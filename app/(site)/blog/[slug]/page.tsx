import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Cover, PostCard } from '@/components/blocks';
import { PixelLogo } from '@/components/chrome';
import { ContactSection } from '@/components/contact';
import { Seam } from '@/components/effects';
import { services } from '@/lib/content';
import { Breadcrumbs } from '@/components/seo';
import { absolute, FOUNDER, OG_IMAGE, ORG_LD, pageMeta } from '@/lib/seo';
import { B, K, Y } from '@/lib/dither';
import { CATEGORY_LABEL, formatDate, getPostBySlug, getPublishedPosts, readTime, type Post } from '@/lib/posts';

export const revalidate = 60;

// Search engines want ~110–160 characters. Short excerpts get a topic line added so no post ships a thin description.
function describe(post: Post) {
  const d = (post.meta_description || post.excerpt).trim();
  if (d.length >= 110) return d;
  return `${d} A short read on ${CATEGORY_LABEL[post.category].toLowerCase()} from the 10sec blog.`;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: 'Post not found', robots: { index: false } };
  return pageMeta({
    title: `${post.seo_title || post.title} | 10sec Blog`,
    description: describe(post),
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.cover_url,
    publishedTime: post.published_at,
  });
}

const SERVICE_FOR = { web: 'web', social: 'social', search: 'search' } as const;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const all = await getPublishedPosts();
  const related = all.filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  const url = absolute(`/blog/${post.slug}`);
  const svc = services[SERVICE_FOR[post.category]];
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title, description: describe(post),
    image: [post.cover_url || absolute(OG_IMAGE.url)],
    datePublished: post.published_at, dateModified: post.published_at,
    author: { '@type': 'Person', name: FOUNDER.name, jobTitle: 'Founder', worksFor: { '@id': ORG_LD['@id'] }, url: absolute('/') },
    publisher: ORG_LD,
    articleSection: CATEGORY_LABEL[post.category], inLanguage: 'en', url,
    isPartOf: { '@id': absolute('/blog#blog') },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="light" id="top">
        <div className="wrap post-hero">
          <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />
          <p className="kicker label">{CATEGORY_LABEL[post.category]} · {formatDate(post.published_at)} · {readTime(post.body)}</p>
          <h1 className="art-title">{post.title}</h1>
          <p className="lede" style={{ margin: 0 }}>{post.excerpt}</p>
          <Cover post={post} className="art-cover" />
        </div>
        <article className="article">
          <ReactMarkdown>{post.body}</ReactMarkdown>
          <p className="post-svc">Filed under <Link href={`/blog`}>{CATEGORY_LABEL[post.category]}</Link>. Want this done for you? See our <Link href={svc.href}>{svc.name} service</Link>.</p>
          <div className="author">
            <div className="avatar" aria-hidden="true"><PixelLogo /></div>
            <div><p className="au-n">{FOUNDER.name}</p><p className="au-d">{FOUNDER.bio}</p></div>
          </div>
        </article>
      </section>
      {related.length > 0 && (
        <section className="light">
          <div className="wrap" style={{ paddingBottom: 120 }}>
            <div className="sec-head head-row" style={{ marginBottom: 40 }}>
              <h2 className="h2" style={{ fontSize: 36 }}>Keep reading</h2>
              <Link href="/blog" className="textlink">All posts →</Link>
            </div>
            <div className="posts">{related.map((p) => <PostCard key={p.id} post={p} index={all.indexOf(p)} />)}</div>
          </div>
        </section>
      )}
      <Seam a={B} b={Y} />
      <ContactSection service={SERVICE_FOR[post.category]} kicker="Want help with this?" title="Make your brand the one they remember." sub="Tell us about your business and what you want to improve. We reply within one business day." />
      <Seam a={Y} b={K} />
    </>
  );
}
