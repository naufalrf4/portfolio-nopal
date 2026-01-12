'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OverviewCards } from './OverviewCards';
import { PageViewsChart } from './PageViewsChart';
import { PopularEntities } from './PopularEntities';
import { CountryDistribution } from './CountryDistribution';

interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d';
}

export function AnalyticsDashboard({}: AnalyticsDashboardProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
        <TabsTrigger value="entities">Entities</TabsTrigger>
        <TabsTrigger value="geo">Geographic</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewCards loading />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <PageViewsChart loading />
          <PopularEntities loading />
        </div>

        <CountryDistribution loading />
      </TabsContent>

      <TabsContent value="pages" className="space-y-6">
        <PageViewsChart loading />
      </TabsContent>

      <TabsContent value="entities" className="space-y-6">
        <PopularEntities loading />
      </TabsContent>

      <TabsContent value="geo" className="space-y-6">
        <CountryDistribution loading />
      </TabsContent>
    </Tabs>
  );
}
