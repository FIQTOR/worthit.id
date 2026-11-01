import { Link } from 'react-router-dom';
import { City, SimulationResult, formatRupiah } from '@worthit/shared';

interface LandingHeroProps {
  sliderIncome: number;
  setSliderIncome: (val: number) => void;
  quickCityId: string;
  setQuickCityId: (val: string) => void;
  cities: City[];
  selectedCity?: City;
  quickSimulation: SimulationResult;
  getStatusColor: (status: string) => string;
}

export function LandingHero({
  sliderIncome,
  setSliderIncome,
  quickCityId,
  setQuickCityId,
  cities,
  selectedCity,
  quickSimulation,
  getStatusColor
}: LandingHeroProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-9 items-center pt-6">
      <div>
        <h1 className="apple-h1">
          Gaji kamu cukup untuk hidup di <span className="text-[var(--ac)]">kota mana?</span>
        </h1>
        <p className="apple-sub">
          Hitung biaya hidup, bandingkan kota, lihat sisa tabungan tiap bulan secara transparan.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/calculator" className="apple-btn">
            Mulai Simulasi
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link to="/reverse-calculator" className="apple-btn apple-btn-secondary">
            Target Gaji
          </Link>
          <Link to="/job-offer" className="apple-btn apple-btn-secondary">
            Tawaran Kerja
          </Link>
          <Link to="/compare" className="apple-btn apple-btn-secondary">
            Bandingkan Kota
          </Link>
        </div>
      </div>

      {/* Quick interactive card */}
      <div className="apple-card relative">
        <span className="apple-fl" style={{ top: '-16px', right: '-12px' }}>
          {selectedCity?.name || 'Jakarta'}
        </span>
        <span
          className="apple-fl hidden sm:block"
          style={{ bottom: '46px', left: '-26px', animationDelay: '-2s' }}
        >
          {quickSimulation.statusInfo.label}
        </span>

        <h3 className="apple-h3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--ac)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
          </svg>
          Coba cepat
        </h3>

        <label className="apple-label">Gaji bersih per bulan</label>
        <div className="text-[32px] font-bold tracking-[-1px] mb-1 text-[var(--tx)]">
          {formatRupiah(sliderIncome)}
        </div>
        <input
          type="range"
          min="2000000"
          max="40000000"
          step="500000"
          value={sliderIncome}
          onChange={(e) => setSliderIncome(Number(e.target.value))}
          className="apple-range"
        />

        <label className="apple-label">Kota</label>
        <select
          value={quickCityId}
          onChange={(e) => setQuickCityId(e.target.value)}
          className="apple-select"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id} className="bg-[var(--c)] text-[var(--tx)]">
              {c.name} ({c.province})
            </option>
          ))}
        </select>

        {/* Circular Ring Gauge */}
        <div
          className="apple-ring"
          style={{
            ['--p' as any]: Math.max(0, Math.min(100, quickSimulation.savingsRate))
          }}
        >
          <i>{Math.round(quickSimulation.savingsRate)}%</i>
        </div>

        <div className="text-center">
          <span
            className="apple-badge"
            style={{ color: getStatusColor(quickSimulation.status) }}
          >
            ● {quickSimulation.statusInfo.label}
          </span>
          <p className="text-[var(--mu)] text-[15px] mt-2">
            Sisa {formatRupiah(quickSimulation.remainingIncome)} per bulan
          </p>
        </div>
      </div>
    </section>
  );
}
