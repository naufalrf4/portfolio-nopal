import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectImages, projects } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { storageService } from '@/lib/services/storage';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await params;
    const body = await request.json();
    const { caption, alt, order } = body;

    const [image] = await db
      .update(projectImages)
      .set({
        ...(caption !== undefined && { caption }),
        ...(alt !== undefined && { alt }),
        ...(order !== undefined && { order }),
      } as any)
      .where(eq(projectImages.id, imageId))
      .returning();

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, imageId } = await params;
    const imageResult = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.id, imageId))
      .limit(1);

    const image = imageResult[0];

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await storageService.deleteFile(image.key);

    await db.delete(projectImages).where(eq(projectImages.id, imageId));

    const remainingImages = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, id))
      .orderBy(asc(projectImages.order));

    for (let i = 0; i < remainingImages.length; i++) {
      await db
        .update(projectImages)
        .set({ order: i } as any)
        .where(eq(projectImages.id, remainingImages[i].id));
    }

    const now = new Date().toISOString();
    if (remainingImages.length > 0) {
      await db
        .update(projects)
        .set({ thumbnailId: remainingImages[0].id, updatedAt: now } as any)
        .where(eq(projects.id, id));
    } else {
      await db
        .update(projects)
        .set({ thumbnailId: null, updatedAt: now } as any)
        .where(eq(projects.id, id));
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
