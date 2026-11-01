import { Helmet } from 'react-helmet-async';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '@/stores/calculator.store';
import { formatRupiah, calculateSimulation } from '@worthit/shared';
import { toPng } from 'html-to-image';

export function ResultPage() {
  const navigate = useNavigate();
  const { income, cityId, profile, householdSize, expenses, targetSavingsRate } = useCalculatorStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const simulation = calculateSimulation({
    income: { netMonthly: income.netMonthly, additionalMonthly: income.additionalMonthly || 0 },
    cityId,
    profile,
    householdSize,
    expenses,
    targetSavingsRate
  });

  const getStatusColor = (status: string) => {
    if (status === 'deficit') return 'var(--r)';
    if (status === 'very_tight') return 'var(--w)';
    if (status === 'tight') return 'var(--ac)';
    return 'var(--ok)';
  };

  const handleShare = async () => {
    const text = `WorthIt: Gaji ${formatRupiah(simulation.totalIncome)}, sisa tabungan ${formatRupiah(simulation.remainingIncome)} (${simulation.savingsRate.toFixed(0)}%) di ${cityId.toUpperCase()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Hasil Simulasi WorthIt', text, url: window.location.href });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('Tautan hasil simulasi telah disalin ke clipboard');
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      setIsGeneratingImage(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `worthit-${cityId}-${Math.round(simulation.savingsRate)}pct.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Gagal menghasilkan gambar kartu. Silakan coba gunakan tombol cetak/PDF.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Hasil Simulasi – WorthIt Indonesia</title>
        <meta name="description" content="Hasil evaluasi kelayakan finansial dan potensi tabungan bulananmu." />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20 print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-[var(--mu)] text-sm uppercase tracking-wider font-semibold">
              {cityId.toUpperCase()} · {profile === 'single' ? 'Sendiri' : profile} · {householdSize} Orang
            </p>
            <h1 className="apple-h1 !mb-1">Hasil Simulasi Finansial</h1>
            <p className="apple-sub !mt-0">
              Gaji {formatRupiah(simulation.totalIncome)} per bulan
            </p>
          </div>

          {/* Quick export actions */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              disabled={isGeneratingImage}
              onClick={handleDownloadCard}
              className="apple-btn text-xs px-3.5 py-2"
            >
              {isGeneratingImage ? 'Menyiapkan Gambar...' : '📷 Unduh Kartu Media Sosial'}
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="apple-btn apple-btn-secondary text-xs px-3.5 py-2"
            >
              🖨️ Cetak / Simpan PDF
            </button>
          </div>
        </div>

        {/* SHAREABLE VISUAL CARD (Target for html-to-image) */}
        <div className="mb-8">
          <div
            ref={cardRef}
            className="apple-card bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl border border-white/10 relative overflow-hidden"
          >
            {/* Background blur circle */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center font-black text-white text-base">
                  W
                </div>
                <div>
                  <div className="font-extrabold text-sm tracking-tight text-white leading-none">
                    worthit<span className="text-blue-400">.id</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">
                    Evaluasi Finansial Kota
                  </div>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-neutral-300 font-semibold border border-white/10">
                {cityId.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-xs text-neutral-400">Estimasi Sisa Bersih:</div>
                <div
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    simulation.remainingIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatRupiah(simulation.remainingIncome)}
                  <span className="text-xs font-normal text-neutral-400">/bln</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Status:{' '}
                  <span className="text-white font-bold">
                    {simulation.statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Mini Ring Gauge */}
              <div
                className="apple-ring !m-0 !w-20 !h-20 flex-shrink-0"
                style={{
                  ['--p' as any]: Math.max(0, Math.min(100, simulation.savingsRate))
                }}
              >
                <i className="!text-white !text-sm">{Math.round(simulation.savingsRate)}%</i>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-neutral-400 block">Penghasilan Bersih</span>
                <b className="text-white text-sm">{formatRupiah(simulation.totalIncome)}</b>
              </div>
              <div>
                <span className="text-neutral-400 block">Total Pengeluaran</span>
                <b className="text-neutral-200 text-sm">{formatRupiah(simulation.totalExpenses)}</b>
              </div>
              <div>
                <span className="text-neutral-400 block">Potensi Tabungan 1 Thn</span>
                <b className="text-blue-300 text-sm">{formatRupiah(simulation.annualSavings)}</b>
              </div>
              <div>
                <span className="text-neutral-400 block">Profil Rumah Tangga</span>
                <b className="text-neutral-200 capitalize text-sm">{profile.replace('_', ' ')}</b>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
              <span>Data BPS & SK UMK Terverifikasi 2025</span>
              <span>Cek kelayakanmu di worthit.id</span>
            </div>
          </div>
        </div>

        {/* TOP 3 SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Pendapatan Bersih</p>
            <div className="text-[28px] font-bold text-[var(--tx)] mt-1">
              {formatRupiah(simulation.totalIncome)}
            </div>
          </div>

          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Total Pengeluaran</p>
            <div className="text-[28px] font-bold text-[var(--tx)] mt-1">
              {formatRupiah(simulation.totalExpenses)}
            </div>
          </div>

          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Sisa / Tabungan</p>
            <div
              className="text-[28px] font-bold mt-1"
              style={{ color: simulation.remainingIncome < 0 ? 'var(--r)' : 'var(--ok)' }}
            >
              {formatRupiah(simulation.remainingIncome)}
            </div>
          </div>
        </div>

        {/* MAIN 2-COL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 items-start">
          <div className="space-y-6">
            {/* STATUS & TARGETS */}
            <div className="apple-card">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="apple-ring !m-0 flex-shrink-0"
                  style={{
                    ['--p' as any]: Math.max(0, Math.min(100, simulation.savingsRate))
                  }}
                >
                  <i>{Math.round(simulation.savingsRate)}%</i>
                </div>

                <div className="flex-1 w-full">
                  <span
                    className="apple-badge mb-2"
                    style={{ color: getStatusColor(simulation.status) }}
                  >
                    ● {simulation.statusInfo.label}
                  </span>
                  <p className="text-[var(--mu)] text-sm my-2">
                    {simulation.statusInfo.description}
                  </p>

                  <div className="apple-kv">
                    <span className="text-[var(--mu)]">Tabungan Setahun</span>
                    <b>{formatRupiah(simulation.annualSavings)}</b>
                  </div>
                  {simulation.targetMinimumSalary && (
                    <div className="apple-kv">
                      <span className="text-[var(--mu)]">Gaji min. target {targetSavingsRate}%</span>
                      <b>{formatRupiah(simulation.targetMinimumSalary)}</b>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EXPENSE BREAKDOWN */}
            <div className="apple-card">
              <h3 className="apple-h3">Rincian Pengeluaran</h3>
              <div className="space-y-3">
                {simulation.expenseBreakdown.map((item, idx) => {
                  const colors = ['#007aff', '#34c759', '#ff9500', '#ff3b30', '#5856d6', '#af52de', '#86868b'];
                  return (
                    <div key={item.category} className="apple-kv !py-2">
                      <div className="flex items-center gap-2">
                        <span style={{ color: colors[idx % colors.length] }}>●</span>
                        <span className="font-medium text-[var(--tx)]">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <b className="text-[var(--tx)]">{formatRupiah(item.amount)}</b>
                        <span className="text-xs text-[var(--mu)] ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PROYEKSI TABUNGAN MULTI-TAHUN */}
            <div className="apple-card">
              <h3 className="apple-h3">Proyeksi Tabungan Kumulatif</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-3">
                {[1, 3, 5].map((y) => {
                  const val = simulation.annualSavings * y;
                  return (
                    <div key={y} className="p-3 bg-[var(--f)] rounded-xl">
                      <p className="text-[var(--mu)] text-xs">{y} Tahun</p>
                      <div className={`text-lg font-bold mt-1 ${val < 0 ? 'text-[var(--r)]' : 'text-[var(--ac)]'}`}>
                        {formatRupiah(val)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY & ACTIONS */}
          <aside className="apple-card lg:sticky lg:top-[68px] print:hidden">
            <h3 className="apple-h3">Ringkasan Keputusan</h3>
            <p className="text-[var(--mu)] text-sm leading-relaxed mb-6">
              {simulation.remainingIncome < 0
                ? `Pengeluaranmu melebihi pemasukan bulanan sebesar ${formatRupiah(Math.abs(simulation.remainingIncome))}. Kamu butuh gaji minimal ${formatRupiah(simulation.targetMinimumSalary)} untuk mencapai target keuangan aman.`
                : `Kamu mampu menyisihkan ${simulation.savingsRate.toFixed(0)}% dari gaji setiap bulan. Finansial tergolong ${simulation.statusInfo.label.toLowerCase()}.`}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate('/calculator')}
                className="apple-btn w-full justify-center text-sm"
              >
                Edit Simulasi
              </button>
              <Link
                to="/job-offer"
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Simulasi Tawaran Pindah Kerja
              </Link>
              <Link
                to="/reverse-calculator"
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Kalkulator Gaji Ideal
              </Link>
              <Link
                to="/compare"
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Bandingkan Kota Lain
              </Link>
              <button
                type="button"
                onClick={handleShare}
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Salin Tautan Hasil
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
