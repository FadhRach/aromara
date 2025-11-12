import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import IngredientsSection from "@/components/home/ingredients-section";
import WhyAromaraSection from "@/components/home/why-aromara-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <IngredientsSection />
      <WhyAromaraSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
