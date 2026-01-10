import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { projectsService } from '@/lib/api/handlers/projects.service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    const query = {
      page,
      limit,
      category,
      featured,
      visible: true,
    };

    const result = await projectsService.getAll(query);

    return successResponse(result);
  } catch {
    return serverErrorResponse();
  }
}
