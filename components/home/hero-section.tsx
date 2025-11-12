import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="max-w-3xl mb-8 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 md:mb-6 leading-tight">
            FIND INDONESIAN
            <br />
            <span className="flex items-center gap-2 md:gap-4 mt-2">
              <ArrowRight className="w-6 h-6 md:w-12 md:h-12 flex-shrink-0" />
              <span className="break-words">FRAGRANCE SUPPLIERS</span>
            </span>
          </h1>

          {/* Description Text */}
          <div className="md:ml-16 max-w-md mt-6">
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              Connecting local farmers, distillers, and perfume makers to build partnerships and support sustainable, natural sourcing in signature scents.
            </p>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 text-xs md:text-sm font-medium text-primary/80">
          <span className="flex items-center gap-1 md:gap-2">
            EFFICIENCY <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            INNOVATION <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            SUSTAINABILITY <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            FRAGRANCE <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2 hidden sm:flex">
            EFFICIENCY <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2 hidden sm:flex">
            INNOVATION <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            INDONESIAN ESSENCE
          </span>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Essential Oils Image */}
          <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <Image
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
              alt="Essential oils and flowers"
              fill
              className="object-cover"
            />
          </div>

          {/* Lavender Field Image */}
          <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <Image
              src="https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=80"
              alt="Lavender field"
              fill
              className="object-cover"
            />
          </div>

          {/* Farmer Image */}
          <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
            <Image
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              alt="Farmer in field"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
