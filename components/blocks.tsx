import Link from 'next/link';
import { services, type ServiceKey } from '@/lib/content';
import { B, C, K, Y, type FieldOpts } from '@/lib/dither';
import { CATEGORY_LABEL, formatDate, readTime, type Category, type Post } from '@/lib/posts';
import { ChoosePackage } from './contact';
import { DitherCanvas } from './effects';

export function SectionHead({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className={children ? 'sec-head head-row' : 'sec-head'}>
      <div>
        <p className="kicker label">{kicker}</p>
        <h2 className="h2"><span className="pxw" data-rv="1">{title}</span></h2>
        {lead && <p className="lead2">{lead}</p>}
      </div>
      {children}
    </div>
  );
}

export function Deliverables({ items }: { items: [string, string][] }) {
  return (
    <div className="deliv">
      {items.map(([h, p], i) => (
        <div className="dl" key={h}><p className="label dl-n">{String(i + 1).padStart(2, '0')}</p><h3>{h}</h3><p>{p}</p></div>
      ))}
    </div>
  );
}

export function Packages({ service }: { service: ServiceKey }) {
  return (
    <div className="pkg">
      {services[service].packages.map((p) => {
        const formName = service === 'social' && !p.hot ? `${p.tier}: ${p.name}` : p.name;
        return (
          <div className={p.hot ? 'pk hot' : 'pk'} key={p.id}>
            <p className="label">{p.tier}</p>
            <h3>{p.name}</h3>
            <p className="pk-d">{p.desc}</p>
            <ul className="ticks2">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <ChoosePackage service={service} pkg={formName} label={`Ask about ${p.name}`} className={p.hot ? 'btn btn-y' : 'btn btn-k'} />
          </div>
        );
      })}
    </div>
  );
}

// 9x9 pixel icons for the home service cards
const ICONS: Record<'monitor' | 'heart' | 'search', string[]> = {
  monitor: ['#########', '#.......#', '#.......#', '#.......#', '#.......#', '#########', '....#....', '..#####..', '.........'],
  heart: ['.........', '.##...##.', '####.####', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'],
  search: ['.####..#.', '#....####', '#....#.#.', '#....#...', '#....#...', '.####....', '.....##..', '......##.', '.......##'],
};
export function PixelIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <div className="ic" aria-hidden="true">
      {ICONS[name].join('').split('').map((c, i) => <span key={i} className={c === '#' ? `on q${(i * 7) % 4}` : undefined} />)}
    </div>
  );
}

// Abstract dither art per blog category, used when a post has no uploaded cover
export const coverArt = (cat: Category, i = 0): FieldOpts => {
  if (cat === 'social') return { fn: i % 2 ? 'grid' : 'ripple', fg: K, fg2: Y, bg: B };
  if (cat === 'search') return { fn: i % 2 ? 'grid' : 'lens', fg: Y, fg2: B, fg3: C, bg: K };
  return { fn: i % 2 ? 'bars' : 'windows', fg: Y, fg2: B, bg: K };
};

export function Cover({ post, index = 0, className = 'cover' }: { post: Post; index?: number; className?: string }) {
  return (
    <div className={className}>
      {post.cover_url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={post.cover_url} alt="" className="cover-img" loading="lazy" />
        : <DitherCanvas kind="field" opts={coverArt(post.category, index)} cell={5} mode="center" />}
    </div>
  );
}

export function PostCard({ post, index, featured }: { post: Post; index: number; featured?: boolean }) {
  return (
    <Link className={featured ? 'pcard feat' : 'pcard'} href={`/blog/${post.slug}`}>
      <Cover post={post} index={index} />
      <div>
        <p className="pc-meta label">{featured && <span>Latest</span>}<span>{CATEGORY_LABEL[post.category]}</span><span>{featured ? formatDate(post.published_at) : readTime(post.body)}</span></p>
        {featured ? <h2 className="pc-title">{post.title}</h2> : <h3 className="pc-title">{post.title}</h3>}
        <p className="pc-ex">{post.excerpt}</p>
      </div>
    </Link>
  );
}
