import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function HowItWorksSection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-16">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
            HOW IT WORKS?
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight">
            Empowering Growth Through
            <br />
            Fragrance with Aromara
          </h2>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-bold text-primary text-sm md:text-base">STEP</span>
              <span className="text-secondary bg-primary px-2 md:px-3 py-1 rounded text-sm md:text-base">01</span>
              <span className="text-muted-foreground text-sm md:text-base">/ 02 / 03</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Left Content Card */}
          <Card className="bg-secondary p-6 md:p-8 order-2 lg:order-1">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-6">
              Connect with verified buyers
            </h3>
            <p className="text-sm md:text-base text-foreground mb-6 md:mb-8 leading-relaxed">
              Reach verified perfume manufacturers and formulators by showcasing your ingredients to trusted partners who value quality and sustainability.
            </p>

            <div className="space-y-3 md:space-y-4">
              <p className="text-xs md:text-sm font-semibold text-primary">
                Perfect if you need to:
              </p>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                  <span>Find verified perfume manufacturers and formulators seamless.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                  <span>Build long-term partnerships with trusted fragrance buyers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                  <span>Ensure every connection values quality, origin, and transparency.</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Right Image */}
          <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden order-1 lg:order-2 hover:scale-105 transition-transform duration-300">
            <Image
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80"
              alt="Business woman working"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
