'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerCompany } from '@/lib/auth'
import { showAlert } from '@/lib/sweetalert'
import IonIcon from '@/components/shared/IonIcon'

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

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/explore-suppliers');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      showAlert.warning('Oops...', 'Nama, email, dan password harus diisi!')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert.error('Password Tidak Cocok', 'Password dan konfirmasi password harus sama!')
      return
    }

    if (formData.password.length < 6) {
      showAlert.warning('Password Terlalu Pendek', 'Password minimal 6 karakter!')
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

      if (result.success && result.data) {
        // Auto login after registration
        localStorage.setItem('user', JSON.stringify(result.data))
        
        // Set cookie
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        })
        
        showAlert.success('Pendaftaran Berhasil!', `Selamat datang, ${result.data.name}`)
          .then(() => {
            if (result.data.role === 'buyer') {
              router.push('/explore-suppliers')
            } else {
              router.push('/')
            }
          })
      } else {
        showAlert.error('Pendaftaran Gagal', result.error || 'Terjadi kesalahan saat mendaftar')
      }
    } catch (error) {
      showAlert.error('Error', 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAEE]">
      <div className="hidden lg:flex lg:w-2/5 bg-[#252F24] items-center justify-center p-12 sticky top-0 h-screen">
        <div className="text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Mulai Perjalanan Anda</h2>
          <p className="text-lg text-white/80 mb-8">
            Bergabunglah dengan ekosistem B2B bahan baku parfum terbesar di Indonesia.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <IonIcon name="flash" style={{ fontSize: '24px', color: '#252F24' }} />
              </div>
              <div>
                <h3 className="font-semibold">Registrasi Cepat</h3>
                <p className="text-sm text-white/70">Proses mudah, langsung aktif</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <IonIcon name="people" style={{ fontSize: '24px', color: '#252F24' }} />
              </div>
              <div>
                <h3 className="font-semibold">Network Luas</h3>
                <p className="text-sm text-white/70">Terhubung dengan ribuan mitra</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5D5] flex items-center justify-center">
                <IonIcon name="trending-up" style={{ fontSize: '24px', color: '#252F24' }} />
              </div>
              <div>
                <h3 className="font-semibold">Pertumbuhan Bisnis</h3>
                <p className="text-sm text-white/70">Tools untuk scale up bisnis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl my-8">
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
                    className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                  placeholder="+62 812-3456-7890"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-2">
                  Alamat
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#252F24]/20 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                  placeholder="Alamat lengkap perusahaan"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252F24] mb-3">
                  Daftar Sebagai <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
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
                      <IonIcon name="cart" style={{ fontSize: '28px', color: '#252F24' }} />
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
                      <IonIcon name="business" style={{ fontSize: '28px', color: '#252F24' }} />
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
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#252F24]/10">
              <p className="text-center text-[#252F24]/70">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-[#252F24] font-bold hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
