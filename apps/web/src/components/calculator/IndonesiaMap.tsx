import React, { useEffect, useRef } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { City } from '@worthit/shared';

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

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none';
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: ${isSelected ? '#007AFF' : '#1D1D1F'};
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
            ${city.name}
          </div>
          <div style="
            width: ${isSelected ? '14px' : '10px'};
            height: ${isSelected ? '14px' : '10px'};
            border-radius: 50%;
            background: ${isSelected ? '#007AFF' : '#FFFFFF'};
            border: 2.5px solid ${isSelected ? '#FFFFFF' : '#007AFF'};
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
  }, [cities, selectedCityId, onSelectCity]);

  return (
    <div className="w-full bg-surface rounded-2xl p-4 border border-border relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Pilih Kota di Peta Interaktif
        </span>
        <span className="text-xs font-semibold text-accent">
          {cities.find((c) => c.id === selectedCityId)?.name || 'Pilih kota'} terpilih
        </span>
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-[340px] rounded-xl overflow-hidden border border-border relative z-0"
      />

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/60">
        {cities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
              city.id === selectedCityId
                ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                : 'bg-surface text-text-primary border border-border hover:bg-gray-50'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
