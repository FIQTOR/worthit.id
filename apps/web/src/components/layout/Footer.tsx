import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="max-w-[1080px] mx-auto mt-12 px-5 py-8 pb-24 border-t border-[var(--bd)] text-[var(--mu)] text-[13px]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-[19px] tracking-[-0.4px] text-[var(--tx)]">
            Worth<b className="text-[var(--ac)]">It</b>
          </div>
          <p className="mt-2 max-w-[300px] leading-relaxed">
            Simulasi biaya hidup di 30 kota Indonesia. Gratis, tanpa akun, tanpa AI spekulatif.
          </p>
        </div>

        <div>
          <b className="block text-[var(--tx)] mb-2 font-semibold">Fitur</b>
          <div className="space-y-1">
            <Link to="/calculator" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Kalkulator Biaya
            </Link>
            <Link to="/reverse-calculator" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Target Gaji (Reverse)
            </Link>
            <Link to="/job-offer" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Tawaran Kerja Luar Kota
            </Link>
            <Link to="/compare" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Bandingkan Kota
            </Link>
            <Link to="/relocation" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Modal Relokasi
            </Link>
          </div>
        </div>

        <div>
          <b className="block text-[var(--tx)] mb-2 font-semibold">Informasi</b>
          <div className="space-y-1">
            <Link to="/cities" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Daftar Kota
            </Link>
            <Link to="/methodology" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Metodologi Data
            </Link>
            <Link to="/result" className="block py-0.5 hover:text-[var(--ac)] transition-colors">
              Hasil Terakhir
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-7 pt-4 border-t border-[var(--bd)]">
        <span>© {new Date().getFullYear()} WorthIt Indonesia · simulasi biaya hidup non-komersial</span>
        <span>Sumber: BPS, Kemnaker, PLN, riset pasar terbuka</span>
      </div>
    </footer>
  );
}
