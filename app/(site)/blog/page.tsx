import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogList } from '@/components/BlogList';
import { Seam } from '@/components/effects';
import { B, K } from '@/lib/dither';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Blog', description: 'Short reads on websites, social media and search, from the 10sec team.' };

export default async function Blog() {
  const posts = await getPublishedPosts();
  return (
    <>
      <section className="light" id="top">
        <div className="wrap blog-wrap">
          <p className="kicker label rise" data-rv="1">The 10sec Blog</p>
          <h1 className="h1s rise d1" data-rv="1" style={{ maxWidth: 900 }}>Short reads on websites, social and search.</h1>
          <p className="lede rise d2" data-rv="1">Practical notes for business owners and marketers. Each one is readable in a few minutes.</p>
          <BlogList posts={posts} />
          <p className="label team-link"><Link href="/admin">Team sign-in →</Link></p>
        </div>
      </section>
      <Seam a={B} b={K} />
    </>
  );
}
