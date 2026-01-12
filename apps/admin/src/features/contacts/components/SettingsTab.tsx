'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useContactSettings } from '../hooks/useContacts';
import { TagInput } from './TagInput';
import type { ContactSettingsForm } from '../types/contacts.types';

const contactSettingsSchema = z.object({
  notificationEmail: z
    .string()
    .email('Please enter a valid email address')
    .nullable()
    .or(z.literal('')),
  blockedKeywords: z.array(z.string()),
});

export function SettingsTab() {
  const { settings, loading, saving, updateSettings } = useContactSettings();

  const form = useForm<ContactSettingsForm>({
    resolver: zodResolver(contactSettingsSchema as never) as never,
    defaultValues: {
      notificationEmail: settings?.notificationEmail || '',
      blockedKeywords: settings?.blockedKeywords || [],
    },
    values: settings
      ? {
          notificationEmail: settings.notificationEmail || '',
          blockedKeywords: settings.blockedKeywords || [],
        }
      : undefined,
  });

  async function handleSaveSettings(formData: ContactSettingsForm) {
    await updateSettings({
      notificationEmail: formData.notificationEmail || null,
      blockedKeywords: formData.blockedKeywords,
    });
  }

  const blockedKeywords = form.watch('blockedKeywords');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#6B7280]">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return <div className="text-center text-[#6B7280]">Failed to load settings</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Settings</CardTitle>
        <CardDescription>Configure notification preferences and spam protection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSaveSettings as never)} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: '#E0E5EC',
                  boxShadow:
                    '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.5)',
                }}
              >
                <Mail className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <p className="text-sm text-[#6B7280]">
                  Email address to receive form submission notifications
                </p>
                <Input
                  id="notificationEmail"
                  type="email"
                  {...form.register('notificationEmail')}
                  placeholder="your@email.com"
                />
                {form.formState.errors.notificationEmail && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.notificationEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: '#E0E5EC',
                  boxShadow:
                    '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.5)',
                }}
              >
                <MessageSquare className="h-5 w-5 text-[#EF4444]" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="blockedKeywords">Blocked Keywords</Label>
                <p className="text-sm text-[#6B7280]">
                  Messages containing these keywords will be blocked (spam filter)
                </p>
                <TagInput
                  tags={blockedKeywords}
                  onTagsChange={(value: string[]) => form.setValue('blockedKeywords', value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#A3B1C6]/20">
            <Button variant="primary" type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
