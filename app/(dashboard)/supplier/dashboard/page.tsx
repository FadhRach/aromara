import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar variant="dashboard" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Supplier Dashboard 🏭
          </h1>
          <p className="text-muted-foreground">
            Manage your products and quotations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Pending Quotations</CardDescription>
              <CardTitle className="text-3xl">7</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active Orders</CardDescription>
              <CardTitle className="text-3xl">15</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">$12.5K</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="bg-primary">Add New Product</Button>
            <Button variant="outline">View Quotations</Button>
            <Button variant="outline">Manage Orders</Button>
            <Button variant="outline">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Recent Quotation Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotation Requests</CardTitle>
            <CardDescription>New inquiries from buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Lavender Essential Oil - 10L</p>
                  <p className="text-sm text-muted-foreground">From: PT Fragrance Indonesia</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" className="bg-primary">Respond</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Rose Absolute Oil - 5L</p>
                  <p className="text-sm text-muted-foreground">From: Bali Cosmetics Co.</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" className="bg-primary">Respond</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Jasmine Oil - 20L</p>
                  <p className="text-sm text-muted-foreground">From: Natural Perfumes Ltd.</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" className="bg-primary">Respond</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
