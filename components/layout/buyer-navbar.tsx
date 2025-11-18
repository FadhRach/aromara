"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BuyerNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        // Clear cookie via API
        await fetch('/api/auth/login', {
            method: 'DELETE',
        });
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to home and force reload to show default navbar
        window.location.href = '/';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Search:', searchQuery);
    };

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
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
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
                            href="/explore-suppliers"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Explor Suplier
                        </Link>
                        <Link
                            href="/explore-suppliers"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Ajukan Permintaan
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-[#252F24] hover:text-[#252F24]/70 transition"
                        >
                            Tentang Kami
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Search, Contact, Logout - Hidden on mobile */}
                        <div className="hidden lg:flex items-center gap-3">
                        {/* Search Bar - Expandable */}
                        {showSearch ? (
                            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Bunga kenanga segar"
                                        className="w-64 md:w-80 px-4 py-2 pr-10 bg-[#E8F5E9] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#252F24]/20"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSearch(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#252F24]/50 hover:text-[#252F24]"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setShowSearch(true)}
                                className="p-2 hover:bg-[#252F24]/5 rounded-full transition"
                                title="Search"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5 text-[#252F24]" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Contact Supplier Button */}
                        {!showSearch && (
                            <Button
                                className="rounded-full bg-[#252F24] hover:bg-[#252F24]/90 text-white text-xs md:text-sm px-4 md:px-6 py-2 transition-all"
                                asChild
                            >
                                <Link href="/explore-suppliers">Hubungi Suplier</Link>
                            </Button>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 rounded-full transition group flex-shrink-0"
                            title="Logout"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 text-[#252F24] group-hover:text-red-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                />
                            </svg>
                        </button>
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
                            {/* Search Bar Mobile */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari supplier atau produk..."
                                    className="w-full px-4 py-2.5 bg-[#E8F5E9] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#252F24]/20"
                                />
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5 text-[#252F24]/50 absolute right-4 top-1/2 -translate-y-1/2" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                    />
                                </svg>
                            </form>

                            {/* Navigation Links */}
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Home
                            </Link>
                            <Link
                                href="/explore-suppliers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Explor Suplier
                            </Link>
                            <Link
                                href="/explore-suppliers"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Ajukan Permintaan
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-[#252F24] hover:bg-[#E8F5E9] rounded-lg transition"
                            >
                                Tentang Kami
                            </Link>

                            {/* Contact Supplier Button */}
                            <Button
                                className="rounded-full bg-[#252F24] hover:bg-[#252F24]/90 text-white text-sm px-6 py-2.5 transition-all w-full"
                                asChild
                            >
                                <Link href="/explore-suppliers" onClick={() => setMobileMenuOpen(false)}>
                                    Hubungi Suplier
                                </Link>
                            </Button>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
