import { retrieverService } from './retriever.service';
import { adminApiService } from './admin-api.service';
import { chunkText } from '../utils/chunker';
import { logger } from '../utils/logger';
import type { IngestRequest, IngestResponse, ContentExport } from '@naufalrf/types';

class IngestService {
  async ingest(request: IngestRequest): Promise<IngestResponse> {
    logger.info({ type: request.type, documentId: request.documentId }, 'Starting ingestion');

    let totalChunks = 0;
    let source = '';

    switch (request.type) {
      case 'knowledge': {
        if (!request.documentId) {
          throw new Error('documentId required for knowledge ingestion');
        }
        const result = await this.ingestKnowledgeDoc(request.documentId);
        totalChunks = result.chunks;
        source = result.source;
        break;
      }

      case 'project': {
        if (!request.documentId) {
          throw new Error('documentId (slug) required for project ingestion');
        }
        const projectResult = await this.ingestProject(request.documentId);
        totalChunks = projectResult.chunks;
        source = projectResult.source;
        break;
      }

      case 'about': {
        const aboutResult = await this.ingestAboutMe();
        totalChunks = aboutResult.chunks;
        source = 'about-me';
        break;
      }

      case 'all':
        totalChunks = await this.ingestAll();
        source = 'all-content';
        break;

      default:
        throw new Error(`Unknown ingest type: ${request.type}`);
    }

    logger.info({ type: request.type, totalChunks, source }, 'Ingestion completed');

    return {
      success: true,
      chunksIngested: totalChunks,
      source,
    };
  }

  private async ingestKnowledgeDoc(id: string): Promise<{ chunks: number; source: string }> {
    const doc = await adminApiService.getKnowledgeDocById(id);
    const source = `knowledge:${doc.filename}`;

    await retrieverService.deleteBySource(source);

    const chunks = chunkText(doc.content, source, { type: 'knowledge', docId: id });
    const count = await retrieverService.upsert(chunks);

    await adminApiService.markKnowledgeDocIndexed(id);

    return { chunks: count, source };
  }

  private async ingestProject(slug: string): Promise<{ chunks: number; source: string }> {
    const content = await adminApiService.getContentForIngestion();
    const project = content.projects.find((p) => p.slug === slug);

    if (!project) {
      throw new Error(`Project not found: ${slug}`);
    }

    const source = `project:${project.slug}`;
    await retrieverService.deleteBySource(source);

    const projectText = this.formatProjectForIngestion(project);
    const chunks = chunkText(projectText, source, { type: 'project', slug: project.slug });
    const count = await retrieverService.upsert(chunks);

    return { chunks: count, source };
  }

  private async ingestAboutMe(): Promise<{ chunks: number; source: string }> {
    const content = await adminApiService.getContentForIngestion();
    const source = 'about:naufal';

    await retrieverService.deleteBySource(source);

    const aboutText = this.formatAboutMeForIngestion(content.aboutMe);
    const chunks = chunkText(aboutText, source, { type: 'about' });
    const count = await retrieverService.upsert(chunks);

    return { chunks: count, source };
  }

  private async ingestAll(): Promise<number> {
    let totalChunks = 0;

    const content = await adminApiService.getContentForIngestion();

    const aboutResult = await this.ingestAboutMe();
    totalChunks += aboutResult.chunks;

    for (const project of content.projects) {
      try {
        const result = await this.ingestProject(project.slug);
        totalChunks += result.chunks;
      } catch (error) {
        logger.error({ error, slug: project.slug }, 'Failed to ingest project');
      }
    }

    const knowledgeDocs = await adminApiService.getKnowledgeDocs();
    for (const doc of knowledgeDocs) {
      try {
        const result = await this.ingestKnowledgeDoc(doc.id);
        totalChunks += result.chunks;
      } catch (error) {
        logger.error({ error, docId: doc.id }, 'Failed to ingest knowledge doc');
      }
    }

    return totalChunks;
  }

  private formatProjectForIngestion(project: ContentExport['projects'][0]): string {
    const parts = [
      `# ${project.title}`,
      '',
      `## Summary`,
      project.summary,
      '',
      `## Description`,
      project.description,
      '',
      `## Technologies`,
      project.techStack.join(', '),
    ];

    if (project.contexts && project.contexts.length > 0) {
      for (const ctx of project.contexts) {
        parts.push('', `## ${ctx.title}`, ctx.content);
      }
    }

    return parts.join('\n');
  }

  private formatAboutMeForIngestion(aboutMe: ContentExport['aboutMe']): string {
    const parts = [
      '# About Naufal Rizqullah Firdaus',
      '',
      '## Bio',
      aboutMe.bio,
      '',
      '## Skills',
      aboutMe.skills.join(', '),
    ];

    if (aboutMe.experience && aboutMe.experience.length > 0) {
      parts.push('', '## Experience');
      for (const exp of aboutMe.experience) {
        const expObj = exp as { title?: string; company?: string; description?: string };
        parts.push(
          `- ${expObj.title || 'Position'} at ${expObj.company || 'Company'}: ${expObj.description || ''}`
        );
      }
    }

    return parts.join('\n');
  }
}

export const ingestService = new IngestService();
