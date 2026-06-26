'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/10 text-brand-gray text-xs font-ui">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="font-display text-2xl font-bold tracking-widest text-white">
            VIBE<span className="text-brand-blue">NEST</span>
          </Link>
          <p className="text-white/60 leading-relaxed font-body text-sm max-w-sm">
            Crafting premium, modern, and high-fashion collections for the modern youth. Elevate your everyday style with curated apparel and footwear.
          </p>
          <div className="text-white/30 text-xs">
            © {new Date().getFullYear()} VibeNest Ltd. All rights reserved.
          </div>
        </div>

        {/* Collections Column */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">SHOP COLLECTIONS</h4>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/men-clothing" className="hover:text-brand-blue transition-colors">Men's Clothing</Link></li>
            <li><Link href="/women-clothing" className="hover:text-brand-blue transition-colors">Women's Clothing</Link></li>
            <li><Link href="/footwear" className="hover:text-brand-blue transition-colors">Footwear Shoes</Link></li>
            <li><Link href="/accessories" className="hover:text-brand-blue transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">CUSTOMER CARE</h4>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/help/orders" className="hover:text-brand-blue transition-colors">Track Your Order</Link></li>
            <li><Link href="/help/returns" className="hover:text-brand-blue transition-colors">Return Policy</Link></li>
            <li><Link href="/help/sizing" className="hover:text-brand-blue transition-colors">Sizing Guide</Link></li>
            <li><Link href="/help/contact" className="hover:text-brand-blue transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4 lg:col-span-1">
          <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">NEWSLETTER</h4>
          <p className="text-white/60 leading-relaxed text-[11px]">
            Subscribe to receive private sale updates, new arrivals details, and promotional rewards.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field py-2 text-xs"
              required
            />
            <button
              type="submit"
              className="btn-primary w-full py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
}
