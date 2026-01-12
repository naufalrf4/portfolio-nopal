import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { blogLinksService } from '@/lib/api/handlers/blog-links.service';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { updateBlogLinkSchema } from '@/lib/validations/blog-link.schema';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const blogLink = await blogLinksService.getById(id);

      if (!blogLink) {
        return notFoundResponse('Blog link');
      }

      return successResponse(blogLink);
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const body = await req.json();
      const validation = updateBlogLinkSchema.safeParse(body);

      if (!validation.success) {
        return validationErrorResponse(validation.error.format());
      }

      const exists = await blogLinksService.getById(id);
      if (!exists) {
        return notFoundResponse('Blog link');
      }

      const blogLink = await blogLinksService.update(id, validation.data);
      return successResponse(blogLink, 'Blog link updated successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const exists = await blogLinksService.getById(id);
      if (!exists) {
        return notFoundResponse('Blog link');
      }

      await blogLinksService.delete(id);
      return successResponse(null, 'Blog link deleted successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}
