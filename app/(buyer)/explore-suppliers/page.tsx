"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MoraAIBanner from "@/components/shared/MoraAIBanner";

interface Supplier {
  id: string;
  name: string;
  company_description: string;
  established_year: number;
  certification_halal: boolean;
  certification_coa: boolean;
  certification_msds: boolean;
  shipping_coverage: string;
  city: string;
  province: string;
  total_supply_partners: number;
  profile_img?: string;
  product_count: number;
}

export default function ExploreSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Read search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      // Get suppliers with product count
      const { data: suppliersData, error } = await supabase
        .from('company')
        .select(`
          id,
          name,
          company_description,
          established_year,
          certification_halal,
          certification_coa,
          certification_msds,
          shipping_coverage,
          city,
          province,
          total_supply_partners,
          profile_img
        `)
        .eq('role', 'supplier')
        .eq('is_active', true);

      if (error) throw error;

      // Get product counts for each supplier
      const suppliersWithCount = await Promise.all(
        (suppliersData || []).map(async (supplier: any) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('supplier_id', supplier.id);

          return {
            ...supplier,
            product_count: count || 0,
          };
        })
      );

      setSuppliers(suppliersWithCount);
      setFilteredSuppliers(suppliersWithCount);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter suppliers based on region and search query
  useEffect(() => {
    let filtered = [...suppliers];

    if (selectedRegion !== "all") {
      filtered = filtered.filter(s => s.province === selectedRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(q) ||
          s.company_description?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q)
      );
    }

    setFilteredSuppliers(filtered);
  }, [selectedRegion, searchQuery, suppliers]);

  // Unique regions with supplier counts from real data
  const regionCounts = suppliers.reduce<Record<string, number>>((acc, s) => {
    if (s.province) acc[s.province] = (acc[s.province] || 0) + 1;
    return acc;
  }, {});
  const regions = Object.keys(regionCounts).sort(
    (a, b) => regionCounts[b] - regionCounts[a]
  );

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 md:pt-36 pb-16">
      {/* MORA AI Banner - Only on this page */}
      <MoraAIBanner />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#252F24] mb-1">
            Explore Suppliers
          </h1>
          <p className="text-sm md:text-base text-[#252F24]/70">
            {filteredSuppliers.length} Product dan Service • {suppliers.length} Suplier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sidebar Filters - Sticky on Desktop */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-280px)]">
            {/* Filter Title - Fixed */}
            <div className="mb-3">
              <h2 className="text-lg font-bold text-[#252F24]">Filter</h2>
            </div>
            
            {/* Filter Cards - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-2">
                {/* Region Filter Card */}
                <Card className="bg-[#E1F0C9] border-none shadow-sm rounded-lg">
                  <CardContent className="p-2">
                    <h3 className="font-semibold text-[#252F24] mb-1.5 text-sm">Wilayah Pemasok</h3>
                  <div className="space-y-0.5">
                    <label className="flex items-center gap-2 p-1 hover:bg-[#252F24]/5 rounded-md cursor-pointer transition group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="region"
                          checked={selectedRegion === "all"}
                          onChange={() => setSelectedRegion("all")}
                          className="sr-only peer"
                        />
                        <div className="w-3.5 h-3.5 border-2 border-[#252F24]/40 rounded-full peer-checked:border-[#252F24] peer-checked:bg-[#252F24] transition flex items-center justify-center">
                          {selectedRegion === "all" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-[#252F24] group-hover:text-[#252F24] font-medium">Semua Wilayah</span>
                    </label>
                    {regions.slice(0, 8).map((region) => (
                      <label key={region} className="flex items-center justify-between gap-2 p-1 hover:bg-[#252F24]/5 rounded-md cursor-pointer transition group">
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center">
                            <input
                              type="radio"
                              name="region"
                              checked={selectedRegion === region}
                              onChange={() => setSelectedRegion(region)}
                              className="sr-only peer"
                            />
                            <div className="w-3.5 h-3.5 border-2 border-[#252F24]/40 rounded-full peer-checked:border-[#252F24] peer-checked:bg-[#252F24] transition flex items-center justify-center">
                              {selectedRegion === region && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-[#252F24] group-hover:text-[#252F24]">{region}</span>
                        </div>
                        <span className="text-xs text-[#252F24]/50">({regionCounts[region]})</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Search Card */}
              <Card className="bg-[#E1F0C9] border-none shadow-sm rounded-lg">
                <CardContent className="p-2">
                  <h3 className="font-semibold text-[#252F24] mb-1.5 text-sm">Cari Supplier</h3>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Nama, kota, deskripsi..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#252F24]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#252F24]/30"
                  />
                </CardContent>
              </Card>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full border-[#252F24]/30 hover:bg-[#252F24]/5 text-[#252F24] text-xs h-8 rounded-lg font-medium"
                onClick={() => {
                  setSelectedRegion("all");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Supplier List - Scrollable */}
        <div className="lg:col-span-9 h-[calc(100vh-280px)] overflow-y-auto pr-2 scrollbar-thin">
            {/* Supplier Cards - Scrollable Container */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#252F24]/70">Loading suppliers...</p>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#252F24]/70">No suppliers found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="bg-[#E1F0C9] border-none hover:shadow-lg transition-all rounded-lg overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Supplier Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-[#252F24]/5">
                            <span className="text-xl font-bold text-[#252F24]">
                              {supplier.name.charAt(0)}
                            </span>
                          </div>
                        </div>

                        {/* Supplier Info */}
                        <div className="flex-1 min-w-0">
                          {/* Header with name and location */}
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex-1">
                              <Link href={`/supplier/${supplier.id}`}>
                                <h3 className="text-base font-bold text-[#252F24] hover:underline mb-0.5">
                                  {supplier.name} <span className="font-normal text-sm">({supplier.product_count} Produk)</span>
                                </h3>
                              </Link>
                              <p className="text-xs text-[#252F24]/70 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                Indonesia, {supplier.city}
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-[#252F24]/80 mb-2 line-clamp-2 leading-relaxed">
                            {supplier.company_description}
                          </p>

                          {/* Company Details Grid */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#252F24]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-[#252F24]/80 text-xs">Semenjak {supplier.established_year}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#252F24]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              <span className="text-[#252F24]/80 text-xs">Supply: {supplier.total_supply_partners} Perusahaan</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#252F24]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className="text-[#252F24]/80 text-xs">Sertifikasi: 3</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#252F24]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <span className="text-[#252F24]/80 text-xs">Pengiriman: {supplier.shipping_coverage}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2.5">
                            <Button
                              asChild
                              className="bg-[#252F24] hover:bg-[#252F24]/90 text-white rounded-full px-5 py-2 text-xs h-auto font-medium shadow-sm hover:shadow-md transition-all"
                            >
                              <Link href={`/supplier/${supplier.id}/contact`}>
                                Kontak Supplier
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="border-[#252F24]/30 text-[#252F24] hover:bg-[#252F24]/5 rounded-full px-5 py-2 text-xs h-auto font-medium"
                            >
                              <Link href={`/supplier/${supplier.id}`}>
                                Lihat portofolio ({supplier.product_count})
                              </Link>
                            </Button>
                          </div>
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
