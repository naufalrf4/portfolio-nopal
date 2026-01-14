import type { Metadata } from 'next';
import type React from 'react';
import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { Navbar, Footer } from '@/src/features/layout/components';
import { GAScript } from '@/src/components/GAScript';
import { SessionProvider } from '@/src/components/providers/SessionProvider';
import { ChatWidget } from '@/src/features/chatbot/components';
import { MobileBottomNav } from '@/src/features/layout/components';
import { FloatingBlobs } from '@/src/features/shared/components';
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
    default: 'NaufalRF',
    template: '%s | NaufalRF',
  },
  description:
    'Portfolio of Naufal Rizqullah Firdaus, a software engineer focused on full stack development, automation, IoT integration, and scalable digital solutions. Based in Depok, Indonesia and open to remote and global opportunities.',
  keywords: [
    'NaufalRF',
    'Naufal Rizqullah Firdaus',
    'Software Engineer Indonesia',
    'Full Stack Developer Indonesia',
    'Automation Engineer Indonesia',
    'IoT Integration Engineer',
    'Solution Engineer',
    'Solution Architect',
    'AI Automation',
    'Web Developer Indonesia',
    'Remote Software Engineer',
  ],
  authors: [{ name: 'Naufal Rizqullah Firdaus', url: 'https://naufalrf.tech' }],
  creator: 'Naufal Rizqullah Firdaus',
  publisher: 'Naufal Rizqullah Firdaus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://naufalrf.tech',
    siteName: 'NaufalRF Portfolio',
    title: 'NaufalRF',
    description:
      'The personal portfolio of Naufal Rizqullah Firdaus featuring full stack development, automation engineering, IoT integration, and real world digital solutions designed for scalability and usability.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NaufalRF Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
    title: 'NaufalRF',
    description:
      'The personal portfolio of Naufal Rizqullah Firdaus featuring full stack development, automation engineering, IoT integration, and real world digital solutions designed for scalability and usability.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://naufalrf.tech',
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
      <body className="antialiased overflow-x-hidden">
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
          <GAScript />
          <FloatingBlobs />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <MobileBottomNav />
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
