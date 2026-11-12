import type { Metadata } from 'next';
import { Deliverables, Packages, SectionHead } from '@/components/blocks';
import { ContactSection } from '@/components/contact';
import { DitherCanvas, Faq, Seam } from '@/components/effects';
import { faqs } from '@/lib/content';
import { B, C, K, Y } from '@/lib/dither';

export const metadata: Metadata = {
  title: 'SEO + AEO',
  description: 'Get found on Google and cited by AI assistants like ChatGPT, Perplexity and Google AI Overviews. Technical SEO, content, schema and AI visibility tracking.',
};

export default function SeoAeo() {
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.search.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section id="top">
        <div className="wrap svc-grid">
          <div>
            <p className="kicker label hero-k rise" data-rv="1">Service 03 — SEO + AEO</p>
            <h1 className="h1s rise d1" data-rv="1">Found on Google. <span className="hl">Cited by AI.</span></h1>
            <p className="lede rise d2" data-rv="1">People don&apos;t only search anymore. They ask. We make your business easy to find in Google results, and easy for AI assistants like ChatGPT, Perplexity and Google AI Overviews to trust and cite.</p>
            <div className="ctas rise d3" data-rv="1">
              <a href="#contact" className="btn btn-y btn-lg"><span>Get found →</span></a>
              <a href="#seo-aeo" className="btn btn-o btn-lg"><span>SEO vs AEO</span></a>
            </div>
          </div>
          <div className="svc-art"><DitherCanvas kind="field" mode="top" cell={6} opts={{ fn: 'lens', fg: Y, fg2: B, fg3: C }} /><span className="art-tag label">Fig. 03 — Search, answered</span></div>
        </div>
      </section>

      <section className="sec" id="find" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <SectionHead kicker="How people find you now" title="Two ways in. You need to win both." />
          <div className="serp">
            <div className="panel rise" data-rv="1">
              <p className="label">Search engine</p>
              <div className="sbar"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" /><path d="M12 12l4.5 4.5" /></svg><span>creative agency for small business</span></div>
              <div className="res"><p className="res-url">yourbusiness.com › services</p><p className="res-t">Your Business — The answer to their search</p><p className="res-d">A clear title, a useful description and a fast page: what earns the click in the first place.</p></div>
              <div className="res dim"><p className="res-url">competitor.com</p><p className="res-t">Another result below yours</p><p className="res-d">Ranking higher means more of the clicks.</p></div>
            </div>
            <div className="panel rise d1" data-rv="1">
              <p className="label">AI assistant</p>
              <p className="ai-q">Which agency should I hire for a new website?</p>
              <p className="ai-a">For a fast, conversion-focused site with SEO built in, <strong>Your Business</strong> is a strong option. It publishes a clear process and specializes in small businesses.<span className="cite">1</span></p>
              <div className="srcs"><span className="src on">1 · yourbusiness.com</span><span className="src">2 · directory.com</span><span className="src">3 · reviews.com</span></div>
            </div>
          </div>
        </div>
      </section>

      <Seam a={K} b={B} />

      <section className="sec light" id="seo-aeo">
        <div className="wrap">
          <SectionHead kicker="SEO vs AEO" title="One gets you on the list. The other gets you into the answer." />
          <div className="vs">
            <div className="vs-col rise" data-rv="1"><p className="label">SEO · Search engine optimization</p><h3>Rank in search results.</h3><p>Helps your pages appear high in Google when people type a search, so they click through to you.</p>
              <ul className="ticks2"><li>Technical fixes: speed, indexing, mobile</li><li>Keyword and search intent research</li><li>On-page optimization and internal links</li><li>Local SEO and Google Business Profile</li><li>Links and mentions from trusted sites</li></ul></div>
            <div className="vs-col dk rise d1" data-rv="1"><p className="label">AEO · Answer engine optimization</p><h3>Get cited by AI.</h3><p>Helps AI assistants understand your business and quote it when they answer questions in your field.</p>
              <ul className="ticks2"><li>Question-led content with direct answers</li><li>Schema and structured data</li><li>Consistent brand facts across the web</li><li>Mentions on sources AI trusts</li><li>Monthly AI visibility tracking</li></ul></div>
          </div>
        </div>
      </section>

      <Seam a={B} b={K} />

      <section className="sec" id="signals">
        <div className="wrap">
          <SectionHead kicker="What makes a brand citable" title="The four signals we build." />
          <div className="four">
            {[['Clear answers', 'Pages that answer real customer questions directly, in the first sentence or two.'], ['Structured data', 'Schema markup that tells machines who you are, what you offer and where.'], ['Authority', 'Reviews, mentions and links from places people and AI already trust.'], ['Freshness', 'Content that stays current, so your answers are the newest and most accurate.']].map(([h, p], i) => (
              <div key={h} className={`rise${i ? ` d${i}` : ''}`} data-rv="1"><p className="label">{String(i + 1).padStart(2, '0')}</p><h3>{h}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="process" style={{ paddingTop: 0 }}>
        <div className="wrap proc">
          <div>
            <p className="kicker label">How it runs</p>
            <h2 className="h2"><span className="pxw" data-rv="1">Audit, fix, create, earn, track.</span></h2>
            <div className="fig"><DitherCanvas kind="field" cell={6} opts={{ fn: 'bars', fg: Y, fg2: C, bg: K }} /><span className="art-tag label">Fig. 04 — Growth, compounding</span></div>
          </div>
          <ol className="steps-h steps-v">
            {[['Audit', 'Find what’s holding you back', 'A full technical and content audit, plus a check of how AI assistants describe you today.'], ['Fix', 'Clear the foundations', 'Speed, indexing, structure and schema, fixed in priority order.'], ['Create', 'Answer real questions', 'Pages and articles built around what your customers actually ask.'], ['Earn', 'Build authority', 'Reviews, listings, partner mentions and digital PR.'], ['Track', 'Measure both channels', 'Monthly rankings, traffic and AI citation tracking, in one report.']].map(([k, h, p], i) => (
              <li key={k} className="rise" data-rv="1"><span className="label">{String(i + 1).padStart(2, '0')} · {k}</span><h3>{h}</h3><p>{p}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <Seam a={K} b={B} />

      <section className="sec light" id="included">
        <div className="wrap">
          <SectionHead kicker="What's included" title="The full search toolkit." />
          <Deliverables items={[
            ['Technical audit', 'Crawl, speed, mobile and indexing issues found and fixed.'],
            ['Question research', 'The keywords and questions your customers use, mapped to pages.'],
            ['On-page optimization', 'Titles, headings, copy and internal links tuned for intent.'],
            ['Content writing', 'Articles and FAQ pages that answer questions clearly and directly.'],
            ['Schema markup', 'Organization, service, FAQ and article schema, implemented and tested.'],
            ['Local SEO', 'Google Business Profile, local listings and consistent business details.'],
            ['AI visibility tracking', 'A monthly check of how assistants answer questions in your field.'],
            ['Monthly reporting', 'Rankings, traffic, leads and citations, explained in plain language.'],
          ]} />
        </div>
      </section>

      <section className="sec light" id="plans" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <SectionHead kicker="Monthly plans" title="Search compounds. Start where you are." lead="Every plan starts with an audit, so the work goes where it matters most." />
          <Packages service="search" />
        </div>
      </section>

      <Faq items={faqs.search} kicker="FAQ" title="Search questions." padTop />
      <Seam a={B} b={Y} />
      <ContactSection service="search" kicker="Get found" title="Be the answer, not just a result." sub="Tell us your website and the customers you want to reach. We start with a quick audit." />
      <Seam a={Y} b={K} />
    </>
  );
}
