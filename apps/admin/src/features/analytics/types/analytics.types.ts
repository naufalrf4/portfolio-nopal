export interface AnalyticsEvent {
  id: string;
  page: string;
  entityType: string;
  entityId: string | null;
  eventType: string;
  data: Record<string, unknown> | null;
  userSession: string | null;
  ipAddress: string | null;
  countryCode: string | null;
  city: string | null;
  createdAt: Date;
}

export interface AnalyticsStats {
  totalEvents: number;
  uniquePages: number;
  topPages: Array<{ page: string; count: number }>;
  topEventTypes: Array<{ eventType: string; count: number }>;
  dateRange: { start: Date; end: Date };
}

export interface PageViewStats {
  page: string;
  views: number;
  uniqueSessions: number;
  avgSessionDuration: number | null;
  lastViewedAt: Date | null;
}
