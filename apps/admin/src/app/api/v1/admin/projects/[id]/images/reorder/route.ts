import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectImages, projects } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageIds } = body as { imageIds: string[] };

    if (!Array.isArray(imageIds)) {
      return NextResponse.json({ error: 'imageIds must be an array' }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      for (let index = 0; index < imageIds.length; index++) {
        await tx
          .update(projectImages)
          .set({ order: index } as any)
          .where(eq(projectImages.id, imageIds[index]));
      }
    });

    if (imageIds.length > 0) {
      const now = new Date().toISOString();
      await db
        .update(projects)
        .set({ thumbnailId: imageIds[0], updatedAt: now } as any)
        .where(eq(projects.id, id));
    }

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, id))
      .orderBy(asc(projectImages.order));

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to reorder images' },
      { status: 500 }
    );
  }
}
