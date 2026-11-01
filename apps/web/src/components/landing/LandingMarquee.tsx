import { City } from '@worthit/shared';

interface LandingMarqueeProps {
  cities: City[];
}

export function LandingMarquee({ cities }: LandingMarqueeProps) {
  const displayCities = cities.length > 0 ? cities : [];

  return (
    <>
      {/* Metrics Row */}
      <section className="grid grid-cols-3 gap-4 mt-12 text-center">
        <div>
          <b className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ac)]">
            {cities.length || 30}
          </b>
          <span className="text-[var(--mu)] text-sm">kota</span>
        </div>
        <div>
          <b className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ac)]">
            7
          </b>
          <span className="text-[var(--mu)] text-sm">kategori biaya</span>
        </div>
        <div>
          <b className="block text-[clamp(30px,5vw,46px)] tracking-[-1.5px] text-[var(--ok)]">
            100%
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
