import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar variant="dashboard" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Admin Dashboard ⚙️
          </h1>
          <p className="text-muted-foreground">
            Manage platform, users, and suppliers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">1,247</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Suppliers</CardDescription>
              <CardTitle className="text-3xl">156</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active Transactions</CardDescription>
              <CardTitle className="text-3xl">89</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Platform Revenue</CardDescription>
              <CardTitle className="text-3xl">$45.2K</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="bg-primary">Verify Supplier</Button>
            <Button variant="outline">Manage Users</Button>
            <Button variant="outline">View Reports</Button>
            <Button variant="outline">Platform Settings</Button>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Supplier Verifications</CardTitle>
            <CardDescription>New supplier applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Java Essential Oils</p>
                  <p className="text-sm text-muted-foreground">Applied 2 days ago</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Bali Fragrance Co.</p>
                  <p className="text-sm text-muted-foreground">Applied 3 days ago</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activities</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Supplier Verified</p>
                  <p className="text-sm text-muted-foreground">Golden Aura Fragrances</p>
                </div>
                <span className="text-sm text-muted-foreground">3 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Transaction Completed</p>
                  <p className="text-sm text-muted-foreground">Order #12345</p>
                </div>
                <span className="text-sm text-muted-foreground">5 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
