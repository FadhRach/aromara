import { NextRequest, NextResponse } from 'next/server';
import { loginWithEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle credential validation when email+password are provided
    if (body.email && body.password) {
      const result = await loginWithEmail(body.email, body.password);

      if (!result.success || !result.data) {
        return NextResponse.json(
          { success: false, error: result.error || 'Email atau password salah' },
          { status: 401 }
        );
      }

      const response = NextResponse.json({ success: true, data: result.data });
      response.cookies.set('user', JSON.stringify(result.data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Email dan password diperlukan' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('user');
  return response;
}
