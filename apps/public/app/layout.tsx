import type { Metadata } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageViewTracker } from '@/components/PageViewTracker';
import { personStructuredData } from '@/lib/structured-data';
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
};

const structuredDataScript = JSON.stringify(personStructuredData);
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataScript }}
        />
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
      </body>
    </html>
  );
}
