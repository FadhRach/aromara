"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  image_product?: string;
  price_per_unit: number;
  min_order_qty: number;
  min_order_unit: string;
  stock_status: string;
  is_pre_order: boolean;
  product_video_url?: string;
  available_quantities?: string;
  supplier_id: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductIngredient {
  id: string;
  ingredient_name: string;
  description?: string;
  percentage?: number;
}

interface Supplier {
  id: string;
  name: string;
  city: string;
  province: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch supplier
      const { data: supplierData, error: supplierError } = await supabase
        .from('company')
        .select('id, name, city, province')
        .eq('id', productData.supplier_id)
        .single();

      if (supplierError) throw supplierError;
      setSupplier(supplierData);

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (!imagesError && imagesData && imagesData.length > 0) {
        setImages(imagesData);
        const primaryImage = imagesData.find(img => img.is_primary) || imagesData[0];
        setSelectedImage(primaryImage.image_url);
      } else if (productData.image_product) {
        setSelectedImage(productData.image_product);
      }

      // Fetch product ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('product_ingredients')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (!ingredientsError) {
        setIngredients(ingredientsData || []);
      }

    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-[#252F24]/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product || !supplier) {
    return (
      <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-[#252F24]/70">Product not found</p>
        </div>
      </div>
    );
  }

  const availableQty = product.available_quantities 
    ? JSON.parse(product.available_quantities) 
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
              {selectedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">🌿</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden ${
                    selectedImage === img.image_url ? 'ring-2 ring-[#252F24]' : ''
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.image_url}
                      alt={`${product.name} ${img.sort_order}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Video */}
            {product.product_video_url && (
              <div className="mt-4">
                <h3 className="font-semibold text-[#252F24] mb-2">Video Produk</h3>
                <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
                  <span className="text-6xl">▶️</span>
                </div>
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Supplier Info */}
            <Link 
              href={`/supplier/${supplier.id}`}
              className="inline-block mb-4 hover:underline"
            >
              <p className="text-sm text-[#252F24]/70">
                {supplier.city}, {supplier.province}
              </p>
            </Link>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-[#252F24] mb-2">
              {product.name}
            </h1>

            {/* Status Badge */}
            <div className="mb-4">
              {product.is_pre_order ? (
                <Badge className="bg-red-500 text-white">Pre-order</Badge>
              ) : product.stock_status === 'ready_stock' ? (
                <Badge className="bg-green-600 text-white">Ready Stock</Badge>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-[#252F24]/80 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Product Features */}
            <Card className="bg-white border-none mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#252F24] mb-4">Keunggulan Produk</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#252F24]">100% Murni & Alami</p>
                    <p className="text-[#252F24]/70">
                      Diekstraksi dari bunga melati segar dan disuling menggunakan teknik distilasi uap modern untuk menjaga kemurnian, aroma, dan kualitas.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#252F24]">Kualitas Terapeutik</p>
                    <p className="text-[#252F24]/70">
                      Mengandung senyawa alami seperti Benzyl Acetate, Indole, dan Linalool yang terkenal dengan efek menenangkan, meningkatkan mood, dan merawat kulit.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#252F24]">Aplikasi Serbaguna</p>
                    <p className="text-[#252F24]/70">
                      Aromaterapi: Cocok untuk melelengkan kulit terasa dan relaksasi, meresapi aura sensasi halus yang memperbaiki karakter parfum berkualitas.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#252F24]">Diproduksi Secara Berkelanjutan</p>
                    <p className="text-[#252F24]/70">
                      Dioleh dengan tanaman dan bunga melati secara dari luas tanaman terbiasa bersama kelanjutan lingkaran produksi berkelas kecil untuk menjaga kualitas serta menganungi iptak
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients/Composition */}
            {ingredients.length > 0 && (
              <Card className="bg-white border-none mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#252F24] mb-4">Kemasan Premium</h3>
                  <p className="text-sm text-[#252F24]/80 mb-3">
                    Dikemas dalam botol kaca 10 ML dengan tutup tetes yang aman dan travel packaging untuk menjaga kualitas dan kesegaran aroma.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="flex items-start gap-2">
                        <span className="text-[#252F24]/70">•</span>
                        <div>
                          <span className="font-medium">{ingredient.ingredient_name}</span>
                          {ingredient.description && (
                            <span className="text-[#252F24]/70"> - {ingredient.description}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Order Section */}
            <Card className="bg-[#E8F5E9] border-none">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-[#252F24]/70 mb-2">
                    min order: {product.min_order_qty}{product.min_order_unit}
                  </p>
                  {availableQty.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[#252F24] mb-2">Available Quantities:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableQty.map((qty: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-white">
                            {qty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  className="w-full bg-[#252F24] hover:bg-[#252F24]/90 text-white"
                  size="lg"
                >
                  <Link href={`/supplier/${supplier.id}/contact`}>
                    Kirim Permintaan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
