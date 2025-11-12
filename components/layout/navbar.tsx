"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NavbarProps {
    variant?: "default" | "dashboard";
}

export default function Navbar({ variant = "default" }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (variant === "dashboard") {
        return (
            <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/images/aromaralogo.png"
                                alt="Aromara Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                                Profile
                            </Button>
                            <Button variant="outline" size="sm">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/90 backdrop-blur-sm"
                    : "bg-transparent"
            }`}
        >
            {/* Top accent bar - only show when not scrolled */}
            {!isScrolled && <div className="h-6 bg-secondary"></div>}
            
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3">
                        <Image
                            src="/images/aromaralogo.png"
                            alt="Aromara Logo"
                            width={120}
                            height={40}
                            className="h-8 md:h-10 w-auto object-contain flex-shrink-0"
                        />
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-primary transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="/suppliers"
                            className="text-sm font-medium hover:text-primary transition"
                        >
                            Explore Suplier
                        </Link>
                        <Link
                            href="/quotation"
                            className="text-sm font-medium hover:text-primary transition"
                        >
                            Request Quotation
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium hover:text-primary transition"
                        >
                            About
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button
                            variant="outline"
                            className="rounded-full text-xs md:text-sm px-3 md:px-4 border-primary/20 hover:bg-primary/5"
                            asChild
                        >
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button
                            className="rounded-full bg-primary hover:bg-primary/90 text-xs md:text-sm px-3 md:px-4"
                            asChild
                        >
                            <Link href="/register">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
