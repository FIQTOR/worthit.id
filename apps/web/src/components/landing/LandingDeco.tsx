export function LandingDeco() {
  return (
    <div className="deco" aria-hidden="true">
      {/* 1. Housing icon */}
      <div className="dc" style={{ top: '8%', left: '-58px', ['--r' as any]: '-12deg', ['--k' as any]: 'var(--ac)' }}>
        <svg viewBox="0 0 24 24">
          <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
        </svg>
      </div>

      {/* 2. Coin / Rupiah finance icon */}
      <div className="dc" style={{ top: '20%', right: '-56px', ['--r' as any]: '10deg', ['--k' as any]: 'var(--ok)' }}>
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.8 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5" />
        </svg>
      </div>

      {/* 3. Food & cutlery icon */}
      <div className="dc" style={{ top: '38%', left: '-52px', ['--r' as any]: '8deg', ['--k' as any]: 'var(--w)' }}>
        <svg viewBox="0 0 24 24">
          <path d="M6 3v7c0 1.1.9 2 2 2s2-.9 2-2V3M8 3v18M17 21V3c-2 2-3 4.5-3 8h3" />
        </svg>
      </div>

      {/* 4. Commute vehicle icon */}
      <div className="dc" style={{ top: '54%', right: '-60px', ['--r' as any]: '-9deg', ['--k' as any]: 'var(--b)' }}>
        <svg viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="14" rx="3" />
          <path d="M4 11h16M7 17v3M17 17v3" />
          <circle cx="8" cy="14" r="0.6" />
          <circle cx="16" cy="14" r="0.6" />
        </svg>
      </div>

      {/* 5. Location pin icon */}
      <div className="dc" style={{ top: '70%', left: '-56px', ['--r' as any]: '-8deg', ['--k' as any]: 'var(--r)' }}>
        <svg viewBox="0 0 24 24">
          <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </div>

      {/* 6. Growth chart icon */}
      <div className="dc" style={{ top: '86%', right: '-52px', ['--r' as any]: '12deg', ['--k' as any]: 'var(--ac)' }}>
        <svg viewBox="0 0 24 24">
          <path d="M5 20v-8M12 20V5M19 20v-9" />
        </svg>
      </div>
    </div>
  );
}
