# WorthIt Indonesia

**Tagline:** Gaji kamu cukup untuk hidup di kota mana?

Platform simulasi biaya hidup dan perbandingan kota di Indonesia.

## Fitur Utama

- **Kalkulator Biaya Hidup**: Simulasikan pengeluaran bulanan berdasarkan gaji dan kota tujuan
- **Perbandingan Kota**: Bandingkan biaya hidup di berbagai kota Indonesia
- **Data Transparan**: Sumber data dari BPS, Kemnaker, dan riset pasar terverifikasi
- **Gratis & No Login**: Tidak perlu registrasi akun

## Teknologi

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS (Apple iOS-inspired design)
- Zustand (state management)
- Recharts (visualisasi data)
- React Router

### Backend
- Express.js + TypeScript
- Zod validation
- Helmet security
- Rate limiting
- Static JSON datasets

### Shared Package
- Calculation engine
- TypeScript types
- Zod schemas
- Utility functions

## Setup Development

```bash
# Install dependencies
npm install

# Build shared package
npm --workspace=@worthit/shared run build

# Run backend API (terminal 1)
npm --workspace=@worthit/api run dev

# Run frontend (terminal 2)
npm --workspace=@worthit/web run dev
```

Backend: http://localhost:3001
Frontend: http://localhost:3000

## Project Structure

```
worthit-indonesia/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared calculations & types
├── datasets/         # JSON data files
│   ├── cities.json
│   ├── rental-prices.json
│   ├── expenditure-benchmarks.json
│   ├── food-prices.json
│   ├── transport-prices.json
│   ├── utilities.json
│   ├── minimum-wages.json
│   └── sources.json
└── docs/
```

## Sumber Data

1. **Badan Pusat Statistik (BPS)**
   - Survei Biaya Hidup 2022
   - Pengeluaran Konsumsi Penduduk Indonesia 2025
   - IHK 150 Kabupaten/Kota

2. **Kementerian Ketenagakerjaan RI**
   - UMP/UMK 2025

3. **PT PLN (Persero)**
   - Tarif listrik resmi

4. **Riset Pasar Terbuka**
   - Harga sewa hunian (manual curation)

## Testing

```bash
# Run calculation tests
npm --workspace=@worthit/shared run test

# Typecheck all packages
npm run typecheck
```

## Build Production

```bash
npm run build
```

## Deployment (Cloudflare Pages)

Aplikasi ini adalah Single Page Application (SPA) murni tanpa ketergantungan server runtime.

### Konfigurasi Cloudflare Pages:
- **Framework preset:** `Vite` (atau `None`)
- **Build command:** `npm run build`
- **Build output directory:** `apps/web/dist`
- **Root directory:** `/`

Redirects rule untuk routing SPA sudah disediakan otomatis di `apps/web/public/_redirects` (`/*  /index.html  200`).

## Metodologi Perhitungan

### Total Pengeluaran Bulanan
```
Total = Tempat Tinggal + Makanan + Transportasi + Utilitas + Gaya Hidup + Kewajiban + Lainnya
```

### Tingkat Tabungan
```
Tingkat Tabungan = (Sisa / Gaji Bersih) × 100%
```

### Gaji Minimum untuk Target Tabungan
```
Gaji Minimum = Total Pengeluaran / (1 - Target Tabungan %)
```

## Status Keuangan

- **Defisit**: Pengeluaran > Pemasukan
- **Sangat Terbatas**: Tabungan < 10%
- **Cukup Ketat**: Tabungan 10-19%
- **Cukup Sehat**: Tabungan 20-29%
- **Ruang Menabung Besar**: Tabungan ≥ 30%

## Kota yang Tersedia

- Jakarta
- Surabaya
- Bandung
- Yogyakarta
- Semarang
- Medan
- Makassar
- Denpasar

## Prinsip Transparansi

1. Tidak ada data yang difabrikasi
2. Semua sumber data dicantumkan
3. Data yang tidak tersedia ditandai dengan jelas
4. Pengguna dapat menyesuaikan semua kategori pengeluaran
5. Perhitungan deterministik, bukan AI spekulatif

## License

Personal project for non-commercial use.

## Contact

Platform simulasi biaya hidup non-komersial.
Data bersumber dari publikasi resmi pemerintah dan riset pasar terbuka.
