import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get('supplier_id');

    if (!supplier_id) {
      return NextResponse.json(
        { success: false, error: 'supplier_id is required' },
        { status: 400 }
      );
    }

    const { data: company, error } = await supabase
      .from('company')
      .select('*')
      .eq('id', supplier_id)
      .eq('role', 'supplier')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error in GET /api/supplier/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { supplier_id, ...updateData } = body;

    if (!supplier_id) {
      return NextResponse.json(
        { success: false, error: 'supplier_id is required' },
        { status: 400 }
      );
    }

    const { data: company, error } = await supabase
      .from('company')
      .update(updateData)
      .eq('id', supplier_id)
      .eq('role', 'supplier')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: company 
    });
  } catch (error) {
    console.error('Error in PUT /api/supplier/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
