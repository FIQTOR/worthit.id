import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { formatRupiah } from '@worthit/shared';

const REGIONS = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'];

const getRegion = (province: string) => {
  if (/Jakarta|Jawa|Yogya|Banten/.test(province)) return 'Jawa';
  if (/Sumatera|Riau|Aceh|Lampung|Jambi/.test(province)) return 'Sumatera';
  if (/Kalimantan/.test(province)) return 'Kalimantan';
  if (/Sulawesi/.test(province)) return 'Sulawesi';
  if (/Bali|Nusa Tenggara|NTB|NTT/.test(province)) return 'Bali & Nusa Tenggara';
  return 'Maluku & Papua';
};

export function CitiesPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    apiService.getCities().then((res) => {
      setCities(res.data || []);
    });
  }, []);

  const filteredCities = cities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || getRegion(c.province) === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <>
      <Helmet>
        <title>Daftar Kota – WorthIt Indonesia</title>
        <meta
          name="description"
          content="Jelajahi biaya hidup 30 kota di Indonesia dari Sabang sampai Merauke."
        />
      </Helmet>

      <div className="max-w-[1080px] mx-auto px-5 pt-8 pb-20">
        <h1 className="apple-h1 mb-2">Daftar Kota</h1>
        <p className="apple-sub !mt-0 !mb-8">
          {cities.length} kota dari Sumatera sampai Papua. Pilih kota untuk melihat rincian biaya hidup.
        </p>

        {/* SEARCH & REGION FILTERS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Cari nama kota atau provinsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="apple-input-raw bg-[var(--f)] rounded-xl px-4 py-2.5 w-full sm:max-w-[280px]"
          />

          <div className="apple-chips !max-h-none overflow-x-auto w-full">
            <button
              type="button"
              onClick={() => setSelectedRegion('')}
              className={`apple-chip ${selectedRegion === '' ? 'on' : ''}`}
            >
              Semua
            </button>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`apple-chip ${selectedRegion === r ? 'on' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* CITIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCities.map((city) => (
            <Link
              key={city.id}
              to={`/cities/${city.id}`}
              className="apple-card hover:scale-[1.02] active:scale-[0.98] transition-transform block"
            >
              <h3 className="apple-h3 !mb-0 flex items-center gap-1.5">
                <span className="text-[var(--ac)] text-sm">📍</span>
                {city.name}
              </h3>
              <p className="text-[var(--mu)] text-xs mt-0.5">{city.province}</p>

              <div className="mt-4 pt-3 border-t border-[var(--bd)] flex justify-between items-center text-xs">
                <span className="text-[var(--mu)]">Est. Hidup Sendiri</span>
                <b className="text-[var(--tx)]">
                  ≈ {formatRupiah(city.benchmarks?.bpsMonthlyPerCapita ? city.benchmarks.bpsMonthlyPerCapita * 1.5 : 2500000)}
                </b>
              </div>
            </Link>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <p className="text-center text-[var(--mu)] py-12">
            Tidak ada kota yang cocok dengan pencarian "{searchQuery}".
          </p>
        )}
      </div>
    </>
  );
}
