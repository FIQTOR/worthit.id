import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  formatRupiah,
  calculateEmergencyRunway,
  EmergencyRunwayResult
} from '@worthit/shared';
import { formatRupiahInput, parseRupiahInput } from '@/utils/helpers';
import citiesData from '../../../../datasets/cities.json';
import expenseData from '../../../../datasets/expenditure-benchmarks.json';

export function EmergencyRunwayPage() {
  const [savingsInput, setSavingsInput] = useState('25.000.000');
  const [selectedCityId, setSelectedCityId] = useState('jakarta');
  const [incomeInput, setIncomeInput] = useState('0');

  const selectedCity = useMemo(
    () => citiesData.find((c) => c.id === selectedCityId) || citiesData[0],
    [selectedCityId]
  );

  // Default monthly expense for this city
  const defaultExpense = useMemo(() => {
    const ref = expenseData.find((e) => e.cityId === selectedCityId && e.profile === 'single');
    if (ref) {
      return (
        ref.estimates.housing +
        ref.estimates.food +
        ref.estimates.transportation +
        ref.estimates.utilities +
        ref.estimates.lifestyle +
        ref.estimates.other
      );
    }
    return 4500000;
  }, [selectedCityId]);

  const [monthlyExpenseInput, setMonthlyExpenseInput] = useState(
    formatRupiahInput(defaultExpense.toString())
  );

  // Update default monthly expense when city changes
  const handleCityChange = (newCityId: string) => {
    setSelectedCityId(newCityId);
    const ref = expenseData.find((e) => e.cityId === newCityId && e.profile === 'single');
    if (ref) {
      const total =
        ref.estimates.housing +
        ref.estimates.food +
        ref.estimates.transportation +
        ref.estimates.utilities +
        ref.estimates.lifestyle +
        ref.estimates.other;
      setMonthlyExpenseInput(formatRupiahInput(total.toString()));
    }
  };

  const savingsBalance = parseRupiahInput(savingsInput);
  const monthlyExpenses = parseRupiahInput(monthlyExpenseInput);
  const expectedMonthlyIncome = parseRupiahInput(incomeInput);

  const runway: EmergencyRunwayResult = useMemo(() => {
    return calculateEmergencyRunway({
      savingsBalance,
      cityId: selectedCityId,
      monthlyExpenses,
      expectedMonthlyIncome
    });
  }, [savingsBalance, selectedCityId, monthlyExpenses, expectedMonthlyIncome]);

  const getTierColor = (tier: EmergencyRunwayResult['safetyTier']) => {
    switch (tier) {
      case 'bulletproof':
      case 'safe':
        return 'var(--ok)';
      case 'moderate':
        return 'var(--ac)';
      case 'warning':
        return 'var(--w)';
      default:
        return 'var(--r)';
    }
  };

  return (
    <>
      <Helmet>
        <title>Kalkulator Runway Dana Darurat | WorthIt Indonesia</title>
        <meta
          name="description"
          content="Hitung berapa lama tabunganmu mampu bertahan hidup di kota tujuan jika tanpa pemasukan tetap."
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--ac)] bg-[var(--f)] px-3 py-1 rounded-full mb-3">
            Simulasi Daya Tahan Tabungan
          </span>
          <h1 className="apple-h1 mb-2">Runway Dana Darurat</h1>
          <p className="apple-sub !mt-0 !mb-8">
            Berapa lama tabungan Anda dapat bertahan jika hari ini kehilangan pekerjaan atau ingin jeda karir di {selectedCity.name}?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          {/* LEFT: FORM INPUT */}
          <div className="apple-card space-y-5">
            <h2 className="text-base font-bold text-[var(--tx)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ac)]"></span>
              Informasi Tabungan dan Kota Domisili
            </h2>

            <div>
              <label className="apple-label">Saldo Tabungan Saat Ini</label>
              <div className="apple-inp">
                <span>Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={savingsInput}
                  onChange={(e) => setSavingsInput(formatRupiahInput(e.target.value))}
                  className="apple-input-raw"
                  placeholder="25.000.000"
                />
              </div>

              {/* Quick balance preset chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[10000000, 25000000, 50000000, 100000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSavingsInput(formatRupiahInput(amt.toString()))}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--bd)] bg-[var(--f)] text-[var(--tx)] hover:opacity-80 transition"
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="apple-label">Kota Tempat Bertahan Hidup</label>
              <select
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="apple-select"
              >
                {citiesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="apple-label">Estimasi Pengeluaran Bulanan</label>
                <span className="text-xs text-[var(--ac)]">
                  Patokan BPS {selectedCity.name}
                </span>
              </div>
              <div className="apple-inp">
                <span>Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlyExpenseInput}
                  onChange={(e) => setMonthlyExpenseInput(formatRupiahInput(e.target.value))}
                  className="apple-input-raw"
                />
              </div>
            </div>

            <div>
              <label className="apple-label">
                Pemasukan Tambahan Pasif / Lepas / Freelance (Opsional)
              </label>
              <div className="apple-inp">
                <span>Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(formatRupiahInput(e.target.value))}
                  className="apple-input-raw"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: RUNWAY GAUGE & ASSESSMENT */}
          <div className="apple-card lg:sticky lg:top-20 space-y-5">
            <div className="text-center">
              <span className="text-xs font-semibold text-[var(--mu)] uppercase tracking-wider">
                Daya Tahan Hidup Anda
              </span>
              <div
                className="text-5xl sm:text-6xl font-black mt-2 tracking-tight"
                style={{ color: getTierColor(runway.safetyTier) }}
              >
                {runway.runwayMonths >= 999 ? '∞' : runway.runwayMonths}
                <span className="text-xl sm:text-2xl font-bold text-[var(--tx)] ml-1">
                  Bulan
                </span>
              </div>
              <p className="text-xs text-[var(--mu)] mt-1">
                Setara dengan sekitar {runway.runwayDays >= 29000 ? 'tanpa batas' : `${runway.runwayDays} hari`} masa aman
              </p>
            </div>

            {/* Status Badge */}
            <div className="text-center">
              <span
                className="apple-badge"
                style={{ color: getTierColor(runway.safetyTier) }}
              >
                ● {runway.safetyLabel}
              </span>
            </div>

            {/* Advice Box */}
            <div className="p-4 bg-[var(--f)] rounded-2xl border border-[var(--bd)] text-xs text-[var(--tx)] leading-relaxed">
              <strong className="block mb-1 text-[var(--tx)]">Rekomendasi Tindakan:</strong>
              {runway.advice}
            </div>

            {/* Financial Rows */}
            <div className="space-y-2 pt-2 border-t border-[var(--bd)] text-xs">
              <div className="apple-kv">
                <span className="text-[var(--mu)]">Saldo Tabungan</span>
                <b className="text-[var(--tx)]">{formatRupiah(runway.savingsBalance)}</b>
              </div>
              <div className="apple-kv">
                <span className="text-[var(--mu)]">Pengeluaran Bulanan</span>
                <b className="text-[var(--tx)]">{formatRupiah(runway.monthlyExpenses)}</b>
              </div>
              <div className="apple-kv">
                <span className="text-[var(--mu)]">Burn Rate Bersih / Bulan</span>
                <b style={{ color: runway.netBurnRate > 0 ? 'var(--r)' : 'var(--ok)' }}>
                  -{formatRupiah(runway.netBurnRate)}
                </b>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to={`/calculator?city=${selectedCityId}`}
                className="apple-btn w-full justify-center text-xs"
              >
                Atur Pengeluaran di Kalkulator →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
