'use client'

import { useState } from 'react'
import { askMoraAI, type MoraAIResponse } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'

interface MoraAIProps {
  onProductSelect?: (productIds: string[]) => void
}

export default function MoraAI({ onProductSelect }: MoraAIProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<MoraAIResponse | null>(null)
  const [products, setProducts] = useState<any[]>([])

  const handleAsk = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResponse(null)
    setProducts([])

    try {
      // 1. Ask MORA AI
      const aiResponse = await askMoraAI(query)
      setResponse(aiResponse)

      // 2. Search matching products in database
      if (aiResponse.matchedProducts && aiResponse.matchedProducts.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            company:company_id (
              id,
              name,
              email,
              phone,
              address
            )
          `)
          .or(
            aiResponse.matchedProducts
              .map(product => `name.ilike.%${product}%`)
              .join(',')
          )

        if (!error && data) {
          setProducts(data)
        }
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* MORA AI Header */}
      <div className="bg-gradient-to-r from-[#252F24] to-[#3a4a38] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#E1F0C9] p-3 rounded-xl">
            <ion-icon name="sparkles" style={{ fontSize: '32px', color: '#252F24' }}></ion-icon>
          </div>
          <div>
            <h2 className="text-3xl font-bold">MORA AI</h2>
            <p className="text-[#E1F0C9]">AI Assistant untuk Rekomendasi Bahan Parfum</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-3 mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder='Contoh: "Saya ingin membuat parfum dengan aroma vanilla yang hangat"'
            className="flex-1 px-6 py-4 rounded-xl text-[#252F24] font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-[#E1F0C9] outline-none"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-[#E1F0C9] text-[#252F24] rounded-xl font-bold hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <ion-icon name="hourglass-outline" className="animate-spin"></ion-icon>
                <span>Berpikir...</span>
              </>
            ) : (
              <>
                <ion-icon name="send"></ion-icon>
                <span>Tanya MORA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Response */}
      {response && (
        <div className="bg-white rounded-2xl border-2 border-[#E1F0C9] p-6 space-y-6">
          {/* Explanation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ion-icon name="bulb" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
              <h3 className="text-xl font-bold text-[#252F24]">Rekomendasi MORA</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{response.explanation}</p>
          </div>

          {/* Ingredients List */}
          {response.ingredients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ion-icon name="leaf" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
                <h3 className="text-lg font-bold text-[#252F24]">Bahan yang Direkomendasikan</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {response.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#E1F0C9] text-[#252F24] rounded-lg font-medium"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {response.tips && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ion-icon name="information-circle" style={{ fontSize: '24px', color: '#252F24' }}></ion-icon>
                <h3 className="text-lg font-bold text-[#252F24]">Tips Formula</h3>
              </div>
              <p className="text-gray-700 leading-relaxed bg-[#E1F0C9]/20 p-4 rounded-lg">
                {response.tips}
              </p>
            </div>
          )}

          {/* Missing Products Alert */}
          {response.missingProducts && response.missingProducts.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ion-icon name="warning" style={{ fontSize: '24px', color: '#f59e0b' }}></ion-icon>
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Produk Belum Tersedia</h4>
                  <p className="text-amber-800 text-sm mb-2">
                    Bahan berikut belum tersedia di platform kami:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {response.missingProducts.map((product, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-sm font-medium"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                  <p className="text-amber-700 text-sm mt-2">
                    💡 Kami akan menghubungi supplier untuk menyediakan produk ini
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matched Products */}
      {products.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#252F24] mb-4">
            Produk yang Tersedia ({products.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[#252F24] hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gradient-to-br from-[#E1F0C9]/30 to-white flex items-center justify-center">
                  <ion-icon 
                    name="flask" 
                    style={{ fontSize: '72px', color: '#252F24' }}
                    className="group-hover:scale-110 transition"
                  ></ion-icon>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-[#252F24] mb-2">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <ion-icon name="business"></ion-icon>
                    <span className="font-semibold">{product.company?.name}</span>
                  </p>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onProductSelect?.([product.id])}
                      className="flex-1 px-4 py-2 bg-[#252F24] text-white rounded-lg font-semibold hover:bg-[#1a2119] transition flex items-center justify-center gap-2"
                    >
                      <ion-icon name="cart"></ion-icon>
                      <span>Inquiry</span>
                    </button>
                    <a
                      href={`/suppliers/${product.company?.id}`}
                      className="px-4 py-2 border-2 border-[#252F24] text-[#252F24] rounded-lg font-semibold hover:bg-[#E1F0C9] transition flex items-center justify-center"
                    >
                      <ion-icon name="eye"></ion-icon>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Products Found */}
      {response && products.length === 0 && response.matchedProducts && response.matchedProducts.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <ion-icon name="search" style={{ fontSize: '64px', color: '#9ca3af' }}></ion-icon>
          <h3 className="text-xl font-bold text-gray-700 mt-4 mb-2">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-gray-600">
            Produk yang Anda cari belum tersedia di database kami.
            <br />
            Silakan hubungi admin untuk permintaan khusus.
          </p>
        </div>
      )}
    </div>
  )
}
