'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { loginWithEmail } from '@/lib/auth'
import { showAlert } from '@/lib/sweetalert'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/explore-suppliers');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      showAlert.warning('Oops...', 'Email dan password harus diisi!')
      return
    }

    setLoading(true)

    try {
      const result = await loginWithEmail(email, password)

      if (result.success && result.data) {
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(result.data))
        
        // Set cookie via API route
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        })
        
        showAlert.success('Login Berhasil!', `Selamat datang, ${result.data.name}`)

        // Get redirect URL from query params or default based on role
        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get('redirect')
        
        setTimeout(() => {
          if (redirect) {
            router.push(redirect)
          } else if (result.data.role === 'buyer') {
            router.push('/explore-suppliers')
          } else if (result.data.role === 'supplier') {
            router.push('/supplier/dashboard')
          } else {
            router.push('/')
          }
        }, 1500)
      } else {
        showAlert.error('Login Gagal', result.error || 'Email atau password salah')
      }
    } catch (error) {
      showAlert.error('Error', 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAEE]">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#252F24] items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#252F24] to-[#1a2119] opacity-90"></div>
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Selamat Datang di Aromara
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Platform B2B terpercaya untuk bahan baku parfum Indonesia. Hubungkan petani, distiller, dan brand dalam satu ekosistem yang berkelanjutan.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="checkmark-circle" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Supplier Terverifikasi</h3>
                <p className="text-sm text-white/70">1,200+ supplier terpercaya</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="leaf" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Produk Berkualitas</h3>
                <p className="text-sm text-white/70">4,500+ listing produk premium</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="shield-checkmark" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Transaksi Aman</h3>
                <p className="text-sm text-white/70">Sistem RFQ yang transparan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <Image
              src="/images/aromaralogo.png"
              alt="Aromara Logo"
              width={160}
              height={50}
              className="mx-auto mb-4"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-[#252F24]/10">
            <h2 className="text-3xl font-bold text-[#252F24] mb-2">Masuk</h2>
            <p className="text-[#252F24]/60 mb-8">Silakan masuk ke akun Anda</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#252F24] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                placeholder="nama@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#252F24] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#252F24] text-white py-3 rounded-lg font-semibold hover:bg-[#1a2119] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

            <div className="mt-6 pt-6 border-t border-[#252F24]/10">
              <p className="text-center text-[#252F24]/70">
                Belum punya akun?{' '}
                <Link 
                  href="/register" 
                  className="text-[#252F24] font-bold hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>

            <div className="text-center mt-6">
              <Link href="/" className="text-sm text-[#252F24]/60 hover:text-[#252F24] flex items-center justify-center gap-2">
                <ion-icon name="arrow-back" style={{ fontSize: '16px' }}></ion-icon>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
