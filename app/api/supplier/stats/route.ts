import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplier_id');

    if (!supplierId) {
      return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 });
    }

    // Get dashboard stats
    const [productsResult, inquiriesResult, companyResult] = await Promise.all([
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('supplier_id', supplierId),
      
      supabase
        .from('inquiry')
        .select('id, status', { count: 'exact' })
        .eq('supplier_id', supplierId),
      
      supabase
        .from('company')
        .select('response_rate')
        .eq('id', supplierId)
        .single(),
    ]);

    const totalProducts = productsResult.count || 0;
    const totalInquiries = inquiriesResult.count || 0;
    const pendingInquiries = inquiriesResult.data?.filter(i => i.status === 'pending').length || 0;
    const responseRate = companyResult.data?.response_rate || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalInquiries,
        pendingInquiries,
        responseRate,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
