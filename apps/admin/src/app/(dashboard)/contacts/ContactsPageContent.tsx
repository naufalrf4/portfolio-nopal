'use client';

import { Send, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContactsTab, SettingsTab } from '@/features/contacts/components';
import { useContacts } from '@/features/contacts/hooks';

export function ContactsPageContent() {
  const { pagination, unreadCount } = useContacts();

  return (
    <PageWrapper>
      <PageHeader
        title="Contact Management"
        description="Manage contact form submissions and settings"
        icon={<Send />}
        stats={[
          { label: 'Total', value: pagination.total },
          { label: 'Unread', value: unreadCount, variant: 'warning' },
        ]}
      />

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Submissions</span>
            {unreadCount > 0 && (
              <Badge variant="warning" className="ml-1 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <ContactsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
