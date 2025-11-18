import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: categories, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: categories || [] });
  } catch (error: any) {
    console.error('Error in GET categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data: category, error } = await supabase
      .from('product_categories')
      .insert({
        name,
        description: description || null,
        slug: categorySlug,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('Error in POST category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
