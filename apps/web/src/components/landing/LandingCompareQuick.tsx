import { City, formatRupiah } from '@worthit/shared';

interface LandingCompareQuickProps {
  cities: City[];
  cityFrom: string;
  setCityFrom: (val: string) => void;
  cityTo: string;
  setCityTo: (val: string) => void;
  diffYearly: number;
}

export function LandingCompareQuick({
  cities,
  cityFrom,
  setCityFrom,
  cityTo,
  setCityTo,
  diffYearly
}: LandingCompareQuickProps) {
  return (
    <section className="mt-14">
      <h2 className="apple-h2">Kalau pindah kota</h2>
      <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
        Selisih sisa uang per tahun dengan gaji yang sama.
      </p>
      <div className="apple-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="apple-label">Dari Kota</label>
            <select
              value={cityFrom}
              onChange={(e) => setCityFrom(e.target.value)}
              className="apple-select"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} className="bg-[var(--c)] text-[var(--tx)]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="apple-label">Ke Kota</label>
            <select
              value={cityTo}
              onChange={(e) => setCityTo(e.target.value)}
              className="apple-select"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} className="bg-[var(--c)] text-[var(--tx)]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-[var(--bd)]">
          <p className="text-[var(--mu)] text-sm">
            {diffYearly >= 0
              ? 'Lebih hemat per tahun di kota tujuan'
              : 'Lebih boros per tahun di kota tujuan'}
          </p>
          <div
            className="text-[40px] font-bold tracking-[-1px] mt-1"
            style={{ color: diffYearly >= 0 ? 'var(--ok)' : 'var(--r)' }}
          >
            {diffYearly >= 0 ? '+' : ''}
            {formatRupiah(diffYearly)}
          </div>
        </div>
      </div>
    </section>
  );
}
