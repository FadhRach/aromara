'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { supabase } from '@/lib/supabase'
import MoraAI from '@/components/shared/MoraAI'

export default function BuyerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(userData)
    if (parsed.role !== 'buyer') {
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
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      // Load suppliers
      const { data: suppliersData } = await supabase
        .from('company')
        .select('*')
        .eq('role', 'supplier')

      setSuppliers(suppliersData || [])

      // Load all products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          company:company_id (
            id,
            name,
            email
          )
        `)
        .limit(6)

      setProducts(productsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
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

  const handleInquiry = (product: any) => {
    Swal.fire({
      title: 'Buat Inquiry',
      html: `
        <p class="mb-4">Anda akan membuat inquiry untuk:</p>
        <p class="font-bold text-lg mb-2">${product.name}</p>
        <p class="text-sm text-gray-600 mb-4">dari ${product.company?.name}</p>
        <textarea 
          id="inquiry-message" 
          class="w-full p-3 border border-gray-300 rounded-lg" 
          rows="4" 
          placeholder="Masukkan pesan inquiry Anda..."
        ></textarea>
      `,
      showCancelButton: true,
      confirmButtonColor: '#252F24',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Kirim Inquiry',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const message = (document.getElementById('inquiry-message') as HTMLTextAreaElement)?.value
        if (!message) {
          Swal.showValidationMessage('Pesan inquiry harus diisi!')
          return false
        }
        return { message }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Inquiry Terkirim!',
          text: 'Supplier akan segera menghubungi Anda',
          confirmButtonColor: '#252F24',
        })
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
              <ion-icon name="flask" style={{ fontSize: '32px' }}></ion-icon>
              <h1 className="text-2xl font-bold text-[#E1F0C9]">Aromara</h1>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-[#E1F0C9] transition">
                Home
              </Link>
              <Link href="/suppliers" className="hover:text-[#E1F0C9] transition">
                Explore Supplier
              </Link>
              <Link href="/user/dashboard" className="text-[#E1F0C9] font-semibold">
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#252F24] to-[#1a2119] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <ion-icon name="cart" style={{ fontSize: '48px', color: '#E1F0C9' }}></ion-icon>
            <h2 className="text-4xl font-bold">Selamat Datang, {user.name}!</h2>
          </div>
          <p className="text-[#E1F0C9] text-lg">
            Temukan bahan baku parfum berkualitas dari supplier terpercaya
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#E1F0C9] p-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari produk, supplier, atau kategori..."
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
            />
            <button className="px-8 py-4 bg-[#252F24] text-white rounded-xl font-semibold hover:bg-[#1a2119] transition flex items-center gap-2">
              <ion-icon name="search" style={{ fontSize: '24px' }}></ion-icon>
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* MORA AI Section - NEW! */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#252F24] to-[#3a4a38] rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#E1F0C9] p-4 rounded-full">
                <ion-icon name="sparkles" style={{ fontSize: '48px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">MORA AI Assistant</h3>
                <p className="text-[#E1F0C9] text-lg">
                  Tanya AI untuk rekomendasi produk yang tepat untuk kebutuhan Anda
                </p>
              </div>
            </div>
          </div>
          <MoraAI />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <ion-icon name="business" style={{ fontSize: '32px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Suppliers</p>
                <p className="text-3xl font-bold text-[#252F24]">{suppliers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <ion-icon name="flask" style={{ fontSize: '32px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Produk Tersedia</p>
                <p className="text-3xl font-bold text-[#252F24]">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <ion-icon name="clipboard" style={{ fontSize: '32px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Inquiry Saya</p>
                <p className="text-3xl font-bold text-[#252F24]">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                <ion-icon name="cube" style={{ fontSize: '32px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Saya</p>
                <p className="text-3xl font-bold text-[#252F24]">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#252F24]">Produk Unggulan</h3>
            <Link
              href="/suppliers"
              className="text-[#252F24] font-semibold hover:text-[#1a2119] flex items-center gap-2"
            >
              Lihat Semua 
              <ion-icon name="arrow-forward" style={{ fontSize: '20px' }}></ion-icon>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#252F24] border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Memuat produk...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#E1F0C9]/30 to-white flex items-center justify-center">
                    <ion-icon name="flask" style={{ fontSize: '96px', color: '#252F24' }} class="group-hover:scale-110 transition"></ion-icon>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-[#252F24] mb-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <ion-icon name="business-outline" style={{ fontSize: '16px' }}></ion-icon>
                      <span className="font-semibold">{product.company?.name}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || 'Produk berkualitas tinggi untuk kebutuhan fragrance Anda'}
                    </p>
                    <button
                      onClick={() => handleInquiry(product)}
                      className="w-full px-4 py-3 bg-[#252F24] text-white rounded-lg font-semibold hover:bg-[#1a2119] transition flex items-center justify-center gap-2"
                    >
                      <ion-icon name="mail" style={{ fontSize: '20px' }}></ion-icon>
                      Buat Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supplier List */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#252F24] mb-6">Supplier Terpercaya</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#E1F0C9]/50 p-4 rounded-full">
                    <ion-icon name="business" style={{ fontSize: '48px', color: '#252F24' }}></ion-icon>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-[#252F24] mb-2">
                      {supplier.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                      <ion-icon name="mail-outline" style={{ fontSize: '16px' }}></ion-icon>
                      {supplier.email}
                    </p>
                    <Link
                      href={`/suppliers/${supplier.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#252F24] text-white rounded-lg text-sm font-semibold hover:bg-[#1a2119] transition"
                    >
                      <ion-icon name="eye" style={{ fontSize: '18px' }}></ion-icon>
                      Lihat Profil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#252F24] to-[#1a2119] rounded-2xl shadow-xl p-12 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ion-icon name="headset" style={{ fontSize: '48px', color: '#E1F0C9' }}></ion-icon>
            <h3 className="text-3xl font-bold">Butuh Bantuan?</h3>
          </div>
          <p className="text-[#E1F0C9] mb-6 text-lg">
            Tim kami siap membantu Anda menemukan supplier dan produk yang tepat
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#E1F0C9] text-[#252F24] rounded-xl font-bold hover:bg-white transition text-lg"
          >
            <ion-icon name="chatbubbles" style={{ fontSize: '24px' }}></ion-icon>
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  )
}
