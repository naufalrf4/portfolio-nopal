'use client';

import { useState } from 'react';
import { BellRing, Radio, Workflow, Send } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useNotificationChannels,
  useNotificationRules,
  useNotificationOutbox,
  ChannelsTab,
  RulesTab,
  OutboxTab,
} from '@/features/notifications';

export function NotificationsPageContent() {
  const [activeTab, setActiveTab] = useState<'channels' | 'rules' | 'outbox'>('channels');

  const {
    channels,
    loading: channelsLoading,
    testingId,
    createChannel,
    updateChannel,
    toggleChannel,
    deleteChannel,
    sendTestMessage,
  } = useNotificationChannels();

  const {
    rules,
    loading: rulesLoading,
    inlineError,
    saveRule,
    toggleRule,
    updateMinLevel,
    deleteRule,
  } = useNotificationRules();

  const {
    rows: outboxRows,
    loading: outboxLoading,
    statusFilter,
    setStatusFilter,
    limit,
    setLimit,
    retryingId,
    retryRow,
    refresh: refreshOutbox,
  } = useNotificationOutbox();

  const activeChannelsCount = channels.filter((c) => c.enabled).length;
  const activeRulesCount = rules.filter((r) => r.enabled).length;
  const pendingOutboxCount = outboxRows.filter((r) => r.status === 'pending').length;
  const failedOutboxCount = outboxRows.filter((r) => r.status === 'failed' || r.status === 'dead').length;

  return (
    <PageWrapper>
      <PageHeader
        title="Telegram Notifications"
        description="Configure target Telegram channels, event routing matrix, and monitor delivery queue"
        icon={<BellRing />}
        stats={[
          { label: 'Configured Channels', value: channels.length },
          { label: 'Active Channels', value: activeChannelsCount },
          { label: 'Active Rules', value: activeRulesCount },
          {
            label: 'Failed in Outbox',
            value: failedOutboxCount,
            variant: failedOutboxCount > 0 ? 'warning' : 'default',
          },
        ]}
      />

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'channels' | 'rules' | 'outbox')}>
        <TabsList className="mb-4">
          <TabsTrigger value="channels" className="gap-2">
            <Radio className="h-4 w-4" />
            Channels ({channels.length})
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Workflow className="h-4 w-4" />
            Rules Matrix ({rules.length})
          </TabsTrigger>
          <TabsTrigger value="outbox" className="gap-2">
            <Send className="h-4 w-4" />
            Outbox Queue
            {pendingOutboxCount > 0 ? (
              <span className="ml-1 rounded-full bg-[var(--teal)]/20 px-1.5 py-0.2 text-[10px] text-[var(--teal)] font-mono">
                {pendingOutboxCount}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <ChannelsTab
            channels={channels}
            loading={channelsLoading}
            testingId={testingId}
            onCreateChannel={createChannel}
            onUpdateChannel={updateChannel}
            onToggleChannel={toggleChannel}
            onDeleteChannel={deleteChannel}
            onSendTestMessage={sendTestMessage}
          />
        </TabsContent>

        <TabsContent value="rules">
          <RulesTab
            rules={rules}
            channels={channels}
            loading={rulesLoading}
            inlineError={inlineError}
            onSaveRule={saveRule}
            onToggleRule={toggleRule}
            onUpdateMinLevel={updateMinLevel}
            onDeleteRule={deleteRule}
          />
        </TabsContent>

        <TabsContent value="outbox">
          <OutboxTab
            rows={outboxRows}
            loading={outboxLoading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            limit={limit}
            setLimit={setLimit}
            retryingId={retryingId}
            onRetry={retryRow}
            onRefresh={refreshOutbox}
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
