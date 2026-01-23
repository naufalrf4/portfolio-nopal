'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { NeuCard, NeuInput, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLazyTurnstile, LazyTurnstile } from '@naufalrf/ui';
import { trackBookingRequest } from '@naufalrf/analytics';

interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface FlatSlot extends BookingSlot {
  dateKey: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

function isSlotPast(slot: BookingSlot): boolean {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const slotDate = new Date(slot.date + 'T00:00:00+07:00');
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate < now;
}

function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00+07:00');
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);

  return isToday ? `${formatted} (Today)` : formatted;
}

export function BookingCalendar() {
  const [allSlots, setAllSlots] = useState<Record<string, FlatSlot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<FlatSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const {
    shouldShowTurnstile,
    turnstileToken,
    turnstileRef,
    handleTurnstileSuccess,
    handleTurnstileError,
    handleTurnstileExpire,
    resetTurnstile,
    activateTurnstile,
    isTurnstileRequired,
  } = useLazyTurnstile(TURNSTILE_SITE_KEY);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await api.bookings.getAvailable();

        const convertedSlots: Record<string, FlatSlot[]> = {};
        Object.entries(data || {}).forEach(([date, dateSlots]) => {
          const flatSlots = dateSlots.map((slot: any) => ({
            ...slot,
            dateKey: date,
          }));
          convertedSlots[date] = flatSlots;
        });

        setAllSlots(convertedSlots);

        const sortedDates = Object.keys(convertedSlots).sort();
        if (sortedDates.length > 0 && !selectedDate) {
          setSelectedDate(sortedDates[0]);
        }
      } catch {
        // Error handled silently - component shows default state
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const sortedDates = Object.keys(allSlots).sort();
  const currentDateIndex = sortedDates.indexOf(selectedDate);
  const currentSlots = selectedDate ? allSlots[selectedDate] || [] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    activateTurnstile();
  };

  const handlePreviousDate = () => {
    if (currentDateIndex > 0) {
      setSelectedDate(sortedDates[currentDateIndex - 1]);
    }
  };

  const handleNextDate = () => {
    if (currentDateIndex < sortedDates.length - 1) {
      setSelectedDate(sortedDates[currentDateIndex + 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    if (isTurnstileRequired && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete verification');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await api.bookings.create({
        slotId: selectedSlot.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        turnstileToken: turnstileToken || '',
      });
      setStatus('success');
      trackBookingRequest(selectedSlot.id);
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setSelectedSlot(null);
      resetTurnstile();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to book slot');
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <NeuCard className="text-center py-12">
        <div className="animate-pulse text-[#6B7280]">Loading available slots...</div>
      </NeuCard>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <NeuCard className="text-center py-12">
        <Clock className="w-12 h-12 mx-auto text-[#6B7280] mb-4" />
        <p className="text-[#6B7280]">No available booking slots at the moment.</p>
        <p className="text-sm text-[#6B7280] mt-2">
          Please use the contact form to reach out instead.
        </p>
      </NeuCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#3D4852] mb-4">Available Slots</h3>

        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handlePreviousDate}
            disabled={currentDateIndex <= 0}
            className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#6B7280] hover:text-[#3B82F6] hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-xl font-semibold text-[#3D4852] min-w-[200px] text-center">
            {formatDateDisplay(selectedDate)}
          </div>

          <button
            onClick={handleNextDate}
            disabled={currentDateIndex >= sortedDates.length - 1}
            className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#6B7280] hover:text-[#3B82F6] hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentSlots.slice(0, 6).map((slot) => {
            const isPast = isSlotPast(slot);

            return (
              <button
                key={slot.id}
                onClick={() => !isPast && setSelectedSlot(slot)}
                disabled={isPast}
                className={cn(
                  'p-4 rounded-xl text-left transition-all duration-200',
                  isPast
                    ? 'opacity-50 cursor-not-allowed bg-[#E0E5EC] text-[#9CA3AF] shadow-none'
                    : selectedSlot === slot
                      ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                      : 'text-[#3D4852] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6]'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} />
                  <span className="font-medium">{slot.startTime}</span>
                  {isPast && <span className="text-xs ml-auto">(Past)</span>}
                </div>
                <div className="text-sm text-[#6B7280]">{slot.duration} min</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeuCard>
            <h4 className="font-medium text-[#3D4852] mb-4">
              Book: {formatDateDisplay(selectedSlot.date)} at {selectedSlot.startTime}
            </h4>

            <div className="space-y-4">
              <NeuInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={activateTurnstile}
                placeholder="Your name"
                required
              />
              <NeuInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={activateTurnstile}
                placeholder="your@email.com"
                required
              />
              <NeuInput
                label="Phone (optional)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onFocus={activateTurnstile}
                placeholder="+1 (555) 000-0000"
              />
              <NeuInput
                label="Notes (optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                onFocus={activateTurnstile}
                placeholder="What would you like to discuss?"
              />
            </div>
          </NeuCard>

          {shouldShowTurnstile && (
            <LazyTurnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              theme="light"
              onSuccess={handleTurnstileSuccess}
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
            />
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
              <CheckCircle size={20} />
              <span>Booking confirmed! Check your email for details.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          <NeuButton
            type="submit"
            variant="accent"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Confirm Booking
          </NeuButton>
        </form>
      )}
    </div>
  );
}
