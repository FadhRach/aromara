'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { showAlert } from '@/lib/sweetalert'
import IonIcon from '@/components/shared/IonIcon'

interface AdminSidebarProps {
  user: any
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    showAlert.confirm('Logout', 'Apakah Anda yakin ingin keluar?', 'Ya, Logout', 'Batal')
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('user')
          router.push('/login')
        }
      })
  }

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-[#252F24] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Aromara</h1>
        <p className="text-xs text-white/60">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link 
          href="/admin/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            isActive('/admin/dashboard') 
              ? 'bg-[#E8F5D5] text-[#252F24]' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="grid" />
          <span>Dashboard</span>
        </Link>
        
        <div className="pt-4 pb-2 px-4">
          <p className="text-xs text-white/40 font-semibold">MANAGEMENT</p>
        </div>
        
        <Link 
          href="/admin/suppliers" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/suppliers') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="business" />
          <span>Suppliers</span>
        </Link>
        <Link 
          href="/admin/buyers" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/buyers') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="people" />
          <span>Buyers</span>
        </Link>
        
        <div className="pt-4 pb-2 px-4">
          <p className="text-xs text-white/40 font-semibold">PRODUCTS</p>
        </div>
        
        <Link 
          href="/admin/products" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/products') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="cube" />
          <span>All Products</span>
        </Link>
        <Link 
          href="/admin/categories" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/categories') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="pricetags" />
          <span>Categories</span>
        </Link>
        
        <div className="pt-4 pb-2 px-4">
          <p className="text-xs text-white/40 font-semibold">TRANSACTIONS</p>
        </div>
        
        <Link 
          href="/admin/inquiries" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/inquiries') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="mail" />
          <span>Inquiries</span>
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">45</span>
        </Link>
        <Link 
          href="/admin/orders" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActive('/admin/orders') 
              ? 'bg-[#E8F5D5] text-[#252F24] font-medium' 
              : 'hover:bg-white/10'
          }`}
        >
          <IonIcon name="cart" />
          <span>Orders</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link 
          href="/admin/profile" 
          className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg ${
            isActive('/admin/profile') 
              ? 'bg-[#E8F5D5] text-[#252F24]' 
              : 'hover:bg-white/10'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#E8F5D5] flex items-center justify-center">
            <IonIcon name="person" style={{ fontSize: '18px', color: '#252F24' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-white/60">Profile Settings</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          <IonIcon name="log-out" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
