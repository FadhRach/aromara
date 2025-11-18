import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aromara - Local Essence to Global Fragrance",
  description: "Platform B2B untuk bahan baku parfum berkualitas dari supplier terpercaya Indonesia",
  icons: {
    icon: "/images/aromaraonelogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${lexend.variable} font-lexend antialiased`}>
        {children}
        
        {/* Ion Icons - Lazy loaded at end of body */}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          strategy="lazyOnload"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
