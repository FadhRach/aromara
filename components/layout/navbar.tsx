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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    ? "bg-[#FAFAEE]/90 backdrop-blur-md shadow-sm"
                    : "bg-[#FAFAEE]/85 backdrop-blur-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                {/* Main Navigation Bar */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/aromaralogo.png"
                            alt="Aromara Logo"
                            width={140}
                            height={45}
                            className="h-10 md:h-11 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="/login?redirect=/explore-suppliers"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Explor Suplier
                        </Link>
                        <Link
                            href="/login?redirect=/explore-suppliers"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Ajukan Permintaan
                        </Link>
                        <Link
                            href="/login?redirect=/about"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Tentang Kami
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Auth Buttons - Hidden on mobile */}
                        <div className="hidden lg:flex items-center gap-2 md:gap-3">
                            <Button
                                variant="outline"
                                className="rounded-full text-xs md:text-sm px-4 md:px-6 py-2 border-[#252F24] text-[#252F24] bg-[#FAFAEE] hover:bg-[#252F24] hover:text-white transition-all"
                                asChild
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                className="rounded-full bg-[#252F24] hover:bg-[#FAFAEE] text-white hover:text-[#252F24] text-xs md:text-sm px-4 md:px-6 py-2 hover:border hover:border-[#252F24] transition-all"
                                asChild
                            >
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </div>

                        {/* Hamburger Menu Button - Visible on mobile/tablet */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-[#252F24]/5 rounded-lg transition"
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-[#252F24]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Slide down */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-[#252F24]/10 pt-4 animate-in slide-in-from-top-5 duration-200">
                        <div className="flex flex-col gap-3">
                            {/* Navigation Links */}
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Home
                            </Link>
                            <Link
                                href="/login?redirect=/explore-suppliers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Explor Suplier
                            </Link>
                            <Link
                                href="/login?redirect=/explore-suppliers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Ajukan Permintaan
                            </Link>
                            <Link
                                href="/login?redirect=/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Tentang Kami
                            </Link>

                            {/* Auth Buttons */}
                            <div className="flex flex-col gap-2 mt-2">
                                <Button
                                    variant="outline"
                                    className="rounded-full text-sm px-6 py-2.5 border-[#252F24] text-[#252F24] bg-[#FAFAEE] hover:bg-[#252F24] hover:text-white transition-all w-full"
                                    asChild
                                >
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                                </Button>
                                <Button
                                    className="rounded-full bg-[#252F24] hover:bg-[#FAFAEE] text-white hover:text-[#252F24] text-sm px-6 py-2.5 hover:border hover:border-[#252F24] transition-all w-full"
                                    asChild
                                >
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
