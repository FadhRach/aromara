import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading + Description (70% - 30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 lg:gap-12 mb-8 md:mb-16 items-start">
          {/* Left: Heading (70%) */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-bold text-[#252F24] leading-tight">
              FIND INDONESIAN
              <br />
              <span className="flex items-center gap-3 md:gap-4 mt-2">
                <ArrowRight className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0" />
                <span>FRAGRANCE SUPPLIERS</span>
              </span>
            </h1>
          </div>

          {/* Right: Description Text (30%) */}
          <div className="flex items-center lg:items-start lg:pt-2">
            <p className="text-sm md:text-base text-[#252F24] leading-relaxed">
              Connecting local farmers, distillers, and perfume brands to build a unified fragrance ecosystem that empowers Indonesia&apos;s supply chain from natural sources to signature scents.
            </p>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 text-xs md:text-sm font-semibold text-[#252F24]/80 uppercase">
          <span className="flex items-center gap-1 md:gap-2">
            EFFICIENCY <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            INNOVATION <span className="text-lg">✦</span>
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            SUSTAINABILITY <span className="text-lg">✦</span>
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            FRAGRANCE <span className="text-lg">✦</span>
          </span>
          <span className="flex items-center gap-1 md:gap-2 hidden sm:flex">
            EFFICIENCY <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </span>
          <span className="flex items-center gap-1 md:gap-2 hidden sm:flex">
            INNOVATION <span className="text-lg">✦</span>
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
