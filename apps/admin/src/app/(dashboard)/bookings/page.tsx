import { redirect } from 'next/navigation';

export default function BookingsPage() {
  redirect('/contacts?tab=bookings');
}
