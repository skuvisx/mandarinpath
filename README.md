# MandarinPath (汉语之路)

> **Platform Pembelajaran Bahasa Mandarin Terpersonalisasi untuk Penutur Bahasa Indonesia**

MandarinPath dirancang khusus untuk memulihkan kelancaran percakapan (*conversational fluency*) dan mempersiapkan ujian sertifikasi HSK bagi pembelajar yang pernah mempelajari bahasa Mandarin (misalnya lulusan sekolah menengah / mahasiswa dengan latar belakang belajar ~12 tahun namun kemampuan lisan dan memori Hanzi/Pinyin sempat menurun).

Platform ini mengintegrasikan metode **Spaced Repetition (SuperMemo SM-2)**, **Laboratorium Menyimak & Shadowing**, **Penyusun Kalimat Interaktif**, serta **Simulasi Ujian HSK 3 Berwaktu**, dengan antarmuka modern berbahasa Indonesia dan dukungan mode **Demo Lokal (Offline-first)** tanpa ketergantungan wajib pada API eksternal berbayar.

---

## 🚀 Fitur Utama

1. **Diagnosis Kemampuan Awal (Informal Placement Assessment)**
   - 10 butir soal adaptif mendeteksi retensi Hanzi, nada Pinyin, struktur sintaksis, pemahaman bacaan, dan audio dialog.
   - Pilihan untuk melewati audio jika lingkungan peramban tidak mendukung suara.
   - Menghasilkan rekomendasi kurikulum personal (*starting path*) tanpa merendahkan pembelajar ke tingkat nol mutlak.
   - *Pemberitahuan resmi:* Berfungsi sebagai diagnosis internal, bukan ujian sertifikasi resmi Hanban/CTI.

2. **Beranda Belajar & Perencana 20–30 Menit Harian**
   - Rencana belajar harian terstruktur:
     1. *Review Kosakata Jatuh Tempo (SRS SM-2)*
     2. *Materi & Dialog Kurikulum Baru*
     3. *Lab Mendengarkan & Shadowing*
     4. *Penyusun Kalimat (Tata Bahasa)*
     5. *Kuis Evaluasi Singkat*
   - Pelacak rentetan belajar harian (*study streak*), cincin target belajar, dan kartu lanjutkan pelajaran.

3. **Kamus & Kartu Kosakata Spaced Repetition (SRS SM-2)**
   - Algoritma SuperMemo SM-2 menghitung interval hari, faktor kemudahan (*ease factor*), dan tanggal review berikutnya berdasarkan penilaian kualitas (Lupa, Sulit, Cukup, Mudah).
   - Penjelasan radikal, komponen karakter, etimologi, rekaman audio, dan kalimat contoh alami.
   - Pemisahan evaluasi pengenalan (*recognition*) dan ingatan aktif (*recall*).

4. **Jalur Kurikulum HSK 2.0 & 3.0 Bridge**
   - Transparansi versi kurikulum antara HSK 2.0 dan HSK 3.0 standar baru.
   - Dialog percakapan interaktif dengan pemutar audio per baris, sakelar sembunyikan/tampilkan Pinyin dan terjemahan Indonesia.
   - Bedah tata bahasa mendalam: pola 把, konstruksi 是...的, kalimat komparatif 比, dan penanda aspek 过 / 了.
   - Latihan urutan kata interaktif (*word order reconstructor*) dan pilihan ganda dengan umpan balik gramatikal langsung.

5. **Lab Mendengarkan & Shadowing (Pronunciation)**
   - Kontrol kecepatan audio (0.75x, 1.0x, 1.25x), pengulangan, transkrip bertahap.
   - Dukungan mesin Web Speech API bahasa Mandarin (`zh-CN`) dengan label transparan audio sintetis tanpa pemutaran otomatis tak terduga (*no unexpected autoplay*).
   - Latihan *shadowing* bertahap dengan evaluasi mandiri jujur (skala 1–5 bintang).

6. **Kuis Harian & Simulasi Ujian HSK 3 (Mock Exam)**
   - Simulasi berbatas waktu 15 menit dengan hitung mundur otomatis dan penguncian jawaban setelah dikumpulkan.
   - Buku Catatan Kesalahan (*Mistake Notebook / 错题本*) yang otomatis menyimpan soal yang salah dijawab untuk diuji ulang hingga tuntas.

