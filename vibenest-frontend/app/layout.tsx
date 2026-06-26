import React from 'react';
import type { Metadata } from 'next';
import { Inter, Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | VibeNest — Premium Fashion & Lifestyle',
    default: 'VibeNest | Premium Fashion, Footwear & Accessories',
  },
  description: 'Shop luxury clothing, footwear, and accessories at VibeNest. Designed with modern minimalism, premium materials, and custom tailored styles.',
  keywords: 'vibenest, luxury fashion, clothing, streetwear, sneakers, accessories, mens clothing, womens clothing',
  authors: [{ name: 'VibeNest Development' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  themeColor: '#0D0D0D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable} h-full`}>
      <body className="flex flex-col min-h-screen bg-brand-black text-brand-white antialiased">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
