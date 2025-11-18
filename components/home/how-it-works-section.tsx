"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Connect with verified buyers",
      description: "Reach verified perfume manufacturers and formulators across Indonesia. Showcase your authentic ingredients to trusted partners who value quality and sustainability.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
      points: [
        "Reach verified perfume manufacturers and formulators seamless.",
        "Build long-term partnerships with trusted fragrance buyers.",
        "Ensure every connection values quality, origin, and transparency.",
      ],
    },
    {
      id: 2,
      title: "Request quotes & negotiate",
      description: "Send quote requests directly to suppliers and negotiate the best terms for your business. Get competitive pricing with transparent communication throughout the process.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      points: [
        "Send detailed quote requests with your specific requirements.",
        "Compare offers from multiple verified suppliers instantly.",
        "Negotiate terms directly through our secure messaging system.",
      ],
    },
    {
      id: 3,
      title: "Secure transactions & delivery",
      description: "Complete your purchase with confidence using our secure platform. Track your order from confirmation to delivery with full transparency and documentation.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      points: [
        "Safe payment processing with buyer protection guaranteed.",
        "Real-time shipment tracking from warehouse to your location.",
        "Complete documentation and certification for every transaction.",
      ],
    },
  ];

  const currentStep = steps.find((step) => step.id === activeStep) || steps[0];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#FAFAEE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground mb-2 md:mb-3">
            HOW IT WORKS?
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 leading-tight">
            Empowering Growth Through
            <br />
            Fragrance with Aromora
          </h2>

          {/* Progress Bar & Step Indicator */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-[#D4E5D4] rounded-full h-2 md:h-3">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Numbers */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-semibold text-primary text-sm md:text-base">STEP</span>
              <span className="text-primary font-semibold text-sm md:text-base">/</span>
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`px-3 md:px-4 py-1 rounded text-sm md:text-base font-semibold transition-all duration-300 ${
                    activeStep === step.id
                      ? "bg-primary text-secondary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {String(step.id).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Left Content Card */}
          <Card className="bg-[#D4E5D4] p-6 md:p-8 border-0 shadow-none">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
              {currentStep.title}
            </h3>
            <p className="text-sm md:text-base text-foreground mb-6 md:mb-8 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="space-y-3 md:space-y-4">
              <p className="text-xs md:text-sm font-semibold text-primary">
                Perfect if you need to:
              </p>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-foreground">
                {currentStep.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Right Image with Animation */}
          <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-primary shadow-lg">
            <Image
              key={activeStep}
              src={currentStep.image}
              alt={currentStep.title}
              fill
              className="object-cover animate-fadeIn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
