export default function StatsSection() {
  const stats = [
    { value: "1,200+", label: "Verified Suppliers" },
    { value: "4,500+", label: "Product Listings" },
    { value: "250+", label: "Buyer Connections" },
    { value: "95%", label: "Positive Engagement" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#252F24] mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-[#252F24]/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
