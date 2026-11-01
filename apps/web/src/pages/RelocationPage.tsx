import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api.service';
import { formatRupiahInput, parseRupiahInput } from '@/utils/helpers';
import { formatRupiah } from '@worthit/shared';

export function RelocationPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('jakarta');

  const [travelCost, setTravelCost] = useState('500.000');
  const [movingCost, setMovingCost] = useState('1.000.000');
  const [rentFirstMonth, setRentFirstMonth] = useState('2.000.000');
  const [deposit, setDeposit] = useState('1.500.000');
  const [equipment, setEquipment] = useState('1.000.000');
  const [monthlyExpense, setMonthlyExpense] = useState('3.500.000');
  const [emergencyMonths, setEmergencyMonths] = useState(3);

  useEffect(() => {
    apiService.getCities().then((res) => {
      setCities(res.data || []);
    });
  }, []);

  const travel = parseRupiahInput(travelCost);
  const move = parseRupiahInput(movingCost);
  const rent = parseRupiahInput(rentFirstMonth);
  const dep = parseRupiahInput(deposit);
  const eq = parseRupiahInput(equipment);
  const mo = parseRupiahInput(monthlyExpense);

  const firstMonthExpenses = travel + move + rent + eq;
  const emergencyReserve = mo * emergencyMonths;
  const totalCapital = firstMonthExpenses + dep + emergencyReserve;

  return (
    <>
      <Helmet>
        <title>Modal Relokasi – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Berapa modal awal yang aman sebelum merantau ke kota baru di Indonesia?"
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <h1 className="apple-h1 mb-2">Modal Relokasi</h1>
        <p className="apple-sub !mt-0 !mb-8">
          Berapa modal awal yang aman sebelum memutuskan merantau ke kota baru?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 items-start">
          {/* INPUT FORM */}
          <div className="apple-card space-y-4">
            <div>
              <label className="apple-label">Kota Tujuan</label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="apple-select"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.province})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="apple-label">Tiket / Perjalanan</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={travelCost}
                    onChange={(e) => setTravelCost(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>

              <div>
                <label className="apple-label">Ongkos Angkut / Pindahan</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={movingCost}
                    onChange={(e) => setMovingCost(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>

              <div>
                <label className="apple-label">Sewa Bulan Pertama</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rentFirstMonth}
                    onChange={(e) => setRentFirstMonth(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>

              <div>
                <label className="apple-label">Deposit Hunian</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={deposit}
                    onChange={(e) => setDeposit(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>

              <div>
                <label className="apple-label">Perlengkapan Awal</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={equipment}
                    onChange={(e) => setEquipment(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>

              <div>
                <label className="apple-label">Estimasi Pengeluaran Bulanan</label>
                <div className="apple-inp">
                  <span>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(formatRupiahInput(e.target.value))}
                    className="apple-input-raw"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="apple-label">Cadangan Dana Darurat</label>
              <div className="apple-seg">
                {[1, 2, 3, 6].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEmergencyMonths(m)}
                    className={emergencyMonths === m ? 'on' : ''}
                  >
                    {m} bulan
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY ASIDE */}
          <aside className="apple-card lg:sticky lg:top-[68px]">
            <p className="text-[var(--mu)] text-sm">Total Modal Awal Diperlukan</p>
            <div className="text-[38px] font-bold text-[var(--ac)] tracking-[-1px] my-1">
              {formatRupiah(totalCapital)}
            </div>
            <p className="text-[var(--mu)] text-xs mb-5">
              Termasuk cadangan darurat runway {emergencyMonths} bulan.
            </p>

            <div className="apple-kv">
              <span className="text-[var(--mu)]">Biaya Bulan Pertama</span>
              <b>{formatRupiah(firstMonthExpenses)}</b>
            </div>
            <div className="apple-kv">
              <span className="text-[var(--mu)]">Deposit (Bisa Kembali)</span>
              <b>{formatRupiah(dep)}</b>
            </div>
            <div className="apple-kv">
              <span className="text-[var(--mu)]">Dana Darurat ({emergencyMonths} bln)</span>
              <b className="text-[var(--ok)]">{formatRupiah(emergencyReserve)}</b>
            </div>

            {/* Proportion Bar */}
            <div className="apple-bar h-2.5 mt-5">
              <i
                style={{
                  width: `${(firstMonthExpenses / totalCapital) * 100}%`,
                  background: 'var(--ac)'
                }}
              />
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-[var(--mu)]">
              <span><span className="text-[var(--ac)]">●</span> Bulan pertama</span>
              <span><span className="text-[var(--w)]">●</span> Deposit</span>
              <span><span className="text-[var(--ok)]">●</span> Dana darurat</span>
            </div>

            <p className="text-[var(--mu)] text-xs mt-6 leading-relaxed bg-[var(--f)] p-3 rounded-xl">
              ⚠️ <b>Tips:</b> Jangan pindah tanpa dana darurat minimal 1–3 bulan pengeluaran untuk mengantisipasi keterlambatan gaji awal atau penyesuaian biaya adaptasi.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
