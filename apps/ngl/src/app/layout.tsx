import type { Metadata } from 'next';
import type React from 'react';
import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { initGA } from '@naufalrf/analytics';
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
  metadataBase: new URL('https://ngl.naufalrf.tech'),
  title: 'Anonymous Message - NaufalRF',
  description:
    'Send anonymous messages, feedback, or questions to Naufal Rizqullah Firdaus regarding his work, projects, or engineering approach in a safe and open way.',
  keywords: ['Anonymous Message Portfolio', 'Feedback Software Engineer', 'NGL Developer Page'],
  authors: [{ name: 'Naufal Rizqullah Firdaus', url: 'https://naufalrf.tech' }],
  creator: 'Naufal Rizqullah Firdaus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ngl.naufalrf.tech',
    siteName: 'NaufalRF NGL',
    title: 'Anonymous Messages for NaufalRF',
    description:
      'An open space to share feedback or questions anonymously with Naufal Rizqullah Firdaus to support transparency and continuous improvement.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
    title: 'Anonymous Messages for NaufalRF',
    description:
      'An open space to share feedback or questions anonymously with Naufal Rizqullah Firdaus to support transparency and continuous improvement.',
  },
  alternates: {
    canonical: 'https://ngl.naufalrf.tech',
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
              onLoad={() => initGA()}
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
