import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@naufalrf/auth';
import { db } from '@/lib/db';
import { projectImages, projects } from '@/lib/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const maxOrderResult = await db
      .select({ order: projectImages.order })
      .from(projectImages)
      .where(eq(projectImages.projectId, id))
      .orderBy(desc(projectImages.order))
      .limit(1);

    const order = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;

    const now = new Date().toISOString();
    const [image] = await db
      .insert(projectImages)
      .values({
        id: createId(),
        projectId: id,
        url,
        key,
        caption,
        alt,
        order,
        createdAt: now,
      } as any)
      .returning();

    if (order === 0) {
      await db
        .update(projects)
        .set({ thumbnailId: image.id, updatedAt: now } as any)
        .where(eq(projects.id, id));
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create image' }, { status: 500 });
  }
}
