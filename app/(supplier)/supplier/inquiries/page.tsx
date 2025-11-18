'use client';

import { useState, useEffect } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';

interface Buyer {
  full_name: string;
  email: string;
  phone_number?: string;
}

interface InquiryItem {
  id: string;
  product_id: string;
  quantity: number;
  unit: string;
  products?: {
    name: string;
  };
}

interface Inquiry {
  id: string;
  buyer_id: string;
  message: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  created_at: string;
  buyers?: Buyer;
  inquiry_items?: InquiryItem[];
}

export default function SupplierInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'quoted' | 'accepted' | 'rejected'>('all');
  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierData(user);
      fetchInquiries(user.id);
    }
  }, []);

  const fetchInquiries = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/supplier/inquiries?supplier_id=${supplierId}`);
      const result = await response.json();
      
      if (result.success) {
        setInquiries(result.data || []);
      } else {
        showAlert.error('Error', result.error || 'Failed to load inquiries');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      showAlert.error('Error', 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: 'quoted' | 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/supplier/inquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showAlert.success('Success', 'Inquiry status updated');
        setInquiries(inquiries.map(inq => 
          inq.id === inquiryId ? { ...inq, status: newStatus } : inq
        ));
      } else {
        showAlert.error('Error', result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      showAlert.error('Error', 'Failed to update status');
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusText = (status: string) => {
    const text = {
      pending: 'Pending',
      quoted: 'Quoted',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return text[status as keyof typeof text] || status;
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All', count: inquiries.length },
            { value: 'pending', label: 'Pending', count: inquiries.filter(i => i.status === 'pending').length },
            { value: 'quoted', label: 'Quoted', count: inquiries.filter(i => i.status === 'quoted').length },
            { value: 'accepted', label: 'Accepted', count: inquiries.filter(i => i.status === 'accepted').length },
            { value: 'rejected', label: 'Rejected', count: inquiries.filter(i => i.status === 'rejected').length },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <IonIcon name="mail-outline" className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600">You don't have any {filter !== 'all' ? filter : ''} inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Inquiry from {inquiry.buyers?.full_name || 'Unknown Buyer'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(inquiry.status)}`}>
                      {getStatusText(inquiry.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <IonIcon name="person-outline" className="text-lg" />
                      {inquiry.buyers?.full_name || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <IonIcon name="mail-outline" className="text-lg" />
                      {inquiry.buyers?.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <IonIcon name="call-outline" className="text-lg" />
                      {inquiry.buyers?.phone_number || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(inquiry.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Inquiry Items */}
              {inquiry.inquiry_items && inquiry.inquiry_items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Requested Products:</h4>
                  <div className="space-y-1">
                    {inquiry.inquiry_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <IonIcon name="cube-outline" className="text-base" />
                        <span>{item.products?.name || 'Unknown Product'}</span>
                        <span className="text-gray-400">-</span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-700 mb-4">{inquiry.message || 'No message provided'}</p>

              <div className="flex gap-3">
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <IonIcon name="mail-outline" className="text-lg mr-2" />
                  Reply
                </button>
                {inquiry.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(inquiry.id, 'quoted')}
                    className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <IonIcon name="document-text-outline" className="text-lg mr-2" />
                    Send Quote
                  </button>
                )}
                {inquiry.status === 'quoted' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(inquiry.id, 'accepted')}
                      className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <IonIcon name="checkmark-circle-outline" className="text-lg mr-2" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(inquiry.id, 'rejected')}
                      className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <IonIcon name="close-circle-outline" className="text-lg mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
