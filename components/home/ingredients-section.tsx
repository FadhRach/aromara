import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Award, Package, Beaker, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function IngredientsSection() {
  const suppliers = [
    {
      id: 1,
      name: "Kenanga Lestari (100 Produk)",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80",
      location: "Indonesia, Jawa Timur",
      established: "Semenjak 2008",
      shipping: "Pengiriman: Seluruh Dunia",
      certifications: "Sertifikasi: 2",
      supply: "Supply: 120 Perusahaan",
      method: "Metode: Fermentasi alami",
      intake: "Pemasok untuk: Distributor dan Manufaktur",
      description: "Verdancia Botanicals menyediakan essential oil, ekstrak alami, dan bahan baku aroma berkualitas tinggi dari pasar global. Produk kami digunakan oleh industri kosmetik, wellness, aromaterapi, makanan, hingga home fragrances.",
      badge: "Kecocokan Produk",
      products: [
        "Lavender Oil Murni (Prancis)",
        "Lemongrass Oil Drum",
        "Peppermint Oil Organik",
        "Ekstrak Rosemary Grade AA",
        "Bergamot FCF Oil",
        "Jasmine Absolute Blend",
      ],
      responseTime: "Kurang dari 24 Jam",
      responseRate: "84%",
      portfolioCount: 87,
    },
    {
      id: 2,
      name: "Kenanga Lestari (100 Produk)",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80",
      location: "Indonesia, Jawa Timur",
      established: "Semenjak 2008",
      shipping: "Pengiriman: Seluruh Dunia",
      certifications: "Sertifikasi: 2",
      supply: "Supply: 120 Perusahaan",
      method: "Metode: Fermentasi alami",
      intake: "Pemasok untuk: Distributor dan Manufaktur",
      description: "Verdancia Botanicals menyediakan essential oil, ekstrak alami, dan bahan baku aroma berkualitas tinggi dari pasar global. Produk kami digunakan oleh industri kosmetik, wellness, aromaterapi, makanan, hingga home fragrances.",
      badge: "Kecocokan Produk",
      products: [
        "Lavender Oil Murni (Prancis)",
        "Lemongrass Oil Drum",
        "Peppermint Oil Organik",
        "Ekstrak Rosemary Grade AA",
        "Bergamot FCF Oil",
        "Jasmine Absolute Blend",
      ],
      responseTime: "Kurang dari 24 Jam",
      responseRate: "84%",
      portfolioCount: 87,
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252F24]">
            EXPLORE INGRIDIENT
          </h2>
          <Button variant="ghost" className="flex items-center gap-2 group text-sm md:text-base underline">
            <span className="hidden sm:inline">Discover More Suppliers</span>
            <span className="sm:hidden">More Suppliers</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition" />
          </Button>
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden bg-[#E1F0C9] border-none hover:shadow-lg transition-shadow p-4 md:p-6">
              <div className="space-y-4">
                {/* Header with Logo and Title */}
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white p-1">
                    <Image
                      src={supplier.logo}
                      alt={supplier.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-[#252F24]">{supplier.name}</h3>
                    <p className="text-xs md:text-sm text-[#252F24]/70">{supplier.location}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm text-[#252F24]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{supplier.established}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{supplier.shipping}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{supplier.certifications}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{supplier.supply}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Beaker className="w-4 h-4" />
                    <span>{supplier.method}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{supplier.intake}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-[#252F24]/80 leading-relaxed">
                  {supplier.description}
                </p>

                {/* Badge */}
                <div className="inline-block">
                  <span className="px-3 py-1 bg-[#D4E5B9] text-[#252F24] rounded-full text-xs font-medium">
                    {supplier.badge}
                  </span>
                </div>

                {/* Products */}
                <div className="flex flex-wrap gap-2">
                  {supplier.products.map((product, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white/60 text-[#252F24] rounded-full text-xs"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                {/* Response Metrics */}
                <div className="flex items-center gap-6 text-xs md:text-sm text-[#252F24]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Waktu respons rata-rata:</p>
                      <p className="font-bold">{supplier.responseTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Tingkat respons rata-rata:</p>
                      <p className="font-bold">{supplier.responseRate}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/supplier/${supplier.id}/contact`}>
                    <Button className="bg-[#252F24] text-white hover:bg-[#252F24]/90 rounded-full px-6">
                      Kontak Supplier
                    </Button>
                  </Link>
                  <Link href={`/supplier/${supplier.id}`} className="text-xs md:text-sm text-[#252F24] underline">
                    Lihat portofolio ({supplier.portfolioCount})
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
