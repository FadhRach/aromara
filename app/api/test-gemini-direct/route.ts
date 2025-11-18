import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key found' }, { status: 500 })
    }

    console.log('🔑 API Key:', apiKey.substring(0, 10) + '...')

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Gemini 2.5 Flash - Latest model (Nov 2025)
    const modelName = 'gemini-2.5-flash-preview-05-20'
    
    console.log(`Testing ${modelName}...`)
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent('Say hello in Indonesian')
    const response = result.response
    const text = response.text()
    
    return NextResponse.json({
      success: true,
      model: modelName,
      response: text,
      message: `✅ ${modelName} WORKS!`,
      apiKeyValid: true
    })

  } catch (error: any) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
