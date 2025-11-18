'use client'

import { useState, useRef, useEffect } from 'react'
import { askMoraAI, type MoraAIResponse } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  type: 'user' | 'ai'
  text: string
  timestamp: Date
  aiResponse?: MoraAIResponse
  products?: any[]
  suppliers?: any[]
}

interface MoraAIProps {
  onProductSelect?: (productIds: string[]) => void
}

export default function MoraAI({ onProductSelect }: MoraAIProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Halo! Saya MORA AI, asisten Anda untuk menemukan bahan parfum yang sempurna. Tanyakan apa saja tentang parfum, essential oil, atau bahan aromaterapi! 🌿',
      timestamp: new Date(),
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAsk = async () => {
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setQuery('')
    setLoading(true)

    try {
      // 1. Ask MORA AI
      const aiResponse = await askMoraAI(query)
      
      // 2. Search matching products and suppliers in database
      let products: any[] = []
      let suppliers: any[] = []

      if (aiResponse.matchedProducts && aiResponse.matchedProducts.length > 0) {
        // Search products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            company:supplier_id (
              id,
              name,
              city,
              province,
              profile_img,
              certification_halal,
              certification_coa,
              certification_msds
            )
          `)
          .or(
            aiResponse.matchedProducts
              .map(product => `name.ilike.%${product}%`)
              .join(',')
          )
          .limit(6)

        if (!productsError && productsData) {
          products = productsData
          
          // Get unique suppliers from products
          const uniqueSupplierIds = [...new Set(products.map(p => p.supplier_id))]
          
          if (uniqueSupplierIds.length > 0) {
            const { data: suppliersData, error: suppliersError } = await supabase
              .from('company')
              .select('*')
              .in('id', uniqueSupplierIds)
              .eq('role', 'supplier')
              .eq('is_active', true)

            if (!suppliersError && suppliersData) {
              suppliers = suppliersData
            }
          }
        }
      }

      // 3. Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiResponse.explanation,
        timestamp: new Date(),
        aiResponse,
        products,
        suppliers,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white rounded-2xl border-2 border-[#E1F0C9] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#252F24] to-[#3a4a38] p-6 text-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-[#E1F0C9] p-3 rounded-xl">
            <svg className="w-8 h-8 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">MORA AI Assistant</h2>
            <p className="text-[#E1F0C9] text-sm">Rekomendasi Bahan Parfum & Essential Oil</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAEE]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-[#252F24] text-white rounded-tr-sm'
                    : 'bg-white border-2 border-[#E1F0C9] text-[#252F24] rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/60' : 'text-[#252F24]/60'}`}>
                  {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* AI Response Details */}
              {message.type === 'ai' && message.aiResponse && (
                <div className="mt-3 space-y-3">
                  {/* Ingredients */}
                  {message.aiResponse.ingredients.length > 0 && (
                    <div className="bg-white rounded-xl border-2 border-[#E1F0C9] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <h4 className="font-bold text-[#252F24]">Bahan Rekomendasi</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.aiResponse.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-[#E1F0C9] text-[#252F24] rounded-full font-medium text-sm"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {message.aiResponse.tips && (
                    <div className="bg-white rounded-xl border-2 border-[#E1F0C9] p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-[#252F24] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-bold text-[#252F24] mb-1">Tips Formula</h4>
                          <p className="text-sm text-[#252F24]/80">{message.aiResponse.tips}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Recommendation */}
                  {message.products && message.products.length > 0 && (
                    <div className="bg-white rounded-xl border-2 border-[#E1F0C9] p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h4 className="font-bold text-[#252F24]">Produk Tersedia ({message.products.length})</h4>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex gap-3 p-3 bg-[#FAFAEE] rounded-lg hover:bg-[#E1F0C9]/30 transition group border border-[#252F24]/10"
                          >
                            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-[#252F24]/10">
                              <svg className="w-8 h-8 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-[#252F24] text-sm mb-1">{product.name}</h5>
                              <p className="text-xs text-[#252F24]/60 mb-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {product.company?.name || 'Unknown Supplier'}
                              </p>
                              {product.description && (
                                <p className="text-xs text-[#252F24]/70 line-clamp-2 mb-2">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <Link 
                                  href={`/product/${product.id}`}
                                  className="text-xs px-3 py-1.5 bg-[#252F24] text-white rounded-lg hover:bg-[#252F24]/90 transition font-medium"
                                >
                                  Lihat Detail
                                </Link>
                                <Link
                                  href={`/supplier/${product.supplier_id}/contact`}
                                  className="text-xs px-3 py-1.5 border border-[#252F24] text-[#252F24] rounded-lg hover:bg-[#E1F0C9] transition font-medium"
                                >
                                  Hubungi
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suppliers Recommendation */}
                  {message.suppliers && message.suppliers.length > 0 && (
                    <div className="bg-white rounded-xl border-2 border-[#E1F0C9] p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-[#252F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h4 className="font-bold text-[#252F24]">Supplier Terpercaya ({message.suppliers.length})</h4>
                      </div>
                      <div className="space-y-3">
                        {message.suppliers.map((supplier) => (
                          <Link
                            key={supplier.id}
                            href={`/supplier/${supplier.id}`}
                            className="flex items-center gap-3 p-3 bg-[#FAFAEE] rounded-lg hover:bg-[#E1F0C9]/30 transition border border-[#252F24]/10"
                          >
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 border-2 border-[#E1F0C9]">
                              <span className="text-lg font-bold text-[#252F24]">
                                {supplier.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-[#252F24] text-sm">{supplier.name}</h5>
                              <p className="text-xs text-[#252F24]/60">
                                {supplier.city}, {supplier.province}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {supplier.certification_halal && (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Halal</span>
                                )}
                                {supplier.certification_coa && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">COA</span>
                                )}
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-[#252F24]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Products Alert */}
                  {message.aiResponse.missingProducts && message.aiResponse.missingProducts.length > 0 && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h4 className="font-bold text-amber-900 text-sm mb-1">Produk Belum Tersedia</h4>
                          <p className="text-xs text-amber-800 mb-2">
                            Bahan berikut belum tersedia di platform kami:
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {message.aiResponse.missingProducts.map((product, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-xs font-medium"
                              >
                                {product}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-amber-700">
                            💡 Hubungi admin untuk permintaan khusus
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-[#E1F0C9] rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <div className="flex items-center gap-2 text-[#252F24]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#252F24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#252F24] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#252F24] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">MORA sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-2 border-[#E1F0C9] flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleAsk()}
            placeholder='Contoh: "Saya ingin membuat parfum dengan aroma vanilla yang hangat"'
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#E1F0C9] text-[#252F24] placeholder:text-[#252F24]/40 focus:ring-2 focus:ring-[#252F24] focus:border-transparent outline-none"
            disabled={loading}
          />
          <Button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-[#252F24] hover:bg-[#252F24]/90 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed h-auto"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
        <p className="text-xs text-[#252F24]/50 mt-2 text-center">
          Tanyakan tentang bahan parfum, essential oil, atau komposisi aromaterapi
        </p>
      </div>
    </div>
  )
}
