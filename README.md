# MandarinPath (汉语之路) — by `@skuvis_`

> **Platform Pembelajaran Bahasa Mandarin Terpersonalisasi Lintas Perangkat (Windows Web, Android, iOS) untuk Penutur Bahasa Indonesia**

MandarinPath dirancang khusus untuk memulihkan kelancaran percakapan (*conversational fluency*), menguasai penulisan guratan Hanzi, dan mempersiapkan ujian sertifikasi **HSK 1 hingga HSK 6 (serta HSK 3.0 Band 1–9)**. Aplikasi ini dibangun untuk pembelajar mandiri maupun pengguna publik yang membutuhkan sistem belajar terstruktur 20–30 menit per hari.

---

## 🌟 Fitur Utama & Keunggulan

1. **Kamus Lengkap HSK 1–6 (4.991 Kata) & HSK 3.0 Band 1–9 (10.969 Kata)**
   - Mencakup **100% kosakata silabus resmi HSK 2.0 Level 1–6** (`public/data/hsk/hsk2-1.json` s/d `hsk2-6.json`) dan **HSK 3.0 Band 1–9** (`public/data/hsk/hsk3-1.json` s/d `hsk3-7.json`).
   - Setiap entri dilengkapi: Hanzi Sederhana (*Simplified*), Hanzi Tradisional (*Traditional*), Pinyin bertanda nada akurat, terjemahan Bahasa Indonesia, definisi CC-CEDICT, kelas kata (*Part of Speech*), **214 Radikal Kangxi beserta penjelasan Bahasa Indonesia**, peringkat frekuensi korpus, audio pelafalan, serta tombol **"+ Dek SRS"** sekali klik.

2. **Lab Guratan & Kaligrafi Hanzi Interaktif (`/writing` & Modal Kosakata)**
   - Didukung oleh `hanzi-writer` di atas kanvas kisi kaligrafi tradisional **MiZiGe (米字格)**.
   - **Mode Animasi**: Memutar urutan guratan (*stroke order*) langkah demi langkah dengan pengaturan kecepatan (`0.5x`, `1x`, `2x`) dan tombol tampil/sembunyikan kerangka.
   - **Mode Uji Tulis & Pengecekan Real-Time**: Pengguna menggambar langsung menggunakan *mouse* (Windows), jari (Android/iOS), atau *stylus* (iPad/Tablet). Sistem memvalidasi arah dan urutan tiap guratan secara langsung, memberikan petunjuk visual saat salah, dan menyimpan skor akurasi ke profil.

3. **Laboratorium Pinyin, Kontur 4 Nada & Aturan Tone Sandhi (`/tones`)**
   - Visualisasi grafik SVG kontur tinggi-rendah suara (`55`, `35`, `214`, `51`).
   - **Matriks 20 Kombinasi Nada Dua Suku Kata** dengan audio interaktif.
   - **3 Aturan Perubahan Nada (*Tone Sandhi*)**: Nada 3+3 (`你好 nǐhǎo → níhǎo`), perubahan nada `不 (bù → bú)`, dan perubahan nada `一 (yī → yí / yì)`.
   - **Kuis Minimal Pairs (Ear-Training)**: Latihan membedakan pasangan kata yang mirip secara fonetik (`mā/má/mǎ/mà`, `mǎi/mài`, `shuìjiào/shuǐjiǎo`).

4. **Spaced Repetition System (SuperMemo SM-2) & Dek Kustom (`/vocabulary`)**
   - Algoritma SM-2 transparan yang menghitung interval hari, *ease factor*, dan jadwal review berikutnya berdasarkan 4 tombol evaluasi (*Ulangi / Sulit / Ingat / Mudah*).
   - Mendukung pintasan papan ketik (`Spasi` untuk balik kartu, `1–4` untuk nilai) dan integrasi langsung kanvas latihan tulis guratan di dalam kartu flashcard.

5. **Jalur Kurikulum Lengkap HSK 1–6 (`/curriculum`)**
   - Modul pelajaran terstruktur dari **HSK 1 hingga HSK 6** dengan dialog berkecepatan variabel, penjelasan tata bahasa Indonesia (konstruksi `把`, `是...的`, `比`, `不仅...而且`, `既...又`, dsb.), dan latihan rekonstruksi urutan kata.

6. **Lab Mendengarkan, Shadowing & Perekam Suara Mikrofon (`/listening`)**
   - Pemutar audio Web Speech API (`zh-CN`) dengan pengaturan kecepatan (`0.75x`, `1.0x`, `1.25x`) tanpa *autoplay* mendadak.
   - **Perekam Suara Asli (`MediaRecorder` API)**: Rekam suara Anda langsung di browser dan putar berdampingan dengan audio penutur asli untuk membandingkan intonasi secara objektif.

