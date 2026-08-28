import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { LogMinLevel, Rule, RuleFormData } from '../types/notifications.types';

export function useNotificationRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [inlineError, setInlineError] = useState<{ bindingKey: string; message: string } | null>(null);

  const fetchRules = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/v1/admin/notifications/rules', {
        ...(signal ? { signal } : {}),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRules(data.data);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error('Failed to load notification rules');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchRules(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchRules]);

  const saveRule = useCallback(
    async (formData: RuleFormData): Promise<boolean> => {
      const bindingKey = `${formData.eventType}:${formData.channelId}`;
      setInlineError(null);
      try {
        const existing = rules.find(
          (r) => r.eventType === formData.eventType && r.channelId === formData.channelId
        );
        const url = '/api/v1/admin/notifications/rules';
        const method = existing ? 'PUT' : 'POST';

        const body: Record<string, unknown> = {
          eventType: formData.eventType,
          channelId: formData.channelId,
          enabled: formData.enabled,
        };
        if (formData.eventType === 'log.error' && formData.minLevel) {
          body.minLevel = formData.minLevel;
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setRules((prev) => {
            const filtered = prev.filter((r) => r.id !== data.data.id && !(r.eventType === formData.eventType && r.channelId === formData.channelId));
            return [...filtered, data.data];
          });
          toast.success('Notification rule saved');
          return true;
        }
        const errorMsg = data.error?.message || 'Failed to save rule';
        setInlineError({ bindingKey, message: errorMsg });
        toast.error(errorMsg);
        return false;
      } catch {
        const msg = 'Network error saving rule';
        setInlineError({ bindingKey, message: msg });
        toast.error(msg);
        return false;
      }
    },
    [rules]
  );

  const toggleRule = useCallback(
    async (eventType: string, channelId: string, currentEnabled: boolean, minLevel: LogMinLevel | null) => {
      const bindingKey = `${eventType}:${channelId}`;
      setInlineError(null);

      const existingRule = rules.find(
        (r) => r.eventType === eventType && r.channelId === channelId
      );

      setRules((prev) => {
        if (existingRule) {
          return prev.map((r) => (r.id === existingRule.id ? { ...r, enabled: !currentEnabled } : r));
        }
        return prev;
      });

      try {
        const body: Record<string, unknown> = {
          eventType,
          channelId,
          enabled: !currentEnabled,
        };
        if (eventType === 'log.error' && minLevel) {
          body.minLevel = minLevel;
        }

        const res = await fetch('/api/v1/admin/notifications/rules', {
          method: existingRule ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setRules((prev) => {
            const filtered = prev.filter((r) => r.id !== data.data.id && !(r.eventType === eventType && r.channelId === channelId));
            return [...filtered, data.data];
          });
          toast.success(`Rule ${!currentEnabled ? 'enabled' : 'disabled'}`);
        } else {
          setRules((prev) => {
            if (existingRule) {
              return prev.map((r) => (r.id === existingRule.id ? { ...r, enabled: currentEnabled } : r));
            }
            return prev;
          });
          const errorMsg = data.error?.message || 'Failed to toggle rule';
          setInlineError({ bindingKey, message: errorMsg });
          toast.error(errorMsg);
        }
      } catch {
        setRules((prev) => {
          if (existingRule) {
            return prev.map((r) => (r.id === existingRule.id ? { ...r, enabled: currentEnabled } : r));
          }
          return prev;
        });
        const msg = 'Network error toggling rule';
        setInlineError({ bindingKey, message: msg });
        toast.error(msg);
      }
    },
    [rules]
  );

  const updateMinLevel = useCallback(
    async (eventType: string, channelId: string, minLevel: LogMinLevel, enabled: boolean) => {
      const bindingKey = `${eventType}:${channelId}`;
      setInlineError(null);

      try {
        const res = await fetch('/api/v1/admin/notifications/rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType,
            channelId,
            enabled,
            minLevel,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setRules((prev) => {
            const filtered = prev.filter((r) => r.id !== data.data.id && !(r.eventType === eventType && r.channelId === channelId));
            return [...filtered, data.data];
          });
          toast.success(`Log threshold updated to ${minLevel}`);
        } else {
          const errorMsg = data.error?.message || 'Failed to update minLevel';
          setInlineError({ bindingKey, message: errorMsg });
          toast.error(errorMsg);
        }
      } catch {
        const msg = 'Network error updating threshold';
        setInlineError({ bindingKey, message: msg });
        toast.error(msg);
      }
    },
    []
  );

  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/v1/admin/notifications/rules/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setRules((prev) => prev.filter((r) => r.id !== id));
        toast.success('Rule deleted');
        return true;
      }
      toast.error(data.error?.message || 'Failed to delete rule');
      return false;
    } catch {
      toast.error('Network error deleting rule');
      return false;
    }
  }, []);

  return {
    rules,
    loading,
    inlineError,
    saveRule,
    toggleRule,
    updateMinLevel,
    deleteRule,
    refresh: fetchRules,
  };
}
