"use client";

import MoraAI from "@/components/shared/MoraAI";
import Link from "next/link";

export default function MoraAIPage() {
  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/"
            className="text-sm text-[#252F24]/70 hover:text-[#252F24] flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#E1F0C9] p-2 rounded-lg">
              <svg className="w-6 h-6 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#252F24]">
                MORA AI Assistant
              </h1>
              <p className="text-[#252F24]/70 text-sm">
                Asisten pintar untuk rekomendasi bahan parfum & essential oil
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-2 border-[#E1F0C9] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#E1F0C9] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#252F24] mb-1">Respons Cepat</h3>
                <p className="text-sm text-[#252F24]/70">
                  Dapatkan rekomendasi dalam hitungan detik
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E1F0C9] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#E1F0C9] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#252F24] mb-1">Akurat & Relevan</h3>
                <p className="text-sm text-[#252F24]/70">
                  Rekomendasi berdasarkan data terpercaya
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E1F0C9] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#E1F0C9] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#252F24] mb-1">Produk Tersedia</h3>
                <p className="text-sm text-[#252F24]/70">
                  Langsung terhubung dengan supplier
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MORA AI Component */}
        <MoraAI />

        {/* Example Questions */}
        <div className="mt-6 bg-white border-2 border-[#E1F0C9] rounded-xl p-6">
          <h3 className="font-bold text-[#252F24] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contoh Pertanyaan
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-[#FAFAEE] rounded-lg border border-[#252F24]/10">
              <p className="text-sm text-[#252F24]">
                � "Saya ingin membuat parfum dengan aroma vanilla yang hangat dan manis"
              </p>
            </div>
            <div className="p-3 bg-[#FAFAEE] rounded-lg border border-[#252F24]/10">
              <p className="text-sm text-[#252F24]">
                🌸 "Bahan apa yang cocok untuk parfum beraroma floral segar?"
              </p>
            </div>
            <div className="p-3 bg-[#FAFAEE] rounded-lg border border-[#252F24]/10">
              <p className="text-sm text-[#252F24]">
                🌿 "Essential oil apa yang baik untuk aromaterapi relaksasi?"
              </p>
            </div>
            <div className="p-3 bg-[#FAFAEE] rounded-lg border border-[#252F24]/10">
              <p className="text-sm text-[#252F24]">
                🍊 "Rekomendasi bahan untuk parfum citrus yang segar"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