7. **Lintas Platform: Windows Web, Android & iOS PWA + Sinkronisasi Cloud (`/auth`)**
   - Dilengkapi Web App Manifest (`manifest.webmanifest`), Service Worker *offline caching* (`public/sw.js`), ikon dinamis resolusi tinggi, dan tata letak responsif (*desktop sidebar* + *mobile bottom navigation* dengan *iOS safe-area-inset*).
   - Mendukung pendaftaran akun publik & sinkronisasi lintas perangkat menggunakan **Supabase Auth & PostgreSQL RLS**.

---

## 🏗️ Arsitektur Aplikasi Step-by-Step (Alur Data End-to-End)

```text
[ Pengguna (Windows Web / Android / iOS PWA) ]
       │
       ▼
[ Next.js 14 App Router UI (React Server & Client Components) ]
       │
       ├──► [ Katalog HSK 1–6 & 3.0 (`src/lib/hsk/loader.ts`) ]
       │         └── Lazy-load & Cache JSON per level dari `/data/hsk/hsk2-*.json`
       │
       ├──► [ Mesin Guratan Hanzi (`src/components/writing/HanziStrokePad.tsx`) ]
       │         └── Render SVG MiZiGe + validasi vektor guratan via `hanzi-writer`
       │
       └──► [ Global State (`src/context/LearnerContext.tsx`) ]
                 │
                 ├──► [ Mesin SRS SM-2 (`src/lib/srs/sm2.ts`) ]
                 │         └── Hitung Ease Factor, Interval Hari & Next Review Date
                 │
                 └──► [ Lapisan Persistensi Hibrida (`src/lib/storage/storageManager.ts`) ]
                           ├── 1. Instan: Simpan ke `localStorage` (Offline-First)
                           └── 2. Cloud Sync (`src/lib/supabase/auth.ts`):
                                  Push/Pull Snapshot JSONB ke Supabase PostgreSQL (RLS)
```

---

## ⚙️ Panduan Menjalankan Proyek Secara Lokal (Step-by-Step)

### 1. Prasyarat
- Node.js versi 18.17+ (direkomendasikan Node.js v20 atau v22 LTS)
- npm versi 9+

### 2. Instalasi Dependensi
```powershell
npm install
```

### 3. Membangun Ulang Dataset HSK (Opsional — sudah terbangun di `public/data/hsk/`)
Jika Anda memperbarui kamus terjemahan di `public/data/hsk/id/`, jalankan:
```powershell
node scripts/build-hsk-data.mjs
```

### 4. Menjalankan Server Pengembangan
```powershell
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000). Aplikasi langsung berjalan penuh dalam **Mode Penyimpanan Lokal** bahkan sebelum Supabase dikonfigurasi.

### 5. Menjalankan Pengujian Otomatis (Vitest)
```powershell
npm test
```

### 6. Membangun Versi Produksi (*Production Build*)
```powershell
npm run build
npm run start
```

---

## ☁️ Konfigurasi Database Supabase (Untuk Login & Sinkronisasi Antar Perangkat)

1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor**, lalu jalankan isi berkas migrasi secara berurutan:
   - `supabase/migrations/20240101000000_init_schema.sql`
   - `supabase/migrations/20261028000000_progress_sync.sql`
3. Salin `.env.example` menjadi `.env.local` dan masukkan URL serta Anon Key proyek Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## 🚀 Deployment ke Vercel & Instalasi di Windows, Android, dan iOS

### Deploy ke Vercel
1. Push repositori ini ke GitHub Anda.
2. Buka [vercel.com/new](https://vercel.com/new) dan impor repositori `MandarinPath`.
3. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di bagian *Environment Variables* (opsional).
4. Klik **Deploy**.

### Cara Menginstal sebagai Aplikasi (PWA):
- **Windows (Chrome / Edge)**: Buka URL website → klik ikon **Install App ( komputer/plus )** di sisi kanan bilah alamat → klik **Install**.
- **Android (Chrome)**: Buka URL website → ketuk menu **⋮ (tiga titik)** di kanan atas → pilih **Tambahkan ke Layar Utama / Install Aplikasi**.
- **iOS / iPadOS (Safari)**: Buka URL website di Safari → ketuk tombol **Bagikan (Share)** di bawah → pilih **Tambahkan ke Layar Utama (Add to Home Screen)**.

---

## © Lisensi & Trademark
- Desain & Arsitektur Aplikasi: **MandarinPath** — Crafted by **`@skuvis_`**.
- Dataset Kosakata HSK & Definisi: CC-CEDICT (CC BY-SA 4.0) & Open HSK Dataset (MIT).
- Data Vektor Guratan Karakter: Hanzi Writer Data / Make Me a Hanzi (ARPHIC / LGPL).
