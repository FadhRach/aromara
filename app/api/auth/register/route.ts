import { NextRequest, NextResponse } from 'next/server';
import { registerCompany } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await registerCompany({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      phone: body.phone,
      address: body.address,
      city: body.city,
      province: body.province,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Gagal membuat akun' },
        { status: 400 }
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
