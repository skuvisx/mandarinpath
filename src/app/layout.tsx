import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LearnerProvider } from '@/context/LearnerContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MandarinPath | Platform Pembelajaran Bahasa Mandarin untuk Penutur Indonesia',
  description: 'Program belajar terpersonalisasi untuk memulihkan kelancaran percakapan Mandarin dan persiapan sertifikasi HSK.',
  keywords: ['Mandarin', 'Bahasa Mandarin', 'HSK', 'Belajar Hanzi', 'Pinyin', 'Spaced Repetition', 'Kursus Mandarin'],
  authors: [{ name: 'MandarinPath Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
