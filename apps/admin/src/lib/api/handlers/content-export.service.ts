import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { aboutMe, projects, knowledgeDocs } from '@/lib/db/schema';

interface ExperienceItem {
  title?: string;
  company?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export class ContentExportService {
  async exportForRAG() {
    const [aboutMeData, projectsData, knowledgeDocsData] = await Promise.all([
      this.getAboutMe(),
      this.getProjects(),
      this.getKnowledgeDocs(),
    ]);

    return {
      aboutMe: aboutMeData,
      projects: projectsData,
      knowledgeDocs: knowledgeDocsData,
    };
  }

  private async getAboutMe() {
    const [about] = await db.select().from(aboutMe).limit(1);

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
    const projectsList = await db.query.projects.findMany({
      where: eq(projects.visible, true),
    });

    return projectsList.map((project) => ({
      title: project.title,
      slug: project.slug,
      summary: project.summary || '',
      description: project.description || '',
      content: project.content || '',
      techStack: project.techStack || [],
    }));
  }

  private async getKnowledgeDocs() {
    const docs = await db
      .select({
        id: knowledgeDocs.id,
        filename: knowledgeDocs.filename,
        content: knowledgeDocs.content,
      })
      .from(knowledgeDocs);

    return docs;
  }
}

export const contentExportService = new ContentExportService();
