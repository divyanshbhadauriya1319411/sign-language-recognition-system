import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SignBridge AI | Real-Time Indian Sign Language Recognition & Translation Platform',
  description: 'AI-powered real-time Indian Sign Language (ISL) recognition using temporal Bi-LSTM networks and MediaPipe 3D tracking with instant speech synthesis.',
  keywords: ['Sign Language', 'ISL', 'Indian Sign Language', 'AI', 'Real-Time Translation', 'Accessibility', 'WCAG AA', 'MediaPipe', 'PyTorch'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
