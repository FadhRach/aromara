import { NextResponse } from 'next/server'
import { askMoraAI } from '@/lib/gemini'

export async function POST(request: Request) {
  console.log('🔥 MORA API Called')
  
  try {
    const body = await request.json()
    console.log('📝 Request Body:', body)
    
    const { query } = body

    if (!query) {
      console.log('❌ No query provided')
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    console.log('🤖 Calling Gemini AI with query:', query)
    const response = await askMoraAI(query)
    console.log('✅ Gemini Response:', response)

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error: any) {
    console.error('❌ MORA AI API Error:', error)
    console.error('Error Stack:', error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'MORA AI API is running',
    timestamp: new Date().toISOString()
  })
}
