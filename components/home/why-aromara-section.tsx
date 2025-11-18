import Image from "next/image";

export default function WhyAromaraSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
                WHY CHOOSE AROMORA?
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Discover Why Aromora Leads Indonesia&apos;s Fragrance Ecosystem
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              Empowering Indonesia&apos;s perfume ecosystem through verified suppliers, sustainable sourcing, and transparent connections.
            </p>
          </div>

          {/* Right: Image Grid (1 Large Top + 2 Small Bottom) */}
          <div className="grid grid-rows-2 gap-4 h-[500px] md:h-[600px]">
            {/* Top Large Image */}
            <div className="row-span-1 overflow-hidden rounded-2xl">
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1720281636639-23615888e0fb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Green Plants Natural"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bottom Two Small Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1675149495735-5df1696650e0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Essential Plants"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1626953313883-9d031d98307e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Herbal Garden"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
