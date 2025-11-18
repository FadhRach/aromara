'use client';

import { useEffect, useState } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  pendingInquiries: number;
  responseRate: number;
}

export default function SupplierDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    responseRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    // Get supplier data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierData(user);
      fetchStats(user.id);
    }
  }, []);

  const fetchStats = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/supplier/stats?supplier_id=${supplierId}`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: 'cube-outline',
      color: 'bg-blue-500',
      link: '/supplier/products',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: 'mail-outline',
      color: 'bg-green-500',
      link: '/supplier/inquiries',
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries,
      icon: 'time-outline',
      color: 'bg-yellow-500',
      link: '/supplier/inquiries?status=pending',
    },
    {
      title: 'Response Rate',
      value: `${stats.responseRate}%`,
      icon: 'trending-up-outline',
      color: 'bg-purple-500',
      link: '/supplier/profile',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {supplierData?.name || 'Supplier'}! Here's your business overview.
          </p>
        </div>
        <Link
          href="/supplier/products/add"
          className="hidden md:flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <IonIcon name="add-circle-outline" className="text-xl mr-2" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-lg`}>
                <IonIcon name={card.icon} className="text-3xl text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/supplier/products/add"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <IonIcon name="add-circle-outline" className="text-3xl text-gray-400 group-hover:text-green-600" />
            <span className="ml-3 font-medium text-gray-700 group-hover:text-green-600">
              Add New Product
            </span>
          </Link>
          
          <Link
            href="/supplier/inquiries"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <IonIcon name="mail-open-outline" className="text-3xl text-gray-400 group-hover:text-blue-600" />
            <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-600">
              View Inquiries
            </span>
          </Link>
          
          <Link
            href="/supplier/profile"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <IonIcon name="create-outline" className="text-3xl text-gray-400 group-hover:text-purple-600" />
            <span className="ml-3 font-medium text-gray-700 group-hover:text-purple-600">
              Edit Profile
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity items - TODO: Replace with real data */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-lg">
              <IonIcon name="checkmark-circle" className="text-xl text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New inquiry received</p>
              <p className="text-sm text-gray-600">John Doe inquired about Lavender Oil - 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-lg">
              <IonIcon name="cube" className="text-xl text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Product updated</p>
              <p className="text-sm text-gray-600">Peppermint Oil stock updated - 5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <IonIcon name="star" className="text-xl text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Profile viewed</p>
              <p className="text-sm text-gray-600">Your profile was viewed 15 times today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
