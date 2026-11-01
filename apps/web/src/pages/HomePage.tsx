import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { useCalculatorStore } from '@/stores/calculator.store';
import { formatRupiah, calculateSimulation } from '@worthit/shared';

export function HomePage() {
  const navigate = useNavigate();
  const { setIncome, setCityId, setProfile, setHouseholdSize } = useCalculatorStore();

  const [cities, setCities] = useState<any[]>([]);
  const [sliderIncome, setSliderIncome] = useState<number>(8000000);
  const [quickCityId, setQuickCityId] = useState<string>('jakarta');
  const [cityFrom, setCityFrom] = useState<string>('jakarta');
  const [cityTo, setCityTo] = useState<string>('yogyakarta');

  // Load cities from API
  useEffect(() => {
    apiService.getCities().then((res) => {
      setCities(res.data || []);
    }).catch(() => {});
  }, []);

  // Calculate live quick simulation
  const selectedCity = cities.find((c) => c.id === quickCityId) || cities[0];

  // Quick default simulation based on city UMK/benchmarks
  const getCityBaseExpenses = (cityObj: any) => {
    if (!cityObj) return 3800000;
    const food = cityObj.benchmarks?.foodExpenditure ? cityObj.benchmarks.foodExpenditure * 1.5 : 1200000;
    const rent = cityObj.id === 'jakarta' ? 2200000 : cityObj.id === 'surabaya' ? 1300000 : 1000000;
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

  // Calculate comparison difference between cityFrom & cityTo
  const cityFromObj = cities.find((c) => c.id === cityFrom);
  const cityToObj = cities.find((c) => c.id === cityTo);
  const expFrom = getCityBaseExpenses(cityFromObj);
  const expTo = getCityBaseExpenses(cityToObj);
  const diffYearly = (expFrom - expTo) * 12;

  // Preset situations
  const presets = [
    {
      icon: 'user',
      title: 'Fresh graduate',
      desc: 'Gaji pertama, kos berbagi',
      income: 5000000,
      prof: 'single_shared' as const,
      city: 'bandung',
      color: '#007aff',
      hh: 1
    },
    {
      icon: 'job',
      title: 'Tawaran kerja',
      desc: 'Cek sebelum teken',
      income: 10000000,
      prof: 'single' as const,
      city: 'jakarta',
      color: '#ff9500',
      hh: 1
    },
    {
      icon: 'heart',
      title: 'Pasangan baru',
      desc: 'Berdua, satu atap',
      income: 15000000,
      prof: 'couple_no_kids' as const,
      city: 'surabaya',
      color: '#ff3b30',
      hh: 2
    },
    {
      icon: 'house',
      title: 'Keluarga',
      desc: 'Dengan anak',
      income: 20000000,
      prof: 'family_with_kids' as const,
      city: 'makassar',
      color: '#34c759',
      hh: 4
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
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
        <title>WorthIt Indonesia – Gaji Kamu Cukup untuk Hidup di Kota Mana?</title>
        <meta
          name="description"
          content="Simulasikan biaya hidup, bandingkan kota, dan cari tahu berapa yang bisa kamu tabung setiap bulan."
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-16">
        {/* HERO SECTION */}
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
                Target Gaji (Reverse)
              </Link>
              <Link to="/job-offer" className="apple-btn apple-btn-secondary">
                Tawaran Kerja Luar Kota
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

            <label className="apple-label">Gaji bersih / bulan</label>
            <div className="text-[32px] font-bold tracking-[-1px] mb-1">
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
                <option key={c.id} value={c.id}>
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

        {/* METRICS ROW */}
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
            <span className="text-[var(--mu)] text-sm">rupiah, gratis</span>
          </div>
        </section>

        {/* MARQUEE OF CITIES */}
        <div className="apple-mq">
          <div className="apple-mq-inner">
            {cities.concat(cities).map((c, i) => (
              <span key={`${c.id}-${i}`}>{c.name}</span>
            ))}
          </div>
        </div>

        {/* SIMULASI SALDO SATU BULAN (SimFlow) */}
        <section className="mt-14">
          <h2 className="apple-h2">Simulasi saldo satu bulan</h2>
          <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
            Pola pengeluaran harian dari awal gajian sampai akhir bulan.
          </p>
          <div className="apple-card">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[var(--mu)] text-sm">
                  Pengeluaran sebulan di {selectedCity?.name || 'Jakarta'}
                </p>
                <div className="text-[28px] font-bold text-[var(--tx)]">
                  {formatRupiah(quickSimulation.totalExpenses)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[var(--mu)] text-sm">Potensi tabungan</p>
                <div className={`text-[28px] font-bold ${quickSimulation.remainingIncome >= 0 ? 'text-[var(--ok)]' : 'text-[var(--r)]'}`}>
                  {formatRupiah(quickSimulation.remainingIncome)}
                </div>
              </div>
            </div>

            {/* Segmented Expense Breakdown Bar */}
            <div className="apple-bar h-3">
              <i style={{ width: `${Math.min(100, Math.max(5, quickSimulation.savingsRate))}%`, background: 'var(--ok)' }} />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[13px] text-[var(--mu)]">
              <span><span className="text-[var(--ok)] font-bold">●</span> Tabungan {quickSimulation.savingsRate.toFixed(0)}%</span>
              <span><span className="text-[var(--ac)] font-bold">●</span> Tempat Tinggal {formatRupiah(quickSimulation.totalExpenses * 0.4)}</span>
              <span><span className="text-[var(--w)] font-bold">●</span> Makanan & Transport {formatRupiah(quickSimulation.totalExpenses * 0.4)}</span>
              <span><span className="text-[var(--b)] font-bold">●</span> Utilitas & Lainnya {formatRupiah(quickSimulation.totalExpenses * 0.2)}</span>
            </div>
          </div>
        </section>

        {/* PROYEKSI TABUNGAN */}
        <section className="mt-14">
          <h2 className="apple-h2">Tabunganmu nanti</h2>
          <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
            Jika sisa uang {formatRupiah(quickSimulation.remainingIncome)} di {selectedCity?.name} rutin ditabung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 3, 5].map((year) => {
              const projected = quickSimulation.remainingIncome * 12 * year;
              return (
                <div key={year} className="apple-card">
                  <p className="text-[var(--mu)] text-sm">{year} tahun</p>
                  <div className={`text-[26px] font-bold mt-1 ${projected < 0 ? 'text-[var(--r)]' : 'text-[var(--ac)]'}`}>
                    {formatRupiah(projected)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* KALAU PINDAH KOTA */}
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
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-[var(--bd)]">
              <p className="text-[var(--mu)] text-sm">
                {diffYearly >= 0 ? 'Lebih hemat per tahun di kota tujuan' : 'Lebih boros per tahun di kota tujuan'}
              </p>
              <div
                className="text-[40px] font-bold tracking-[-1px] mt-1"
                style={{ color: diffYearly >= 0 ? 'var(--ok)' : 'var(--r)' }}
              >
                {diffYearly >= 0 ? '+' : ''}{formatRupiah(diffYearly)}
              </div>
            </div>
          </div>
        </section>

        {/* MULAI DARI SITUASIMU */}
        <section className="mt-14">
          <h2 className="apple-h2">Mulai dari situasimu</h2>
          <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
            Satu klik, profil dan angka awal langsung terisi.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="apple-card text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-11 h-11 rounded-[11px] grid place-items-center text-white mb-3"
                  style={{ background: p.color }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {p.icon === 'user' && <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                    {p.icon === 'job' && <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    {p.icon === 'heart' && <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                    {p.icon === 'house' && <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                  </svg>
                </div>
                <h3 className="apple-h3 !mb-1">{p.title}</h3>
                <p className="text-[var(--mu)] text-sm">{p.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* TIGA LANGKAH */}
        <section className="mt-14">
          <h2 className="apple-h2">Tiga langkah mudah</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { num: '1', title: 'Isi gaji & kota', desc: 'Tentukan gaji bersih dan kota tujuanmu.', color: 'var(--ac)' },
              { num: '2', title: 'Atur pengeluaran', desc: 'Pakai estimasi dataset atau edit bebas.', color: 'var(--w)' },
              { num: '3', title: 'Lihat sisa & tabungan', desc: 'Cek proyeksi tahunan dan komparasi.', color: 'var(--ok)' }
            ].map((step) => (
              <div key={step.num} className="apple-card">
                <div
                  className="w-11 h-11 rounded-[11px] grid place-items-center text-white mb-3 text-lg font-bold"
                  style={{ background: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="apple-h3 !mb-1">{step.title}</h3>
                <p className="text-[var(--mu)] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mt-14">
          <h2 className="apple-h2">Pertanyaan umum</h2>
          <div className="apple-card divide-y divide-[var(--bd)]">
            {[
              { q: 'Datanya bersumber dari mana?', a: 'Dari publikasi resmi BPS (Survei Biaya Hidup & IHK), JDIH Kemnaker (UMK 2025), PLN, dan kurasi riset pasar terbuka.' },
              { q: 'Apakah angkanya bersifat mutlak?', a: 'Angka merupakan estimasi baseline acuan. Seluruh nominal pengeluaran dapat kamu sesuaikan sesuai pengeluaran aktual.' },
              { q: 'Perlu mendaftar atau login akun?', a: 'Tidak sama sekali. Semua fitur 100% gratis dan data disimpan di perangkat pengguna secara lokal.' },
              { q: 'Apakah perhitungan menggunakan AI spekulatif?', a: 'Tidak. Semua kalkulasi bersifat deterministik dan matematis transparan.' }
            ].map((faq, idx) => (
              <details key={idx} className="py-3.5 group cursor-pointer">
                <summary className="font-semibold flex justify-between items-center list-none select-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-[var(--mu)] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-[var(--mu)] text-sm mt-2 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="mt-14">
          <div className="rounded-3xl bg-[var(--ac)] text-white text-center py-12 px-6 shadow-xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
              Cek gajimu sekarang
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-md mx-auto mb-7 leading-relaxed">
              Hanya butuh 1 menit untuk mengetahui kesehatan finansialmu di kota tujuan.
            </p>
            <div className="flex justify-center">
              <Link
                to="/calculator"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[var(--ac)] hover:bg-neutral-100 font-bold text-base shadow-lg transition-transform hover:scale-105 active:scale-95 no-underline"
              >
                Mulai Simulasi
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
