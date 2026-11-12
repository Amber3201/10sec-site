import type { Metadata } from 'next';
import { Deliverables, Packages, SectionHead } from '@/components/blocks';
import { ContactSection } from '@/components/contact';
import { DitherCanvas, Faq, Seam } from '@/components/effects';
import { faqs } from '@/lib/content';
import { B, K, Y } from '@/lib/dither';

export const metadata: Metadata = {
  title: 'Social Media Marketing',
  description: 'Social content that stops the scroll: strategy, short-form video, carousels, community management, paid social and reporting.',
};

const formats = [
  { tag: 'Reels / Shorts', title: 'Short-form video', text: 'Scripted, shot and edited vertical video with captions and on-screen hooks.', fn: 'ripple' as const },
  { tag: 'Carousels', title: 'Carousels', text: 'Swipeable posts that teach, compare or tell a story, designed to be saved.', fn: 'grid' as const },
  { tag: 'Stories', title: 'Stories', text: 'Daily, lightweight updates with polls and links that keep you top of mind.', fn: 'sphere' as const },
  { tag: 'Paid ads', title: 'Paid social', text: 'Ad creative and targeting that reach new people, measured against real goals.', fn: 'bars' as const },
];

export default function SocialMedia() {
  return (
    <>
      <section className="light" id="top">
        <div className="wrap svc-grid">
          <div>
            <p className="kicker label hero-k rise" data-rv="1">Service 02 — Social Media Marketing</p>
            <h1 className="h1s rise d1" data-rv="1">Content that <span className="hl">stops the scroll.</span></h1>
            <p className="lede rise d2" data-rv="1">On social, you get about a second to earn the next nine. We plan, create and run content that hooks fast, builds a following and turns attention into enquiries.</p>
            <div className="ctas rise d3" data-rv="1">
              <a href="#contact" className="btn btn-k btn-lg"><span>Grow my socials →</span></a>
              <a href="#plans" className="btn btn-o btn-lg"><span>See plans</span></a>
            </div>
          </div>
          <div className="svc-art"><DitherCanvas kind="field" mode="top" cell={6} opts={{ fn: 'ripple', fg: K, fg2: Y }} /><span className="art-tag label">Fig. 02 — Signal, spreading</span></div>
        </div>
      </section>

      <Seam a={B} b={K} />

      <section className="sec" id="hook">
        <div className="wrap">
          <SectionHead kicker="The first second" title="Every post has three jobs, in this order." />
          <div className="big3">
            <div className="rise" data-rv="1"><p className="bignum">1s</p><h3>The first frame</h3><p>Bold visuals and movement in frame one, so thumbs stop before they scroll past.</p></div>
            <div className="rise d1" data-rv="1"><p className="bignum">3s</p><h3>The hook</h3><p>A line, question or reveal that gives people a reason to keep watching or swiping.</p></div>
            <div className="rise d2" data-rv="1"><p className="bignum">10s</p><h3>The payoff</h3><p>Deliver the value fast and end with one next step: follow, save, share or click.</p></div>
          </div>
        </div>
      </section>

      <section className="sec" id="formats" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead kicker="Formats we make" title="Built for the feed, in every shape." />
          <div className="formats">
            {formats.map((f, i) => (
              <div key={f.tag} className={`fm rise${i ? ` d${i}` : ''}`} data-rv="1">
                <div className="phone"><DitherCanvas kind="field" cell={5} opts={{ fn: f.fn, fg: Y, fg2: B, bg: K }} /><span className="label">{f.tag}</span></div>
                <h3>{f.title}</h3><p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Seam a={K} b={B} />

      <section className="sec light" id="included">
        <div className="wrap">
          <SectionHead kicker="What's included" title="We run your social, end to end." />
          <Deliverables items={[
            ['Audit and strategy', 'Where you are now, who you are talking to and what each platform is for.'],
            ['Content calendar', 'A monthly plan of themes, formats and dates, approved by you before anything goes out.'],
            ['Short-form video', 'Concepts, scripts, filming guidance and editing for Reels and Shorts.'],
            ['Design and carousels', 'On-brand templates and graphics so every post looks like it belongs to you.'],
            ['Copy and captions', 'Hooks, captions and hashtags written in your voice.'],
            ['Community management', 'Replies to comments and messages, so conversations turn into customers.'],
            ['Paid social', 'Campaign setup, creative testing and budget management on Meta and LinkedIn.'],
            ['Monthly reporting', 'Plain-language reports on reach, engagement and leads, with next month’s plan.'],
          ]} />
          <div style={{ marginTop: 72 }}>
            <p className="kicker label">Platforms we work on</p>
            <div className="chips">{['Instagram', 'LinkedIn', 'YouTube Shorts', 'Facebook', 'X', 'Pinterest'].map((c) => <span key={c} className="chip">{c}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="sec light" id="plans" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <SectionHead kicker="Monthly plans" title="Consistency beats virality. Pick a pace." lead="All plans run month to month. Exact volumes are set after your strategy call." />
          <Packages service="social" />
        </div>
      </section>

      <Faq items={faqs.social} kicker="FAQ" title="Social questions." padTop />
      <Seam a={B} b={Y} />
      <ContactSection service="social" kicker="Start growing" title="One second to stop them. We’ll handle the rest." sub="Tell us where you post today and what you want social to do for you." />
      <Seam a={Y} b={K} />
    </>
  );
}
