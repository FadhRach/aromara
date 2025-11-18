import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// PUT update category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const categoryId = params.id;

    if (!categoryId || categoryId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      description: description || null,
      updated_at: new Date().toISOString(),
    };

    if (slug) {
      updateData.slug = slug;
    }

    const { data: category, error } = await supabase
      .from('product_categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('Error in PUT category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const categoryId = params.id;

    if (!categoryId || categoryId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (checkError) {
      console.error('Error checking products:', checkError);
      throw checkError;
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing products' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error in DELETE category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
