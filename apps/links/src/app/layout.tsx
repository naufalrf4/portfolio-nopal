import type { Metadata } from 'next';
import type React from 'react';
import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://links.naufalrf.tech'),
  title: 'Links - NaufalRF',
  description:
    'A central hub of official links by Naufal Rizqullah Firdaus including portfolio, GitHub, LinkedIn, automation projects, IoT systems, blogs, and contact details.',
  keywords: ['Naufal Rizqullah Firdaus Links', 'Automation Engineer Portfolio Links'],
  authors: [{ name: 'Naufal Rizqullah Firdaus', url: 'https://naufalrf.tech' }],
  creator: 'Naufal Rizqullah Firdaus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://links.naufalrf.tech',
    siteName: 'NaufalRF Links',
    title: 'NaufalRF Links',
    description:
      'Quick access to the professional work, social profiles, and engineering portfolio of Naufal Rizqullah Firdaus from a single page.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
    title: 'NaufalRF Links',
    description:
      'Quick access to the professional work, social profiles, and engineering portfolio of Naufal Rizqullah Firdaus from a single page.',
  },
  alternates: {
    canonical: 'https://links.naufalrf.tech',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${dmSans.variable} antialiased`}>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
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
          </>
        )}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
