import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { blogLinksService } from '@/lib/api/handlers/blog-links.service';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/responses';
import { reorderBlogLinksSchema } from '@/lib/validations/blog-link.schema';

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = reorderBlogLinksSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const blogLinks = await blogLinksService.reorder(validation.data.blogIds);
    return successResponse({ blogLinks }, 'Blog links reordered successfully');
  } catch {
    return serverErrorResponse();
  }
}

export const POST = withAdminAuth(handlePost);
