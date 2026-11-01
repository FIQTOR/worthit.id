import { LivingProfileType } from '@worthit/shared';

export interface PresetItem {
  icon: 'user' | 'job' | 'heart' | 'house';
  title: string;
  desc: string;
  income: number;
  prof: LivingProfileType;
  city: string;
  color: string;
  hh: number;
}

interface LandingPresetsProps {
  presets: PresetItem[];
  onApplyPreset: (p: PresetItem) => void;
}

export function LandingPresets({ presets, onApplyPreset }: LandingPresetsProps) {
  return (
    <section className="mt-14">
      <h2 className="apple-h2">Mulai dari situasimu</h2>
      <p className="text-[var(--mu)] text-sm -mt-2 mb-5">
        Satu klik, profil dan angka awal langsung terisi di kalkulator.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {presets.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onApplyPreset(p)}
            className="apple-card text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform border border-[var(--bd)]"
          >
            <div
              className="w-11 h-11 rounded-[11px] grid place-items-center text-white mb-3 shadow-sm"
              style={{ background: p.color }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {p.icon === 'user' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                )}
                {p.icon === 'job' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                )}
                {p.icon === 'heart' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                )}
                {p.icon === 'house' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                )}
              </svg>
            </div>
            <h3 className="apple-h3 !mb-1 text-[var(--tx)]">{p.title}</h3>
            <p className="text-[var(--mu)] text-sm">{p.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
