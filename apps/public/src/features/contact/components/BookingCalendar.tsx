'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { cn } from '@/src/lib/utils';
import { NeuCard, NeuInput, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingSlot {
  date: string;
  time: string;
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

export function BookingCalendar() {
  const [slots, setSlots] = useState<FlatSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<FlatSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await api.bookings.getAvailable();
        const flatSlots: FlatSlot[] = [];
        Object.entries(data.slots || {}).forEach(([dateKey, dateSlots]) => {
          dateSlots.forEach((slot) => {
            flatSlots.push({ ...slot, dateKey });
          });
        });
        setSlots(flatSlots);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setTurnstileError(true);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the verification');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await api.bookings.create({
        ...formData,
        date: selectedSlot.date,
        time: selectedSlot.time,
        turnstileToken: turnstileToken || undefined,
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setSelectedSlot(null);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to book slot');
      turnstileRef.current?.reset();
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

  if (slots.length === 0) {
    return (
      <NeuCard className="text-center py-12">
        <Calendar className="w-12 h-12 mx-auto text-[#6B7280] mb-4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.slice(0, 6).map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={cn(
                'p-4 rounded-xl text-left transition-all duration-200',
                selectedSlot === slot
                  ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                  : 'text-[#3D4852] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6]'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} />
                <span className="font-medium">{slot.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Clock size={14} />
                <span>
                  {slot.time} ({slot.duration} min)
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeuCard>
            <h4 className="font-medium text-[#3D4852] mb-4">
              Book: {selectedSlot.date} at {selectedSlot.time}
            </h4>

            <div className="space-y-4">
              <NeuInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <NeuInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
              <NeuInput
                label="Phone (optional)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
              <NeuInput
                label="Notes (optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="What would you like to discuss?"
              />
            </div>
          </NeuCard>

          {TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
                onExpire={handleTurnstileExpire}
                options={{
                  theme: 'light',
                }}
              />
            </div>
          )}

          {turnstileError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
              <AlertCircle size={20} />
              <span>Verification failed. Please try again.</span>
            </div>
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
