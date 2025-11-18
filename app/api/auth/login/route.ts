import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    const response = NextResponse.json({ success: true });
    
    // Set cookie with user data (expires in 7 days)
    response.cookies.set('user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to set cookie' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // Delete cookie
  response.cookies.delete('user');
  
  return response;
}
