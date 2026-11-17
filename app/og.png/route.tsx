import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { LOGO } from '@/lib/dither';

// Default share image (1200x630) for og:image and twitter:image, rendered once at build time and served at /og.png.
export const dynamic = 'force-static';

const K = '#0A0A0A', Y = '#FFD60A', C = '#F3F0E8', A = '#8A8780', R = '#FF3B30', LINE = '#262626';
const CELL = 9;

const font = (p: string) => readFile(join(process.cwd(), 'node_modules/geist/dist/fonts', p));

function Corner({ x, y }: { x: 'left' | 'right'; y: 'top' | 'bottom' }) {
  const s = 18, t = 3;
  return (
    <div style={{ position: 'absolute', [x]: 40, [y]: 40, width: s, height: s, display: 'flex' }}>
      <div style={{ position: 'absolute', [x]: 0, [y]: 0, width: s, height: t, background: Y }} />
      <div style={{ position: 'absolute', [x]: 0, [y]: 0, width: t, height: s, background: Y }} />
    </div>
  );
}

export async function GET() {
  const [semi, mono] = await Promise.all([font('geist-sans/Geist-SemiBold.ttf'), font('geist-mono/GeistMono-Medium.ttf')]);
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: K, color: C, padding: '84px 96px 80px', position: 'relative', fontFamily: 'Geist' }}>
        {/* faint brand grid */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', backgroundImage: `linear-gradient(${'#141414'} 1px, transparent 1px), linear-gradient(90deg, ${'#141414'} 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <Corner x="left" y="top" /><Corner x="right" y="top" /><Corner x="left" y="bottom" /><Corner x="right" y="bottom" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', width: 38 * CELL, height: 7 * CELL, display: 'flex' }}>
            {LOGO.map((p, i) => <div key={i} style={{ position: 'absolute', left: p.x * CELL, top: p.y * CELL, width: CELL + 0.5, height: CELL + 0.5, background: p.w ? C : Y }} />)}
            <div style={{ position: 'absolute', left: 35 * CELL, top: 0, width: 3 * CELL, height: 3 * CELL, background: R, borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 2, color: A }}>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: R }} />REC 00:10
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5 }}>
          <div style={{ display: 'flex' }}>Your website should</div>
          <div style={{ display: 'flex' }}>
            <span style={{ background: Y, color: K, padding: '0 10px', marginLeft: -10, marginRight: 18 }}>explain you</span>before you do.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${LINE}`, paddingTop: 26, fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 2 }}>
          <div style={{ display: 'flex', color: A }}>WEBSITE DESIGN · SOCIAL MEDIA · SEO + AEO</div>
          <div style={{ display: 'flex', color: Y }}>10SEC.SPACE</div>
        </div>
      </div>
    ),
    {
      width: 1200, height: 630,
      fonts: [{ name: 'Geist', data: semi, weight: 600, style: 'normal' }, { name: 'Geist Mono', data: mono, weight: 500, style: 'normal' }],
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000' },
    },
  );
}
