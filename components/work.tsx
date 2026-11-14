'use client';

import { useEffect, useRef, useState } from 'react';

export type Concept = {
  slug: string;
  num: string;
  name: string;
  niche: string;
  desc: string;
  tags: string[];
};

function tc(s: number) {
  const f = Math.floor((s % 1) * 30);
  const sec = Math.floor(s) % 60;
  const min = Math.floor(s / 60);
  return `00:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

function WorkCard({ c, i }: { c: Concept; i: number }) {
  const vid = useRef<HTMLVideoElement>(null);
  const card = useRef<HTMLAnchorElement>(null);
  const [on, setOn] = useState(false);
  const [time, setTime] = useState(0);

  const play = () => {
    const v = vid.current;
    if (!v) return;
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
    v.play().then(() => setOn(true)).catch(() => {});
  };
  const stop = () => {
    const v = vid.current;
    setOn(false);
    if (!v) return;
    v.pause();
    setTimeout(() => { if (v.paused) { v.currentTime = 0; setTime(0); } }, 350);
  };

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    let raf = 0;
    const tick = () => { setTime(v.currentTime); raf = requestAnimationFrame(tick); };
    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const end = () => cancelAnimationFrame(raf);
    v.addEventListener('play', start);
    v.addEventListener('pause', end);
    return () => { end(); v.removeEventListener('play', start); v.removeEventListener('pause', end); };
  }, []);

  // Touch screens have no hover: play while the card is mostly in view.
  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.6 ? play() : stop()), { threshold: [0, 0.6, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const href = `/concepts/${c.slug}.html`;
  return (
    <div className={`rise${i ? ` d${i}` : ''}`} data-rv="1">
    <a
      ref={card}
      href={href}
      target="_blank"
      rel="noopener"
      className={`wk${on ? ' play' : ''}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <div className="wk-frame">
        <div className="wk-bar label">
          <span><i className="rec" aria-hidden="true" />{on ? 'Rec' : 'Concept'} {c.num}</span>
          <span className="wk-tc">{tc(time)}</span>
        </div>
        <div className="wk-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/work/${c.slug}-poster.webp`} alt={`${c.name} concept website, first screen`} width={1280} height={800} loading="lazy" />
          <video ref={vid} src={`/work/${c.slug}-scroll.mp4`} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
          <span className="wk-hint label" aria-hidden="true">Hover to scroll</span>
        </div>
      </div>
      <div className="wk-meta">
        <p className="label wk-k">Concept {c.num} · {c.niche}</p>
        <h3>{c.name}</h3>
        <p className="wk-d">{c.desc}</p>
        <ul className="wk-tags">{c.tags.map((t) => <li key={t} className="label">{t}</li>)}</ul>
        <span className="more">View live concept ↗</span>
      </div>
    </a>
    </div>
  );
}

export function WorkGrid({ items }: { items: Concept[] }) {
  return (
    <>
      <div className="wk-grid">{items.map((c, i) => <WorkCard key={c.slug} c={c} i={i} />)}</div>
      <p className="wk-note label">Self-initiated concepts. The brands are fictional and no client work is shown.</p>
    </>
  );
}
