'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(userData)
    if (parsed.role !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki akses ke halaman ini',
      }).then(() => router.push('/login'))
      return
    }

    setUser(parsed)
  }, [router])

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user')
        router.push('/login')
      }
    })
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#FAFAEE]">
      <aside className="w-64 bg-[#252F24] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Aromara</h1>
          <p className="text-xs text-white/60">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#E8F5D5] text-[#252F24] rounded-lg font-medium">
            <ion-icon name="grid"></ion-icon>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <ion-icon name="cube"></ion-icon>
            <span>Products</span>
          </Link>
          <Link href="/admin/suppliers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <ion-icon name="business"></ion-icon>
            <span>Suppliers</span>
          </Link>
          <Link href="/admin/buyers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <ion-icon name="people"></ion-icon>
            <span>Buyers</span>
          </Link>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600">
            <ion-icon name="log-out"></ion-icon>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6">
            <div className="text-4xl font-bold">1,200</div>
            <p className="text-gray-600">Suppliers</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-4xl font-bold">850</div>
            <p className="text-gray-600">Buyers</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-4xl font-bold">4,500</div>
            <p className="text-gray-600">Products</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-4xl font-bold">320</div>
            <p className="text-gray-600">Inquiries</p>
          </div>
        </div>
      </main>
    </div>
  )
}
