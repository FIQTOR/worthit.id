import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--nav)] border-b border-[var(--bd)]">
      <div className="max-w-[1080px] mx-auto px-5 h-[52px] flex items-center justify-between">
        <Link to="/" className="font-semibold text-[19px] tracking-[-0.4px]">
          Worth<b className="text-[var(--ac)]">It</b>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-[2px]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'text-[var(--ac)] bg-[var(--f)]'
                  : 'text-[var(--mu)] hover:text-[var(--tx)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[var(--ac)] focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--bd)] bg-[var(--c)] px-5 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${
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
