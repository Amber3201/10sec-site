'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp, renderField, renderSeam, type FieldOpts, type RGB } from '@/lib/dither';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Calls fn on mount, on scroll and on resize, at most once per animation frame.
export function useScroll(fn: () => void) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    let raf = 0;
    const run = () => { raf = 0; ref.current(); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); if (raf) cancelAnimationFrame(raf); };
  }, []);
}

type CanvasProps = {
  cell?: number;
  mode?: 'top' | 'center' | 'seam';
  className?: string;
} & ({ kind: 'field'; opts: FieldOpts } | { kind: 'seam'; a: RGB; b: RGB });

// A dithered canvas that only redraws when scroll progress changes. Nothing moves on its own.
export function DitherCanvas(props: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<{ img?: ImageData; ctx?: CanvasRenderingContext2D; key?: number; visible: boolean }>({ visible: true });
  const cell = props.cell ?? 6;
  const mode = props.kind === 'seam' ? 'seam' : props.mode ?? 'center';

  const draw = () => {
    const el = ref.current, s = st.current;
    if (!el || !s.visible) return;
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const cols = Math.max(1, Math.ceil(w / cell)), rows = Math.max(1, Math.ceil(h / cell));
    let fresh = false;
    if (!s.img || el.width !== cols || el.height !== rows) {
      el.width = cols; el.height = rows;
      s.ctx = el.getContext('2d')!;
      s.img = s.ctx.createImageData(cols, rows);
      fresh = true;
    }
    const vh = window.innerHeight;
    let prog: number;
    if (prefersReducedMotion()) prog = mode === 'seam' ? 0.5 : mode === 'top' ? 0 : 1;
    else if (mode === 'top') prog = clamp(window.scrollY / 650);
    else {
      const r = el.getBoundingClientRect();
      prog = mode === 'seam' ? clamp((vh - r.top) / (vh + r.height)) : clamp((vh - r.top) / (vh * 0.8));
    }
    const key = Math.round(prog * 400);
    if (!fresh && s.key === key) return;
    s.key = key;
    if (props.kind === 'seam') renderSeam(s.img, props.a, props.b, prog);
    else renderField(s.img, props.opts, prog);
    s.ctx!.putImageData(s.img, 0, 0);
  };

  useScroll(draw);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { st.current.visible = e.isIntersecting; if (e.isIntersecting) draw(); }, { rootMargin: '160px' });
    io.observe(el);
    const ro = new ResizeObserver(() => draw());
    ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className={props.className ?? (props.kind === 'seam' ? 'seam' : 'cv')} aria-hidden="true" />;
}

export function Seam({ a, b }: { a: RGB; b: RGB }) {
  return <DitherCanvas kind="seam" a={a} b={b} cell={8} />;
}

// Adds .in to every [data-rv] element when it scrolls into view (pixel headline wipes + soft rises).
export function RevealObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    const scan = () => document.querySelectorAll('[data-rv]:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

// Vertical process line that draws itself as you scroll
export function Timeline({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useScroll(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setP(1); return; }
    const r = el.getBoundingClientRect();
    setP(Math.round(clamp((window.innerHeight * 0.65 - r.top) / Math.max(1, r.height)) * 40) / 40);
  });
  const n = steps.length + 1;
  return (
    <div className="tl" ref={ref}>
      <div className="tl-track" aria-hidden="true" />
      <div className="tl-fill" aria-hidden="true" style={{ height: `${p * 100}%` }} />
      {steps.map((s, i) => (
        <div className="step" key={s.title}>
          <span className={p >= (i + 0.5) / n ? 'node on' : 'node'} aria-hidden="true" />
          <p className="step-k label">Step {String(i + 1).padStart(2, '0')}</p>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </div>
      ))}
      <div className="step" style={{ paddingBottom: 0 }}>
        <span className={p >= 0.97 ? 'node live on' : 'node live'} aria-hidden="true" />
        <p className="live-txt">LIVE</p>
      </div>
    </div>
  );
}

// Website page: a 10-block bar that fills second by second as the section scrolls past
export function TenSecondBar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useScroll(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setN(10); return; }
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    setN(Math.round(clamp((vh * 0.8 - r.top) / (vh * 0.5)) * 10));
  });
  return (
    <div ref={ref}>
      <div className="ts-bar" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < n ? 'tb on' : 'tb'} />)}</div>
      <div className="ts-scale label" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}s</span>)}</div>
      {children}
    </div>
  );
}

export function Faq({ items, kicker, title, padTop }: { items: { q: string; a: string }[]; kicker: string; title: string; padTop?: boolean }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec light" id="faq" style={padTop ? { paddingTop: 24 } : undefined}>
      <div className="wrap faq">
        <div>
          <p className="kicker label">{kicker}</p>
          <h2 className="h2"><span className="pxw" data-rv="1">{title}</span></h2>
        </div>
        <div>
          {items.map((f, i) => (
            <div className="qa" key={f.q}>
              <button type="button" className="q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}
                <span className={open === i ? 'pxplus open' : 'pxplus'} aria-hidden="true"><span className="hz" /><span className="vt" /></span>
              </button>
              {open === i && <p className="ans" id={`faq-${i}`}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
