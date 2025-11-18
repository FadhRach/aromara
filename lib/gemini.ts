import { GoogleGenerativeAI } from '@google/generative-ai'

// Inisialisasi Gemini AI
// API Key gratis bisa didapat di: https://makersuite.google.com/app/apikey
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDEMO_KEY'
)

export interface MoraAIResponse {
  ingredients: string[]
  explanation: string
  tips: string
  matchedProducts?: string[]
  missingProducts?: string[]
}

export async function askMoraAI(userQuery: string): Promise<MoraAIResponse> {
  try {
    // Model updated to Gemini 2.5 Flash (Nov 2025) - Fast & FREE
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' })

    const prompt = `Anda adalah MORA AI, asisten cerdas untuk platform Aromara yang membantu buyer menemukan bahan baku parfum berkualitas dari Indonesia.

USER REQUEST: "${userQuery}"

Produk yang TERSEDIA di database kami:
1. Lavender Oil - Aroma floral segar dan menenangkan
2. Patchouli Oil - Aroma earthy, woody, dan eksotis
3. Vanilla Extract - Aroma manis dan hangat
4. Rose Oil - Aroma floral elegan dan romantis
5. Jasmine Absolute - Aroma floral manis dan sensual
6. Sandalwood Oil - Aroma woody creamy dan spiritual
7. Bergamot Oil - Aroma citrus segar dan ceria
8. Ylang Ylang Oil - Aroma floral manis dan eksotis

TUGAS ANDA:
1. Analisis apa yang user inginkan (jenis aroma, karakteristik parfum)
2. Rekomendasikan bahan-bahan dari daftar di atas yang COCOK
3. Jika ada bahan yang TIDAK ADA di database tapi seharusnya diperlukan, sebutkan di "missingProducts"
4. Berikan tips formula dan komposisi yang baik

FORMAT RESPONSE (JSON):
{
  "ingredients": ["nama bahan1", "nama bahan2"],
  "explanation": "penjelasan mengapa bahan-bahan ini cocok untuk kebutuhan user",
  "tips": "tips komposisi dan cara penggunaan",
  "matchedProducts": ["produk yang ada di database yang cocok"],
  "missingProducts": ["produk yang tidak ada tapi diperlukan"]
}

PENTING:
- Gunakan bahasa Indonesia yang natural
- Hanya rekomendasikan produk yang ADA di database untuk matchedProducts
- Untuk missingProducts, sebutkan bahan lain yang ideal tapi belum tersedia
- Berikan penjelasan yang praktis untuk industri parfum

Response Anda:`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse JSON response
    try {
      // Extract JSON dari response (kadang AI bisa kasih markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          ingredients: parsed.ingredients || [],
          explanation: parsed.explanation || text,
          tips: parsed.tips || 'Konsultasikan dengan supplier untuk formula terbaik',
          matchedProducts: parsed.matchedProducts || [],
          missingProducts: parsed.missingProducts || []
        }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
    }

    // Fallback: extract dari teks biasa
    return {
      ingredients: extractIngredients(text),
      explanation: text,
      tips: 'Hubungi supplier untuk mendapatkan rekomendasi formula yang tepat',
      matchedProducts: extractIngredients(text),
      missingProducts: []
    }

  } catch (error: any) {
    console.error('Gemini API Error:', error)
    
    // Error handling yang lebih baik
    if (error.message?.includes('API_KEY')) {
      throw new Error('API Key tidak valid. Silakan hubungi administrator.')
    }
    
    throw new Error('MORA AI sedang sibuk. Silakan coba lagi dalam beberapa saat.')
  }
}

function extractIngredients(text: string): string[] {
  const availableProducts = [
    'Lavender Oil', 'Patchouli Oil', 'Vanilla Extract', 
    'Rose Oil', 'Jasmine Absolute', 'Sandalwood Oil',
    'Bergamot Oil', 'Ylang Ylang Oil'
  ]
  
  const found: string[] = []
  const lowerText = text.toLowerCase()
  
  availableProducts.forEach(product => {
    if (lowerText.includes(product.toLowerCase())) {
      found.push(product)
    }
  })
  
  return found.length > 0 ? found : ['Lavender Oil', 'Vanilla Extract']
}
