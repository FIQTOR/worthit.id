import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { City, SimulationResult, formatRupiah } from '@worthit/shared';
import { LandingDotMap } from './LandingDotMap';
import { gsap, splitTextIntoSpans } from '@/utils/gsapAnimations';

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
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const btnsRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // GSAP 3D character flip on Hero title & entrance sequence
  useEffect(() => {
    if (!h1Ref.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const chars = splitTextIntoSpans(h1Ref.current);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from(pillRef.current, { y: 20, opacity: 0, duration: 0.7 })
        .from(
          chars,
          {
            yPercent: 120,
            rotateX: -80,
            opacity: 0,
            transformOrigin: '0 100% -20px',
            duration: 1,
            stagger: 0.018
          },
          '-=0.4'
        )
        .from(subRef.current, { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
        .from(
          btnsRef.current ? btnsRef.current.querySelectorAll('.btn') : [],
          { y: 20, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.1 },
          '-=0.5'
        )
        .from(cardRef.current, { y: 60, opacity: 0, duration: 1 }, '-=1.1')
        .from(
          cardRef.current ? cardRef.current.querySelectorAll('.fl') : [],
          { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.15 },
          '-=0.3'
        );
    });

    return () => ctx.revert();
  }, []);

  // Magnetic button cursor feel
  useEffect(() => {
    if (!btnsRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const buttons = btnsRef.current.querySelectorAll<HTMLElement>('.btn');
    const cleanups: (() => void)[] = [];

    buttons.forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });

      const onMouseMove = (e: MouseEvent) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      b.addEventListener('mousemove', onMouseMove);
      b.addEventListener('mouseleave', onMouseLeave);

      cleanups.push(() => {
        b.removeEventListener('mousemove', onMouseMove);
        b.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center pt-4 relative">
      {/* Background Dot Map Animation */}
      <LandingDotMap selectedCityId={quickCityId} />

      {/* Left Column: Headline & Action Buttons */}
      <div className="relative z-10">
        <span ref={pillRef} className="pill">
          Gratis · Tanpa akun · Tanpa AI spekulatif
        </span>

        <h1 ref={h1Ref} className="h1">
          Gaji kamu cukup untuk hidup di{' '}
          <span className="text-[var(--ac)]">kota mana?</span>
        </h1>

        <p ref={subRef} className="sub">
          Hitung biaya hidup, bandingkan kota, lihat sisa tabungan tiap bulan secara transparan.
        </p>

        <div ref={btnsRef} className="flex gap-3 flex-wrap">
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
      <div ref={cardRef} className="card relative z-10 shadow-lg" id="kalkulator">
        <span className="fl" style={{ top: '-16px', right: '-8px' }}>
          {selectedCity?.name || 'Jakarta'}
        </span>
        <span
          className="fl hidden sm:block"
          style={{
            bottom: '56px',
            left: '-22px',
            animationDelay: '-2s',
            color: getStatusColor(quickSimulation.status)
          }}
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
            Sisa{' '}
            <b style={{ color: quickSimulation.remainingIncome < 0 ? 'var(--r)' : 'var(--tx)' }}>
              {formatRupiah(quickSimulation.remainingIncome)}
            </b>{' '}
            per bulan
          </p>
        </div>
      </div>
    </section>
  );
}
