"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Supplier {
  id: string;
  name: string;
  company_description: string;
  address: string;
  city: string;
  province: string;
  established_year: number;
  shipping_coverage: string;
  certification_halal: boolean;
  certification_coa: boolean;
  certification_msds: boolean;
  total_supply_partners: number;
  company_video_url?: string;
  profile_img?: string;
}

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
}

interface Capability {
  id: string;
  capability_type: string;
  description: string;
}

export default function SupplierProfilePage() {
  const params = useParams();
  const supplierId = params?.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId]);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);

      // Fetch supplier details
      const { data: supplierData, error: supplierError } = await supabase
        .from('company')
        .select('*')
        .eq('id', supplierId)
        .eq('role', 'supplier')
        .single();

      if (supplierError) throw supplierError;
      setSupplier(supplierData);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', supplierId);

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch capabilities
      const { data: capabilitiesData, error: capabilitiesError } = await supabase
        .from('supplier_capabilities')
        .select('*')
        .eq('supplier_id', supplierId);

      if (capabilitiesError) throw capabilitiesError;
      setCapabilities(capabilitiesData || []);

    } catch (error) {
      console.error('Error fetching supplier data:', error);
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

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-[#252F24]/70">Supplier not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Supplier Info */}
          <div className="lg:col-span-1">
            <Card className="bg-[#E8F5E9] border-none sticky top-32">
              <CardContent className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAFAEE] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#252F24]">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-[#252F24] text-center mb-2">
                  {supplier.name}
                </h2>

                {/* Address */}
                <p className="text-sm text-[#252F24]/70 text-center mb-6">
                  {supplier.address}
                </p>

                <div className="space-y-4 mb-6">
                  {/* Established */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAEE] flex items-center justify-center">
                      <span>📅</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#252F24]/70">Semenjak</p>
                      <p className="text-sm font-medium">{supplier.established_year}</p>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAEE] flex items-center justify-center">
                      <span>🚚</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#252F24]/70">Pengiriman</p>
                      <p className="text-sm font-medium">{supplier.shipping_coverage}</p>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAEE] flex items-center justify-center">
                      <span>📜</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#252F24]/70">Sertifikasi</p>
                      <p className="text-sm font-medium">
                        {supplier.certification_halal && 'Halal'}
                        {supplier.certification_halal && supplier.certification_coa && ', '}
                        {supplier.certification_coa && 'COA'}
                      </p>
                    </div>
                  </div>

                  {/* Supply Partners */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAEE] flex items-center justify-center">
                      <span>🏭</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#252F24]/70">Supply</p>
                      <p className="text-sm font-medium">{supplier.total_supply_partners} Perusahaan</p>
                    </div>
                  </div>
                </div>

                {/* Capabilities */}
                {capabilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#252F24] mb-3">Capabilities</h3>
                    <div className="space-y-2">
                      {capabilities.map((cap) => (
                        <div key={cap.id} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#FAFAEE] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs">✓</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{cap.capability_type}</p>
                            {cap.description && (
                              <p className="text-xs text-[#252F24]/70">{cap.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Video */}
                {supplier.company_video_url && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#252F24] mb-3">Company Video</h3>
                    <div className="aspect-video bg-[#FAFAEE] rounded-lg flex items-center justify-center">
                      <span className="text-4xl">▶️</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Products */}
          <div className="lg:col-span-2">
            {/* Contact Button */}
            <div className="mb-6">
              <Button
                asChild
                className="bg-[#252F24] hover:bg-[#252F24]/90 text-white rounded-full px-8 w-full md:w-auto"
              >
                <Link href={`/supplier/${supplierId}/contact`}>
                  Hubungi Suplier
                </Link>
              </Button>
            </div>

            {/* Description */}
            <Card className="bg-white border-none mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#252F24] mb-3">Deskripsi</h3>
                <p className="text-sm text-[#252F24]/80 leading-relaxed">
                  {supplier.company_description}
                </p>
              </CardContent>
            </Card>

            {/* Products */}
            <div>
              <h3 className="text-xl font-bold text-[#252F24] mb-4">
                Produk {supplier.name}
              </h3>

              {products.length === 0 ? (
                <p className="text-[#252F24]/70">No products available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-white border-none overflow-hidden hover:shadow-lg transition">
                      <div className="relative">
                        {/* Product Image */}
                        <div className="aspect-square bg-[#E8F5E9] relative">
                          {product.image_product ? (
                            <Image
                              src={product.image_product}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">🌿</span>
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        {product.is_pre_order ? (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                            Pre-order
                          </Badge>
                        ) : product.stock_status === 'ready_stock' ? (
                          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                            Ready Stock
                          </Badge>
                        ) : null}
                      </div>

                      <CardContent className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h4 className="font-semibold text-[#252F24] mb-2 hover:underline">
                            {product.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-[#252F24]/70 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-sm text-[#252F24]/60 mb-3">
                          min order: {product.min_order_qty}{product.min_order_unit}
                        </p>
                        <Button
                          asChild
                          className="w-full bg-[#252F24] hover:bg-[#252F24]/90 text-white"
                        >
                          <Link href={`/product/${product.id}`}>
                            Pesan
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
