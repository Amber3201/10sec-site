import { Footer, Header } from '@/components/chrome';
import { RevealObserver } from '@/components/effects';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <RevealObserver />
    </>
  );
}
