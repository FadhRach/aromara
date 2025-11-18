"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import IonIcon from "@/components/shared/IonIcon";
import { getProductPrimaryImage } from "@/lib/image-utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  minimum_order: number;
  category_id: string;
  supplier_id: string;
  product_categories: {
    id: string;
    name: string;
  } | null;
  product_images: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
  company: {
    id: string;
    name: string;
    city: string;
    province: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ExploreProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (
            id,
            name
          ),
          product_images (
            id,
            image_url,
            is_primary,
            sort_order
          ),
          company (
            id,
            name,
            city,
            province
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Sort product images
      const productsWithSortedImages = (data || []).map((product: any) => ({
        ...product,
        product_images: product.product_images?.sort((a: any, b: any) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.sort_order || 0) - (b.sort_order || 0);
        })
      }));

      setProducts(productsWithSortedImages || []);
      setFilteredProducts(productsWithSortedImages || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category_id === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.product_categories?.name.toLowerCase().includes(query) ||
        product.company?.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleImageError = (productId: string, imageUrl: string) => {
    // Silently mark as error without console spam
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getProductImage = (product: Product) => {
    if (!product.product_images || product.product_images.length === 0) {
      return null;
    }
    
    const imageUrl = getProductPrimaryImage(product.product_images);
    
    // Filter out external/dummy URLs - only use Supabase Storage
    if (imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/product-images/')) {
      return imageUrl;
    }
    
    // Return null for Unsplash or other external URLs (will show placeholder)
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#252F24] mb-2">
            Explore Products
          </h1>
          <p className="text-sm md:text-base text-[#252F24]/70">
            {filteredProducts.length} Products Available
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <IonIcon name="search-outline" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#252F24]/50 text-xl" />
            <Input
              type="text"
              placeholder="Search products, categories, or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white border-[#252F24]/20 rounded-xl text-[#252F24] placeholder:text-[#252F24]/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3">
            <Card className="bg-[#E1F0C9] border-none shadow-sm rounded-lg sticky top-36">
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#252F24] mb-3 text-sm">Filter by Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 hover:bg-[#252F24]/5 rounded-md cursor-pointer transition group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 border-2 border-[#252F24]/40 rounded-full peer-checked:border-[#252F24] peer-checked:bg-[#252F24] transition flex items-center justify-center">
                      {selectedCategory === "all" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm text-[#252F24] group-hover:text-[#252F24] font-medium">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 p-2 hover:bg-[#252F24]/5 rounded-md cursor-pointer transition group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 border-2 border-[#252F24]/40 rounded-full peer-checked:border-[#252F24] peer-checked:bg-[#252F24] transition flex items-center justify-center">
                        {selectedCategory === category.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm text-[#252F24] group-hover:text-[#252F24]">{category.name}</span>
                    </label>
                  ))}
                </div>

                {/* Reset Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-[#252F24]/30 hover:bg-[#252F24]/5 text-[#252F24] text-sm h-9 rounded-lg font-medium"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#252F24]/70">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <IonIcon name="cube-outline" className="text-6xl text-[#252F24]/30 mb-4" />
                <p className="text-[#252F24]/70 text-lg">No products found</p>
                <p className="text-[#252F24]/50 text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-white border-none hover:shadow-xl transition-all rounded-xl overflow-hidden group">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {(() => {
                          const imageUrl = getProductImage(product);
                          const hasError = imageErrors.has(product.id);
                          
                          // Only render if we have a valid Supabase Storage URL
                          if (imageUrl && !hasError) {
                            return (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={() => handleImageError(product.id, imageUrl)}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            );
                          }
                          
                          // Show placeholder for products without valid images
                          return (
                            <div className="flex flex-col items-center justify-center h-full">
                              <IonIcon name="image-outline" className="text-6xl text-gray-400" />
                              <p className="text-xs text-gray-500 mt-2">No image available</p>
                            </div>
                          );
                        })()}
                        
                        {/* Category Badge */}
                        {product.product_categories && (
                          <Badge className="absolute top-3 left-3 bg-[#252F24] text-white text-xs">
                            {product.product_categories.name}
                          </Badge>
                        )}

                        {/* Stock Badge */}
                        {product.stock_quantity > 0 ? (
                          <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-[#252F24] text-lg mb-1 hover:underline line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Supplier Info */}
                        {product.company && (
                          <Link href={`/supplier/${product.supplier_id}`}>
                            <p className="text-xs text-[#252F24]/60 mb-2 hover:underline flex items-center gap-1">
                              <IonIcon name="business-outline" className="text-sm" />
                              {product.company.name}
                            </p>
                          </Link>
                        )}

                        {/* Description */}
                        <p className="text-sm text-[#252F24]/70 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price & MOQ */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-[#252F24]/60">Price</p>
                            <p className="text-lg font-bold text-[#252F24]">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#252F24]/60">MOQ</p>
                            <p className="text-sm font-semibold text-[#252F24]">
                              {product.minimum_order} units
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            asChild
                            className="flex-1 bg-[#252F24] hover:bg-[#252F24]/90 text-white rounded-lg text-sm h-9"
                          >
                            <Link href={`/product/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="border-[#252F24]/30 text-[#252F24] hover:bg-[#252F24]/5 rounded-lg text-sm h-9 px-3"
                          >
                            <Link href={`/request-quote?product=${product.id}`}>
                              <IonIcon name="mail-outline" className="text-lg" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
