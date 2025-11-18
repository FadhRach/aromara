'use client'

import { useState, useEffect } from 'react'

export default function TestGemini() {
  const [query, setQuery] = useState('Saya ingin membuat parfum dengan aroma vanilla yang hangat')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('Checking...')

  // Check API Key on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const res = await fetch('/api/mora')
        const data = await res.json()
        setApiKeyStatus(`✅ API Ready: ${data.status}`)
        console.log('✅ API Health Check:', data)
      } catch (err) {
        setApiKeyStatus('❌ API Not Ready')
        console.error('❌ API Health Check Failed:', err)
      }
    }
    checkAPI()
  }, [])

  const testAPI = async () => {
    console.log('🚀 Testing Gemini API...')
    console.log('📝 Query:', query)
    
    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('📡 Sending request to /api/mora')
      const res = await fetch('/api/mora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      console.log('📥 Response status:', res.status)
      const data = await res.json()
      console.log('📦 Response data:', data)

      if (data.success) {
        console.log('✅ API Success!')
        setResult(data.data)
      } else {
        console.error('❌ API Error:', data.error)
        setError(data.error || data.details || 'Unknown error')
      }
    } catch (err: any) {
      console.error('❌ Fetch Error:', err)
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1F0C9]/20 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#252F24] mb-2">Test Gemini AI & Font Lexend</h1>
          <p className="text-gray-600 mb-4">
            Font ini menggunakan <strong>Lexend</strong> - jika terlihat modern dan clean berarti sudah berhasil!
          </p>
          
          {/* API Status */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm font-mono text-gray-700">{apiKeyStatus}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#252F24] mb-2">
                Query untuk MORA AI:
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#252F24] focus:ring-2 focus:ring-[#E1F0C9] outline-none transition"
                rows={3}
              />
            </div>

            <button
              onClick={testAPI}
              disabled={loading}
              className="w-full px-6 py-4 bg-[#252F24] text-white rounded-xl font-bold hover:bg-[#1a2119] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? '⏳ Testing Gemini API...' : '🚀 Test Gemini API'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
                <div className="mt-4 text-sm text-red-600">
                  <p className="font-semibold">Troubleshooting:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Pastikan API Key sudah di set di .env.local</li>
                    <li>Restart dev server setelah update .env.local</li>
                    <li>API Key bisa didapat gratis di: https://makersuite.google.com/app/apikey</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Display */}
        {result && (
          <div className="bg-[#E1F0C9]/30 border-2 border-[#E1F0C9] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="font-bold text-[#252F24] text-2xl">API Key Valid!</h3>
                <p className="text-gray-600">Gemini AI berhasil merespons</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Explanation */}
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-bold text-[#252F24] mb-3 text-lg flex items-center gap-2">
                  💡 Penjelasan
                </h4>
                <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
              </div>

              {/* Ingredients */}
              {result.ingredients && result.ingredients.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-[#252F24] mb-3 text-lg flex items-center gap-2">
                    🌿 Bahan Rekomendasi
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredients.map((ing: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-[#252F24] text-white rounded-lg font-semibold"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {result.matchedProducts && result.matchedProducts.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-[#252F24] mb-3 text-lg flex items-center gap-2">
                    ✅ Produk Tersedia
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedProducts.map((prod: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Products */}
              {result.missingProducts && result.missingProducts.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-[#252F24] mb-3 text-lg flex items-center gap-2">
                    ⚠️ Produk Belum Tersedia
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingProducts.map((prod: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {result.tips && (
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-[#252F24] mb-3 text-lg flex items-center gap-2">
                    📝 Tips Formula
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{result.tips}</p>
                </div>
              )}
            </div>

            {/* Font Test */}
            <div className="mt-8 bg-gradient-to-r from-[#252F24] to-[#3a4a38] rounded-xl p-6 text-white">
              <h4 className="font-bold text-2xl mb-4">Font Lexend Test</h4>
              <div className="space-y-2">
                <p className="font-light">Font Weight 300 (Light): The quick brown fox jumps</p>
                <p className="font-normal">Font Weight 400 (Regular): The quick brown fox jumps</p>
                <p className="font-medium">Font Weight 500 (Medium): The quick brown fox jumps</p>
                <p className="font-semibold">Font Weight 600 (Semibold): The quick brown fox jumps</p>
                <p className="font-bold">Font Weight 700 (Bold): The quick brown fox jumps</p>
                <p className="font-extrabold">Font Weight 800 (Extrabold): The quick brown fox jumps</p>
              </div>
              <p className="mt-4 text-[#E1F0C9] text-sm">
                Jika semua terlihat modern dan clean dengan spacing yang baik = Lexend berhasil! ✨
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-[#252F24] text-xl mb-4">📋 Checklist:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-[#252F24]">Font Lexend</p>
                <p className="text-sm text-gray-600">Teks harus terlihat modern, clean, dengan spacing yang baik</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-[#252F24]">Gemini API</p>
                <p className="text-sm text-gray-600">Klik tombol test di atas untuk validasi API key</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-[#252F24]">URL Test</p>
                <p className="text-sm text-gray-600 font-mono">http://localhost:3000/test-gemini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
