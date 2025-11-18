"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-0">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#252F24] mb-2">
              AROMORA
            </h1>
            <p className="text-base text-[#252F24]/70">
              Membentuk Masa Depan Bahan Baku Aroma
            </p>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
                alt="Essential oils and natural ingredients"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80"
                alt="Aromatic plants and herbs"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#252F24] mb-8">
            Tentang Kami
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[#252F24]/80 leading-relaxed mb-4 text-justify">
                Aromora hadir sebagai mitra tepercaya bagi brand, pabrik, dan pelaku industri yang membutuhkan bahan baku aroma berkualitas tinggi. Kami menyediakan essential oil, natural extracts, dan fragrance compounds yang dikurasi dengan standar internasional untuk memastikan konsistensi, keamanan, dan performa terbaik bagi produk Anda.
              </p>
              <p className="text-[#252F24]/80 leading-relaxed text-justify">
                Mulai dari sumber petani hingga produsen bersertifikasi, setiap bahan dipilih dengan teliti agar sesuai dengan kebutuhan spesifik parfum padat, personal care, aromaterapi, makanan, hingga home fragrance.
              </p>
            </div>
            
            <div className="bg-[#E8F5E9] rounded-lg p-8">
              <p className="text-[#252F24] leading-relaxed italic text-justify">
                "Aromora membantu kami mendapatkan essential oil dengan kualitas stabil dan harga yang transparan. Pelayanannya cepat dan dokumentasinya lengkap."
              </p>
              <p className="text-[#252F24] font-semibold mt-4">
                — Founder Skincare Lokal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landasan Aromora */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#252F24] mb-2">
            Landasan Aromora
          </h2>
          <p className="text-[#252F24]/70 mb-8">
            Keyakinan dan tujuan yang membentuk identitas Aromora
          </p>

          <div className="space-y-6">
            {/* VISI */}
            <div>
              <h3 className="text-xl font-bold text-[#252F24] mb-3">VISI</h3>
              <p className="text-[#252F24]/80 leading-relaxed text-justify">
                Menjadi platform bahan baku aroma terlengkap di Asia Tenggara yang memudahkan brand menemukan produk berkualitas tinggi secara cepat, aman, dan transparan
              </p>
            </div>

            {/* MISI */}
            <div>
              <h3 className="text-xl font-bold text-[#252F24] mb-3">MISI</h3>
              <p className="text-[#252F24]/80 leading-relaxed text-justify">
                Menghubungkan industri dengan bahan baku aroma terbaik melalui proses sourcing yang etis, transparan, dan berkelanjutan sambil memberdayakan petani dan distillers lokal di berbagai wilayah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Inspired */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#252F24] mb-2">
            Stay Inspired, Stay Aromatic
          </h2>
          <p className="text-[#252F24]/70 mb-8">
            Silakan tinggalkan pesan Anda,<br />
            kami akan segera menghubungi Anda kembali
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nama"
                    className="w-full bg-transparent border-b border-[#252F24]/30 px-0 py-2 focus:outline-none focus:border-[#252F24] transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-[#252F24]/30 px-0 py-2 focus:outline-none focus:border-[#252F24] transition"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Pesan"
                    className="w-full bg-transparent border-b border-[#252F24]/30 px-0 py-2 focus:outline-none focus:border-[#252F24] transition"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#252F24] hover:bg-[#252F24]/90 text-white rounded-full mt-6"
                  size="lg"
                >
                  Kirim Pesan
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#252F24] mb-2">Kunjungi Kami</h3>
                <p className="text-[#252F24]/80 text-sm">
                  Jalan Kunjungan Rulla No. 10,<br />
                  Pucangan, Baturaja,<br />
                  Surakarta
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#252F24] mb-2">Hubungi Kami</h3>
                <p className="text-[#252F24]/80 text-sm">
                  Hubungi Kami:<br />
                  +62 812-3456-7890
                </p>
                <p className="text-[#252F24]/80 text-sm mt-2">
                  support@aromora.id
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
