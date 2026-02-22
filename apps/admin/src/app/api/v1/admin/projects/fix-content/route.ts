import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, isNotNull } from 'drizzle-orm';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allProjects = await db
      .select({ id: projects.id, title: projects.title, content: projects.content })
      .from(projects)
      .where(isNotNull(projects.content));

    const fixedProjects = [];

    for (const project of allProjects) {
      if (!project.content) continue;

      let content = project.content;
      let iterations = 0;
      const maxIterations = 10;

      while (typeof content === 'string' && iterations < maxIterations) {
        try {
          const parsed = JSON.parse(content);
          if (typeof parsed === 'object' && parsed !== null && parsed.type === 'doc') {
            const now = new Date().toISOString();
            await db
              .update(projects)
              .set({ content: JSON.stringify(parsed), updatedAt: now } as any)
              .where(eq(projects.id, project.id));

            fixedProjects.push({
              id: project.id,
              title: project.title,
              layers: iterations + 1,
            });
            break;
          } else {
            content = parsed;
            iterations++;
          }
        } catch {
          const now = new Date().toISOString();
          await db
            .update(projects)
            .set({ content: '{"type":"doc","content":[]}', updatedAt: now } as any)
            .where(eq(projects.id, project.id));

          fixedProjects.push({
            id: project.id,
            title: project.title,
            reset: true,
          });
          break;
        }
      }

      if (iterations >= maxIterations) {
        const now = new Date().toISOString();
        await db
          .update(projects)
          .set({ content: '{"type":"doc","content":[]}', updatedAt: now } as any)
          .where(eq(projects.id, project.id));

        fixedProjects.push({
          id: project.id,
          title: project.title,
          reset: true,
          tooManyLayers: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedProjects.length} projects`,
      data: fixedProjects,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fix content' }, { status: 500 });
  }
}
