import { useEffect, useRef } from 'react';
import { City } from '@worthit/shared';
import { gsap } from '@/utils/gsapAnimations';

interface LandingMarqueeProps {
  cities: City[];
}

export function LandingMarquee({ cities }: LandingMarqueeProps) {
  const displayCities = cities.length > 0 ? cities : [];
  const statsRef = useRef<HTMLDivElement | null>(null);

  // GSAP Count-up animation for stats numbers
  useEffect(() => {
    if (!statsRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const elements = statsRef.current.querySelectorAll<HTMLElement>('[data-target]');

    const ctx = gsap.context(() => {
      elements.forEach((el) => {
        const targetVal = Number(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%'
          },
          onUpdate() {
            el.textContent = Math.round(obj.val) + suffix;
          }
        });
      });
    });

    return () => ctx.revert();
  }, [cities]);

  return (
    <>
      {/* Metrics Row */}
      <section ref={statsRef} className="grid grid-cols-3 gap-4 mt-12 text-center">
        <div>
          <b
            data-target={cities.length || 30}
            className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ac)]"
          >
            0
          </b>
          <span className="text-[var(--mu)] text-sm">kota</span>
        </div>
        <div>
          <b
            data-target={7}
            className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ac)]"
          >
            0
          </b>
          <span className="text-[var(--mu)] text-sm">kategori biaya</span>
        </div>
        <div>
          <b
            data-target={100}
            data-suffix="%"
            className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ok)]"
          >
            0%
          </b>
          <span className="text-[var(--mu)] text-sm">rupiah, transparan</span>
        </div>
      </section>

      {/* Marquee ticker */}
      <div className="apple-mq">
        <div className="apple-mq-inner">
          {displayCities.concat(displayCities).map((c, i) => (
            <span key={`${c.id}-${i}`}>{c.name}</span>
          ))}
        </div>
      </div>
    </>
  );
}
