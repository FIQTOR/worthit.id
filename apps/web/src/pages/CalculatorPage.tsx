import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCalculatorStore } from '@/stores/calculator.store';
import { apiService } from '@/services/api.service';
import { formatRupiahInput, parseRupiahInput } from '@/utils/helpers';
import {
  formatRupiah,
  calculateSimulation,
  calculateTaxAndDeductions,
  EXPENSE_CATEGORY_LABELS,
  ExpenseEstimates,
  CommuteMode,
  PTKPStatus
} from '@worthit/shared';
import { IndonesiaMap } from '@/components/calculator/IndonesiaMap';
import rentalData from '../../../../datasets/rental-prices.json';

const COMMUTE_OPTIONS: { id: CommuteMode; label: string; desc: string; baseCost: number }[] = [
  { id: 'motorcycle', label: 'Motor Pribadi', desc: 'Bensin Pertalite/Max + servis bulanan', baseCost: 300000 },
  { id: 'public_transit', label: 'Transportasi Publik', desc: 'KRL / MRT / Busway / Angkot harian', baseCost: 400000 },
  { id: 'ride_hailing', label: 'Ojek Online', desc: 'GoJek / Grab motor harian PP', baseCost: 850000 },
  { id: 'car', label: 'Mobil Pribadi', desc: 'BBM + tol + parkir kantor', baseCost: 1800000 },
  { id: 'walk_bicycle', label: 'Jalan Kaki / Sepeda', desc: 'Kos nempel kantor/jalan santai', baseCost: 50000 }
];

