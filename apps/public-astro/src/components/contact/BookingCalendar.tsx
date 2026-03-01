import React from 'react';
import { NeuCard } from '../shared/NeuCard';
import { Clock } from 'lucide-react';

export function BookingCalendar() {
  return (
    <NeuCard className="text-center py-12">
      <Clock className="w-12 h-12 mx-auto text-[#6B7280] mb-4" />
      <p className="text-[#6B7280]">Booking system is currently under maintenance.</p>
      <p className="text-sm text-[#6B7280] mt-2">
        Please use the contact form or email to reach out instead.
      </p>
    </NeuCard>
  );
}
