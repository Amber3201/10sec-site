import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { site } from '@/lib/content';
import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: '10sec — Your website should explain you before you do', template: '%s — 10sec' },
  description: '10sec designs websites for B2B companies that buyers understand in 10 seconds, plus SEO, AEO and social media that bring the right people to them.',
  openGraph: { siteName: '10sec', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#0A0A0A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
