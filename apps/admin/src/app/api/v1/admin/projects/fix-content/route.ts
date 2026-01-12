import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        content: {
          not: null,
        },
      },
      select: { id: true, title: true, content: true },
    });

    const fixedProjects = [];

    for (const project of projects) {
      if (!project.content) continue;

      let content = project.content;
      let iterations = 0;
      const maxIterations = 10;

      while (typeof content === 'string' && iterations < maxIterations) {
        try {
          const parsed = JSON.parse(content);
          if (typeof parsed === 'object' && parsed !== null && parsed.type === 'doc') {
            await prisma.project.update({
              where: { id: project.id },
              data: { content: JSON.stringify(parsed) },
            });

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
          await prisma.project.update({
            where: { id: project.id },
            data: { content: '{"type":"doc","content":[]}' },
          });

          fixedProjects.push({
            id: project.id,
            title: project.title,
            reset: true,
          });
          break;
        }
      }

      if (iterations >= maxIterations) {
        await prisma.project.update({
          where: { id: project.id },
          data: { content: '{"type":"doc","content":[]}' },
        });

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
