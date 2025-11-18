import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const params = await context.params;
    const productId = params.id;

    if (!productId || productId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    console.log('Updating product:', productId);

    const { data: product, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const params = await context.params;
    const productId = params.id;

    if (!productId || productId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    console.log('Deleting product:', productId);

    // First delete product images from storage
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId);

    if (images && images.length > 0) {
      // Extract paths from URLs and delete from storage
      const paths = images.map(img => {
        const url = new URL(img.image_url);
        return url.pathname.replace('/storage/v1/object/public/product-images/', '');
      });

      if (paths.length > 0) {
        await supabase.storage
          .from('product-images')
          .remove(paths);
      }
    }

    // Delete product (will cascade delete product_images due to FK)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
