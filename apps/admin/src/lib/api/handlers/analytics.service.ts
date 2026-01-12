import { Prisma } from '@/prisma/generated/client/client';
import { prisma } from '@/lib/db/prisma';
import type { CreateAnalyticsEventInput } from '@/lib/validations/analytics.schema';

export class AnalyticsService {
  async trackEvent(event: CreateAnalyticsEventInput) {
    return prisma.analyticsEvent.create({
      data: {
        page: event.page,
        eventType: event.eventType,
        entityType: event.entityType,
        entityId: event.entityId,
        data: event.data as Prisma.InputJsonValue,
        userSession: event.userSession,
        ipAddress: event.ipAddress,
        countryCode: event.countryCode,
        city: event.city,
      },
    });
  }

  async getPageViews(page?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: Prisma.AnalyticsEventWhereInput = {
      eventType: 'pageview',
      createdAt: { gte: startDate },
      ...(page && { page }),
    };

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        page: true,
      },
    });

    const groupedByDate = events.reduce(
      (acc, event) => {
        const date = new Date(event.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, views: 0 };
        }
        acc[date].views++;
        return acc;
      },
      {} as Record<string, { date: string; views: number }>
    );

    return Object.values(groupedByDate);
  }

  async getEntityStats(entityType: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        entityType,
        createdAt: { gte: startDate },
      },
      select: {
        entityId: true,
        eventType: true,
      },
    });

    const stats = events.reduce(
      (acc, event) => {
        const key = event.entityId || 'unknown';
        if (!acc[key]) {
          acc[key] = { entityId: key, views: 0, clicks: 0 };
        }
        if (event.eventType === 'pageview') {
          acc[key].views++;
        }
        if (event.eventType === 'click') {
          acc[key].clicks++;
        }
        return acc;
      },
      {} as Record<string, { entityId: string | null; views: number; clicks: number }>
    );

    return Object.values(stats).sort((a, b) => b.views - a.views);
  }

  async getCountryStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'pageview',
        createdAt: { gte: startDate },
        countryCode: { not: null },
      },
      select: {
        countryCode: true,
      },
    });

    const stats = events.reduce(
      (acc, event) => {
        const key = event.countryCode || 'unknown';
        if (!acc[key]) {
          acc[key] = { countryCode: event.countryCode, count: 0 };
        }
        acc[key].count++;
        return acc;
      },
      {} as Record<string, { countryCode: string | null; count: number }>
    );

    return Object.values(stats).sort((a, b) => b.count - a.count);
  }

  async getPopularEntities(entityType: string, limit: number = 10) {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        entityType,
        eventType: 'pageview',
        entityId: { not: null },
      },
      select: {
        entityId: true,
      },
    });

    const counts = events.reduce(
      (acc, event) => {
        const key = event.entityId || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(counts)
      .map(([entityId, views]) => ({ entityId, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async getOverview(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalViews, uniqueSessions, topPagesData, totalEvents] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          eventType: 'pageview',
          createdAt: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['userSession'],
        where: {
          createdAt: { gte: startDate },
          userSession: { not: null },
        },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['page'],
        where: {
          eventType: 'pageview',
          createdAt: { gte: startDate },
        },
        _count: {
          page: true,
        },
        orderBy: {
          _count: {
            page: 'desc',
          },
        },
        take: 10,
      }),
      prisma.analyticsEvent.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
    ]);

    return {
      totalViews,
      uniqueVisitors: uniqueSessions.length,
      totalEvents,
      topPages: topPagesData.map((item) => ({
        page: item.page,
        views: item._count.page,
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
