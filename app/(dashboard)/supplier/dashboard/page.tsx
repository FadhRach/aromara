'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { supabase } from '@/lib/supabase'

export default function SupplierDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(userData)
    if (parsed.role !== 'supplier') {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki akses ke halaman ini',
        confirmButtonColor: '#252F24',
      }).then(() => {
        router.push('/login')
      })
      return
    }

    setUser(parsed)
    loadProducts(parsed.id)
  }, [router])

  const loadProducts = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#252F24',
      cancelButtonColor: '#6b7280',
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
    <div className="min-h-screen bg-gradient-to-br from-[#E1F0C9]/20 to-white">
      {/* Navbar */}
      <nav className="bg-[#252F24] text-white sticky top-0 z-50 border-b-4 border-[#E1F0C9]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🧴</span>
              <h1 className="text-2xl font-bold text-[#E1F0C9]">Aromara</h1>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-[#E1F0C9] transition">
                Home
              </Link>
              <Link href="/suppliers" className="hover:text-[#E1F0C9] transition">
                Explore Supplier
              </Link>
              <Link href="/supplier/dashboard" className="text-[#E1F0C9] font-semibold">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#E1F0C9] text-[#252F24] rounded-lg font-semibold hover:bg-[#d4e3b8] transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Card - Left Aligned like screenshot */}
        <div className="bg-[#E1F0C9]/40 rounded-2xl shadow-sm border border-[#E1F0C9] p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#252F24]">
              <span className="text-5xl">🏭</span>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#252F24] mb-2">{user.name}</h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span>{user.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span>{user.address || 'Jl. Kenanga Indah No. 21, Desa Sidoharjo, Kecamatan Sukorejo, Banyuwangi, Jawa Timur 68419'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span>Semenjak 2008</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">🌍</span>
                  <span>Pengiriman: Worldwide</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span>Sertifikasi: Halal, COA</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <span>Pemesanan untuk: Penyuling</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-[#252F24] text-white rounded-lg font-semibold mb-4">
                SUPPLIER
              </span>
              <Link
                href="/supplier/profile"
                className="block px-6 py-3 bg-[#252F24] text-white rounded-lg font-semibold hover:bg-[#1a2119] transition text-center"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Company Video Section - like screenshot */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#252F24] mb-4">Company Video</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🎥</span>
                <p className="text-gray-600">Upload video perusahaan Anda</p>
                <button className="mt-4 px-6 py-2 bg-[#252F24] text-white rounded-lg hover:bg-[#1a2119] transition">
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-[#252F24] mb-4">Deskripsi</h3>
          <p className="text-gray-700 leading-relaxed">
            Kami adalah perusahaan yang telah membudidayakan tanaman aromatik seperti kenanga, akar wangi, dan serai wangi. 
            Mereka menerapkan metode pertanian berkelanjutan untuk menjaga kualitas bahan baku yang digunakan dalam produksi 
            fragrance di seluruh Jawa Timur.
          </p>
        </div>

        {/* Products Section - like screenshot */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#252F24]">
              Produk dari {user.name}
            </h3>
            <Link
              href="/supplier/products/add"
              className="px-6 py-3 bg-[#252F24] text-white rounded-lg font-semibold hover:bg-[#1a2119] transition flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              Tambah Produk
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#252F24] border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Memuat produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <span className="text-6xl mb-4 block">📦</span>
              <p className="text-gray-600 text-lg mb-4">Belum ada produk</p>
              <Link
                href="/supplier/products/add"
                className="inline-block px-6 py-3 bg-[#252F24] text-white rounded-lg font-semibold hover:bg-[#1a2119] transition"
              >
                Tambah Produk Pertama
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#E1F0C9]/30 to-white flex items-center justify-center">
                    <span className="text-6xl">🧴</span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-[#252F24] mb-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      Lavender memberi aroma floral-herbal yang segar dan menenangkan, sering dipakai sebagai bahan utama parfum.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock_quantity || 0}
                      </span>
                      <button className="px-4 py-2 bg-[#252F24] text-white rounded-lg text-sm font-semibold hover:bg-[#1a2119] transition">
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <span className="text-3xl">🧴</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Produk</p>
                <p className="text-3xl font-bold text-[#252F24]">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Inquiry Masuk</p>
                <p className="text-3xl font-bold text-[#252F24]">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-[#252F24]">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
