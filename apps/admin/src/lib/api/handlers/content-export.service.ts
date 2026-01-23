import { prisma } from '@/lib/db/prisma';

interface ExperienceItem {
  title?: string;
  company?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export class ContentExportService {
  async exportForRAG() {
    const [aboutMe, projects, knowledgeDocs] = await Promise.all([
      this.getAboutMe(),
      this.getProjects(),
      this.getKnowledgeDocs(),
    ]);

    return {
      aboutMe,
      projects,
      knowledgeDocs,
    };
  }

  private async getAboutMe() {
    const about = await prisma.aboutMe.findFirst();

    if (!about) {
      return {
        bio: '',
        skills: [],
        experience: [],
      };
    }

    return {
      bio: about.bio || '',
      skills: about.skills || [],
      experience: (about.experience as ExperienceItem[]) || [],
    };
  }

  private async getProjects() {
    const projects = await prisma.project.findMany({
      where: { visible: true },
      include: {
        contexts: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return projects.map((project) => ({
      title: project.title,
      slug: project.slug,
      summary: project.summary || '',
      description: project.description || '',
      techStack: project.techStack || [],
      contexts: project.contexts.map((ctx) => ({
        type: ctx.type,
        title: ctx.title,
        content: ctx.content,
      })),
    }));
  }

  private async getKnowledgeDocs() {
    const docs = await prisma.knowledgeDoc.findMany({
      select: {
        id: true,
        filename: true,
        content: true,
      },
    });

    return docs;
  }
}

export const contentExportService = new ContentExportService();
