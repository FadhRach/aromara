'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { registerCompany } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'buyer' as 'buyer' | 'supplier',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Nama, email, dan password harus diisi!',
        confirmButtonColor: '#252F24',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Tidak Cocok',
        text: 'Password dan konfirmasi password harus sama!',
        confirmButtonColor: '#252F24',
      })
      return
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Terlalu Pendek',
        text: 'Password minimal 6 karakter!',
        confirmButtonColor: '#252F24',
      })
      return
    }

    setLoading(true)

    try {
      const result = await registerCompany({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        role: formData.role,
      })

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil!',
          text: 'Akun Anda telah dibuat. Silakan login.',
          confirmButtonColor: '#252F24',
        }).then(() => {
          router.push('/login')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: result.error || 'Terjadi kesalahan saat mendaftar',
          confirmButtonColor: '#252F24',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan. Silakan coba lagi.',
        confirmButtonColor: '#252F24',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAEE]">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-[#252F24] items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#252F24] to-[#1a2119] opacity-90"></div>
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Mulai Perjalanan Anda
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Bergabunglah dengan ekosistem B2B bahan baku parfum terbesar di Indonesia. Temukan mitra bisnis yang tepat untuk kesuksesan Anda.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="flash" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Registrasi Cepat</h3>
                <p className="text-sm text-white/70">Proses mudah, langsung aktif</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="people" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Network Luas</h3>
                <p className="text-sm text-white/70">Terhubung dengan ribuan mitra</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <ion-icon name="trending-up" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              </div>
              <div>
                <h3 className="font-semibold">Pertumbuhan Bisnis</h3>
                <p className="text-sm text-white/70">Tools untuk scale up bisnis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <Image
              src="/images/aromaralogo.png"
              alt="Aromara Logo"
      {/* Right Side - Register Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
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
            <h2 className="text-3xl font-bold text-[#252F24] mb-2">Daftar</h2>
            <p className="text-[#252F24]/60 mb-6">Buat akun baru Anda</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-2">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                  placeholder="PT. Wangi Sejahtera"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                  placeholder="email@perusahaan.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                  placeholder="Min. 6 karakter"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-2">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                  placeholder="Ketik ulang password"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#252F24] mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent transition bg-white"
                placeholder="+62 812-3456-7890"
                disabled={loading}
              />
            </div>utton
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'buyer'
                      ? 'border-[#252F24] bg-[#E8F5D5]'
                      : 'border-[#252F24]/20 hover:border-[#252F24]/40'
                  }`}
                  disabled={loading}
                >
                  <div className="text-center">
                    <ion-icon name="cart" style={{ fontSize: '28px', color: '#252F24' }}></ion-icon>
                    <div className="font-semibold text-[#252F24] text-sm mt-2">Buyer</div>
                    <div className="text-xs text-[#252F24]/60 mt-1">Beli bahan baku</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'supplier' })}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'supplier'
                      ? 'border-[#252F24] bg-[#E8F5D5]'
                      : 'border-[#252F24]/20 hover:border-[#252F24]/40'
                  }`}
                  disabled={loading}
                >
                  <div className="text-center">
                    <ion-icon name="business" style={{ fontSize: '28px', color: '#252F24' }}></ion-icon>
                    <div className="font-semibold text-[#252F24] text-sm mt-2">Supplier</div>
                    <div className="text-xs text-[#252F24]/60 mt-1">Jual bahan baku</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#252F24] text-white py-3 rounded-lg font-semibold hover:bg-[#1a2119] transition disabled:bg-[#252F24]/40 disabled:cursor-not-allowed mt-6"
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
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#252F24]/10">
            <p className="text-center text-[#252F24]/70">
              Sudah punya akun?{' '}
              <Link 
                href="/login" 
                className="text-[#252F24] font-bold hover:underline"
              >
                Masuk
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
