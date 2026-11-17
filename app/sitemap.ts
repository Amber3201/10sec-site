import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 3600;

// Bump this when the core pages change, so search engines know to re-crawl them.
const CORE_UPDATED = '2026-11-17';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const newestPost = posts[0]?.published_at || CORE_UPDATED;
  const core: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: CORE_UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/website-design`, lastModified: CORE_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/social-media`, lastModified: CORE_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/seo-aeo`, lastModified: CORE_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: newestPost > CORE_UPDATED ? newestPost : CORE_UPDATED, changeFrequency: 'weekly', priority: 0.7 },
  ];
  // Self-initiated concept sites shown in "Lab work" on the homepage (static files in /public/concepts).
  const concepts: MetadataRoute.Sitemap = ['northfold', 'vernier'].map((c) => ({ url: `${site.url}/concepts/${c}.html`, lastModified: CORE_UPDATED, changeFrequency: 'yearly', priority: 0.4 }));
  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.published_at || undefined, changeFrequency: 'monthly', priority: 0.6 }));
  return [...core, ...postUrls, ...concepts];
}
