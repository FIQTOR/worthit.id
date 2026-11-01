import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/calculator', label: 'Kalkulator' },
    { to: '/reverse-calculator', label: 'Target Gaji' },
    { to: '/job-offer', label: 'Tawaran Kerja' },
    { to: '/compare', label: 'Bandingkan' },
    { to: '/relocation', label: 'Modal Relokasi' },
    { to: '/cities', label: 'Kota' },
    { to: '/methodology', label: 'Metodologi' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--nav)] border-b border-[var(--bd)] transition-colors duration-200">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-5 h-[56px] flex items-center justify-between gap-2">
        <Link to="/" className="font-bold text-[19px] tracking-[-0.4px] text-[var(--tx)] flex items-center gap-1.5 shrink-0">
          <span>Worth</span><span className="text-[var(--ac)]">It</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-[2px]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'text-[var(--ac)] bg-[var(--f)]'
                  : 'text-[var(--mu)] hover:text-[var(--tx)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side controls: Theme toggle + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ubah tema"
            className="w-9 h-9 rounded-full bg-[var(--f)] text-[var(--tx)] flex items-center justify-center hover:opacity-80 active:scale-95 transition"
            title={resolvedTheme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
          >
            {resolvedTheme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-[var(--tx)] hover:text-[var(--ac)] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--bd)] bg-[var(--c)] px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'text-[var(--ac)] bg-[var(--f)] font-semibold'
                  : 'text-[var(--tx)] hover:bg-[var(--f)]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