7. **Analisis Progres, Pencadangan & Pengaturan**
   - Metrik riwayat nyata: total menit belajar, kosakata matang, persentase akurasi kuis, dan kalender aktivitas.
   - Ekspor dan impor data kemajuan dalam format berkas JSON mandiri.
   - Penyesuaian komitmen waktu harian (15, 20, 25, 30 menit) dan target level HSK.

---

## 🛠️ Arsitektur & Tumpukan Teknologi

- **Framework**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS dengan palet akademik profesional (Deep Navy `#0f172a`, Brand Blue `#0284c7`, Teal `#0d9488`)
- **Ikonografi**: Lucide Icons
- **State & Persistence**:
  - *Mode Demo Lokal*: LocalStorage + in-memory fallback yang sepenuhnya independen tanpa konfigurasi rumit.
  - *Cloud Persistence*: Supabase Auth & PostgreSQL dengan Row Level Security (RLS).
- **Pengujian**: Vitest untuk pengujian unit & integrasi algoritma SM-2, penyimpanan, dan validasi kurikulum.

---

## 📁 Struktur Direktori

```text
VISMandarinPath/
├── .env.example                       # Contoh variabel lingkungan
├── package.json                       # Konfigurasi dependensi dan skrip proyek
├── tailwind.config.ts                 # Konfigurasi tema dan tipografi warna
├── tsconfig.json                      # Konfigurasi TypeScript
├── vitest.config.ts                   # Konfigurasi test runner Vitest
│
├── supabase/
│   └── migrations/
│       └── 20240101000000_init_schema.sql  # Skema tabel PostgreSQL & kebijakan RLS
│
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout, metadata SEO, viewport & LearnerProvider
    │   ├── globals.css                # Utilitas CSS & font Hanzi
    │   ├── page.tsx                   # Beranda Belajar (Dashboard & 20-30 min plan)
    │   ├── diagnostic/page.tsx        # Penilaian Penempatan Awal
    │   ├── vocabulary/page.tsx        # Kamus & Kartu Kosakata SRS SM-2
    │   ├── curriculum/
    │   │   ├── page.tsx               # Ikhtisar modul kurikulum HSK
    │   │   └── [slug]/page.tsx        # Modul pelajaran interaktif & rekonstruksi kata
    │   ├── listening/page.tsx         # Lab Mendengarkan & Latihan Shadowing
    │   ├── grammar/page.tsx           # Laboratorium Penyusun Kalimat (Sentence Builder)
    │   ├── quiz/page.tsx              # Kuis Harian & Simulasi Ujian HSK 3 Berwaktu
    │   └── analytics/page.tsx         # Analisis Progres, Buku Kesalahan, Ekspor/Impor JSON
    │
    ├── components/
    │   ├── layout/
    │   │   └── AppShell.tsx           # Navigasi desktop sidebar & bottom mobile bar
    │   └── ui/
    │       ├── Button.tsx             # Komponen tombol serbaguna
    │       ├── Card.tsx               # Kontainer kartu terstandar
    │       ├── Badge.tsx              # Label status warna-warni
    │       └── AudioPlayerButton.tsx  # Pemutar audio sintetis Web Speech API
    │
    ├── context/
    │   └── LearnerContext.tsx         # Context API manajemen status global pelajar
    │
    ├── data/
    │   ├── vocabulary.ts              # Data kosakata terverifikasi (HSK 1-4)
    │   ├── lessons.ts                 # Modul kurikulum, dialog, dan tata bahasa
    │   ├── diagnostic.ts              # 10 butir instrumen soal diagnostik penempatan
    │   └── mockExam.ts                # Bank soal simulasi ujian HSK 3 (Tīnglì, Yuèdú, Yǔfǎ)
    │
    ├── lib/
    │   ├── srs/
    │   │   ├── sm2.ts                 # Implementasi algoritma SuperMemo SM-2
    │   │   └── sm2.test.ts            # 7 unit test algoritma SM-2
    │   ├── audio/
    │   │   └── tts.ts                 # Service Web Speech API Mandarin zh-CN
    │   ├── storage/
    │   │   ├── storageManager.ts      # Abstraksi persistensi hibrida (Local + Cloud)
    │   │   └── storageManager.test.ts # 6 test integrasi penyimpanan data
    │   └── supabase/
    │       └── client.ts              # Inisialisasi klien Supabase aman tanpa crash
    │
    └── types/
        └── index.ts                   # Definisi tipe data TypeScript terpusat
```

---

## 🗄️ Skema Database PostgreSQL (Supabase)

