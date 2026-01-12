import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { blogLinksService } from '@/lib/api/handlers/blog-links.service';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { createBlogLinkSchema } from '@/lib/validations/blog-link.schema';
import { z } from 'zod';

const querySchema = z.object({
  source: z.string().optional(),
  visible: z.coerce.boolean().optional(),
});

async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = querySchema.safeParse(queryParams);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const blogLinks = await blogLinksService.getAll(validation.data);
    return successResponse({ blogLinks });
  } catch {
    return serverErrorResponse();
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createBlogLinkSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const existingBlogLink = await blogLinksService.getAll({ visible: undefined });
    const urlExists = existingBlogLink.some((blog) => blog.url === validation.data.url);

    if (urlExists) {
      return errorResponse('Blog link with this URL already exists', 409, 'URL_EXISTS');
    }

    const blogLink = await blogLinksService.create(validation.data);
    return successResponse(blogLink, 'Blog link created successfully');
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
export const POST = withAdminAuth(handlePost);
