import { City } from '@worthit/shared';

interface LandingCityRankingProps {
  cities: City[];
  income: number;
}

export function LandingCityRanking({ cities, income }: LandingCityRankingProps) {
  // Sort 10 major benchmark cities by savings rate given current slider income
  const benchmarkCities = cities.slice(0, 10).map((c) => {
    const rent = c.benchmarks?.bpsMonthlyPerCapita ? Math.round(c.benchmarks.bpsMonthlyPerCapita * 0.8) : 1500000;
    const other = c.benchmarks?.bpsMonthlyPerCapita ? Math.round(c.benchmarks.bpsMonthlyPerCapita * 1.2) : 2000000;
    const totalExp = rent + other;
    const remaining = income - totalExp;
    const rate = income > 0 ? Math.round((remaining / income) * 100) : 0;
    return {
      city: c,
      totalExp,
      remaining,
      rate
    };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <section id="kota" className="mt-16">
      <h2 className="apple-h2">Adu 10 kota dengan gajimu</h2>
      <p className="note">
        Peringkat tingkat tabungan, diperbarui langsung saat kamu menggeser slider gaji di atas.
      </p>

      <div className="card">
        <div className="divide-y divide-[var(--bd)]">
          {benchmarkCities.map((item, idx) => {
            const isDeficit = item.rate < 0;
            const barColor = isDeficit
              ? 'var(--r)'
              : item.rate < 15
              ? 'var(--w)'
              : item.rate < 30
              ? 'var(--ac)'
              : 'var(--ok)';

            return (
              <div key={item.city.id} className="rk py-3">
                <div className="font-semibold text-sm text-[var(--tx)] flex items-center gap-1.5">
                  <span className="text-xs text-[var(--mu)] w-4">{idx + 1}.</span>
                  {item.city.name}
                </div>

                <div className="t">
                  <i
                    style={{
                      width: `${Math.max(3, Math.min(100, item.rate))}%`,
                      background: barColor
                    }}
                  />
                </div>

                <em style={{ color: barColor }}>
                  {item.rate}%
                </em>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
