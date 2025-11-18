"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import BuyerNavbar from "@/components/layout/buyer-navbar";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import IngredientsSection from "@/components/home/ingredients-section";
import WhyAromaraSection from "@/components/home/why-aromara-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoggedIn ? <BuyerNavbar /> : <Navbar />}
      <HeroSection />
      <StatsSection />
      <IngredientsSection />
      <WhyAromaraSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
