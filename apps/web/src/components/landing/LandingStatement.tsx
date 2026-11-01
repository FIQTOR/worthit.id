import { useEffect, useRef } from 'react';
import { gsap, splitTextIntoSpans } from '@/utils/gsapAnimations';

export function LandingStatement() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    // Split text into word spans
    splitTextIntoSpans(textRef.current);
    const wordSpans = textRef.current.querySelectorAll('.w');
    wordSpans.forEach((w) => w.classList.add('sw'));

    const ctx = gsap.context(() => {
      gsap.to(wordSpans, {
        opacity: 1,
        stagger: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="mt-20">
      <div className="card p-8 sm:p-12 relative overflow-hidden border border-[var(--bd)]">
        <div ref={textRef} className="statement-text text-[var(--tx)]">
          <span className="text-[var(--ac)]">Gaji besar belum tentu hidup lega.</span> Yang menentukan kualitas finansial bukanlah angka di slip gaji, melainkan seberapa banyak uang bersih yang mampu kamu sisihkan di akhir bulan.
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-[var(--mu)] uppercase tracking-wider">
          <span>● Transparansi Finansial</span>
          <span>● Data Resmi BPS & UMK 2025</span>
          <span>● Bebas Bias Promosi</span>
        </div>
      </div>
    </section>
  );
}
