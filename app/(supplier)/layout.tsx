import SupplierSidebar from "@/components/layout/SupplierSidebar";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SupplierSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
