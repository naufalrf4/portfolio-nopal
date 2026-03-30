import { redirect } from 'next/navigation';

export default function MessagesPage() {
  redirect('/contacts?tab=messages');
}