Tersedia berkas migrasi lengkap di `supabase/migrations/20240101000000_init_schema.sql` yang mencakup:

| Tabel | Deskripsi | Akses RLS |
| :--- | :--- | :--- |
| `curriculums` | Metadata versi kurikulum (HSK 2.0 / 3.0) | Publik (Read-Only) |
| `vocabulary` | Daftar kosakata, radikal, arti ID, kalimat contoh | Publik (Read-Only) |
| `lessons` | Modul pelajaran, dialog, tata bahasa, latihan | Publik (Read-Only) |
| `profiles` | Data profil pembelajar, komitmen harian, target ujian | Privat (Hanya Pemilik) |
| `user_vocabulary_progress` | Status kartu SRS SM-2 (interval, ease factor, review date) | Privat (Hanya Pemilik) |
| `user_lesson_progress` | Status penyelesaian dan nilai tiap modul | Privat (Hanya Pemilik) |
| `quiz_attempts` | Riwayat pengerjaan kuis dan simulasi ujian | Privat (Hanya Pemilik) |
| `user_mistakes` | Buku catatan kesalahan (*Mistake Bank*) | Privat (Hanya Pemilik) |
| `study_sessions` | Riwayat durasi aktivitas harian untuk rentetan (*streak*) | Privat (Hanya Pemilik) |

---

## ⚙️ Panduan Menjalankan Proyek Secara Lokal (Windows)

### 1. Prasyarat
- Node.js versi 18+ (direkomendasikan Node.js v20 atau v24)
- npm versi 9+

### 2. Instalasi Dependensi
Jalankan di PowerShell:
```powershell
npm install
```

### 3. Menjalankan Server Pengembangan
```powershell
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000). Aplikasi langsung dapat digunakan dalam **Mode Demo Lokal** tanpa perlu konfigurasi Supabase awal.

### 4. Menjalankan Pengujian Unit & Integrasi
```powershell
npm test
```
Semua 17 butir pengujian (algoritma SM-2, persistensi data, validasi konten kurikulum) akan dieksekusi menggunakan Vitest.

### 5. Membangun Versi Produksi (*Production Build*)
```powershell
npm run build
npm run start
```

---

## 🌐 Konfigurasi Supabase (Opsional untuk Sinkronisasi Cloud)

Jika ingin menghubungkan akun Supabase:
1. Buat proyek baru di [database.new](https://database.new).
2. Masuk ke menu **SQL Editor** di dasbor Supabase, lalu salin dan jalankan seluruh isi berkas `supabase/migrations/20240101000000_init_schema.sql`.
3. Buat berkas `.env.local` di root proyek dan isi kredensial anonim:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Jalankan ulang server. Badge di header akan otomatis berubah menjadi **"Supabase Terhubung"**.

---

## 🚀 Panduan Penerbitan ke Vercel (Deployment)

Aplikasi dirancang agar langsung siap di-deploy ke Vercel (subdomain gratis `*.vercel.app`):

### Opsi A: Melalui Dasbor Web Vercel
1. Unggah kode ke repositori GitHub pribadi/publik Anda.
2. Buka [vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Hubungkan repositori GitHub `MandarinPath`.
4. Pada bagian *Environment Variables*, tambahkan variabel dari `.env.example` (jika menggunakan Supabase) atau biarkan kosong untuk mode Demo Lokal instan.
5. Klik **Deploy**. Vercel akan otomatis mendeteksi konfigurasi Next.js dan menghasilkan URL seperti `https://mandarinpath.vercel.app`.

### Opsi B: Menggunakan Vercel CLI
```powershell
npm install -g vercel
vercel login
vercel
vercel --prod
```

---

## 🛣️ Peta Jalan Pengembangan Berikutnya (Roadmap)

- [ ] **Pemberian Skor Pelafalan Otomatis (Speech Evaluation API)**: Integrasi Azure Cognitive Services atau Whisper untuk analisis fonetik dan nada pinyin presisi tinggi.
- [ ] **HSK 4 & 5 Expansion**: Penambahan 1.200 kosakata lanjutan dan format soal esai menyusun kalimat HSK 4/5.
- [ ] **Sesi Obrolan Terbimbing AI Tutor**: Simulasi dialog skenario bebas dengan umpan balik gramatikal *real-time*.
- [ ] **Notifikasi Pengingat Belajar Harian**: Web Push Notification sesuai jam belajar komitmen pengguna.
