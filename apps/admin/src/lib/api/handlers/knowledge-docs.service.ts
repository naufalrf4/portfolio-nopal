import { prisma } from '@/lib/db/prisma';
import type {
  CreateKnowledgeDocInput,
  UpdateKnowledgeDocInput,
  KnowledgeDocQueryInput,
} from '@/lib/validations/knowledge.schema';

export class KnowledgeDocsService {
  async getAll(query: KnowledgeDocQueryInput) {
    const { page, limit, indexed } = query;
    const skip = (page - 1) * limit;

    const where = indexed !== undefined ? { indexed } : {};

    const [docs, total] = await Promise.all([
      prisma.knowledgeDoc.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.knowledgeDoc.count({ where }),
    ]);

    return {
      docs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.knowledgeDoc.findUnique({
      where: { id },
    });
  }

  async getByFilename(filename: string) {
    return prisma.knowledgeDoc.findUnique({
      where: { filename },
    });
  }

  async create(data: CreateKnowledgeDocInput) {
    return prisma.knowledgeDoc.create({
      data: {
        filename: data.filename,
        content: data.content,
        indexed: false,
      },
    });
  }

  async update(id: string, data: UpdateKnowledgeDocInput) {
    return prisma.knowledgeDoc.update({
      where: { id },
      data: {
        ...data,
        indexed: false,
      },
    });
  }

  async delete(id: string) {
    return prisma.knowledgeDoc.delete({
      where: { id },
    });
  }

  async markIndexed(id: string) {
    return prisma.knowledgeDoc.update({
      where: { id },
      data: { indexed: true },
    });
  }

  async getAllForExport() {
    return prisma.knowledgeDoc.findMany({
      select: {
        id: true,
        filename: true,
        content: true,
      },
    });
  }
}

export const knowledgeDocsService = new KnowledgeDocsService();
