'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import IonIcon from '../shared/IonIcon';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/supplier/dashboard',
    icon: 'speedometer-outline',
  },
  {
    title: 'Products',
    href: '/supplier/products',
    icon: 'cube-outline',
  },
  {
    title: 'Add Product',
    href: '/supplier/products/add',
    icon: 'add-circle-outline',
  },
  {
    title: 'Categories',
    href: '/supplier/categories',
    icon: 'pricetags-outline',
  },
  {
    title: 'Inquiries',
    href: '/supplier/inquiries',
    icon: 'mail-outline',
  },
  {
    title: 'Profile',
    href: '/supplier/profile',
    icon: 'person-outline',
  },
  {
    title: 'Settings',
    href: '/supplier/settings',
    icon: 'settings-outline',
  },
];

export default function SupplierSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Clear session/token
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <IonIcon name={isMobileMenuOpen ? 'close' : 'menu'} className="text-2xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-gray-200 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="mb-8 px-3">
            <Link href="/supplier/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Aromara</span>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Supplier
              </span>
            </Link>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-3 rounded-lg group transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IonIcon
                      name={item.icon}
                      className={`text-xl ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                    />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <IonIcon name="log-out-outline" className="text-xl" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
