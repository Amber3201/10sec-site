import Link from 'next/link';
import { PixelIcon, PostCard, SectionHead } from '@/components/blocks';
import { ContactSection } from '@/components/contact';
import { DitherCanvas, Faq, Seam, Timeline } from '@/components/effects';
import { WorkGrid } from '@/components/work';
import { concepts } from '@/lib/work';
import { faqs, site } from '@/lib/content';
import { B, K, Y } from '@/lib/dither';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 60;

const DIFF: [string, string][] = [
  ['Headline says what you believe', 'Headline says what you sell'],
  ['Three vendors, three plans', 'One team for site, social and search'],
  ['SEO starts after launch', 'SEO and schema built in from day one'],
  ["AI assistants don't know you exist", 'Built to be cited in AI answers'],
  ['A developer for every small change', 'You own and edit everything'],
  ['The price moves once work starts', 'Fixed quote before anything is built'],
];

const cards = [
  { href: '/website-design', icon: 'monitor' as const, label: 'Website Design', title: 'Websites people get in 10 seconds.', desc: 'New sites, revamps and landing pages on Next.js, Webflow or Framer, checked against our 10-second test before launch.', ticks: ['Visitors know what you do and who it is for', 'A clear path from visit to enquiry', 'SEO-ready, and yours to edit'], more: 'Explore Website Design' },
  { href: '/social-media', icon: 'heart' as const, label: 'Social Media Marketing', title: 'Content that sends buyers, not just views.', desc: 'Brand-first strategy, Reels and carousels made for the feed, aimed at the people who actually buy from you.', ticks: ['Reach the right audience', 'Posts that send people to your site', 'DMs that turn into calls'], more: 'Explore Social Media' },
  { href: '/seo-aeo', icon: 'search' as const, label: 'SEO + AEO', title: 'Found on Google. Cited by AI.', desc: 'SEO gets you ranked. AEO gets your brand cited in AI answers on ChatGPT, Perplexity and Google AI Overviews.', ticks: ['Rank for what customers search', 'Show up in AI answers', 'One plain-language monthly report'], more: 'Explore SEO / AEO' },
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
            <h1 className="h1 h1-home rise d1" data-rv="1">Your website should explain you <span className="hl">before you do.</span></h1>
            <p className="lede rise d2" data-rv="1">10sec designs websites for B2B companies that buyers understand in 10 seconds, then brings the right people to them through Google, AI answers and social.</p>
            <div className="ctas rise d3" data-rv="1">
              <a href="#contact" className="btn btn-y btn-lg"><span>Start a project →</span></a>
              <a href="#services" className="btn btn-o btn-lg"><span>Explore services</span></a>
            </div>
            <p className="trust label rise d3" data-rv="1"><span><i className="rec-sq" aria-hidden="true" />Client 01 live</span><span>Fixed quote first</span><span>You own everything</span></p>
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
          <SectionHead kicker="01 — Services" title="Three services. One job: being understood." lead="Use one, or combine all three. Each one is measured on what it brings you, not on what we hand over." />
          <div className="cards">
            {cards.map((c, i) => (
              <Link key={c.href} className={`card rise${i ? ` d${i}` : ''}`} data-rv="1" href={c.href}>
                <PixelIcon name={c.icon} />
                <p className="card-num label">{c.label}</p>
                <h3>{c.title}</h3>
                <p className="desc">{c.desc}</p>
                <p className="label out-k">Outcomes</p>
                <ul className="ticks">{c.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="more">{c.more} →</span>
              </Link>
            ))}
          </div>
          <div className="founder rise" data-rv="1">
            <div className="founder-tx"><h3>You talk to the person who builds it.</h3><p>Amber Kujur, founder. One point of contact from the first call to launch, and after.</p></div>
            <a href="https://calendly.com/amber-10sec/30min" className="btn btn-k btn-lg"><span>Book a free 30-min call →</span></a>
          </div>
        </div>
      </section>

      <Seam a={B} b={K} />

      <section className="sec" id="work">
        <div className="wrap">
          <SectionHead kicker="02 — Work" title={'Our first client is\u00a0live.'} lead="Hello Nails, a nail studio in Bhubaneswar, launched with a website, local SEO and print from 10sec. Below it, two self-initiated concept sites. Every card plays a scroll-through." />
          <WorkGrid items={concepts} />
        </div>
      </section>


      <section className="sec sec-tight" id="difference">
        <div className="wrap">
          <SectionHead kicker="03 — The difference" title="Most websites need explaining. Yours shouldn't." />
          <div className="diff">
            <p className="label diff-h">The usual website</p><p className="label diff-h y">A 10sec website</p>
            {DIFF.map(([o, n]) => (
              <div className="diff-row" key={o}><p className="diff-o">{o}</p><p className="diff-n">{n}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-tight" id="experiment">
        <div className="wrap">
          <SectionHead kicker="04 — Experiment #01" title="Can a stranger tell what you do in 10 seconds?" lead="Visitors decide whether to stay in about the first 10 seconds (Nielsen Norman Group). Dr. Sec ran the same B2B software company through two headlines." />
          <div className="serp">
            <div className="panel"><p className="label xp-top"><span>Take A</span><span><i className="rec-sq" aria-hidden="true" />REC 00:10</span></p><p className="xp-h dim">Empowering businesses through innovation.</p><p className="label xp-v">Verdict: stranger left. No idea what this is.</p></div>
            <div className="panel pass"><p className="label xp-top"><span>Take B</span><span><i className="rec-sq" aria-hidden="true" />REC 00:04</span></p><p className="xp-h">Payroll software for Indian manufacturers. GST-ready, live in a week.</p><p className="label xp-v">Verdict: understood in 4 seconds.</p></div>
          </div>
          <div className="xp-cta"><p>Want yours tested? Comment <span className="label" style={{ color: 'var(--y)' }}>TEST</span> on Instagram, or send us your link.</p><a href="#contact" className="btn btn-y btn-lg"><span>Test my website →</span></a></div>
          <p className="label xp-note">Illustrative example, not a client. Source: J. Nielsen, “How Long Do Users Stay on Web Pages?”, NN/g, 2011.</p>
        </div>
      </section>

      <section className="sec sec-tight" id="process">
        <div className="wrap proc">
          <SectionHead kicker="05 — Process" title="From brief to live, in five moves." lead="The same rhythm runs through every service, so you always know what happens next." />
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
            <SectionHead kicker="06 — From the lab" title="Notes on the first 10 seconds.">
              <Link href="/blog" className="textlink">All posts →</Link>
            </SectionHead>
            <div className="posts">{posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          </div>
        </section>
      )}

      <Faq items={faqs.home} kicker="07 — FAQ" title="Quick answers." padTop={posts.length > 0} />
      <Seam a={B} b={Y} />
      <ContactSection kicker="08 — Contact" title="Got 10 seconds? Tell us your idea." sub="Share a few lines about your project. We reply within one business day." />
      <Seam a={Y} b={K} />
    </>
  );
}
