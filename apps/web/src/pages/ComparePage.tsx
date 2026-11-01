import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api.service';
import { formatRupiahInput, parseRupiahInput } from '@/utils/helpers';
import { formatRupiah, calculateSimulation, EXPENSE_CATEGORY_LABELS, ExpenseEstimates } from '@worthit/shared';

export function ComparePage() {
  const [cities, setCities] = useState<any[]>([]);
  const [incomeInput, setIncomeInput] = useState('8.000.000');
  const [profile, setProfile] = useState<'single' | 'single_shared' | 'couple_no_kids' | 'family_with_kids'>('single');
  const [cityIds, setCityIds] = useState<string[]>(['jakarta', 'surabaya', 'bandung']);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

  useEffect(() => {
    apiService.getCities().then((res) => {
      setCities(res.data || []);
    });
  }, []);

  const runCompare = async () => {
    const validIds = cityIds.filter(Boolean);
    const parsedIncome = parseRupiahInput(incomeInput);

    const promises = validIds.map(async (cId) => {
      const cityObj = cities.find((c) => c.id === cId);
      const expRes = await apiService.getCityExpenses(cId, profile, 1).catch(() => null);
      const estimates: ExpenseEstimates = expRes?.data?.reference?.estimates || {
        housing: 1500000,
        food: 1200000,
        transportation: 350000,
        utilities: 250000,
        lifestyle: 350000,
        financialObligations: 0,
        other: 100000
      };
      const sim = calculateSimulation({
        income: { netMonthly: parsedIncome },
        cityId: cId,
        profile,
        householdSize: 1,
        expenses: estimates
      });
      return { city: cityObj, estimates, sim };
    });

    const results = await Promise.all(promises);
    setComparisonResults(results);
  };

  useEffect(() => {
    if (cities.length >= 2) {
      runCompare();
    }
  }, [cities, cityIds, profile, incomeInput]);

  const maxRemaining = Math.max(...comparisonResults.map((r) => r.sim.remainingIncome), 0);
  const categories = Object.keys(EXPENSE_CATEGORY_LABELS) as (keyof ExpenseEstimates)[];

  return (
    <>
      <Helmet>
        <title>Bandingkan Kota – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Gaji dan gaya hidup sama, kota berbeda. Mana yang paling menyisakan uang tabungan?"
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <h1 className="apple-h1 mb-2">Bandingkan Kota</h1>
        <p className="apple-sub !mt-0 !mb-8">
          Gaji dan gaya hidup sama, kota berbeda. Mana yang paling menyisakan uang?
        </p>

        {/* INPUT CONTROLS */}
        <div className="apple-card mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="apple-label">Gaji bersih</label>
              <div className="apple-inp">
                <span>Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(formatRupiahInput(e.target.value))}
                  className="apple-input-raw"
                />
              </div>
            </div>

            <div>
              <label className="apple-label">Profil Hidup</label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value as any)}
                className="apple-select"
              >
                <option value="single">Single (Sendiri)</option>
                <option value="single_shared">Single (Berbagi)</option>
                <option value="couple_no_kids">Pasangan (2 orang)</option>
                <option value="family_with_kids">Keluarga (4 orang)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[var(--bd)]">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <label className="apple-label">Kota {idx + 1}</label>
                <select
                  value={cityIds[idx] || ''}
                  onChange={(e) => {
                    const next = [...cityIds];
                    next[idx] = e.target.value;
                    setCityIds(next);
                  }}
                  className="apple-select"
                >
                  {idx === 2 && <option value="">— Opsional —</option>}
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {comparisonResults.map((item) => {
            const isWinner = item.sim.remainingIncome === maxRemaining && maxRemaining > 0;
            return (
              <div
                key={item.city?.id}
                className={`apple-card relative ${isWinner ? 'border-2 border-[var(--ok)] shadow-md' : ''}`}
              >
                {isWinner && (
                  <span className="absolute -top-3 left-4 bg-[var(--ok)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Paling Terjangkau
                  </span>
                )}
                <h3 className="apple-h3 !mb-0">{item.city?.name}</h3>
                <p className="text-[var(--mu)] text-sm mb-4">{item.city?.province}</p>

                <div className="apple-kv">
                  <span className="text-[var(--mu)]">Pengeluaran</span>
                  <b>{formatRupiah(item.sim.totalExpenses)}</b>
                </div>
                <div className="apple-kv">
                  <span className="text-[var(--mu)]">Sisa / bulan</span>
                  <b style={{ color: item.sim.remainingIncome < 0 ? 'var(--r)' : 'var(--ok)' }}>
                    {formatRupiah(item.sim.remainingIncome)}
                  </b>
                </div>
                <div className="apple-kv">
                  <span className="text-[var(--mu)]">Tabungan</span>
                  <b>{Math.round(item.sim.savingsRate)}%</b>
                </div>

                <div className="apple-bar mt-3">
                  <i
                    style={{
                      width: `${Math.min(100, Math.max(0, item.sim.savingsRate))}%`,
                      background: isWinner ? 'var(--ok)' : 'var(--ac)'
                    }}
                  />
                </div>

                <p className="text-[var(--mu)] text-xs mt-3">
                  {item.sim.statusInfo.label} · {isWinner ? 'Opsi paling hemat' : `Selisih ${formatRupiah((maxRemaining - item.sim.remainingIncome) * 12)} / tahun`}
                </p>
              </div>
            );
          })}
        </div>

        {/* DETAILED CATEGORY COMPARISON TABLE */}
        <div className="apple-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--bd)] text-[var(--mu)]">
                <th className="py-3 px-3">Kategori</th>
                {comparisonResults.map((r) => (
                  <th key={r.city?.id} className="py-3 px-3 font-semibold text-[var(--tx)]">
                    {r.city?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bd)]">
              {categories.map((cat) => (
                <tr key={cat}>
                  <td className="py-3 px-3 font-medium text-[var(--tx)]">
                    {EXPENSE_CATEGORY_LABELS[cat]}
                  </td>
                  {comparisonResults.map((r) => (
                    <td key={r.city?.id} className="py-3 px-3 text-[var(--mu)]">
                      {formatRupiah(r.estimates[cat])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold bg-[var(--f)]">
                <td className="py-3 px-3 text-[var(--tx)]">Total Pengeluaran</td>
                {comparisonResults.map((r) => (
                  <td key={r.city?.id} className="py-3 px-3 text-[var(--tx)]">
                    {formatRupiah(r.sim.totalExpenses)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
