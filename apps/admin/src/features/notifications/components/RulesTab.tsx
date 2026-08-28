import { useState } from 'react';
import { AlertCircle, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  NOTIFICATION_EVENT_TYPES,
  LOG_MIN_LEVELS,
} from '../constants/notifications.constants';
import type {
  Channel,
  LogMinLevel,
  Rule,
  RuleFormData,
} from '../types/notifications.types';

interface RulesTabProps {
  rules: readonly Rule[];
  channels: readonly Channel[];
  loading: boolean;
  inlineError: { bindingKey: string; message: string } | null;
  onSaveRule: (data: RuleFormData) => Promise<boolean>;
  onToggleRule: (
    eventType: string,
    channelId: string,
    currentEnabled: boolean,
    minLevel: LogMinLevel | null
  ) => Promise<void>;
  onUpdateMinLevel: (
    eventType: string,
    channelId: string,
    minLevel: LogMinLevel,
    enabled: boolean
  ) => Promise<void>;
  onDeleteRule: (id: string) => Promise<boolean>;
}

export function RulesTab({
  rules,
  channels,
  loading,
  inlineError,
  onSaveRule,
  onToggleRule,
  onUpdateMinLevel,
  onDeleteRule,
}: RulesTabProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string>(NOTIFICATION_EVENT_TYPES[0].value);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [selectedMinLevel, setSelectedMinLevel] = useState<LogMinLevel>('error');
  const [ruleEnabled, setRuleEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getRuleForBinding = (eventType: string, channelId: string): Rule | undefined => {
    return rules.find((r) => r.eventType === eventType && r.channelId === channelId);
  };

  const handleCreateRule = async () => {
    if (!selectedEventType || !selectedChannelId) return;
    setSubmitting(true);

    const payload: RuleFormData = {
      eventType: selectedEventType,
      channelId: selectedChannelId,
      enabled: ruleEnabled,
      ...(selectedEventType === 'log.error' ? { minLevel: selectedMinLevel } : {}),
    };

    const ok = await onSaveRule(payload);
    setSubmitting(false);
    if (ok) {
      setCreateModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Routing Rules Matrix</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Bind domain and operational events to target Telegram channels. Note: Log errors and submission events cannot share the same channel.
          </p>
        </div>
        {channels.length > 0 && (
          <Button
            size="sm"
            onClick={() => {
              setSelectedChannelId(channels[0]?.id || '');
              setCreateModalOpen(true);
            }}
            className="bg-[var(--teal)] text-on-accent hover:brightness-110"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Rule
          </Button>
        )}
      </div>

      {inlineError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{inlineError.message}</span>
        </div>
      )}

      {channels.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--bg-card)] surface-raised text-[var(--text-secondary)] text-sm">
          No channels configured yet. Create a channel in the Channels tab first.
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--bg-card)] surface-raised overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Event Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Telegram Delivery Threshold</TableHead>
                {channels.map((channel) => (
                  <TableHead key={channel.id} className="text-center min-w-[140px]">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-[var(--text-primary)]">{channel.name}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-mono truncate max-w-[120px]">
                        {channel.chatId}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3 + channels.length} className="text-center py-8 text-[var(--text-secondary)]">
                    Loading rules matrix...
                  </TableCell>
                </TableRow>
              ) : (
                NOTIFICATION_EVENT_TYPES.map((eventTypeItem) => {
                  const isLogEvent = eventTypeItem.value === 'log.error';

                  return (
                    <TableRow key={eventTypeItem.value}>
                      <TableCell className="font-medium text-[var(--text-primary)]">
                        <div className="flex items-center gap-2">
                          {isLogEvent ? (
                            <ShieldAlert className="h-4 w-4 text-[var(--amber)]" />
                          ) : null}
                          <span>{eventTypeItem.label}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--text-tertiary)] block">
                          {eventTypeItem.value}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-[var(--text-secondary)] max-w-xs">
                        {eventTypeItem.description}
                      </TableCell>
                      <TableCell>
                        {isLogEvent ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                              What reaches Telegram
                            </span>
                            <span className="text-[10px] text-[var(--text-tertiary)]">
                              (Separate from /logs capture threshold)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-tertiary)] italic">
                            Immediate (all submissions)
                          </span>
                        )}
                      </TableCell>

                      {channels.map((channel) => {
                        const rule = getRuleForBinding(eventTypeItem.value, channel.id);
                        const isBound = !!rule;
                        const isEnabled = rule ? rule.enabled : false;
                        const bindingKey = `${eventTypeItem.value}:${channel.id}`;
                        const hasError = inlineError?.bindingKey === bindingKey;

                        return (
                          <TableCell key={channel.id} className="text-center align-middle">
                            <div className="flex flex-col items-center justify-center gap-2 py-1">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={isEnabled}
                                  disabled={!channel.enabled}
                                  onCheckedChange={() =>
                                    onToggleRule(
                                      eventTypeItem.value,
                                      channel.id,
                                      isEnabled,
                                      rule?.minLevel || (isLogEvent ? 'error' : null)
                                    )
                                  }
                                />
                                {isBound && (
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onDeleteRule(rule.id)}
                                    className="h-6 w-6 text-[var(--text-tertiary)] hover:text-destructive p-0"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span className="sr-only">Remove Binding</span>
                                  </Button>
                                )}
                              </div>

                              {isLogEvent && isEnabled && (
                                <div className="w-full max-w-[130px]">
                                  <Select
                                    value={rule?.minLevel || 'error'}
                                    onValueChange={(val) =>
                                      onUpdateMinLevel(
                                        eventTypeItem.value,
                                        channel.id,
                                        val as LogMinLevel,
                                        isEnabled
                                      )
                                    }
                                  >
                                    <SelectTrigger size="sm" className="h-8 text-xs">
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {LOG_MIN_LEVELS.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                          {level.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {hasError && (
                                <span className="text-[10px] text-destructive font-medium max-w-[120px] text-center leading-tight">
                                  {inlineError.message}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent size="default">
          <DialogHeader>
            <DialogTitle>Add Routing Rule</DialogTitle>
            <DialogDescription>
              Bind an event to a channel. The API enforces that log error rules cannot target channels bound to submissions.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label>Event Type</Label>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label} ({t.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Target Channel</Label>
              <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.chatId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEventType === 'log.error' && (
              <div className="space-y-1.5">
                <Label>Telegram Minimum Severity Threshold</Label>
                <Select
                  value={selectedMinLevel}
                  onValueChange={(v) => setSelectedMinLevel(v as LogMinLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOG_MIN_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Controls what is forwarded to Telegram. This is independent of the ingestion threshold on /logs.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] p-3 surface-raised-sm">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Enable Rule</p>
                <p className="text-xs text-[var(--text-secondary)]">Activate dispatch when this event occurs</p>
              </div>
              <Switch checked={ruleEnabled} onCheckedChange={setRuleEnabled} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateRule}
              disabled={submitting || !selectedEventType || !selectedChannelId}
              className="bg-[var(--teal)] text-on-accent hover:brightness-110"
            >
              {submitting ? 'Saving...' : 'Save Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
