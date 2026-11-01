import { Helmet } from 'react-helmet-async';

export function MethodologyPage() {
  return (
    <>
      <Helmet>
        <title>Metodologi Data – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Prinsip transparansi, rumus finansial, dan sumber data resmi yang digunakan di WorthIt Indonesia."
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <h1 className="apple-h1 mb-2">Metodologi Data</h1>
        <p className="apple-sub !mt-0 !mb-8">
          Prinsip transparansi sumber data dan formula perhitungan yang digunakan.
        </p>

        <div className="space-y-6">
          {/* SUMBER DATA */}
          <div className="apple-card">
            <h3 className="apple-h3">Sumber Data Utama</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {[
                { title: 'Badan Pusat Statistik (BPS)', desc: 'Survei Biaya Hidup 2022, IHK 150 Kabupaten/Kota, dan Pengeluaran Konsumsi Penduduk September 2025.', color: '#007aff' },
                { title: 'Kementerian Ketenagakerjaan', desc: 'SK Gubernur tentang Upah Minimum Provinsi (UMP) dan UMK Tahun 2025 sebagai acuan konteks upah.', color: '#ff9500' },
                { title: 'PT PLN (Persero)', desc: 'Tarif listrik reguler non-subsidi golongan R-1 untuk acuan dasar utilitas tempat tinggal.', color: '#ff3b30' },
                { title: 'Riset Pasar Terbuka', desc: 'Median tarif sewa kost AC dan kamar mandi dalam dari listing publik Mamikos dan platform sejenis.', color: '#34c759' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-[var(--f)] rounded-xl">
                  <b className="block text-sm mb-1.5" style={{ color: item.color }}>
                    {item.title}
                  </b>
                  <p className="text-[var(--mu)] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RUMUS KALKULASI */}
          <div className="apple-card">
            <h3 className="apple-h3">Rumus Kalkulasi</h3>
            <div className="space-y-2.5 font-mono text-xs text-[var(--tx)]">
              <div className="p-3 bg-[var(--f)] rounded-xl overflow-x-auto">
                Total Pengeluaran = Tinggal + Makan + Transport + Utilitas + Gaya Hidup + Cicilan + Lainnya
              </div>
              <div className="p-3 bg-[var(--f)] rounded-xl overflow-x-auto">
                Sisa Pendapatan = Gaji Bersih Bulanan − Total Pengeluaran
              </div>
              <div className="p-3 bg-[var(--f)] rounded-xl overflow-x-auto">
                Tingkat Tabungan (%) = (Sisa Pendapatan ÷ Gaji Bersih) × 100
              </div>
              <div className="p-3 bg-[var(--f)] rounded-xl overflow-x-auto">
                Gaji Minimum Target = Total Pengeluaran ÷ (1 − Target Tabungan %)
              </div>
            </div>
          </div>

          {/* KETERBATASAN DATA */}
          <div className="apple-card">
            <h3 className="apple-h3">Keterbatasan & Integritas Data</h3>
            <div className="divide-y divide-[var(--bd)] text-sm">
              {[
                'Data yang tidak tersedia tidak diisi dengan estimasi spekulatif; ditandai secara jujur sebagai baseline umum.',
                'IHK (Indeks Harga Konsumen) adalah indeks statistik, bukan harga komoditas dalam mata uang Rupiah.',
                'Rata-rata pengeluaran per kapita BPS merupakan agregat rumah tangga, bukan budget personal individu.',
                'UMK/UMP adalah regulasi batas bawah upah pekerja formal, bukan rekomendasi biaya hidup layak aktual.'
              ].map((point, idx) => (
                <div key={idx} className="py-3 text-[var(--mu)]">
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* STATUS KEUANGAN */}
          <div className="apple-card">
            <h3 className="apple-h3">Kategori Status Keuangan</h3>
            <div className="divide-y divide-[var(--bd)] text-sm">
              {[
                { label: 'Defisit', color: 'var(--r)', desc: 'Pengeluaran melebihi pemasukan bulanan.' },
                { label: 'Sangat Terbatas', color: 'var(--w)', desc: 'Tingkat tabungan di bawah 10% pendapatan.' },
                { label: 'Cukup Ketat', color: 'var(--ac)', desc: 'Tingkat tabungan antara 10% – 19%.' },
                { label: 'Cukup Sehat', color: 'var(--ok)', desc: 'Tingkat tabungan antara 20% – 29%.' },
                { label: 'Ruang Menabung Besar', color: 'var(--ok)', desc: 'Tingkat tabungan 30% atau lebih.' }
              ].map((st, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center gap-4">
                  <span className="font-semibold" style={{ color: st.color }}>
                    ● {st.label}
                  </span>
                  <span className="text-[var(--mu)] text-xs">{st.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
