'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { clamp, LOGO, LOGO_COLS } from '@/lib/dither';
import { site } from '@/lib/content';
import { prefersReducedMotion, useScroll } from './effects';

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

// Boxy 8-bit logo: "10" yellow, "SEC" white, blinking red REC dot.
// progress < 1 makes the pixels fall into place (used in the footer, driven by scroll).
export function PixelLogo({ progress = 1, className = '' }: { progress?: number; className?: string }) {
  return (
    <div className={`logo ${className}`} aria-hidden="true">
      {LOGO.map((r, i) => {
        const k = clamp((progress - r.d) / 0.55), e = 1 - Math.pow(1 - k, 3);
        const X = r.sx + (r.x - r.sx) * e, Yv = r.sy + (r.y - r.sy) * e;
        return <span key={i} className={r.w ? 'lp w' : 'lp'} style={{ left: pct(X, LOGO_COLS), top: pct(Yv, 7), opacity: k > 0 ? 1 : 0 }} />;
      })}
      {progress >= 1 && <span className="rec" />}
    </div>
  );
}

const NAV = [
  { href: '/website-design', label: 'Website Design' },
  { href: '/social-media', label: 'Social Media' },
  { href: '/seo-aeo', label: 'SEO / AEO' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [meter, setMeter] = useState(0);
  useScroll(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    setMeter(Math.round(clamp(window.scrollY / Math.max(1, total)) * 10));
  });
  const ctaHref = path.startsWith('/blog') ? '/#contact' : '#contact';
  const close = () => setMenu(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand" aria-label="10sec home" onClick={close}><PixelLogo /></Link>
        <div className="hdr-right">
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => <Link key={n.href} href={n.href} className={path.startsWith(n.href) ? 'on' : undefined}>{n.label}</Link>)}
          </nav>
          <div className="meter" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < meter ? 'on' : undefined} />)}</div>
          <a href={ctaHref} className="btn btn-y hdr-cta"><span>Start a project</span></a>
          <button type="button" className="menu-btn" aria-label="Menu" aria-expanded={menu} aria-controls="mnav" onClick={() => setMenu(!menu)}><span /><span /><span /></button>
        </div>
      </div>
      {menu && (
        <nav className="mnav" id="mnav" aria-label="Mobile">
          <Link href="/" onClick={close}>Home</Link>
          {NAV.map((n) => <Link key={n.href} href={n.href} onClick={close}>{n.label}</Link>)}
          <a href={ctaHref} className="btn btn-y btn-lg" onClick={close}><span>Start a project →</span></a>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  useScroll(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setT(1); return; }
    const r = el.getBoundingClientRect();
    setT(Math.round(clamp((window.innerHeight - r.top) / (window.innerHeight * 0.55)) * 50) / 50);
  });
  return (
    <footer className="foot">
      <div className="wrap">
        <div ref={ref} role="img" aria-label="10sec"><PixelLogo progress={t} className="foot-logo" /></div>
        <div className="foot-row">
          <nav className="foot-links" aria-label="Footer">
            <Link href="/">Home</Link>
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            {site.socials.map((s) => <a key={s.label} href={s.href} rel="noopener noreferrer" target="_blank">{s.label}</a>)}
          </nav>
          <p className="small">{site.email && <><a href={`mailto:${site.email}`} style={{ color: 'inherit' }}>{site.email}</a> · </>}© {new Date().getFullYear()} 10sec</p>
        </div>
      </div>
    </footer>
  );
}
