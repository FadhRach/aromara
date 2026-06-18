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
          qty,
          unit,
          target_price,
          products (
            id,
            name
          )
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { inquiry_id, status } = body;

    if (!inquiry_id || !status) {
      return NextResponse.json(
        { success: false, error: 'inquiry_id and status are required' },
        { status: 400 }
      );
    }

    const { data: inquiry, error } = await supabase
      .from('inquiry')
      .update({ status })
      .eq('id', inquiry_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
