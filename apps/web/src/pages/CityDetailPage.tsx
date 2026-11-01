import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { formatRupiah, calculateSimulation } from '@worthit/shared';

export function CityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [city, setCity] = useState<any>(null);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [allCities, setAllCities] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      apiService.getCityById(slug),
      apiService.getCityBenchmarks(slug),
      apiService.getCities()
    ]).then(([cityRes, benchRes, allCitiesRes]) => {
      setCity(cityRes.data);
      setBenchmarks(benchRes.data);
      setAllCities(allCitiesRes.data || []);
    }).catch(() => {});
  }, [slug]);

  if (!city) {
    return (
      <div className="max-w-[1080px] mx-auto px-5 py-20 text-center">
        <h1 className="apple-h1 mb-4">Kota Tidak Ditemukan</h1>
        <Link to="/cities" className="apple-btn">
          ← Kembali ke Daftar Kota
        </Link>
      </div>
    );
  }

  // Base estimate for single person
  const baseMonthlyExp = city.benchmarks?.bpsMonthlyPerCapita
    ? Math.round(city.benchmarks.bpsMonthlyPerCapita * 1.5)
    : 2800000;

  // Comparison with Jakarta
  const jakartaExp = 4500000;
  const diffJakartaPercent = Math.round(((baseMonthlyExp - jakartaExp) / jakartaExp) * 100);

  // Rank among all cities
  const sortedCities = [...allCities].sort(
    (a, b) => (a.benchmarks?.bpsMonthlyPerCapita || 0) - (b.benchmarks?.bpsMonthlyPerCapita || 0)
  );
  const rank = sortedCities.findIndex((c) => c.id === city.id) + 1;

  return (
    <>
      <Helmet>
        <title>{city.name} – Biaya Hidup – WorthIt Indonesia</title>
        <meta
          name="description"
          content={`Estimasi biaya hidup bulanan, benchmark resmi BPS, dan sampel sewa kost di ${city.name}, ${city.province}.`}
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <Link to="/cities" className="text-[var(--mu)] text-sm hover:text-[var(--tx)] transition-colors">
          ← Semua kota
        </Link>

        {/* CITY HEADER */}
        <div className="flex items-center gap-4 mt-3 mb-6">
          <div className="w-16 h-16 rounded-[20px] bg-[var(--ac)] text-white grid place-items-center text-2xl font-bold flex-shrink-0">
            📍
          </div>
          <div>
            <h1 className="apple-h1">{city.name}</h1>
            <p className="text-[var(--mu)] text-sm">{city.province} · {city.administrativeLevel}</p>
          </div>
        </div>

        {/* TOP 3 STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Biaya Hidup Sendiri</p>
            <div className="text-[28px] font-bold text-[var(--tx)] mt-1">
              {formatRupiah(baseMonthlyExp)}
            </div>
            <p className="text-[var(--mu)] text-xs mt-1">estimasi per bulan</p>
          </div>

          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Peringkat Termurah</p>
            <div className="text-[28px] font-bold text-[var(--tx)] mt-1">
              #{rank > 0 ? rank : 5}
              <span className="text-[var(--mu)] text-sm font-normal"> dari {allCities.length || 30}</span>
            </div>
            <p className="text-[var(--mu)] text-xs mt-1">berdasarkan BPS per kapita</p>
          </div>

          <div className="apple-card">
            <p className="text-[var(--mu)] text-sm">Dibanding Jakarta</p>
            <div
              className="text-[28px] font-bold mt-1"
              style={{ color: diffJakartaPercent <= 0 ? 'var(--ok)' : 'var(--r)' }}
            >
              {diffJakartaPercent > 0 ? '+' : ''}{diffJakartaPercent}%
            </div>
            <p className="text-[var(--mu)] text-xs mt-1">
              {diffJakartaPercent <= 0 ? 'lebih hemat' : 'lebih mahal'}
            </p>
          </div>
        </div>

        {/* 2-COL MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 items-start">
          <div className="space-y-6">
            {/* BENCHMARK STATISTIK */}
            <div className="apple-card">
              <h3 className="apple-h3">Benchmark Statistik Resmi</h3>
              <div className="divide-y divide-[var(--bd)]">
                {city.benchmarks?.umk && (
                  <div className="apple-kv">
                    <span className="text-[var(--mu)]">Upah Minimum Kota (UMK 2025)</span>
                    <b>{formatRupiah(city.benchmarks.umk)}</b>
                  </div>
                )}
                {city.benchmarks?.bpsMonthlyPerCapita && (
                  <div className="apple-kv">
                    <span className="text-[var(--mu)]">Rata-rata Pengeluaran BPS</span>
                    <b>{formatRupiah(city.benchmarks.bpsMonthlyPerCapita)}</b>
                  </div>
                )}
                {city.inflation?.value && (
                  <div className="apple-kv">
                    <span className="text-[var(--mu)]">Inflasi Tahunan Kota</span>
                    <b className="text-[var(--ac)]">{city.inflation.value}%</b>
                  </div>
                )}
              </div>
            </div>

            {/* SISA UANG MENURUT GAJI */}
            <div className="apple-card overflow-x-auto">
              <h3 className="apple-h3">Sisa Uang Menurut Besaran Gaji</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--bd)] text-[var(--mu)]">
                    <th className="py-2.5">Gaji Bersih</th>
                    <th className="py-2.5">Sisa / Bulan</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bd)]">
                  {[4, 6, 8, 12, 20].map((jt) => {
                    const inc = jt * 1000000;
                    const sim = calculateSimulation({
                      income: { netMonthly: inc },
                      cityId: city.id,
                      profile: 'single',
                      householdSize: 1,
                      expenses: {
                        housing: baseMonthlyExp * 0.4,
                        food: baseMonthlyExp * 0.35,
                        transportation: 300000,
                        utilities: 250000,
                        lifestyle: 300000,
                        financialObligations: 0,
                        other: 100000
                      }
                    });
                    return (
                      <tr key={jt}>
                        <td className="py-2.5 font-medium">Rp {jt} jt</td>
                        <td
                          className="py-2.5 font-semibold"
                          style={{ color: sim.remainingIncome < 0 ? 'var(--r)' : 'var(--ok)' }}
                        >
                          {formatRupiah(sim.remainingIncome)}
                        </td>
                        <td className="py-2.5">
                          <span className="apple-badge text-xs">
                            {sim.statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* SAMPEL SEWA KOST */}
            {benchmarks?.rentals && benchmarks.rentals.length > 0 && (
              <div className="apple-card">
                <h3 className="apple-h3">Sampel Rentang Sewa Hunian</h3>
                <div className="space-y-3">
                  {benchmarks.rentals.map((r: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-[var(--f)] rounded-xl flex justify-between items-center">
                      <div>
                        <b className="capitalize text-sm block">
                          {r.housingType.replace('_', ' ')}
                        </b>
                        <p className="text-xs text-[var(--mu)]">
                          Area: {r.area || 'Pusat Kota'}
                        </p>
                      </div>
                      <div className="text-right">
                        <b className="text-[var(--ac)] text-sm">
                          {formatRupiah(r.monthlyPriceMedian || r.monthlyPriceMin)} / bln
                        </b>
                        {r.monthlyPriceMin && r.monthlyPriceMax && (
                          <p className="text-xs text-[var(--mu)]">
                            {formatRupiah(r.monthlyPriceMin)} – {formatRupiah(r.monthlyPriceMax)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR FAST ACTIONS */}
          <aside className="apple-card lg:sticky lg:top-[68px]">
            <h3 className="apple-h3">Aksi Cepat</h3>
            <p className="text-[var(--mu)] text-xs mb-5 leading-relaxed">
              Mulai simulasi detail dengan memasukkan angka pengeluaran dan gaya hidup pribadimu.
            </p>

            <div className="space-y-3">
              <Link
                to={`/calculator?city=${city.id}`}
                className="apple-btn w-full justify-center text-sm"
              >
                Simulasikan Gajiku di {city.name}
              </Link>
              <Link
                to="/compare"
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Bandingkan Kota
              </Link>
              <Link
                to="/relocation"
                className="apple-btn apple-btn-secondary w-full justify-center text-sm"
              >
                Hitung Modal Pindah
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
