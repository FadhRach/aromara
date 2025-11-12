export default function StatsSection() {
  const stats = [
    { value: "1,200+", label: "Verified Supliers" },
    { value: "4,500+", label: "Product Listings" },
    { value: "250+", label: "Buyer Connections" },
    { value: "95%", label: "Positive Engagement" },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
