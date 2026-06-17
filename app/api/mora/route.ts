import { NextResponse } from 'next/server'
import { askMoraAI } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    const response = await askMoraAI(query)

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error: any) {
    console.error('MORA AI error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
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
