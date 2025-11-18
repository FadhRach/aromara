"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#252F24] mb-4">
              AROMARA
            </h1>
            <p className="text-lg text-[#252F24]/70 max-w-2xl mx-auto">
              Membentuk Masa Depan Bahan Baku Aroma
            </p>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="aspect-video bg-[#E8F5E9] rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">🌺</span>
              </div>
            </div>
            <div className="aspect-video bg-[#E8F5E9] rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="mb-20 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-[#E8F5E9] rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">🧴</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#252F24] mb-6">
                Tentang Kami
              </h2>
              <p className="text-[#252F24]/80 leading-relaxed mb-4">
                Aromara hadir sebagai mitra terpercaya bagi brand, pabrik, dan pelaku industri yang membutuhkan bahan baku aroma berkualitas tinggi. Kami menyediakan essential oil, natural extracts, dan fragrance compounds yang dikurasi dengan standar internasional untuk memastikan konsistensi, keamanan, dan performa terbaik bagi produk Anda.
              </p>
              <p className="text-[#252F24]/80 leading-relaxed">
                Mulai dari sumber petani hingga produsen bersertifikasi, setiap bahan dipilih dengan teliti agar sesuai dengan kebutuhan spesifik parfum padat, personal care, aromaterapi, makanan, hingga home fragrance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landasan Aromora */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#252F24] mb-4 text-center">
            Landasan Aromora
          </h2>
          <p className="text-center text-[#252F24]/70 mb-12 max-w-2xl mx-auto">
            Keyakinan dan tujuan yang membentuk identitas Aromara
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VISI */}
            <div className="bg-[#E8F5E9] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#252F24] mb-4">VISI</h3>
              <p className="text-[#252F24]/80 leading-relaxed">
                Menjadi platform bahan baku aroma terlengkap di Asia Tenggara yang memudahkan brand menemukan produk berkualitas tinggi secara cepat, aman, dan transparan
              </p>
            </div>

            {/* MISI */}
            <div className="bg-[#E8F5E9] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#252F24] mb-4">MISI</h3>
              <p className="text-[#252F24]/80 leading-relaxed">
                Menghubungkan industri dengan bahan baku aroma terbaik melalui proses sourcing yang etis, transparan, dan berkelanjutan sambil memberdayakan petani dan distillers lokal di berbagai wilayah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Inspired */}
      <section className="mb-20 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#252F24] mb-6">
                Stay Inspired, Stay Aromatic
              </h2>
              <p className="text-[#252F24]/80 leading-relaxed mb-6">
                Silakan tinggalkan pesan Anda, kami akan segera menghubungi Anda kembali
              </p>

              {/* Contact Form */}
              <form className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Nama"
                    className="bg-[#FAFAEE] border-[#252F24]/20"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-[#FAFAEE] border-[#252F24]/20"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Pesan"
                    className="w-full bg-[#FAFAEE] border border-[#252F24]/20 rounded-md px-3 py-2 min-h-[120px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#252F24] hover:bg-[#252F24]/90 text-white"
                  size="lg"
                >
                  Kirim Pesan
                </Button>
              </form>
            </div>

            <div>
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#252F24] mb-2">Kunjungi Kami</h3>
                  <p className="text-[#252F24]/80">
                    Jalan Kunjungan Rulla No. 10,<br />
                    Pucangan, Baturaja,<br />
                    Surakarta
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#252F24] mb-2">Hubungi Kami</h3>
                  <p className="text-[#252F24]/80">
                    Hubungi Kami:<br />
                    +62 812-3456-7890
                  </p>
                  <p className="text-[#252F24]/80 mt-2">
                    support@aromara.id
                  </p>
                </div>

                {/* Social Media */}
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-[#252F24] rounded-full flex items-center justify-center text-white hover:bg-[#252F24]/80 transition">
                    <span>📘</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#252F24] rounded-full flex items-center justify-center text-white hover:bg-[#252F24]/80 transition">
                    <span>𝕏</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#252F24] rounded-full flex items-center justify-center text-white hover:bg-[#252F24]/80 transition">
                    <span>📷</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-[#252F24] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm">
            © 2025 Aromara. All rights reserved.
          </p>
          <p className="text-sm text-white/70 mt-2">
            Crafted with ❤️ from Indonesia
          </p>
        </div>
      </section>
    </div>
  );
}
