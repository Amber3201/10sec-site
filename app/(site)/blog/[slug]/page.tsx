import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Cover, PostCard } from '@/components/blocks';
import { PixelLogo } from '@/components/chrome';
import { ContactSection } from '@/components/contact';
import { Seam } from '@/components/effects';
import { site } from '@/lib/content';
import { B, K, Y } from '@/lib/dither';
import { CATEGORY_LABEL, formatDate, getPostBySlug, getPublishedPosts, readTime } from '@/lib/posts';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.seo_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: { type: 'article', title: post.seo_title || post.title, description: post.meta_description || post.excerpt, images: post.cover_url ? [post.cover_url] : undefined },
  };
}

const SERVICE_FOR = { web: 'web', social: 'social', search: 'search' } as const;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const all = await getPublishedPosts();
  const related = all.filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2);
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt,
    datePublished: post.published_at, author: { '@type': 'Organization', name: '10sec' },
    url: `${site.url}/blog/${post.slug}`, ...(post.cover_url ? { image: post.cover_url } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="light" id="top">
        <div className="wrap post-hero">
          <Link href="/blog" className="back">← All posts</Link>
          <p className="kicker label">{CATEGORY_LABEL[post.category]} · {formatDate(post.published_at)} · {readTime(post.body)}</p>
          <h1 className="art-title">{post.title}</h1>
          <p className="lede" style={{ margin: 0 }}>{post.excerpt}</p>
          <Cover post={post} className="art-cover" />
        </div>
        <article className="article">
          <ReactMarkdown>{post.body}</ReactMarkdown>
          <div className="author">
            <div className="avatar" aria-hidden="true"><PixelLogo /></div>
            <div><p className="au-n">10sec Team</p><p className="au-d">Websites, social and search for brands that need to land fast.</p></div>
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
            <div className="related">{related.map((p) => <PostCard key={p.id} post={p} index={all.indexOf(p)} />)}</div>
          </div>
        </section>
      )}
      <Seam a={B} b={Y} />
      <ContactSection service={SERVICE_FOR[post.category]} kicker="Want help with this?" title="Make your brand the one they remember." sub="Tell us about your business and what you want to improve. We reply within one business day." />
      <Seam a={Y} b={K} />
    </>
  );
}
