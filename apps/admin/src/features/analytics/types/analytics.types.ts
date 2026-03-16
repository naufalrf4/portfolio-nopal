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

export interface InteractionOverview {
  totalSubmissions: number;
  totalClicks: number;
  uniqueCountries: number;
  sourceApps: number;
}

export interface InteractionTrendPoint {
  date: string;
  submissions: number;
  clicks: number;
}

export interface InteractionCountryStat {
  code: string;
  country: string;
  count: number;
  percentage: number;
}

export interface InteractionSourceAppStat {
  app: string;
  submissions: number;
  clicks: number;
  total: number;
}

export interface InteractionTypeStat {
  type: string;
  label: string;
  count: number;
}

export interface InteractionLocationItem {
  id: string;
  type: string;
  label: string;
  sourceApp: string;
  sourcePath: string;
  countryCode: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  createdAt: string;
}

export interface TelemetryLinkStat {
  id: string;
  label: string;
  clicks: number;
  type: string;
  sourceApp: string;
}

export interface RecentInteraction {
  id: string;
  type: string;
  label: string;
  sourceApp: string;
  sourcePath: string;
  country: string | null;
  city: string | null;
  createdAt: string;
}

export interface AnalyticsDashboardData {
  range: '7d' | '30d' | '90d';
  overview: InteractionOverview;
  trend: InteractionTrendPoint[];
  countries: InteractionCountryStat[];
  sourceApps: InteractionSourceAppStat[];
  interactionTypes: InteractionTypeStat[];
  locationItems: InteractionLocationItem[];
  topLinks: TelemetryLinkStat[];
  recentInteractions: RecentInteraction[];
}
