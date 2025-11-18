"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MoraAIBanner() {
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setShowBanner(window.scrollY < 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeBanner = () => {
        setShowBanner(false);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    if (!showBanner) return null;

    return (
        <div className="fixed top-[72px] md:top-[76px] left-0 right-0 z-40 bg-[#E8F5E9] py-2.5 px-4 md:px-6 border-b border-[#252F24]/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <p className="text-sm text-[#252F24] flex-1">
                    Butuh rekomendasi? Biarkan <span className="font-semibold">MORA AI</span> membantu Anda menemukan jawabannya.
                </p>
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        className="rounded-full bg-[#252F24] hover:bg-[#252F24]/90 text-white text-sm px-4 py-1.5 h-auto"
                    >
                        <Link href="/mora-ai" className="flex items-center gap-2">
                            Mulai Tanya
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                />
                            </svg>
                        </Link>
                    </Button>
                    <button
                        onClick={closeBanner}
                        className="p-1 hover:bg-[#252F24]/5 rounded-full transition"
                        title="Close"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-[#252F24]/50 hover:text-[#252F24]" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
