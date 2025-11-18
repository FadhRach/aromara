import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplier_id');
    const status = searchParams.get('status');

    if (!supplierId) {
      return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 });
    }

    let query = supabase
      .from('inquiry')
      .select(`
        *,
        buyer:company!inquiry_buyer_id_fkey (
          id,
          name,
          email,
          phone,
          city,
          province
        ),
        inquiry_items (
          id,
          product_id,
          product_name,
          qty,
          unit,
          notes
        )
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: inquiries, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id, status } = body;

    const { data: inquiry, error } = await supabase
      .from('inquiry')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
