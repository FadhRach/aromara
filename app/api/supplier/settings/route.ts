import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { action, supplier_id } = body;

    if (!supplier_id) {
      return NextResponse.json(
        { success: false, error: 'supplier_id diperlukan' },
        { status: 400 }
      );
    }

    if (action === 'change_password') {
      const { current_password, new_password } = body;

      if (!current_password || !new_password) {
        return NextResponse.json(
          { success: false, error: 'Password lama dan baru diperlukan' },
          { status: 400 }
        );
      }

      const currentHash = hashPassword(current_password);

      const { data: company, error: fetchError } = await supabase
        .from('company')
        .select('id, password')
        .eq('id', supplier_id)
        .single();

      if (fetchError || !company) {
        return NextResponse.json(
          { success: false, error: 'Akun tidak ditemukan' },
          { status: 404 }
        );
      }

      if (company.password !== currentHash) {
        return NextResponse.json(
          { success: false, error: 'Password lama tidak sesuai' },
          { status: 401 }
        );
      }

      const newHash = hashPassword(new_password);
      const { error: updateError } = await supabase
        .from('company')
        .update({ password: newHash })
        .eq('id', supplier_id);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true, message: 'Password berhasil diubah' });
    }

    return NextResponse.json(
      { success: false, error: 'Action tidak dikenal' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in settings API:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