export function CalculatorPage() {
  const location = useLocation();
  const {
    income,
    cityId,
    profile,
    householdSize,
    expenses,
    targetSavingsRate,
    setIncome,
    setCityId,
    setProfile,
    setHouseholdSize,
    setExpenses,
    setTargetSavingsRate
  } = useCalculatorStore();

  const [cities, setCities] = useState<any[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [incomeType, setIncomeType] = useState<'net' | 'gross'>('net');
  const [ptkpStatus, setPtkpStatus] = useState<PTKPStatus>('TK/0');
  const [rawSalaryInput, setRawSalaryInput] = useState(
    formatRupiahInput(income.netMonthly.toString())
  );

  // Commute mode quick-apply
  const [selectedCommute, setSelectedCommute] = useState<CommuteMode>('motorcycle');

  // Pre-select city and income from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get('city');
    if (c) setCityId(c);
    const inc = params.get('income');
    if (inc) {
      setRawSalaryInput(formatRupiahInput(inc));
      setIncome({ netMonthly: Number(inc) || 5000000 });
    }
  }, [location.search, setCityId, setIncome]);

  // Load cities list
  useEffect(() => {
    apiService.getCities().then((res) => {
      setCities(res.data || []);
    });
  }, []);

  // Update default expenses when city, profile, or household size changes
  useEffect(() => {
    if (!cityId) return;
    apiService.getCityExpenses(cityId, profile, householdSize).then((res) => {
      if (res.data?.reference?.estimates) {
        setExpenses(res.data.reference.estimates);
      }
    }).catch(() => {});
  }, [cityId, profile, householdSize, setExpenses]);

  // Tax calculation if gross mode is active
  const parsedSalary = parseRupiahInput(rawSalaryInput);
  const taxCalculation = useMemo(() => {
    if (incomeType === 'gross') {
      return calculateTaxAndDeductions(parsedSalary, ptkpStatus);
    }
    return null;
  }, [incomeType, parsedSalary, ptkpStatus]);

  // Effective net monthly salary
  const effectiveNetMonthly = useMemo(() => {
    if (incomeType === 'gross' && taxCalculation) {
      return taxCalculation.takeHomePay;
    }
    return parsedSalary;
  }, [incomeType, taxCalculation, parsedSalary]);

  // Keep store in sync
  useEffect(() => {
    setIncome({ netMonthly: effectiveNetMonthly });
  }, [effectiveNetMonthly, setIncome]);

  // City rental benchmarks
  const cityRentals = useMemo(() => {
    return rentalData.filter((r) => r.cityId === cityId);
  }, [cityId]);

  // Live simulation result for sidebar
  const currentSimulation = calculateSimulation({
    income: { netMonthly: effectiveNetMonthly },
    cityId,
    profile,
    householdSize,
    expenses,
    targetSavingsRate
  });

  const selectedCityObj = cities.find((c) => c.id === cityId) || cities[0];

  const handleSalaryChange = (valStr: string) => {
    setRawSalaryInput(valStr);
  };

  const handleExpenseChange = (key: keyof ExpenseEstimates, valStr: string) => {
    const parsed = parseRupiahInput(valStr);
    setExpenses({ [key]: parsed });
  };

  const applyRentalPreset = (medianPrice: number) => {
    setExpenses({ housing: medianPrice });
  };

  const applyCommutePreset = (mode: CommuteMode, cost: number) => {
    setSelectedCommute(mode);
    setExpenses({ transportation: cost });
  };

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.province.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'deficit') return 'var(--r)';
    if (status === 'very_tight') return 'var(--w)';
    if (status === 'tight') return 'var(--ac)';
    return 'var(--ok)';
  };

  const categories = Object.keys(EXPENSE_CATEGORY_LABELS) as (keyof ExpenseEstimates)[];

  return (
    <>
      <Helmet>
        <title>Kalkulator Biaya Hidup – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Simulasikan dan sesuaikan seluruh komponen pengeluaran bulananmu di kota tujuan."
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <h1 className="apple-h1 mb-2">Kalkulator Biaya Hidup</h1>
        <p className="apple-sub !mt-0 !mb-8">
          Hasil simulasi diperbarui langsung saat angka kamu ubah.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 items-start">
          {/* LEFT: FORM INPUTS */}
          <div className="space-y-6">
            {/* 1. INFORMASI DASAR */}
            <div className="apple-card">
              <h3 className="apple-h3">1. Informasi Pendapatan & Pajak</h3>

              {/* Mode Toggle: Gaji Bersih vs Kotor */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-neutral-600">Jenis Input:</span>
                <div className="apple-seg !mb-0 text-xs">
                  <button
                    type="button"
                    onClick={() => setIncomeType('net')}
                    className={incomeType === 'net' ? 'on' : ''}
                  >
                    Take Home Pay (Bersih)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncomeType('gross')}
                    className={incomeType === 'gross' ? 'on' : ''}
                  >
                    Gaji Kotor (Gross + PPh 21 TER)
                  </button>
                </div>
              </div>

              <label className="apple-label">
                {incomeType === 'gross' ? 'Gaji Kotor Bulanan (Gross)' : 'Gaji Bersih Bulanan (THP)'}
              </label>
              <div className="apple-inp">
                <span>Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rawSalaryInput}
                  onChange={(e) => handleSalaryChange(formatRupiahInput(e.target.value))}
                  className="apple-input-raw"
                  placeholder="5.000.000"
                />
              </div>

              <input
                type="range"
                min="1500000"
                max="50000000"
                step="250000"
                value={parsedSalary || 5000000}
                onChange={(e) => handleSalaryChange(formatRupiahInput(e.target.value))}
                className="apple-range"
              />

              {/* Gross mode breakdown */}
              {incomeType === 'gross' && taxCalculation && (
                <div className="p-3.5 bg-[var(--f)] rounded-2xl border border-[var(--bd)] mb-4 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--bd)] gap-1">
                    <span className="font-semibold text-[var(--tx)]">Status PTKP:</span>
                    <select
                      value={ptkpStatus}
                      onChange={(e) => setPtkpStatus(e.target.value as PTKPStatus)}
                      className="bg-[var(--c)] text-[var(--tx)] border border-[var(--bd)] rounded-lg px-2.5 py-1 font-medium focus:outline-none"
                    >
                      <option value="TK/0">TK/0 (Lajang tanpa tanggungan)</option>
                      <option value="TK/1">TK/1 (Lajang 1 tanggungan)</option>
                      <option value="K/0">K/0 (Kawin tanpa tanggungan)</option>
                      <option value="K/1">K/1 (Kawin 1 tanggungan)</option>
                      <option value="K/2">K/2 (Kawin 2 tanggungan)</option>
                      <option value="K/3">K/3 (Kawin 3 tanggungan)</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-[var(--mu)]">
                    <span>BPJS Ketenagakerjaan (JHT 2% + JP 1%):</span>
                    <span className="font-medium text-[var(--tx)]">-{formatRupiah(taxCalculation.bpjsKetenagakerjaanJht + taxCalculation.bpjsKetenagakerjaanJp)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--mu)]">
                    <span>BPJS Kesehatan (1%):</span>
                    <span className="font-medium text-[var(--tx)]">-{formatRupiah(taxCalculation.bpjsKesehatan)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--mu)]">
                    <span>PPh 21 TER ({(taxCalculation.pph21EffectiveRate * 100).toFixed(2)}%):</span>
                    <span className="font-medium text-[var(--tx)]">-{formatRupiah(taxCalculation.pph21Monthly)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[var(--tx)] pt-1.5 border-t border-[var(--bd)]">
                    <span>Estimasi Gaji Bersih Diterima:</span>
                    <span className="text-[var(--ac)]">{formatRupiah(taxCalculation.takeHomePay)}</span>
                  </div>
                </div>
              )}

              <label className="apple-label">Kota Tujuan</label>
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="Cari kota pilihan..."
                className="apple-input-raw bg-[var(--f)] rounded-xl px-3.5 py-2.5 mb-3 text-sm"
              />
              <div className="apple-chips max-h-36 overflow-y-auto">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCityId(c.id)}
                    className={`apple-chip ${c.id === cityId ? 'on' : ''}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <label className="apple-label">Profil Tempat Tinggal</label>
              <div className="apple-seg">
                {[
                  { id: 'single', label: 'Sendiri' },
                  { id: 'single_shared', label: 'Berbagi' },
                  { id: 'couple_no_kids', label: 'Pasangan' },
                  { id: 'family_with_kids', label: 'Keluarga' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile(item.id as any)}
                    className={profile === item.id ? 'on' : ''}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="apple-label">Anggota Rumah Tangga</label>
              <div className="apple-seg">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHouseholdSize(num)}
                    className={householdSize === num ? 'on' : ''}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <label className="apple-label">Target Tabungan</label>
              <div className="apple-seg">
                {[10, 20, 30, 40].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setTargetSavingsRate(rate)}
                    className={targetSavingsRate === rate ? 'on' : ''}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* PETA INTERAKTIF */}
            <IndonesiaMap
              cities={cities}
              selectedCityId={cityId}
              onSelectCity={(id) => setCityId(id)}
            />

            {/* 2. ESTIMASI PENGELUARAN DENGAN PRESET HUNIAN & TRANSPORT */}
            <div className="apple-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="apple-h3 !mb-0">2. Estimasi Pengeluaran Bulanan</h3>
                <span className="text-xs text-[var(--mu)]">Semua bisa diedit</span>
              </div>

              {/* RENTAL PRESETS DARI DATABASE REAL */}
              {cityRentals.length > 0 && (
                <div className="p-3.5 bg-[var(--f)] rounded-2xl mb-4 border border-[var(--bd)]">
                  <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block mb-2">
                    Gunakan Patokan Sewa Riil {selectedCityObj?.name}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cityRentals.map((r, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyRentalPreset(r.monthlyPriceMedian || 1500000)}
                        className="text-xs px-3 py-1.5 bg-[var(--c)] border border-[var(--bd)] hover:border-[var(--ac)] rounded-xl text-left transition"
                      >
                        <div className="font-semibold text-[var(--tx)] capitalize">
                          {r.housingType.replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-[var(--ac)] font-bold">
                          {formatRupiah(r.monthlyPriceMedian)}/bln
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COMMUTE MODE PRESETS */}
              <div className="p-3.5 bg-[var(--f)] rounded-2xl mb-4 border border-[var(--bd)]">
                <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block mb-2">
                  Pilih Moda Komuter Harian:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMUTE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => applyCommutePreset(opt.id, opt.baseCost)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        selectedCommute === opt.id
                          ? 'border-[var(--ac)] bg-[var(--c)] text-[var(--ac)] font-semibold shadow-sm'
                          : 'border-[var(--bd)] bg-[var(--c)] text-[var(--tx)] hover:opacity-85'
                      }`}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-[10px] text-[var(--mu)]">
                        {formatRupiah(opt.baseCost)}/bln
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT RINCIAN BIAYA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat}>
                    <label className="apple-label">{EXPENSE_CATEGORY_LABELS[cat]}</label>
                    <div className="apple-inp">
                      <span>Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatRupiahInput(expenses[cat]?.toString() || '0')}
                        onChange={(e) => handleExpenseChange(cat, e.target.value)}
                        className="apple-input-raw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: STICKY SUMMARY CARD */}
          <aside className="apple-card lg:sticky lg:top-[68px]">
            <div className="text-center text-[var(--mu)] text-sm mb-1">
              {selectedCityObj?.name}, {selectedCityObj?.province}
            </div>

            {/* Gauge Ring */}
            <div
              className="apple-ring"
              style={{
                ['--p' as any]: Math.max(0, Math.min(100, currentSimulation.savingsRate))
              }}
            >
              <i>{Math.round(currentSimulation.savingsRate)}%</i>
            </div>

            <div className="text-center mb-4">
              <span
                className="apple-badge"
                style={{ color: getStatusColor(currentSimulation.status) }}
              >
                ● {currentSimulation.statusInfo.label}
              </span>
            </div>

            <div className="apple-kv">
              <span className="text-[var(--mu)]">Total Pengeluaran</span>
              <b>{formatRupiah(currentSimulation.totalExpenses)}</b>
            </div>

            <div className="apple-kv">
              <span className="text-[var(--mu)]">Sisa / bulan</span>
              <b style={{ color: currentSimulation.remainingIncome < 0 ? 'var(--r)' : 'var(--ok)' }}>
                {formatRupiah(currentSimulation.remainingIncome)}
              </b>
            </div>

            <div className="apple-kv">
              <span className="text-[var(--mu)]">Tabungan setahun</span>
              <b>{formatRupiah(currentSimulation.annualSavings)}</b>
            </div>

            {currentSimulation.targetMinimumSalary && (
              <div className="apple-kv">
                <span className="text-[var(--mu)]">Gaji min. target {targetSavingsRate}%</span>
                <b>{formatRupiah(currentSimulation.targetMinimumSalary)}</b>
              </div>
            )}

            {/* Category breakdown bars */}
            <div className="mt-4 pt-3 border-t border-[var(--bd)] space-y-2">
              {currentSimulation.expenseBreakdown.map((item, idx) => {
                const colors = ['#007aff', '#34c759', '#ff9500', '#ff3b30', '#5856d6', '#af52de', '#86868b'];
                return (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs text-[var(--mu)]">
                      <span><span style={{ color: colors[idx % colors.length] }}>●</span> {item.label}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="apple-bar">
                      <i style={{ width: `${item.percentage}%`, background: colors[idx % colors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/result"
              className="apple-btn w-full mt-5 text-center justify-center text-sm"
            >
              Lihat Hasil Lengkap →
            </Link>

            <button
              type="button"
              onClick={async () => {
                const text = `WorthIt: di ${selectedCityObj?.name} gajiku ${formatRupiah(currentSimulation.totalIncome)}, sisa ${formatRupiah(currentSimulation.remainingIncome)} (${currentSimulation.savingsRate}%)`;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: 'WorthIt Indonesia', text, url: window.location.href });
                  } catch (_) {}
                } else {
                  await navigator.clipboard.writeText(`${text} ${window.location.href}`);
                  alert('Tautan hasil telah disalin ke clipboard');
                }
              }}
              className="apple-btn apple-btn-secondary w-full mt-2 justify-center text-sm"
            >
              Bagikan Hasil
            </button>
          </aside>
        </div>

        {/* FLOATING PILL FOR MOBILE */}
        <div
          className="apple-pill md:hidden"
          onClick={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-[var(--mu)] text-sm">Sisa / bulan</span>
          <b style={{ color: currentSimulation.remainingIncome < 0 ? 'var(--r)' : 'var(--ok)' }}>
            {formatRupiah(currentSimulation.remainingIncome)}
          </b>
        </div>
      </div>
    </>
  );
}
