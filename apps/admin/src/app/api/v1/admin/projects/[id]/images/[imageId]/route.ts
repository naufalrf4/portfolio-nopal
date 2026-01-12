import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@naufalrf/auth';
import { prisma } from '@/lib/db/prisma';
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

    const image = await prisma.projectImage.update({
      where: { id: imageId },
      data: {
        ...(caption !== undefined && { caption }),
        ...(alt !== undefined && { alt }),
        ...(order !== undefined && { order }),
      },
    });

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
    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await storageService.deleteFile(image.key);

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    const remainingImages = await prisma.projectImage.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < remainingImages.length; i++) {
      await prisma.projectImage.update({
        where: { id: remainingImages[i].id },
        data: { order: i },
      });
    }

    if (remainingImages.length > 0) {
      await prisma.project.update({
        where: { id },
        data: { thumbnailId: remainingImages[0].id },
      });
    } else {
      await prisma.project.update({
        where: { id },
        data: { thumbnailId: null },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
