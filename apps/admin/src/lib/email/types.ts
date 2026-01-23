export interface ContactConfirmationData {
  name: string;
  subject?: string | null;
  messageId: string;
  receivedAt: string;
}

export interface AdminContactNotificationData {
  contact: {
    id: string;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    country?: string | null;
    city?: string | null;
  };
  dashboardLink: string;
  receivedAt: string;
}

export interface BookingConfirmationData {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  duration: number;
}

export interface AdminBookingNotificationData {
  booking: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    date: string;
    time: string;
    notes?: string | null;
  };
  dashboardLink: string;
  acceptLink: string;
  rejectLink: string;
}

export interface BookingStatusUpdateData {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  message?: string;
  status: 'confirmed' | 'rejected';
}

export interface BookingReminderData {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  hoursUntil: number;
}
