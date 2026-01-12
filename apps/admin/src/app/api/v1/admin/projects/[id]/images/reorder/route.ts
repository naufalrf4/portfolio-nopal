import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@naufalrf/auth';
import { prisma } from '@/lib/db/prisma';

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

    await Promise.all(
      imageIds.map((id, index) =>
        prisma.projectImage.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    if (imageIds.length > 0) {
      await prisma.project.update({
        where: { id },
        data: { thumbnailId: imageIds[0] },
      });
    }

    const images = await prisma.projectImage.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
    });

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
