import { db } from '@/lib/db';
import { eq, and, gte, asc, desc, count, isNotNull } from 'drizzle-orm';
import { analyticsEvents } from '@/lib/db/schema';
import { createId } from '@paralleldrive/cuid2';
import type { CreateAnalyticsEventInput } from '@/lib/validations/analytics.schema';

export class AnalyticsService {
  async trackEvent(event: CreateAnalyticsEventInput) {
    const now = new Date().toISOString();
    const [created] = await db
      .insert(analyticsEvents)
      .values({
        id: createId(),
        page: event.page,
        eventType: event.eventType,
        entityType: event.entityType,
        entityId: event.entityId,
        data: event.data,
        userSession: event.userSession,
        ipAddress: event.ipAddress,
        countryCode: event.countryCode,
        city: event.city,
        createdAt: now,
      } as any)
      .returning();
    return created;
  }

  async getPageViews(page?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const conditions = [
      eq(analyticsEvents.eventType, 'pageview'),
      gte(analyticsEvents.createdAt, startDate.toISOString()),
    ];
    if (page) {
      conditions.push(eq(analyticsEvents.page, page));
    }

    const events = await db
      .select({
        createdAt: analyticsEvents.createdAt,
        page: analyticsEvents.page,
      })
      .from(analyticsEvents)
      .where(and(...conditions))
      .orderBy(asc(analyticsEvents.createdAt));

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

    const events = await db
      .select({
        entityId: analyticsEvents.entityId,
        eventType: analyticsEvents.eventType,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.entityType, entityType),
          gte(analyticsEvents.createdAt, startDate.toISOString())
        )
      );

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

    const events = await db
      .select({
        countryCode: analyticsEvents.countryCode,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'pageview'),
          gte(analyticsEvents.createdAt, startDate.toISOString()),
          isNotNull(analyticsEvents.countryCode)
        )
      );

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
    const events = await db
      .select({
        entityId: analyticsEvents.entityId,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.entityType, entityType),
          eq(analyticsEvents.eventType, 'pageview'),
          isNotNull(analyticsEvents.entityId)
        )
      );

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

    const startDateStr = startDate.toISOString();

    const [totalViewsResult, uniqueSessions, topPagesData, totalEventsResult] = await Promise.all([
      db
        .select({ value: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'pageview'),
            gte(analyticsEvents.createdAt, startDateStr)
          )
        ),
      db
        .select({ userSession: analyticsEvents.userSession })
        .from(analyticsEvents)
        .where(
          and(gte(analyticsEvents.createdAt, startDateStr), isNotNull(analyticsEvents.userSession))
        )
        .groupBy(analyticsEvents.userSession),
      db
        .select({
          page: analyticsEvents.page,
          views: count(),
        })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'pageview'),
            gte(analyticsEvents.createdAt, startDateStr)
          )
        )
        .groupBy(analyticsEvents.page)
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({ value: count() })
        .from(analyticsEvents)
        .where(gte(analyticsEvents.createdAt, startDateStr)),
    ]);

    return {
      totalViews: totalViewsResult[0].value,
      uniqueVisitors: uniqueSessions.length,
      totalEvents: totalEventsResult[0].value,
      topPages: topPagesData.map((item) => ({
        page: item.page,
        views: item.views,
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
