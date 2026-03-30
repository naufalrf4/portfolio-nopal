import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/contacts?tab=settings');
}
