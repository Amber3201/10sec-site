import type { Metadata } from 'next';
import { BlogList } from '@/components/BlogList';
import { Seam } from '@/components/effects';
import { Breadcrumbs } from '@/components/seo';
import { B, K } from '@/lib/dither';
import { getPublishedPosts } from '@/lib/posts';
import { absolute, FOUNDER, ORG_LD, pageMeta } from '@/lib/seo';

export const revalidate = 60;
export const metadata: Metadata = pageMeta({
  title: 'The 10sec Blog: Website Design, Social Media, SEO + AEO',
  description: 'Short, practical reads on website design, social media and SEO + AEO for small business owners and founders. Each one takes a few minutes to read.',
  path: '/blog',
});

export default async function Blog() {
  const posts = await getPublishedPosts();
  const ld = {
    '@context': 'https://schema.org', '@type': 'Blog', '@id': absolute('/blog#blog'),
    name: 'The 10sec Blog', url: absolute('/blog'), inLanguage: 'en',
    description: 'Short reads on websites, social media and search.',
    publisher: ORG_LD,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting', headline: p.title, url: absolute(`/blog/${p.slug}`),
      datePublished: p.published_at || undefined, author: { '@type': 'Person', name: FOUNDER.name },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="light" id="top">
        <div className="wrap blog-wrap">
          <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }]} />
          <p className="kicker label rise" data-rv="1">The 10sec Blog</p>
          <h1 className="h1s rise d1" data-rv="1" style={{ maxWidth: 900 }}>Short reads on websites, social and search.</h1>
          <p className="lede rise d2" data-rv="1">Practical notes for business owners and marketers. Each one is readable in a few minutes.</p>
          <BlogList posts={posts} />
        </div>
      </section>
      <Seam a={B} b={K} />
    </>
  );
}
