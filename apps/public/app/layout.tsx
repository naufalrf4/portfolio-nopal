import type { Metadata } from 'next';
import type React from 'react';
import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { Navbar, Footer } from '@/src/features/layout/components';
import { PageViewTracker } from '@/src/components/PageViewTracker';
import { SessionProvider } from '@/src/components/providers/SessionProvider';
import { FloatingChatbot } from '@/src/features/chatbot/components';
import { MobileBottomNav } from '@/src/features/layout/components';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://naufalrf.tech'),
  title: {
    default: 'NaufalRF | Full-Stack Engineer',
    template: '%s | NaufalRF',
  },
  description:
    'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://naufalrf.tech',
    siteName: 'NaufalRF Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
  },
  alternates: {
    canonical: '/',
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <SessionProvider>
          {GA_MEASUREMENT_ID && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
          )}
          {GA_MEASUREMENT_ID && (
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                `,
              }}
            />
          )}
          <PageViewTracker />
          <Navbar />
          {children}
          <Footer />
          <MobileBottomNav />
          <FloatingChatbot />
        </SessionProvider>
      </body>
    </html>
  );
}
