import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Toaster } from 'sonner';
import { SessionProvider } from '@/components/providers/SessionProvider';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin',
  },
  description: 'Portfolio CMS Admin Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: import('react').ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${dmSans.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#E0E5EC',
              color: '#3D4852',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
            },
          }}
        />
      </body>
    </html>
  );
}
