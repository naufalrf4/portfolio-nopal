import type { Metadata } from 'next';
import type React from 'react';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';

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
  title: 'NaufalRF | Send Anonymous Message',
  description:
    'Send an anonymous message to NaufalRF. Share your thoughts, feedback, or questions privately.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ngl.naufalrf.tech',
    siteName: 'NaufalRF NGL',
    title: 'NaufalRF | Send Anonymous Message',
    description:
      'Send an anonymous message to NaufalRF. Share your thoughts, feedback, or questions privately.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen">
        <div className="bg-shapes-container">
          <div className="bg-gradient-overlay" />
          <div className="floating-shape floating-shape-1" />
          <div className="floating-shape floating-shape-2" />
          <div className="floating-shape floating-shape-3" />
          <div className="floating-shape floating-shape-4" />
        </div>

        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
