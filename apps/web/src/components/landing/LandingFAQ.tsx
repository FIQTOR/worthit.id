import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, splitTextIntoSpans } from '@/utils/gsapAnimations';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Datanya bersumber dari mana?',
    a: 'Dari publikasi resmi BPS (Survei Biaya Hidup & IHK), JDIH Kemnaker (SK Gubernur UMK 2025), PLN, dan kurasi pasar hunian terbuka.'
  },
  {
    q: 'Apakah angkanya bersifat mutlak?',
    a: 'Angka merupakan estimasi baseline acuan. Seluruh nominal pengeluaran dapat kamu sesuaikan sesuai gaya hidup dan pengeluaran aktual.'
  },
  {
    q: 'Perlu mendaftar atau login akun?',
    a: 'Tidak sama sekali. Semua fitur 100% gratis dan data simulasi disimpan di perangkat pengguna secara lokal.'
  },
  {
    q: 'Apakah perhitungan menggunakan AI spekulatif?',
    a: 'Tidak. Semua kalkulasi bersifat deterministik matematis dan mengacu pada regulasi resmi pemerintah.'
  }
];

export function LandingFAQ() {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const ctaTitleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    if (ctaTitleRef.current) {
      splitTextIntoSpans(ctaTitleRef.current);
    }

    const ctx = gsap.context(() => {
      // Parallax scale & border radius transition on CTA
      gsap.from(ctaRef.current, {
        scale: 0.92,
        borderRadius: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 100%',
          end: 'top 55%',
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* TIGA LANGKAH */}
      <section className="mt-16">
        <h2 className="apple-h2">Tiga langkah mudah</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            {
              num: '1',
              title: 'Isi gaji & kota',
              desc: 'Tentukan gaji bersih dan kota tujuanmu.',
              color: 'var(--ac)'
            },
            {
              num: '2',
              title: 'Atur pengeluaran',
              desc: 'Pakai estimasi dataset atau edit bebas.',
              color: 'var(--w)'
            },
            {
              num: '3',
              title: 'Lihat sisa & tabungan',
              desc: 'Cek proyeksi tahunan dan komparasi.',
              color: 'var(--ok)'
            }
          ].map((step) => (
            <div key={step.num} className="card border border-[var(--bd)]">
              <div
                className="w-11 h-11 rounded-[11px] grid place-items-center text-white mb-3 text-lg font-bold shadow-sm"
                style={{ background: step.color }}
              >
                {step.num}
              </div>
              <h3 className="apple-h3 !mb-1 text-[var(--tx)]">{step.title}</h3>
              <p className="text-[var(--mu)] text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="mt-16" id="faq">
        <h2 className="apple-h2">Pertanyaan umum</h2>
        <div className="card divide-y divide-[var(--bd)] border border-[var(--bd)]">
          {FAQS.map((faq, idx) => (
            <details key={idx} className="py-3.5 group cursor-pointer">
              <summary className="font-semibold flex justify-between items-center list-none select-none text-[var(--tx)]">
                {faq.q}
                <svg
                  className="w-4 h-4 text-[var(--mu)] transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-[var(--mu)] text-sm mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="mt-16">
        <div
          ref={ctaRef}
          className="cta-banner shadow-xl"
        >
          <h2 ref={ctaTitleRef}>
            Cek gajimu sekarang
          </h2>
          <p>
            Hanya butuh 1 menit untuk mengetahui kesehatan finansialmu di kota tujuan.
          </p>
          <div className="flex justify-center">
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[var(--ac)] hover:bg-neutral-100 font-bold text-base shadow-lg transition-transform hover:scale-105 active:scale-95 no-underline"
            >
              Mulai Simulasi
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
