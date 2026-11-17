import Link from 'next/link';
import { services, type ServiceKey } from '@/lib/content';
import type { Post } from '@/lib/posts';
import { breadcrumbLd, type Crumb } from '@/lib/seo';
import { PostCard, SectionHead } from './blocks';

// Visible breadcrumb trail + matching BreadcrumbList schema.
// The first crumb is always Home; the last one is the current page (not a link).
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs = [{ name: 'Home', path: '/' }, ...items];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs)) }} />
      <nav className="crumbs label" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((c, i) => (
            <li key={c.path}>
              {i < crumbs.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

const ORDER: ServiceKey[] = ['web', 'social', 'search'];
const BLURB: Record<ServiceKey, string> = {
  web: 'Websites that explain you before you do.',
  social: 'Content built for the first second of the feed.',
  search: 'Found on Google, cited in AI answers.',
};

const READ_TITLE: Record<ServiceKey, string> = {
  web: 'Read up on website design.',
  social: 'Read up on social media.',
  search: 'Read up on SEO and AEO.',
};

// "Keep reading" block for service pages: the posts on this topic plus links to the other two services.
export function RelatedReading({ service, posts, kicker = 'From the blog' }: { service: ServiceKey; posts: Post[]; kicker?: string }) {
  const topical = posts.filter((p) => p.category === service);
  // Topic posts first, then the newest others, so the row is always full.
  const list = [...topical, ...posts.filter((p) => p.category !== service)].slice(0, 3);
  const others = ORDER.filter((k) => k !== service);
  return (
    <section className="sec light" id="reading">
      <div className="wrap">
        <SectionHead kicker={kicker} title={READ_TITLE[service]} lead="Short, practical notes from the lab. Each one takes a few minutes.">
          <Link href="/blog" className="textlink">All posts →</Link>
        </SectionHead>
        {list.length > 0 && <div className="posts">{list.map((p) => <PostCard key={p.id} post={p} index={posts.indexOf(p)} />)}</div>}
        <div className="xsell">
          <p className="label xsell-k">Also from 10sec</p>
          <ul>
            {others.map((k) => (
              <li key={k}><Link href={services[k].href}><strong>{services[k].name}</strong><span>{BLURB[k]}</span><i aria-hidden="true">→</i></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
