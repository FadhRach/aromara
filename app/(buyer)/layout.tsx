import React from 'react';
import BuyerNavbar from '@/components/layout/buyer-navbar';
import Footer from '@/components/layout/footer';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BuyerNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
