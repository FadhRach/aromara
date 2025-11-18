import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('product_categories')
      .select('id, name, description, icon')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Add slug from name
    const categoriesWithSlug = (data || []).map(cat => ({
      ...cat,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-')
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithSlug,
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
