import { GoogleGenerativeAI } from '@google/generative-ai'

export interface MoraAIResponse {
  ingredients: string[]
  explanation: string
  tips: string
  matchedProducts?: string[]
  missingProducts?: string[]
}

const MAX_RETRIES = 3

async function callWithRetry(fn: () => Promise<any>): Promise<any> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      const is429 = error.message?.includes('429') || error.status === 429
      const isLastAttempt = attempt === MAX_RETRIES - 1

      if (is429 && !isLastAttempt) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = 2000 * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      throw error
    }
  }
}

export async function askMoraAI(userQuery: string): Promise<MoraAIResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi. Tambahkan di Vercel Environment Variables.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Kamu adalah MORA AI, asisten platform Aromara untuk rekomendasi bahan parfum Indonesia.

PERMINTAAN: "${userQuery}"

PRODUK TERSEDIA:
Lavender Oil, Patchouli Oil, Vanilla Extract, Rose Oil, Jasmine Absolute, Sandalwood Oil, Bergamot Oil, Ylang Ylang Oil

TUGAS: Rekomendasikan bahan yang cocok dari daftar di atas. Jika ada bahan ideal yang tidak ada di daftar, masukkan ke missingProducts.

RESPONSE (JSON only, no markdown):
{"ingredients":[],"explanation":"","tips":"","matchedProducts":[],"missingProducts":[]}`

  try {
    const result = await callWithRetry(() => model.generateContent(prompt))
    const text = result.response.text()

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          ingredients: parsed.ingredients || [],
          explanation: parsed.explanation || text,
          tips: parsed.tips || 'Konsultasikan dengan supplier untuk formula terbaik.',
          matchedProducts: parsed.matchedProducts || [],
          missingProducts: parsed.missingProducts || []
        }
      }
    } catch {
      // fallthrough to text extraction
    }

    return {
      ingredients: extractIngredients(text),
      explanation: text,
      tips: 'Hubungi supplier untuk rekomendasi formula yang tepat.',
      matchedProducts: extractIngredients(text),
      missingProducts: []
    }

  } catch (error: any) {
    console.error('Gemini API Error:', error.message)

    if (error.message?.includes('429')) {
      throw new Error('MORA AI sedang sibuk karena banyak permintaan. Tunggu beberapa detik lalu coba lagi.')
    }
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      throw new Error('API Key Gemini tidak valid. Hubungi administrator.')
    }

    throw new Error('MORA AI mengalami gangguan. Silakan coba lagi.')
  }
}

function extractIngredients(text: string): string[] {
  const products = [
    'Lavender Oil', 'Patchouli Oil', 'Vanilla Extract',
    'Rose Oil', 'Jasmine Absolute', 'Sandalwood Oil',
    'Bergamot Oil', 'Ylang Ylang Oil'
  ]
  const lower = text.toLowerCase()
  const found = products.filter(p => lower.includes(p.toLowerCase()))
  return found.length > 0 ? found : ['Lavender Oil', 'Vanilla Extract']
}
