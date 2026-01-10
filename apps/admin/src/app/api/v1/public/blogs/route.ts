import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { blogLinksService } from '@/lib/api/handlers/blog-links.service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const source = searchParams.get('source') || undefined;

    const query = {
      source,
      visible: true,
    };

    const blogs = await blogLinksService.getAll(query);

    return successResponse(blogs);
  } catch {
    return serverErrorResponse();
  }
}
