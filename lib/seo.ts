import type { Metadata } from 'next';
import { site } from './content';

// One place for page-level SEO: canonical URL, Open Graph and X (Twitter) card.
// Every public page should build its metadata with pageMeta() so no tag is left out.

export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: '10sec: website design, social media and SEO + AEO' };

export const FOUNDER = {
  name: 'Amber Kujur',
  role: 'Founder, 10sec',
  bio: 'Founder of 10sec. Designs websites, social content and search strategy so a business makes sense in its first 10 seconds.',
};

type PageMetaInput = {
  title: string; // used as-is for <title>, og:title and twitter:title
  description: string;
  path: string; // '' for home, '/blog' etc.
  type?: 'website' | 'article';
  image?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

export function absolute(path: string) {
  return `${site.url}${path}`;
}

export function pageMeta({ title, description, path, type = 'website', image, publishedTime, modifiedTime }: PageMetaInput): Metadata {
  const url = absolute(path || '/');
  const images = image ? [{ url: image, alt: title }] : [OG_IMAGE];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path || '/' },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: 'en_IN',
      title,
      description,
      images,
      ...(type === 'article' ? { publishedTime: publishedTime || undefined, modifiedTime: modifiedTime || publishedTime || undefined, authors: [FOUNDER.name] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

// Organization node reused as publisher in other schema blocks.
export const ORG_LD = {
  '@type': 'Organization',
  '@id': `${site.url}/#org`,
  name: site.name,
  url: site.url,
  logo: { '@type': 'ImageObject', url: absolute('/og.png'), width: 1200, height: 630 },
};

export type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.path || '/') })),
  };
}
