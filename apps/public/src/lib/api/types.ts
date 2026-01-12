export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface BookingData {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  date: string;
  time: string;
}
