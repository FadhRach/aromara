"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SupplierCard } from "@/components/shared/supplier-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data for suppliers
const suppliers = [
  {
    id: 1,
    title: "Golden Aura Fragrances",
    description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice untuk parfum, kosmetik, dan home fragrance. Menyediakan essential oils, aroma beads, dan natural ingredients.",
    image: "https://images.unsplash.com/photo-1583932976476-85dcee4d1ee1?w=800&q=80",
    region: "Based in Bali",
    tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
    trends: ["Floral", "Eco Packaging", "Vegan"],
  },
  {
    id: 2,
    title: "Golden Aura Fragrances",
    description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice untuk parfum, kosmetik, dan home fragrance. Menyediakan essential oils, aroma beads, dan natural ingredients.",
    image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&q=80",
    region: "Based in Bali",
    tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
    trends: ["Natural", "Eco Packaging", "Vegan"],
  },
  {
    id: 3,
    title: "Golden Aura Fragrances",
    description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice untuk parfum, kosmetik, dan home fragrance. Menyediakan essential oils, aroma beads, dan natural ingredients.",
    image: "https://images.unsplash.com/photo-1583932976476-85dcee4d1ee1?w=800&q=80",
    region: "Region: Jawa Tengah, Indonesia",
    tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
    trends: ["Floral", "Eco Packaging", "Niche Perfume House", "Organic"],
  },
  {
    id: 4,
    title: "Golden Aura Fragrances",
    description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice untuk parfum, kosmetik, dan home fragrance. Menyediakan essential oils, aroma beads, dan natural ingredients.",
    image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&q=80",
    region: "Region: Jawa Tengah, Indonesia",
    tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
    trends: ["Floral", "Eco Packaging", "Niche Perfume House", "Organic"],
  },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Explore Supplier Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find verified perfume manufacturers and formulators seamless
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 rounded-full"
              />
            </div>

            {/* Contact Suppliers Button */}
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
              Contact suppliers
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 rounded-md">
              Category
              <span className="ml-2">▼</span>
            </Button>
            <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 rounded-md">
              Region
              <span className="ml-2">▼</span>
            </Button>
            <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 rounded-md">
              Certifications
              <span className="ml-2">▼</span>
            </Button>
            <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 rounded-md">
              Packaging
              <span className="ml-2">▼</span>
            </Button>
            <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 rounded-md">
              Trade Shows
              <span className="ml-2">▼</span>
            </Button>
            <Button variant="outline" className="rounded-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Reset Filter
            </Button>
          </div>

          {/* AI Assistant */}
          <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <span className="font-medium">You can ask to MORA AI</span>
            </p>
          </div>
        </div>
      </section>

      {/* Supplier Cards Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                title={supplier.title}
                description={supplier.description}
                image={supplier.image}
                region={supplier.region}
                tags={supplier.tags}
                trends={supplier.trends}
                variant="dark"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
