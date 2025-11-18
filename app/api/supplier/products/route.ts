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

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        ),
        product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching products:', error);
      throw error;
    }

    console.log(`Fetched ${products?.length || 0} products for supplier ${supplierId}`);
    
    // Sort product images - primary first, then by sort_order
    const productsWithSortedImages = products?.map((product: any) => ({
      ...product,
      product_images: product.product_images?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order || 0) - (b.sort_order || 0);
      })
    }));

    return NextResponse.json({ success: true, data: productsWithSortedImages || [] });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { supplier_id, category_id, images, ...productData } = body;

    if (!supplier_id) {
      return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 });
    }

    // Insert product first
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        supplier_id,
        category_id,
        ...productData,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert product images if provided
    if (images && images.length > 0) {
      const imageRecords = images.map((img: any, index: number) => ({
        product_id: product.id,
        image_url: img.image_url,
        is_primary: img.is_primary || false,
        sort_order: img.sort_order !== undefined ? img.sort_order : index
      }));

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imageRecords);

      if (imagesError) {
        console.error('Error inserting images:', imagesError);
        throw imagesError; // Fail operation if images fail
      } else {
        console.log(`Inserted ${imageRecords.length} images for product ${product.id}`);
      }
    }

    // Fetch complete product with images
    const { data: completeProduct } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        ),
        product_images (
          id,
          image_url,
          is_primary,
          sort_order
        )
      `)
      .eq('id', product.id)
      .single();

    return NextResponse.json({ success: true, data: completeProduct || product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
