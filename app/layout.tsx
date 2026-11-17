import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { site } from '@/lib/content';
import { OG_IMAGE } from '@/lib/seo';
import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Your website should explain you before you do | 10sec', template: '%s | 10sec' },
  description: '10sec is a creative agency for website design, social media marketing and SEO + AEO, building websites people understand in their first 10 seconds.',
  openGraph: { siteName: '10sec', type: 'website', locale: 'en_IN', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
};

export const viewport: Viewport = { themeColor: '#0A0A0A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
