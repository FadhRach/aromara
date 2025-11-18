import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function WhyAromaraSection() {
  const features = [
    {
      title: "Verified Supliers",
      description: "Quality and origin fragrance transparency",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=80",
    },
    {
      title: "Powered by Quote",
      description: "Streamlined procurement for buyers",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    },
    {
      title: "Sustainable Profile",
      description: "Eco certifications with quality assurance",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
              WHY CHOOSE AROMARA?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight">
              Discover Why Aromara Leads Indonesia&apos;s Fragrance Ecosystem
            </h2>
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              Empowering Indonesia&apos;s perfume ecosystem through verified suppliers, sustainable sourcing, and transparent connections.
            </p>
          </div>

          {/* Right Feature Cards */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 order-1 lg:order-2">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary mb-1 text-sm md:text-base">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
