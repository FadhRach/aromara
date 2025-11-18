import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAEE] py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Inner Container with Dark Background and Border Radius */}
        <div className="bg-[#252F24] text-white rounded-3xl py-12 md:py-16 px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Logo & Description */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/aromaraonelogo.png"
                  alt="Aromora Icon"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="font-bold text-white text-xl">Aromora</div>
                  <div className="text-sm text-[#E8F5D5]/80">Local Essence to Global Fragrance</div>
                </div>
              </div>
              <p className="text-sm text-white/80 max-w-md leading-relaxed">
                Connecting farmers, distillers, and brands to strengthen Indonesia&apos;s fragrance ecosystem
              </p>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="font-bold mb-4 text-white text-base">Quick Navigation</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  <Link href="/" className="hover:text-[#E8F5D5] transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/explore-suppliers" className="hover:text-[#E8F5D5] transition">
                    Explore Ingridient
                  </Link>
                </li>
                <li>
                  <Link href="/request-quote" className="hover:text-[#E8F5D5] transition">
                    Request Quotation
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#E8F5D5] transition">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support and Contact */}
            <div>
              <h3 className="font-bold mb-4 text-white text-base">Support and Contact</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  <Link href="/faq" className="hover:text-[#E8F5D5] transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-[#E8F5D5] transition">
                    Verification Process
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#E8F5D5] transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#E8F5D5] transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media & Email */}
            <div>
              <div className="flex gap-3 mb-4">
                <Link 
                  href="https://instagram.com/aromora" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition" 
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link 
                  href="https://twitter.com/aromora" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition" 
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link 
                  href="https://linkedin.com/company/aromora" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition" 
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
              <Link 
                href="mailto:hello@aromora.id" 
                className="text-sm text-white/80 hover:text-[#E8F5D5] transition underline"
              >
                hello@aromora.id
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60 text-center md:text-left">
              © 2025 Aromora. All rights reserved.
            </p>
            
            <p className="text-sm text-white/60">
              Crafted with 🌿 from Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
