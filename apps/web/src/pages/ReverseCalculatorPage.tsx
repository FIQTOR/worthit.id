import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  formatRupiah,
  calculateReverseSalary,
  calculateTotalExpenses,
  PTKPStatus,
  LivingProfileType
} from '@worthit/shared';
import citiesData from '../../../../datasets/cities.json';
import expenseData from '../../../../datasets/expenditure-benchmarks.json';

const PTKP_OPTIONS: { value: PTKPStatus; label: string; desc: string }[] = [
  { value: 'TK/0', label: 'TK/0', desc: 'Lajang tanpa tanggungan' },
  { value: 'TK/1', label: 'TK/1', desc: 'Lajang 1 tanggungan' },
  { value: 'K/0', label: 'K/0', desc: 'Menikah tanpa tanggungan' },
  { value: 'K/1', label: 'K/1', desc: 'Menikah 1 tanggungan' },
  { value: 'K/2', label: 'K/2', desc: 'Menikah 2 tanggungan' },
  { value: 'K/3', label: 'K/3', desc: 'Menikah 3 tanggungan' },
];

export function ReverseCalculatorPage() {
  const [cityId, setCityId] = useState<string>('jakarta');
  const [targetSavingsMonthly, setTargetSavingsMonthly] = useState<number>(3000000);
  const [profile, setProfile] = useState<LivingProfileType>('single');
  const [includeTaxDeduction, setIncludeTaxDeduction] = useState<boolean>(true);
  const [ptkpStatus, setPtkpStatus] = useState<PTKPStatus>('TK/0');

  // Custom expenses override state
  const selectedCity = useMemo(() => {
    return citiesData.find((c) => c.id === cityId) || citiesData[0];
  }, [cityId]);

  const defaultEstimates = useMemo(() => {
    const ref = expenseData.find(
      (e) => e.cityId === cityId && e.profile === profile
    );
    if (ref) return ref.estimates;
    return {
      housing: 1500000,
      food: 1200000,
      transportation: 350000,
      utilities: 250000,
      lifestyle: 350000,
      financialObligations: 0,
      other: 100000
    };
  }, [cityId, profile]);

  const [expenses, setExpenses] = useState(defaultEstimates);

  // Sync when city or profile changes
  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    const ref = expenseData.find(
      (e) => e.cityId === newCityId && e.profile === profile
    );
    if (ref) setExpenses(ref.estimates);
  };

  const handleProfileChange = (newProfile: LivingProfileType) => {
    setProfile(newProfile);
    const ref = expenseData.find(
      (e) => e.cityId === cityId && e.profile === newProfile
    );
    if (ref) setExpenses(ref.estimates);
  };

  const handleExpenseChange = (field: keyof typeof defaultEstimates, val: number) => {
    setExpenses((prev) => ({
      ...prev,
      [field]: Math.max(0, val)
    }));
  };

  const cityUmk = selectedCity.benchmarks.umk || null;

  const result = useMemo(() => {
    return calculateReverseSalary(
      {
        targetSavingsMonthly,
        cityId,
        profile,
        householdSize: profile === 'single' ? 1 : 2,
        expenses,
        includeTaxDeduction,
        ptkpStatus
      },
      cityUmk
    );
  }, [targetSavingsMonthly, cityId, profile, expenses, includeTaxDeduction, ptkpStatus, cityUmk]);

  const totalExpenseVal = calculateTotalExpenses(expenses);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
          Kalkulator Target Gaji (Reverse)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
          Berapa Gaji yang Harus Dinegosiasi?
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          Tentukan target tabungan bersih dan gaya hidup Anda di kota tujuan. Kami hitungkan estimasi gaji bersih (THP) serta gaji kotor sebelum potongan PPh 21 & BPJS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Savings Card */}
          <div className="apple-card p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
            <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              1. Target Tabungan Bulanan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Berapa uang yang ingin Anda sisihkan bersih setiap bulan?
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={targetSavingsMonthly}
                    onChange={(e) => setTargetSavingsMonthly(Number(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-neutral-900"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {[1500000, 3000000, 5000000, 10000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTargetSavingsMonthly(amt)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                      targetSavingsMonthly === amt
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {formatRupiah(amt)}/bln
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* City & Profile Selection */}
          <div className="apple-card p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
            <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              2. Kota & Profil Kehidupan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Kota Domisili Pekerjaan
                </label>
                <select
                  value={cityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-neutral-800 bg-white"
                >
                  {citiesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Profil Rumah Tangga
                </label>
                <select
                  value={profile}
                  onChange={(e) => handleProfileChange(e.target.value as LivingProfileType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-neutral-800 bg-white"
                >
                  <option value="single">Lajang Sendiri (Single)</option>
                  <option value="single_shared">Lajang Berbagi Hunian (Shared)</option>
                  <option value="couple_no_kids">Menikah (Belum Punya Anak)</option>
                  <option value="family_with_kids">Keluarga (Dengan Anak)</option>
                </select>
              </div>
            </div>

            {/* Living Cost Breakdown inputs */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-neutral-700 uppercase">
                  Estimasi Biaya Hidup Bulanan ({selectedCity.name})
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  Total: {formatRupiah(totalExpenseVal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-500">Sewa Hunian</label>
                  <input
                    type="number"
                    value={expenses.housing}
                    onChange={(e) => handleExpenseChange('housing', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">Makan & Minum</label>
                  <input
                    type="number"
                    value={expenses.food}
                    onChange={(e) => handleExpenseChange('food', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">Transportasi</label>
                  <input
                    type="number"
                    value={expenses.transportation}
                    onChange={(e) => handleExpenseChange('transportation', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">Utilitas & Kuota</label>
                  <input
                    type="number"
                    value={expenses.utilities}
                    onChange={(e) => handleExpenseChange('utilities', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">Gaya Hidup & Nongkrong</label>
                  <input
                    type="number"
                    value={expenses.lifestyle}
                    onChange={(e) => handleExpenseChange('lifestyle', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">Cicilan / Kewajiban</label>
                  <input
                    type="number"
                    value={expenses.financialObligations}
                    onChange={(e) => handleExpenseChange('financialObligations', Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tax & BPJS Settings */}
          <div className="apple-card p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                3. Simulasi Potongan Pajak & BPJS
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                <input
                  type="checkbox"
                  checked={includeTaxDeduction}
                  onChange={(e) => setIncludeTaxDeduction(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Hitung Gaji Kotor (Gross)
              </label>
            </div>

            {includeTaxDeduction && (
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Status PTKP (Penghasilan Tidak Kena Pajak)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PTKP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPtkpStatus(opt.value)}
                      className={`text-left p-2.5 rounded-xl border transition ${
                        ptkpStatus === opt.value
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-neutral-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 mt-3 leading-relaxed">
                  Perhitungan menggunakan tarif PPh 21 TER (Tarif Efektif Rata-Rata) PP 58/2023, BPJS Ketenagakerjaan JHT (2%) + JP (1% maks basis 10.5jt), dan BPJS Kesehatan (1% maks basis 12jt).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Output Negotiation Recommendation */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="apple-card p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>TARGET NEGOSIASI GAJI</span>
              <span className="bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded">
                {selectedCity.name}
              </span>
            </div>

            {includeTaxDeduction ? (
              <div className="mb-6">
                <div className="text-xs text-neutral-300 mb-1">Target Penawaran Gaji Kotor (Gross Offer):</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">
                  {formatRupiah(result.requiredGrossSalary)}
                  <span className="text-xs font-normal text-neutral-400">/bln</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Untuk menghasilkan Take-Home Pay bersih {formatRupiah(result.requiredNetSalary)}/bulan.
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="text-xs text-neutral-300 mb-1">Target Gaji Bersih (Take Home Pay):</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">
                  {formatRupiah(result.requiredNetSalary)}
                  <span className="text-xs font-normal text-neutral-400">/bln</span>
                </div>
              </div>
            )}

            {/* Benchmark vs UMK */}
            {result.umkRatio && (
              <div className="p-3 bg-white/10 rounded-xl mb-6 text-xs flex items-center justify-between">
                <div>
                  <div className="text-neutral-400">Rasio terhadap UMK {selectedCity.name}:</div>
                  <div className="text-neutral-200 font-semibold">
                    {formatRupiah(result.cityUmk)}/bulan
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-300">
                    {result.umkRatio}x UMK
                  </span>
                </div>
              </div>
            )}

            {/* Breakdown summary */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Pengeluaran Hidup Bulanan:</span>
                <span className="font-semibold text-white">{formatRupiah(result.totalExpenses)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Target Tabungan Bersih:</span>
                <span className="font-semibold text-emerald-400">+{formatRupiah(result.targetSavingsMonthly)}</span>
              </div>

              {includeTaxDeduction && result.estimatedTaxAndDeductions && (
                <>
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Estimasi BPJS Karyawan:</span>
                    <span className="text-neutral-300">-{formatRupiah(result.estimatedTaxAndDeductions.totalBpjsEmployee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Estimasi PPh 21 Bulanan:</span>
                    <span className="text-neutral-300">-{formatRupiah(result.estimatedTaxAndDeductions.pph21Monthly)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                to={`/calculator?city=${cityId}&income=${result.requiredNetSalary}`}
                className="w-full block text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition"
              >
                Buka di Simulator Penuh →
              </Link>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl text-xs text-neutral-700 leading-relaxed">
            <strong className="text-blue-900 block mb-1">Tips Negosiasi Gaji:</strong>
            Sebutkan angka gross saat wawancara jika perusahaan menerapkan sistem pemotongan PPh 21 & BPJS standar. Minta penegasan apakah angka tawaran berupa <em>Gross</em> atau <em>Nett</em> di offering letter.
          </div>
        </div>
      </div>
    </div>
  );
}
