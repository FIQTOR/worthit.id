import { ReactNode, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Scroll progress line listener
    const handleScroll = () => {
      const h = document.documentElement;
      const progress = window.scrollY / Math.max(1, h.scrollHeight - window.innerHeight);
      const bar = document.getElementById('scroll-progress');
      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
      }
    };

    // Spotlight cursor effect on cards
    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest('.apple-card') as HTMLElement | null;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--ac)] selection:text-white">
      <div id="scroll-progress"></div>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
