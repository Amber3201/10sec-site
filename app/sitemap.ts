import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/website-design', '/social-media', '/seo-aeo', '/blog'].map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'weekly' as const }));
  const posts = (await getPublishedPosts()).map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.published_at || undefined }));
  return [...pages, ...posts];
}
