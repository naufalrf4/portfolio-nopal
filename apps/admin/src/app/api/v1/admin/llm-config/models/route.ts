import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { z } from 'zod';

const modelsQuerySchema = z.object({
  provider: z.enum(['openai-compatible', 'gemini']),
  baseUrl: z.string().min(1),
  apiKey: z.string().min(1),
});

/**
 * Given provider + baseUrl + apiKey, fetch the available model list from that provider.
 * Returns the raw model list for the Admin UI dropdown.
 */
async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = modelsQuerySchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { provider, baseUrl, apiKey } = validation.data;

    if (provider === 'gemini') {
      // Gem1ni doesn't have a simple list endpoint. Use well-known models.
      return successResponse({
        models: [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.5-flash-lite',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
          'gemini-embedding-001',
        ],
        provider: 'gemini',
      });
    }

    // 0penAI-compatible: GET /v1/models
    const url = `${baseUrl.replace(/\/$/, "")}/v1/models`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        return errorResponse(
          `Failed to fetch models from provider: ${res.status} ${errText.slice(0, 200)}`,
          502,
          'PROVIDER_MODEL_FETCH_FAILED',
        );
      }

      const data = (await res.json()) as Record<string, unknown>;
      const items = data.data as Array<{ id: string }> | undefined;
      const modelIds = (items ?? [])
        .map((m) => m.id)
        .filter((id) => typeof id === 'string' && id.length > 0)
        .sort();

      return successResponse({ models: modelIds, provider });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return serverErrorResponse('Failed to fetch models from provider');
  }
}

export const POST = withAdminAuth(handlePost);
