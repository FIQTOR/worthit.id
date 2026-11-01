import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { useCalculatorStore } from '@/stores/calculator.store';
import { calculateSimulation, formatRupiah, City } from '@worthit/shared';
import { gsap } from '@/utils/gsapAnimations';
import {
  LandingHero,
  LandingMarquee,
  LandingSimFlow,
  LandingCompareQuick,
  LandingPresets,
  LandingFAQ,
  LandingDeco,
  LandingStatement,
  LandingCityRanking,
  PresetItem
} from '@/components/landing';

export function HomePage() {
  const navigate = useNavigate();
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const { setIncome, setCityId, setProfile, setHouseholdSize } = useCalculatorStore();

  const [cities, setCities] = useState<City[]>([]);
  const [sliderIncome, setSliderIncome] = useState<number>(8000000);
  const [quickCityId, setQuickCityId] = useState<string>('jakarta');
  const [cityFrom, setCityFrom] = useState<string>('jakarta');
  const [cityTo, setCityTo] = useState<string>('yogyakarta');

  // Load cities from API
  useEffect(() => {
    apiService
      .getCities()
      .then((res) => {
        setCities(res.data || []);
      })
      .catch(() => {});
  }, []);

  // Global GSAP section entrance animations on scroll
  useEffect(() => {
    if (!pageContainerRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Stagger card appearances on scroll
      const cardSelectors = ['.card', '.rk', '.apple-card'];
      cardSelectors.forEach((selector) => {
        const elements = pageContainerRef.current?.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          gsap.from(elements, {
            y: 40,
            opacity: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elements[0],
              start: 'top 92%'
            },
            clearProps: 'transform,opacity'
          });
        }
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, [cities]);

  const selectedCity = cities.find((c) => c.id === quickCityId) || cities[0];

  const getCityBaseExpenses = (cityObj?: City) => {
    if (!cityObj) return 3800000;
    const food = cityObj.benchmarks?.foodExpenditure
      ? cityObj.benchmarks.foodExpenditure * 1.5
      : 1200000;
    const rent =
      cityObj.id === 'jakarta' ? 2200000 : cityObj.id === 'surabaya' ? 1300000 : 1000000;
    const util = 350000;
    const transport = 400000;
    const life = 450000;
    return Math.round(food + rent + util + transport + life);
  };

  const quickTotalExp = getCityBaseExpenses(selectedCity);
  const quickSimulation = calculateSimulation({
    income: { netMonthly: sliderIncome },
    cityId: quickCityId,
    profile: 'single',
    householdSize: 1,
    expenses: {
      housing: quickCityId === 'jakarta' ? 2200000 : 1100000,
      food: quickTotalExp * 0.35,
      transportation: 350000,
      utilities: 250000,
      lifestyle: 350000,
      financialObligations: 0,
      other: 100000
    }
  });

  const cityFromObj = cities.find((c) => c.id === cityFrom);
  const cityToObj = cities.find((c) => c.id === cityTo);
  const expFrom = getCityBaseExpenses(cityFromObj);
  const expTo = getCityBaseExpenses(cityToObj);
  const diffYearly = (expFrom - expTo) * 12;

  const presets: PresetItem[] = [
    {
      icon: 'user',
      title: 'Fresh graduate',
      desc: 'Gaji pertama, kos berbagi',
      income: 5000000,
      prof: 'single_shared',
      city: 'bandung',
      color: '#007aff',
      hh: 1
    },
    {
      icon: 'job',
      title: 'Tawaran kerja',
      desc: 'Cek sebelum teken',
      income: 10000000,
      prof: 'single',
      city: 'jakarta',
      color: '#ff9500',
      hh: 1
    },
    {
      icon: 'heart',
      title: 'Pasangan baru',
      desc: 'Berdua, satu atap',
      income: 15000000,
      prof: 'couple_no_kids',
      city: 'surabaya',
      color: '#ff3b30',
      hh: 2
    },
    {
      icon: 'house',
      title: 'Keluarga',
      desc: 'Dengan anak',
      income: 20000000,
      prof: 'family_with_kids',
      city: 'makassar',
      color: '#34c759',
      hh: 4
    }
  ];

  const handleApplyPreset = (p: PresetItem) => {
    setIncome({ netMonthly: p.income });
    setProfile(p.prof);
    setCityId(p.city);
    setHouseholdSize(p.hh);
    navigate(`/calculator?city=${p.city}`);
  };

  const getStatusColor = (status: string) => {
    if (status === 'deficit') return 'var(--r)';
    if (status === 'very_tight') return 'var(--w)';
    if (status === 'tight') return 'var(--ac)';
    return 'var(--ok)';
  };

  return (
    <>
      <Helmet>
        <title>WorthIt Indonesia: Gaji Kamu Cukup untuk Hidup di Kota Mana?</title>
        <meta
          name="description"
          content="Simulasikan biaya hidup, bandingkan kota, dan cari tahu berapa yang bisa kamu tabung setiap bulan."
        />
      </Helmet>

      <div ref={pageContainerRef} className="max-w-[1080px] mx-auto px-5 pt-8 pb-16 relative">
        {/* Floating 3D Geometric Decorators */}
        <LandingDeco />

        {/* 1. HERO SECTION WITH GSAP 3D FLIP & DOT MAP */}
        <LandingHero
          sliderIncome={sliderIncome}
          setSliderIncome={setSliderIncome}
          quickCityId={quickCityId}
          setQuickCityId={setQuickCityId}
          cities={cities}
          selectedCity={selectedCity}
          quickSimulation={quickSimulation}
          getStatusColor={getStatusColor}
        />

        {/* 2. STATS WITH GSAP COUNT-UP & MARQUEE TICKER */}
        <LandingMarquee cities={cities} />

        {/* 3. STATEMENT CALLOUT WITH GSAP SCROLL SCRUB */}
        <LandingStatement />

        {/* 4. CASHFLOW ALLOCATION BAR */}
        <LandingSimFlow selectedCity={selectedCity} quickSimulation={quickSimulation} />

        {/* 5. 10-CITY RANKING DUEL */}
        <LandingCityRanking cities={cities} income={sliderIncome} />

        {/* 6. PROYEKSI TABUNGAN MULTI-TAHUN */}
        <section className="mt-16">
          <h2 className="apple-h2">Tabunganmu nanti</h2>
          <p className="note">
            Jika sisa uang {formatRupiah(quickSimulation.remainingIncome)} di {selectedCity?.name} rutin ditabung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 3, 5].map((year) => {
              const projected = quickSimulation.remainingIncome * 12 * year;
              return (
                <div key={year} className="card">
                  <p className="text-[var(--mu)] text-sm">{year} tahun</p>
                  <div
                    className={`text-[28px] font-bold mt-1 tracking-tight ${
                      projected < 0 ? 'text-[var(--r)]' : 'text-[var(--ac)]'
                    }`}
                  >
                    {formatRupiah(projected)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. PERBANDINGAN PINDAH KOTA CEPAT */}
        <LandingCompareQuick
          cities={cities}
          cityFrom={cityFrom}
          setCityFrom={setCityFrom}
          cityTo={cityTo}
          setCityTo={setCityTo}
          diffYearly={diffYearly}
        />

        {/* 8. SITUASI / PRESETS AWAL */}
        <LandingPresets presets={presets} onApplyPreset={handleApplyPreset} />

        {/* 9. TIGA LANGKAH, FAQ, & CTA */}
        <LandingFAQ />
      </div>
    </>
  );
}
