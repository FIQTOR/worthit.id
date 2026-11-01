import { Link } from 'react-router-dom';
import { City, SimulationResult, formatRupiah } from '@worthit/shared';
import { LandingDotMap } from './LandingDotMap';

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
    <section className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center pt-4 relative">
      {/* Background Dot Map Animation */}
      <LandingDotMap selectedCityId={quickCityId} />

      {/* Left Column: Headline & Action Buttons */}
      <div className="relative z-10">
        <span className="pill">
          Gratis · Tanpa akun · Tanpa AI spekulatif
        </span>

        <h1 className="h1">
          Gaji kamu cukup untuk hidup di{' '}
          <span className="text-[var(--ac)]">kota mana?</span>
        </h1>

        <p className="sub">
          Hitung biaya hidup, bandingkan kota, lihat sisa tabungan tiap bulan secara transparan.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link to="/calculator" className="btn">
            Mulai Simulasi
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link to="/compare" className="btn s">
            Bandingkan Kota
          </Link>
          <Link to="/runway" className="btn s">
            Dana Darurat
          </Link>
          <Link to="/job-offer" className="btn s">
            Tawaran Kerja
          </Link>
        </div>
      </div>

      {/* Right Column: Quick Interactive Card */}
      <div className="card relative z-10 shadow-lg" id="kalkulator">
        <span className="fl" style={{ top: '-16px', right: '-8px' }}>
          {selectedCity?.name || 'Jakarta'}
        </span>
        <span
          className="fl hidden sm:block"
          style={{ bottom: '56px', left: '-22px', animationDelay: '-2s', color: getStatusColor(quickSimulation.status) }}
        >
          ● {quickSimulation.statusInfo.label}
        </span>

        <h3 className="apple-h3 flex items-center gap-2 text-[var(--tx)]">
          <svg
            className="w-5 h-5 text-[var(--ac)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
          </svg>
          Coba cepat
        </h3>

        <label className="lbl">Gaji bersih per bulan</label>
        <div className="big text-[var(--tx)] mb-1">
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

        <label className="lbl">Kota</label>
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
          className="ring"
          style={{
            ['--p' as any]: Math.max(0, Math.min(100, quickSimulation.savingsRate)),
            ['--sc' as any]: getStatusColor(quickSimulation.status)
          }}
        >
          <i className="text-[var(--tx)]">{Math.round(quickSimulation.savingsRate)}%</i>
        </div>

        <div className="text-center">
          <span
            className="badge"
            style={{ color: getStatusColor(quickSimulation.status) }}
          >
            ● {quickSimulation.statusInfo.label}
          </span>
          <p className="text-[var(--mu)] text-[15px] mt-2">
            Sisa <b style={{ color: quickSimulation.remainingIncome < 0 ? 'var(--r)' : 'var(--tx)' }}>
              {formatRupiah(quickSimulation.remainingIncome)}
            </b> per bulan
          </p>
        </div>
      </div>
    </section>
  );
}
