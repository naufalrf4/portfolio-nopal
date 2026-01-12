import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@naufalrf/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const images = await prisma.projectImage.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { url, key, caption, alt } = body;

    if (!url || !key) {
      return NextResponse.json({ error: 'URL and key are required' }, { status: 400 });
    }

    const maxOrder = await prisma.projectImage.findFirst({
      where: { projectId: id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = maxOrder ? maxOrder.order + 1 : 0;

    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url,
        key,
        caption,
        alt,
        order,
      },
    });

    if (order === 0) {
      await prisma.project.update({
        where: { id },
        data: { thumbnailId: image.id },
      });
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create image' }, { status: 500 });
  }
}
