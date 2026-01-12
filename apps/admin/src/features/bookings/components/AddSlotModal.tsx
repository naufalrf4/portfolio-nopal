'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { toast } from 'sonner';
import type { BookingSlot } from '../types/bookings.types';
import { formatDateISO } from '../utils/dateUtils';
import { getErrorMessage } from '../utils/errors';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slot: BookingSlot | null;
  prefilledDate: string | null;
}

export function AddSlotModal({
  isOpen,
  onClose,
  onSuccess,
  slot,
  prefilledDate,
}: AddSlotModalProps) {
  const [form, setForm] = useState({
    date: '',
    startTime: '',
    duration: 60,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (slot) {
      setForm({
        date: slot.date.split('T')[0],
        startTime: slot.startTime,
        duration: 60,
      });
    } else if (prefilledDate) {
      setForm({
        date: prefilledDate,
        startTime: '09:00',
        duration: 60,
      });
    } else {
      setForm({
        date: formatDateISO(new Date()),
        startTime: '09:00',
        duration: 60,
      });
    }
  }, [slot, prefilledDate, isOpen]);

  async function handleSubmit() {
    if (!form.date || !form.startTime) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const url = slot?.id
        ? `/api/v1/admin/booking-slots/${slot.id}`
        : '/api/v1/admin/booking-slots';

      const response = await fetch(url, {
        method: slot?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          time: form.startTime,
          duration: form.duration || 60,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(slot?.id ? 'Slot updated successfully' : 'Slot created successfully');
        onSuccess();
      } else {
        toast.error(getErrorMessage(data.error, 'Failed to save slot'));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save slot'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onClose}
      title={slot?.id ? 'Edit Time Slot' : 'Add Time Slot'}
      description="Create a new booking slot for appointments"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="slotDate">Date</Label>
          <Input
            id="slotDate"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slotTime">Start Time</Label>
          <Input
            id="slotTime"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slotDuration">Duration (minutes)</Label>
          <select
            id="slotDuration"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border-none outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6]/30 bg-[#E0E5EC]"
            style={{
              boxShadow:
                'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
              color: '#3D4852',
            }}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>
      </div>
    </ResponsiveModal>
  );
}
