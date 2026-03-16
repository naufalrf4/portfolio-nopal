import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    if (content !== undefined && typeof content !== 'string') {
      return NextResponse.json({ error: 'Content must be markdown text' }, { status: 400 });
    }

    const contentToSave = content;

    const now = new Date().toISOString();
    const [project] = await db
      .update(projects)
      .set({
        ...(contentToSave !== undefined && { content: contentToSave }),
        ...(summary !== undefined && { summary }),
        updatedAt: now,
      } as any)
      .where(eq(projects.id, id))
      .returning();

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
    const result = await db
      .select({
        id: projects.id,
        content: projects.content,
        summary: projects.summary,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    const project = result[0];

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
