import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bp">
      <div className="wrap" style={{ padding: '140px 40px 160px' }}>
        <p className="kicker label">404</p>
        <h1 className="h1s">That page took more than <span className="hl">10 seconds.</span></h1>
        <p className="lede">It doesn&apos;t exist, or it moved. Let&apos;s get you somewhere useful.</p>
        <div className="ctas"><Link href="/" className="btn btn-y btn-lg"><span>Back to home →</span></Link><Link href="/blog" className="btn btn-o btn-lg"><span>Read the blog</span></Link></div>
      </div>
    </section>
  );
}
