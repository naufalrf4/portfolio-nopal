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
    const { content, summary } = body;

    if (content === undefined && summary === undefined) {
      return NextResponse.json({ error: 'Content or summary is required' }, { status: 400 });
    }

    
    const contentToSave =
      content !== undefined
        ? typeof content === 'string'
          ? content
          : JSON.stringify(content)
        : undefined;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(contentToSave !== undefined && { content: contentToSave }),
        ...(summary !== undefined && { summary }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        content: project.content,
        summary: project.summary,
        updatedAt: project.updatedAt,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        summary: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        content: project.content,
        summary: project.summary,
        updatedAt: project.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
  }
}
