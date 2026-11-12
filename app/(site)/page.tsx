import Link from 'next/link';
import { PixelIcon, PostCard, SectionHead } from '@/components/blocks';
import { ContactSection } from '@/components/contact';
import { DitherCanvas, Faq, Seam, Timeline } from '@/components/effects';
import { faqs, site } from '@/lib/content';
import { B, K, Y } from '@/lib/dither';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 60;

const cards = [
  { href: '/website-design', icon: 'monitor' as const, label: 'Website Design', title: 'Websites that hook in seconds.', desc: 'Fast, clear, conversion-first sites with a look people remember, built to load before attention runs out.', ticks: ['Strategy, UX and UI design', 'Next.js, Webflow or Framer builds', 'SEO-ready and easy to edit'], more: 'Explore Website Design' },
  { href: '/social-media', icon: 'heart' as const, label: 'Social Media Marketing', title: 'Content that stops the thumb.', desc: 'Strategy, content and campaigns made for the feed, where the first frame decides everything.', ticks: ['Content strategy and calendars', 'Reels, carousels and short-form video', 'Community and paid social'], more: 'Explore Social Media' },
  { href: '/seo-aeo', icon: 'search' as const, label: 'SEO + AEO', title: 'Found on Google. Cited by AI.', desc: 'SEO gets you ranked. AEO gets your brand cited in AI answers on ChatGPT, Perplexity and Google AI Overviews.', ticks: ['Technical SEO and site audits', 'Content built for real questions', 'Schema and AI answer visibility'], more: 'Explore SEO / AEO' },
];

export default async function Home() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Organization', name: '10sec', url: site.url,
    description: 'Creative agency for website design, social media marketing and SEO / AEO.',
    ...(site.email ? { email: site.email } : {}), sameAs: site.socials.map((s) => s.href),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section id="top">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow label rise" data-rv="1"><span className="dot" aria-hidden="true" />Creative agency — Web · Social · Search</p>
            <h1 className="h1 h1-home rise d1" data-rv="1">First impressions take <span className="hl">10 seconds.</span></h1>
            <p className="lede rise d2" data-rv="1">10sec designs websites, runs social and gets you found on Google and in AI answers, so those first ten seconds turn into customers.</p>
            <div className="ctas rise d3" data-rv="1">
              <a href="#contact" className="btn btn-y btn-lg"><span>Start a project →</span></a>
              <a href="#services" className="btn btn-o btn-lg"><span>Explore services</span></a>
            </div>
          </div>
          <div className="hero-art"><DitherCanvas kind="field" mode="top" cell={6} opts={{ fn: 'sphere', fg: Y, pix: true }} /></div>
        </div>
      </section>

      <div className="why">
        <div className="wrap why-grid">
          <div className="rise" data-rv="1"><p className="label why-k">01 · Speed</p><h3>Built for the first 10 seconds</h3><p>Every page, post and search result is designed to make sense, and make an impression, almost instantly.</p></div>
          <div className="rise d1" data-rv="1"><p className="label why-k">02 · Focus</p><h3>One team, three channels</h3><p>Your website, social and search work from one plan, one voice and one set of goals, instead of three vendors.</p></div>
          <div className="rise d2" data-rv="1"><p className="label why-k">03 · Visibility</p><h3>Found by people and by AI</h3><p>We optimize for Google and for AI assistants, so your brand shows up wherever people ask for what you do.</p></div>
        </div>
      </div>

      <Seam a={K} b={B} />

      <section className="sec light" id="services">
        <div className="wrap">
          <SectionHead kicker="01 — Services" title="Three services. One goal: the first impression." lead="Use one, or combine all three. Each service has its own page with exactly what is included, how it works and where to start." />
          <div className="cards">
            {cards.map((c, i) => (
              <Link key={c.href} className={`card rise${i ? ` d${i}` : ''}`} data-rv="1" href={c.href}>
                <PixelIcon name={c.icon} />
                <p className="card-num label">{c.label}</p>
                <h3>{c.title}</h3>
                <p className="desc">{c.desc}</p>
                <ul className="ticks">{c.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="more">{c.more} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Seam a={B} b={K} />

      <section className="sec" id="process">
        <div className="wrap proc">
          <SectionHead kicker="02 — Process" title="From brief to live, in five moves." lead="The same rhythm runs through every service, so you always know what happens next." />
          <Timeline steps={[
            { title: 'Brief', text: 'One call to pin down your goals, audience and what success looks like.' },
            { title: 'Plan', text: 'A clear scope, timeline and fixed quote before any work begins.' },
            { title: 'Create', text: 'Design, content and build, with reviews at every key point.' },
            { title: 'Launch', text: 'Go live with analytics, SEO and social rollout ready from day one.' },
            { title: 'Grow', text: 'Monthly content, campaigns and search work that compound over time.' },
          ]} />
        </div>
      </section>

      <Seam a={K} b={B} />

      {posts.length > 0 && (
        <section className="sec light" id="blog">
          <div className="wrap">
            <SectionHead kicker="03 — From the blog" title="Notes on the first 10 seconds.">
              <Link href="/blog" className="textlink">All posts →</Link>
            </SectionHead>
            <div className="posts">{posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          </div>
        </section>
      )}

      <Faq items={faqs.home} kicker="04 — FAQ" title="Quick answers." padTop={posts.length > 0} />
      <Seam a={B} b={Y} />
      <ContactSection kicker="05 — Contact" title="Got 10 seconds? Tell us your idea." sub="Share a few lines about your project. We reply within one business day." />
      <Seam a={Y} b={K} />
    </>
  );
}
