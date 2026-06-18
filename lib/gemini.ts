import Groq from 'groq-sdk'

export interface MoraAIResponse {
  ingredients: string[]
  explanation: string
  tips: string
  matchedProducts?: string[]
  missingProducts?: string[]
}

// In-memory cache to avoid hitting the API for repeated queries
const cache = new Map<string, { result: MoraAIResponse; expiresAt: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function getCached(query: string): MoraAIResponse | null {
  const key = query.toLowerCase().trim()
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.result
}

function setCache(query: string, result: MoraAIResponse): void {
  const key = query.toLowerCase().trim()
  cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS })
}

const SYSTEM_PROMPT = `Kamu adalah MORA AI, asisten platform Aromara untuk rekomendasi bahan parfum Indonesia.

PRODUK TERSEDIA:
Lavender Oil, Patchouli Oil, Vanilla Extract, Rose Oil, Jasmine Absolute, Sandalwood Oil, Bergamot Oil, Ylang Ylang Oil

TUGAS: Rekomendasikan bahan yang cocok dari daftar di atas berdasarkan permintaan pengguna. Jika ada bahan ideal yang tidak ada di daftar, masukkan ke missingProducts.

RESPONSE FORMAT (JSON only, no markdown, no extra text):
{"ingredients":[],"explanation":"","tips":"","matchedProducts":[],"missingProducts":[]}`

export async function askMoraAI(userQuery: string): Promise<MoraAIResponse> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY belum dikonfigurasi. Tambahkan di environment variables.')
  }

  const cached = getCached(userQuery)
  if (cached) return cached

  const groq = new Groq({ apiKey })

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.4,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content || ''

    let response: MoraAIResponse
    try {
      const parsed = JSON.parse(text)
      response = {
        ingredients: parsed.ingredients || [],
        explanation: parsed.explanation || text,
        tips: parsed.tips || 'Konsultasikan dengan supplier untuk formula terbaik.',
        matchedProducts: parsed.matchedProducts || [],
        missingProducts: parsed.missingProducts || [],
      }
    } catch {
      response = {
        ingredients: extractIngredients(text),
        explanation: text,
        tips: 'Hubungi supplier untuk rekomendasi formula yang tepat.',
        matchedProducts: extractIngredients(text),
        missingProducts: [],
      }
    }

    setCache(userQuery, response)
    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Groq API Error:', message)

    if (message.includes('429')) {
      throw new Error('MORA AI sedang sibuk. Coba lagi dalam beberapa detik.')
    }
    if (message.includes('401') || message.includes('api_key')) {
      throw new Error('API Key Groq tidak valid. Hubungi administrator.')
    }

    throw new Error('MORA AI mengalami gangguan. Silakan coba lagi.')
  }
}

function extractIngredients(text: string): string[] {
  const products = [
    'Lavender Oil', 'Patchouli Oil', 'Vanilla Extract',
    'Rose Oil', 'Jasmine Absolute', 'Sandalwood Oil',
    'Bergamot Oil', 'Ylang Ylang Oil',
  ]
  const lower = text.toLowerCase()
  const found = products.filter(p => lower.includes(p.toLowerCase()))
  return found.length > 0 ? found : ['Lavender Oil', 'Vanilla Extract']
}
