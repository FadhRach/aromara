import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function IngredientsSection() {
  const ingredients = [
    {
      title: "Golden Aura Fragrances",
      image: "https://images.unsplash.com/photo-1583932976476-85dcee4d1ee1?w=800&q=80",
      description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice",
      origin: "Based in Bali",
      tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
      trends: ["Floral", "Eco Packaging", "Vegan"],
    },
    {
      title: "Golden Aura Fragrances",
      image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&q=80",
      description: "Amanya, Bakker, Bourbon Madagascar, Exotic Floral Delight, Jasmine, Lavender, Rose, Sweet Spice",
      origin: "Based in Bali",
      tags: ["Cotton Woody", "Lavender", "Classic Woody", "Herbs"],
      trends: ["Floral", "Eco Packaging", "Vegan"],
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            EXPLORE INGRIDIENT
          </h2>
          <Button variant="ghost" className="flex items-center gap-2 group text-sm md:text-base">
            <span className="hidden sm:inline">Discover More Supliers</span>
            <span className="sm:hidden">More Supliers</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition" />
          </Button>
        </div>

        {/* Ingredient Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {ingredients.map((ingredient, index) => (
            <Card key={index} className="overflow-hidden bg-primary text-white hover:shadow-xl transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6">
                {/* Image */}
                <div className="relative w-full sm:w-32 md:w-40 h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2">{ingredient.title}</h3>
                  <p className="text-xs md:text-sm text-white/80 mb-2 md:mb-3 line-clamp-2">
                    {ingredient.description}
                  </p>
                  <p className="text-xs text-white/60 mb-3 md:mb-4">{ingredient.origin}</p>

                  {/* Tags */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-2">Key</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {ingredient.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 md:px-3 py-1 bg-white/20 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {ingredient.tags.length > 3 && (
                        <span className="px-2 md:px-3 py-1 bg-white/20 rounded-full text-xs">
                          +{ingredient.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trends */}
                  <div>
                    <p className="text-xs font-semibold mb-2">Trends</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {ingredient.trends.map((trend, i) => (
                        <span
                          key={i}
                          className="px-2 md:px-3 py-1 bg-white/20 rounded-full text-xs"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
