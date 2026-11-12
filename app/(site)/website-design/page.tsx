import type { Metadata } from 'next';
import { Deliverables, Packages, SectionHead } from '@/components/blocks';
import { ContactSection } from '@/components/contact';
import { DitherCanvas, Faq, Seam, TenSecondBar } from '@/components/effects';
import { faqs } from '@/lib/content';
import { B, K, Y } from '@/lib/dither';

export const metadata: Metadata = {
  title: 'Website Design',
  description: 'Fast, clear, conversion-focused websites built for the first 10 seconds. Strategy, UX, UI, copy, development and SEO foundations.',
};

export default function WebsiteDesign() {
  return (
    <>
      <section className="bp" id="top">
        <div className="wrap svc-grid">
          <div>
            <p className="kicker label hero-k rise" data-rv="1">Service 01 — Website Design</p>
            <h1 className="h1s rise d1" data-rv="1">Websites built for the <span className="hl">first 10 seconds.</span></h1>
            <p className="lede rise d2" data-rv="1">Visitors decide almost instantly whether to stay. We design and build fast, clear, conversion-focused websites that answer three questions before anyone scrolls: what you do, why it matters and what to do next.</p>
            <div className="ctas rise d3" data-rv="1">
              <a href="#contact" className="btn btn-y btn-lg"><span>Start a website →</span></a>
              <a href="#packages" className="btn btn-o btn-lg"><span>See packages</span></a>
            </div>
          </div>
          <div className="svc-art"><DitherCanvas kind="field" mode="top" cell={6} opts={{ fn: 'windows', fg: Y, fg2: B }} /><span className="art-tag label">Fig. 01 — Layout, unfolding</span></div>
        </div>
      </section>

      <section className="sec bp" id="ten" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <SectionHead kicker="The 10-second rule" title="What a visitor decides in the first 10 seconds." lead="Scroll to run the clock. Every site we build is designed around these four moments." />
          <TenSecondBar>
            <div className="ts-grid">
              <div className="ts rise" data-rv="1"><p className="label">0–1s · Load</p><h3>It has to be fast.</h3><p>Slow pages lose people before they see anything. We build lean, optimized sites that pass Core Web Vitals on mobile.</p></div>
              <div className="ts rise d1" data-rv="1"><p className="label">1–3s · Clarity</p><h3>Say what you do.</h3><p>A headline and visual that explain your offer at a glance, with no jargon to decode.</p></div>
              <div className="ts rise d2" data-rv="1"><p className="label">3–6s · Trust</p><h3>Look the part.</h3><p>Considered design, real details and consistent branding that signal you are worth the time.</p></div>
              <div className="ts rise d3" data-rv="1"><p className="label">6–10s · Action</p><h3>Show the next step.</h3><p>One clear call to action, placed where the eye lands: book, buy, call or enquire.</p></div>
            </div>
          </TenSecondBar>
        </div>
      </section>

      <Seam a={K} b={B} />

      <section className="sec light" id="included">
        <div className="wrap">
          <SectionHead kicker="What's included" title="Everything a website needs to work, not just look good." />
          <Deliverables items={[
            ['Strategy and sitemap', 'We map your goals, audience and pages before any design starts.'],
            ['UX wireframes', 'Page structure and user flows in simple grey boxes, so layout decisions are made on purpose.'],
            ['UI design', 'A distinctive visual system: type, color, components and layouts for every screen size.'],
            ['Copywriting', 'Clear, scannable copy written for people first and search engines second.'],
            ['Development', 'Built in Next.js, Webflow or Framer, depending on how you want to edit it later.'],
            ['Speed and performance', 'Optimized images, clean code and hosting setup for fast loads on any connection.'],
            ['SEO foundations', 'Metadata, schema, sitemaps and clean URLs, ready for Google and AI search.'],
            ['Analytics and handover', 'Tracking set up, a CMS you can edit yourself and a recorded walkthrough.'],
          ]} />
        </div>
      </section>

      <Seam a={B} b={K} />

      <section className="sec bp" id="how">
        <div className="wrap">
          <SectionHead kicker="How it runs" title="Five steps, no surprises." />
          <ol className="steps-h">
            {[
              ['Discover', 'A kickoff call on goals, audience, competitors and must-have features.'],
              ['Wireframe', 'Structure for every key page, reviewed with you before visual design.'],
              ['Design', 'Desktop and mobile designs, with two rounds of revisions included.'],
              ['Build', 'Development, content entry and testing across devices and browsers.'],
              ['Launch', 'Domain, hosting, analytics and SEO checks, then we go live together.'],
            ].map(([h, p], i) => (
              <li key={h} className={`rise${i ? ` d${Math.min(i, 3)}` : ''}`} data-rv="1"><span className="label">{String(i + 1).padStart(2, '0')}</span><h3>{h}</h3><p>{p}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <Seam a={K} b={B} />

      <section className="sec light" id="packages">
        <div className="wrap">
          <SectionHead kicker="Packages" title="Pick a starting point." lead="Every project gets a fixed quote after a short call. These are the usual starting points." />
          <Packages service="web" />
        </div>
      </section>

      <Faq items={faqs.web} kicker="FAQ" title="Website questions." padTop />
      <Seam a={B} b={Y} />
      <ContactSection service="web" kicker="Start a website" title="Ten seconds to impress. Let’s build them." sub="Tell us what the site needs to do. You’ll get a fixed quote after one call." />
      <Seam a={Y} b={K} />
    </>
  );
}
