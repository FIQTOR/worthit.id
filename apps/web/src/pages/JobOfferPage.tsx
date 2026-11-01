import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  formatRupiah,
  calculateJobOfferComparison,
  calculateTotalExpenses,
  LivingProfileType
} from '@worthit/shared';
import citiesData from '../../../../datasets/cities.json';
import expenseData from '../../../../datasets/expenditure-benchmarks.json';

export function JobOfferPage() {
  const [currentCityId, setCurrentCityId] = useState<string>('yogyakarta');
  const [currentNetSalary, setCurrentNetSalary] = useState<number>(5500000);

  const [offerCityId, setOfferCityId] = useState<string>('jakarta');
  const [offerNetSalary, setOfferNetSalary] = useState<number>(9000000);

  const [profile] = useState<LivingProfileType>('single');

  // Baseline expenses for current city
  const defaultCurrentExpenses = useMemo(() => {
    const ref = expenseData.find(
      (e) => e.cityId === currentCityId && e.profile === profile
    );
    return ref
      ? ref.estimates
      : {
          housing: 900000,
          food: 950000,
          transportation: 250000,
          utilities: 200000,
          lifestyle: 300000,
          financialObligations: 0,
          other: 100000
        };
  }, [currentCityId, profile]);

  // Baseline expenses for offer city
  const defaultOfferExpenses = useMemo(() => {
    const ref = expenseData.find(
      (e) => e.cityId === offerCityId && e.profile === profile
    );
    return ref
      ? ref.estimates
      : {
          housing: 2200000,
          food: 1800000,
          transportation: 500000,
          utilities: 350000,
          lifestyle: 450000,
          financialObligations: 0,
          other: 150000
        };
  }, [offerCityId, profile]);

  const [currentExpenses, setCurrentExpenses] = useState(defaultCurrentExpenses);
  const [offerExpenses, setOfferExpenses] = useState(defaultOfferExpenses);

  const handleCurrentCityChange = (id: string) => {
    setCurrentCityId(id);
    const ref = expenseData.find((e) => e.cityId === id && e.profile === profile);
    if (ref) setCurrentExpenses(ref.estimates);
  };

  const handleOfferCityChange = (id: string) => {
    setOfferCityId(id);
    const ref = expenseData.find((e) => e.cityId === id && e.profile === profile);
    if (ref) setOfferExpenses(ref.estimates);
  };

  const currentCityObj = useMemo(
    () => citiesData.find((c) => c.id === currentCityId) || citiesData[0],
    [currentCityId]
  );
  const offerCityObj = useMemo(
    () => citiesData.find((c) => c.id === offerCityId) || citiesData[0],
    [offerCityId]
  );

  const result = useMemo(() => {
    return calculateJobOfferComparison({
      currentCityId,
      currentNetSalary,
      currentExpenses,
      offerCityId,
      offerNetSalary,
      offerExpenses
    });
  }, [currentCityId, currentNetSalary, currentExpenses, offerCityId, offerNetSalary, offerExpenses]);

  return (
    <>
      <Helmet>
        <title>Simulator Tawaran Kerja (Job Offer) – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Bandingkan penawaran gaji baru dan lonjakan biaya hidup di kota tujuan untuk mendeteksi phantom raise sebelum menerima offer kerja."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--ok)] bg-[var(--f)] px-3 py-1 rounded-full mb-3">
          Simulator Tawaran Kerja (Job Offer)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--tx)] tracking-tight mb-3">
          Apakah Tawaran Pindah Kota Layak Diambil?
        </h1>
        <p className="text-sm sm:text-base text-[var(--mu)]">
          Hindari <em>Phantom Raise</em> — kenaikan nominal gaji yang ternyata habis termakan biaya hidup dan sewa tempat tinggal di kota tujuan.
        </p>
      </div>

      {/* Main Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Box 1: Kondisi Saat Ini */}
        <div className="apple-card">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)] mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--mu)]">
              Kondisi Saat Ini
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--f)] text-[var(--tx)]">
              Kota Asal
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--mu)] mb-1">
                Kota Domisili Saat Ini
              </label>
              <select
                value={currentCityId}
                onChange={(e) => handleCurrentCityChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--f)] text-sm font-semibold text-[var(--tx)] focus:outline-none focus:ring-2 focus:ring-[var(--ac)]"
              >
                {citiesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--mu)] mb-1">
                Gaji Bersih Diterima (THP) / Bulan
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--mu)]">
                  Rp
                </span>
                <input
                  type="number"
                  step="500000"
                  value={currentNetSalary}
                  onChange={(e) => setCurrentNetSalary(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--f)] font-bold text-[var(--tx)] focus:outline-none focus:ring-2 focus:ring-[var(--ac)]"
                />
              </div>
            </div>

            {/* Expense breakdown toggle/summary */}
            <div className="pt-3 border-t border-[var(--bd)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--mu)]">
                <span>Pengeluaran Total:</span>
                <span className="font-semibold text-[var(--tx)]">
                  {formatRupiah(calculateTotalExpenses(currentExpenses))}
                </span>
              </div>
              <div className="flex justify-between text-[var(--mu)]">
                <span>Sisa Tabungan Bersih:</span>
                <span className="font-bold text-[var(--ok)]">
                  {formatRupiah(result.currentDisposableIncome)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--mu)]">
                <span>Tingkat Tabungan:</span>
                <span className="font-semibold text-[var(--tx)]">{result.currentSavingsRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Tawaran Baru */}
        <div className="apple-card border border-[var(--ac)]/40">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)] mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ac)]">
              Tawaran Baru
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--ac)]/15 text-[var(--ac)]">
              Kota Tujuan
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--mu)] mb-1">
                Kota Penempatan Baru
              </label>
              <select
                value={offerCityId}
                onChange={(e) => handleOfferCityChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--f)] text-sm font-semibold text-[var(--tx)] focus:outline-none focus:ring-2 focus:ring-[var(--ac)]"
              >
                {citiesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--mu)] mb-1">
                Gaji Bersih Ditawarkan (THP) / Bulan
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--mu)]">
                  Rp
                </span>
                <input
                  type="number"
                  step="500000"
                  value={offerNetSalary}
                  onChange={(e) => setOfferNetSalary(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--ac)] bg-[var(--f)] focus:ring-2 focus:ring-[var(--ac)] font-bold text-[var(--tx)] focus:outline-none"
                />
              </div>
            </div>

            {/* Expense breakdown summary */}
            <div className="pt-3 border-t border-[var(--bd)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--mu)]">
                <span>Pengeluaran Total:</span>
                <span className="font-semibold text-[var(--tx)]">
                  {formatRupiah(calculateTotalExpenses(offerExpenses))}
                </span>
              </div>
              <div className="flex justify-between text-[var(--mu)]">
                <span>Sisa Tabungan Bersih:</span>
                <span className="font-bold text-[var(--ac)]">
                  {formatRupiah(result.offerDisposableIncome)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--mu)]">
                <span>Tingkat Tabungan:</span>
                <span className="font-semibold text-[var(--tx)]">{result.offerSavingsRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Verdict Banner */}
      <div
        className={`apple-card mb-8 border ${
          result.isWorthIt
            ? 'border-[var(--ok)]/50 bg-[var(--ok)]/10'
            : 'border-[var(--w)]/50 bg-[var(--w)]/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3 h-3 rounded-full ${
                  result.isWorthIt ? 'bg-[var(--ok)]' : 'bg-[var(--w)]'
                }`}
              ></span>
              <h2 className="text-xl font-extrabold text-[var(--tx)]">
                {result.recommendationHeadline}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--tx)] opacity-90 leading-relaxed max-w-2xl">
              {result.recommendationDetail}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-xs text-[var(--mu)]">Selisih Tabungan Bulanan:</div>
            <div
              className={`text-2xl font-black ${
                result.disposableIncomeDifference >= 0 ? 'text-[var(--ok)]' : 'text-[var(--r)]'
              }`}
            >
              {result.disposableIncomeDifference >= 0 ? '+' : ''}
              {formatRupiah(result.disposableIncomeDifference)}/bln
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Metrics */}
      <div className="apple-card mb-8">
        <h3 className="text-sm font-bold text-[var(--tx)] uppercase tracking-wider mb-4">
          Ringkasan Angka Kunci
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[var(--f)] rounded-2xl">
            <div className="text-xs text-[var(--mu)] mb-1">Kenaikan Gaji Nominal</div>
            <div className="text-xl font-bold text-[var(--tx)]">
              +{formatRupiah(result.salaryIncreaseAmount)}
            </div>
            <div className="text-[11px] text-[var(--ac)] font-semibold mt-1">
              +{result.salaryIncreasePercentage}% dari gaji lama
            </div>
          </div>

          <div className="p-4 bg-[var(--f)] rounded-2xl">
            <div className="text-xs text-[var(--mu)] mb-1">Kenaikan Biaya Hidup</div>
            <div className="text-xl font-bold text-[var(--tx)]">
              +{formatRupiah(result.expenseDifferenceAmount)}
            </div>
            <div className="text-[11px] text-[var(--w)] font-semibold mt-1">
              +{result.expenseDifferencePercentage}% pengeluaran tambahan
            </div>
          </div>

          <div className="p-4 bg-[var(--f)] rounded-2xl">
            <div className="text-xs text-[var(--mu)] mb-1">Dampak ke Tabungan Tahunan</div>
            <div
              className={`text-xl font-bold ${
                result.disposableIncomeDifference >= 0 ? 'text-[var(--ok)]' : 'text-[var(--r)]'
              }`}
            >
              {result.disposableIncomeDifference >= 0 ? '+' : ''}
              {formatRupiah(result.disposableIncomeDifference * 12)}
            </div>
            <div className="text-[11px] text-[var(--mu)] mt-1">Akumulasi 12 bulan</div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[var(--f)] rounded-2xl border border-[var(--bd)]">
        <div className="text-xs text-[var(--mu)] text-center sm:text-left">
          Ingin menghitung ongkos pindahan fisik dari {currentCityObj.name} ke {offerCityObj.name}?
        </div>
        <div className="flex gap-2">
          <Link
            to={`/relocation?city=${offerCityId}`}
            className="text-xs font-semibold px-4 py-2.5 bg-[var(--tx)] hover:opacity-90 text-[var(--c)] rounded-xl transition"
          >
            Hitung Modal Relokasi →
          </Link>
          <Link
            to={`/reverse-calculator?city=${offerCityId}`}
            className="text-xs font-semibold px-4 py-2.5 bg-[var(--c)] border border-[var(--bd)] text-[var(--tx)] hover:bg-[var(--f)] rounded-xl transition"
          >
            Berapa Gaji Idealnya?
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
