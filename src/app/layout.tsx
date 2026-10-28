import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LearnerProvider } from '@/context/LearnerContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MandarinPath | Belajar Mandarin & Kamus Lengkap HSK 1–6 (@skuvis_)',
  description:
    'Platform belajar bahasa Mandarin untuk penutur Indonesia: 4.991 kata HSK 1–6 & 10.969 kata HSK 3.0, latihan menulis guratan Hanzi, pelatih nada, Spaced Repetition SM-2, dan simulasi ujian HSK. Kompatibel di Windows, Android, dan iOS.',
  keywords: [
    'Mandarin',
    'Bahasa Mandarin',
    'HSK 1-6',
    'HSK 3.0',
    'Belajar Hanzi',
    'Urutan Guratan Hanzi',
    'Pinyin',
    'Spaced Repetition',
    '@skuvis_',
  ],
  authors: [{ name: '@skuvis_' }],
  creator: '@skuvis_',
  publisher: '@skuvis_',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MandarinPath',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0b1f3a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased font-sans min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-100 selection:text-brand-900">
        <LearnerProvider>
          <AppShell>{children}</AppShell>
        </LearnerProvider>
      </body>
    </html>
  );
}
