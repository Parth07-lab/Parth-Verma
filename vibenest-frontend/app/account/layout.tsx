'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, logout } = useAuthStore();

  // Route security: redirect to login if session token is missing
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-ui text-xs text-brand-gray">
        Verifying authorization credentials...
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', name: 'My Profile', href: '/account/profile', icon: User },
    { id: 'orders', name: 'Order History', href: '/account/orders', icon: ShoppingBag },
    { id: 'wishlist', name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { id: 'addresses', name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="bg-brand-darkGray/25 border border-white/5 p-6 rounded-lg space-y-6 font-ui">
          <div className="space-y-1">
            <h3 className="text-white font-bold text-base truncate">{user?.name}</h3>
            <p className="text-brand-gray text-xs truncate">{user?.email}</p>
          </div>

          <nav className="flex flex-col gap-1 border-t border-white/5 pt-4 text-xs font-semibold">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'bg-brand-blue text-white font-bold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content Box */}
        <div className="lg:col-span-3 bg-white/[0.01] border border-white/5 p-8 rounded-lg min-h-[50vh]">
          {children}
        </div>

      </div>
    </div>
  );
}
