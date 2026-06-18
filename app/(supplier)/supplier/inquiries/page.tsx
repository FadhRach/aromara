'use client';

import { useState, useEffect } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';

type InquiryStatus = 'open' | 'negotiating' | 'closed' | 'ordered';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface InquiryItem {
  id: string;
  product_id: string;
  qty: number;
  unit: string;
  products?: {
    id: string;
    name: string;
  };
}

interface Inquiry {
  id: string;
  buyer_id: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  buyer?: Buyer;
  inquiry_items?: InquiryItem[];
}

interface Message {
  id: string;
  inquiry_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

const STATUS_BADGE: Record<InquiryStatus, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  negotiating: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800',
  ordered: 'bg-green-100 text-green-800',
};

const STATUS_LABEL: Record<InquiryStatus, string> = {
  open: 'Open',
  negotiating: 'Negotiating',
  closed: 'Closed',
  ordered: 'Ordered',
};

export default function SupplierInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | InquiryStatus>('all');
  const [supplierId, setSupplierId] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierId(user.id);
      fetchInquiries(user.id);
    }
  }, []);

  const fetchInquiries = async (id: string) => {
    try {
      const response = await fetch(`/api/supplier/inquiries?supplier_id=${id}`);
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data || []);
      } else {
        showAlert.error('Error', result.error || 'Failed to load inquiries');
      }
    } catch {
      showAlert.error('Error', 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const response = await fetch('/api/supplier/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry_id: inquiryId, status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        showAlert.success('Status diperbarui', `Inquiry dipindahkan ke ${STATUS_LABEL[newStatus]}`);
        setInquiries(prev =>
          prev.map(inq => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
      } else {
        showAlert.error('Error', result.error || 'Failed to update status');
      }
    } catch {
      showAlert.error('Error', 'Failed to update status');
    }
  };

  const toggleReply = async (inquiryId: string) => {
    if (expandedId === inquiryId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inquiryId);
    if (!messages[inquiryId]) {
      await fetchMessages(inquiryId);
    }
  };

  const fetchMessages = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/supplier/inquiries/${inquiryId}/messages`);
      const result = await response.json();
      if (result.success) {
        setMessages(prev => ({ ...prev, [inquiryId]: result.data || [] }));
      }
    } catch {
      setMessages(prev => ({ ...prev, [inquiryId]: [] }));
    }
  };

  const handleSendReply = async (inquiryId: string) => {
    const body = replyText[inquiryId]?.trim();
    if (!body) return;

    setSendingReply(prev => ({ ...prev, [inquiryId]: true }));
    try {
      const response = await fetch(`/api/supplier/inquiries/${inquiryId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: supplierId, body }),
      });
      const result = await response.json();
      if (result.success) {
        setMessages(prev => ({
          ...prev,
          [inquiryId]: [...(prev[inquiryId] || []), result.data],
        }));
        setReplyText(prev => ({ ...prev, [inquiryId]: '' }));
      } else {
        showAlert.error('Error', result.error || 'Failed to send reply');
      }
    } catch {
      showAlert.error('Error', 'Failed to send reply');
    } finally {
      setSendingReply(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  const filteredInquiries =
    filter === 'all' ? inquiries : inquiries.filter(inq => inq.status === filter);

  const filterTabs: { value: 'all' | InquiryStatus; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'open', label: 'Open' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'closed', label: 'Closed' },
    { value: 'ordered', label: 'Ordered' },
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-2">Kelola permintaan harga dari buyer</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2">
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === tab.value
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.value === 'all' ? inquiries.length : inquiries.filter(i => i.status === tab.value).length})
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <IonIcon name="mail-outline" className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada inquiry</h3>
          <p className="text-gray-600">Tidak ada inquiry dengan status {filter !== 'all' ? filter : 'apapun'}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map(inquiry => (
            <div key={inquiry.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inquiry.subject || `Inquiry dari ${inquiry.buyer?.name || 'Buyer'}`}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[inquiry.status] || STATUS_BADGE.open}`}>
                        {STATUS_LABEL[inquiry.status] || inquiry.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <IonIcon name="person-outline" className="text-base" />
                        {inquiry.buyer?.name || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <IonIcon name="mail-outline" className="text-base" />
                        {inquiry.buyer?.email || 'N/A'}
                      </span>
                      {inquiry.buyer?.phone && (
                        <span className="flex items-center gap-1">
                          <IonIcon name="call-outline" className="text-base" />
                          {inquiry.buyer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex-shrink-0">
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Produk yang diminta:</h4>
                    <div className="space-y-1">
                      {inquiry.inquiry_items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <IonIcon name="cube-outline" className="text-base" />
                          <span className="font-medium">{item.products?.name || 'Produk tidak ditemukan'}</span>
                          <span className="text-gray-400">-</span>
                          <span>{item.qty} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inquiry.message && (
                  <p className="text-gray-700 mb-4 text-sm bg-gray-50 rounded-lg p-3">
                    {inquiry.message}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => toggleReply(inquiry.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      expandedId === inquiry.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <IonIcon name="chatbubble-outline" className="text-base mr-2" />
                    {expandedId === inquiry.id ? 'Tutup Pesan' : 'Balas'}
                  </button>

                  {inquiry.status === 'open' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'negotiating')}
                      className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      <IonIcon name="document-text-outline" className="text-base mr-2" />
                      Mulai Negosiasi
                    </button>
                  )}
                  {inquiry.status === 'negotiating' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'ordered')}
                      className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                    >
                      <IonIcon name="checkmark-circle-outline" className="text-base mr-2" />
                      Tandai Ordered
                    </button>
                  )}
                  {(inquiry.status === 'open' || inquiry.status === 'negotiating') && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'closed')}
                      className="flex items-center px-4 py-2 border border-gray-400 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <IonIcon name="close-circle-outline" className="text-base mr-2" />
                      Tutup
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Thread - Expandable */}
              {expandedId === inquiry.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Thread Pesan</h4>

                  {/* Message Thread */}
                  {messages[inquiry.id] && messages[inquiry.id].length > 0 ? (
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {messages[inquiry.id].map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === supplierId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                              msg.sender_id === supplierId
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p>{msg.body}</p>
                            <p className={`text-xs mt-1 ${msg.sender_id === supplierId ? 'text-green-100' : 'text-gray-400'}`}>
                              {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4 text-center py-4">
                      Belum ada pesan. Kirim pesan pertama ke buyer.
                    </p>
                  )}

                  {/* Reply Input */}
                  <div className="flex gap-3">
                    <textarea
                      value={replyText[inquiry.id] || ''}
                      onChange={e =>
                        setReplyText(prev => ({ ...prev, [inquiry.id]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(inquiry.id);
                        }
                      }}
                      placeholder="Ketik pesan... (Enter untuk kirim)"
                      rows={2}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleSendReply(inquiry.id)}
                      disabled={sendingReply[inquiry.id] || !replyText[inquiry.id]?.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sendingReply[inquiry.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <IonIcon name="send-outline" className="text-base" />
                      )}
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
