import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { City, formatRupiah } from '@worthit/shared';

// Explicitly register worker URL so Vite serves it correctly
setWorkerUrl(maplibreWorkerUrl);

interface RealMapProps {
  cities: City[];
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
}

const BASEMAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

export const IndonesiaMap: React.FC<RealMapProps> = ({
  cities,
  selectedCityId,
  onSelectCity
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [mapMode, setMapMode] = useState<'pins' | 'heat'>('pins');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLE,
      center: [118.0149, -2.5489],
      zoom: 4.8,
      minZoom: 3.5,
      maxZoom: 16,
      attributionControl: false
    });

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Helper to get heat color based on BPS cost relative to national average
  const getCityHeatColor = (city: City) => {
    const cost = city.benchmarks?.bpsMonthlyPerCapita || 2000000;
    if (cost >= 2600000) return '#FF3B30'; // Red - Highest (Jakarta, Bekasi, etc)
    if (cost >= 2100000) return '#FF9500'; // Orange - Above average (Surabaya, Tangerang)
    if (cost >= 1800000) return '#007AFF'; // Blue - Moderate
    return '#34C759'; // Green - Most affordable (Solo, Jogja, dll)
  };

  // Sync city markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    cities.forEach((city) => {
      if (!city.coordinates?.latitude || !city.coordinates?.longitude) return;

      const isSelected = city.id === selectedCityId;
      const heatColor = getCityHeatColor(city);
      const markerBg = mapMode === 'heat' ? heatColor : (isSelected ? '#007AFF' : '#1D1D1F');

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none';
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: ${markerBg};
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 999px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            border: 2px solid #FFFFFF;
            white-space: nowrap;
            margin-bottom: 2px;
            transform: scale(${isSelected ? 1.08 : 0.95});
            transition: all 0.2s ease;
          ">
            ${city.name}${mapMode === 'heat' && city.benchmarks?.bpsMonthlyPerCapita ? ` · ${formatRupiah(city.benchmarks.bpsMonthlyPerCapita)}` : ''}
          </div>
          <div style="
            width: ${isSelected ? '14px' : '10px'};
            height: ${isSelected ? '14px' : '10px'};
            border-radius: 50%;
            background: ${markerBg};
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          "></div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectCity(city.id);
      });

      const marker = new Marker({ element: el, anchor: 'bottom' })
        .setLngLat([city.coordinates.longitude, city.coordinates.latitude])
        .addTo(map);

      markersRef.current[city.id] = marker;
    });

    // Fly camera smoothly to selected city
    const selectedCity = cities.find((c) => c.id === selectedCityId);
    if (selectedCity?.coordinates?.latitude && selectedCity?.coordinates?.longitude) {
      map.flyTo({
        center: [selectedCity.coordinates.longitude, selectedCity.coordinates.latitude],
        zoom: 6.8,
        essential: true,
        duration: 800
      });
    }
  }, [cities, selectedCityId, onSelectCity, mapMode]);

  return (
    <div className="apple-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div>
          <span className="text-xs font-semibold text-[var(--mu)] uppercase tracking-wider block">
            Peta Interaktif 30 Kota Indonesia
          </span>
          <span className="text-xs font-semibold text-[var(--ac)]">
            {cities.find((c) => c.id === selectedCityId)?.name || 'Pilih kota'} terpilih
          </span>
        </div>

        {/* Map Mode Toggle: Pin vs Heat Index */}
        <div className="apple-seg !mb-0 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setMapMode('pins')}
            className={mapMode === 'pins' ? 'on' : ''}
          >
            Pin Kota
          </button>
          <button
            type="button"
            onClick={() => setMapMode('heat')}
            className={mapMode === 'heat' ? 'on' : ''}
          >
            🔥 Heat Indeks Biaya
          </button>
        </div>
      </div>

      {mapMode === 'heat' && (
        <div className="flex items-center gap-3 text-[11px] mb-2 px-1 text-[var(--mu)]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#34C759]"></span> Terjangkau</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></span> Menengah</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9500]"></span> Cukup Tinggi</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></span> Tertinggi</span>
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="w-full h-[320px] rounded-xl overflow-hidden border border-[var(--bd)] relative z-0"
      />

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--bd)] max-h-28 overflow-y-auto">
        {cities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              city.id === selectedCityId
                ? 'bg-[var(--ac)] text-white shadow-sm'
                : 'bg-[var(--f)] text-[var(--tx)] border border-[var(--bd)] hover:opacity-80'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
