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
  metadataBase: new URL('https://links.naufalrf.tech'),
  title: 'NaufalRF | Links',
  description:
    'Connect with NaufalRF - Full-Stack Engineer. Find all my social profiles and links in one place.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://links.naufalrf.tech',
    siteName: 'NaufalRF Links',
    title: 'NaufalRF | Links',
    description:
      'Connect with NaufalRF - Full-Stack Engineer. Find all my social profiles and links in one place.',
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
          <div className="floating-shape floating-shape-5" />
          <div className="floating-shape floating-shape-6" />
        </div>

        <main className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-12 md:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}
