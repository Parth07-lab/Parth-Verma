'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, ShoppingCart, Users, BadgePercent, LogOut, Package, ShieldAlert 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminToken, admin, adminLogout } = useAuthStore();

  const isLoginPage = pathname === '/admin/login';

  // Secure admin routing
  useEffect(() => {
    if (!adminToken && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [adminToken, isLoginPage]);

  // Do not wrap layout if on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center font-ui text-xs text-brand-gray">
        Securing administrator routing credentials...
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Stats', href: '/admin', icon: LayoutDashboard },
    { id: 'products', name: 'Products Catalog', href: '/admin/products', icon: Package },
    { id: 'orders', name: 'Orders Queue', href: '/admin/orders', icon: ShoppingCart },
    { id: 'users', name: 'Customer Database', href: '/admin/users', icon: Users },
    { id: 'coupons', name: 'Promotions Coupons', href: '/admin/coupons', icon: BadgePercent },
  ];

  return (
    <div className="min-h-screen bg-brand-black flex flex-col font-ui text-sm">
      {/* Top Admin Header */}
      <header className="h-16 bg-brand-darkGray/40 border-b border-white/5 flex items-center justify-between px-6 z-20">
        <Link href="/admin" className="font-display text-lg font-bold tracking-widest text-white flex items-center gap-1.5">
          VIBENEST <span className="bg-brand-blue/10 text-brand-blue font-ui text-[9px] font-bold border border-brand-blue/20 px-2 py-0.5 rounded">PORTAL</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-white/80">
          <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-bold px-2 py-0.5 rounded uppercase text-[10px]">
            {admin?.role.replace('_', ' ')}
          </span>
          <span className="font-semibold">{admin?.email}</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-brand-darkGray/15 border-r border-white/5 p-6 space-y-6">
          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
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
                adminLogout();
                router.push('/admin/login');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
            >
              <LogOut size={16} />
              Portal Exit
            </button>
          </nav>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-8 bg-brand-black overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
