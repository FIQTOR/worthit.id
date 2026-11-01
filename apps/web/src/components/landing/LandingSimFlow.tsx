import { City, SimulationResult, formatRupiah } from '@worthit/shared';

interface LandingSimFlowProps {
  selectedCity?: City;
  quickSimulation: SimulationResult;
}

export function LandingSimFlow({ selectedCity, quickSimulation }: LandingSimFlowProps) {
  return (
    <section className="mt-14">
      <h2 className="apple-h2">Simulasi saldo satu bulan</h2>
      <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
        Pola alokasi pengeluaran dari awal gajian sampai akhir bulan.
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
            <div
              className={`text-[28px] font-bold ${
                quickSimulation.remainingIncome >= 0 ? 'text-[var(--ok)]' : 'text-[var(--r)]'
              }`}
            >
              {formatRupiah(quickSimulation.remainingIncome)}
            </div>
          </div>
        </div>

        {/* Segmented Expense Breakdown Bar */}
        <div className="apple-bar h-3">
          <i
            style={{
              width: `${Math.min(100, Math.max(5, quickSimulation.savingsRate))}%`,
              background: 'var(--ok)'
            }}
          />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[13px] text-[var(--mu)]">
          <span>
            <span className="text-[var(--ok)] font-bold">●</span> Tabungan{' '}
            {quickSimulation.savingsRate.toFixed(0)}%
          </span>
          <span>
            <span className="text-[var(--ac)] font-bold">●</span> Tempat Tinggal{' '}
            {formatRupiah(quickSimulation.totalExpenses * 0.4)}
          </span>
          <span>
            <span className="text-[var(--w)] font-bold">●</span> Makanan & Transport{' '}
            {formatRupiah(quickSimulation.totalExpenses * 0.4)}
          </span>
          <span>
            <span className="text-[var(--b)] font-bold">●</span> Utilitas & Lainnya{' '}
            {formatRupiah(quickSimulation.totalExpenses * 0.2)}
          </span>
        </div>
      </div>
    </section>
  );
}
