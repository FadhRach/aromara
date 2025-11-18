'use client';

import { useState, useEffect } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import Image from 'next/image';
import { showAlert } from '@/lib/sweetalert';

export default function SupplierProfile() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [supplierData, setSupplierData] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    province: '',
    country: 'Indonesia',
    website: '',
    company_description: '',
    established_year: '',
    business_type: 'manufacturer',
    shipping_coverage: '',
    certifications: [] as string[],
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierData(user);
      fetchProfile(user.id);
    }
  }, []);

  const fetchProfile = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/supplier/profile?supplier_id=${supplierId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const profile = result.data;
        setFormData({
          company_name: profile.company_name || '',
          email: profile.email || '',
          phone_number: profile.phone_number || '',
          address: profile.address || '',
          city: profile.city || '',
          province: profile.province || '',
          country: profile.country || 'Indonesia',
          website: profile.website || '',
          company_description: profile.company_description || '',
          established_year: profile.established_year?.toString() || '',
          business_type: profile.business_type || 'manufacturer',
          shipping_coverage: profile.shipping_coverage || '',
          certifications: profile.certifications || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert.error('Error', 'Failed to load profile');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierData) {
      showAlert.error('Error', 'User data not found');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/supplier/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: supplierData.id,
          ...formData,
          established_year: formData.established_year ? parseInt(formData.established_year) : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showAlert.success('Success!', 'Profile updated successfully');
      } else {
        showAlert.error('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert.error('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCertificationChange = (cert: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.includes(cert)
        ? formData.certifications.filter(c => c !== cert)
        : [...formData.certifications, cert]
    });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-gray-600 mt-2">Manage your company information and certifications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80"
                alt="Company Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Change Photo
              </button>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province *
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <input
                type="number"
                name="established_year"
                value={formData.established_year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Coverage
              </label>
              <select
                name="shipping_coverage"
                value={formData.shipping_coverage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select coverage</option>
                <option value="Indonesia Only">Indonesia Only</option>
                <option value="Indonesia & ASEAN">Indonesia & ASEAN</option>
                <option value="Seluruh Dunia">Seluruh Dunia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
          <div className="space-y-3">
            {[
              { value: 'halal', label: 'Halal Certification' },
              { value: 'coa', label: 'COA (Certificate of Analysis)' },
              { value: 'msds', label: 'MSDS (Material Safety Data Sheet)' },
              { value: 'organic', label: 'Organic Certification' },
            ].map((cert) => (
              <label key={cert.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.certifications.includes(cert.value)}
                  onChange={() => handleCertificationChange(cert.value)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <IonIcon name="shield-checkmark-outline" className="text-xl text-gray-600" />
                  <span className="font-medium text-gray-900">{cert.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <IonIcon name="save-outline" className="text-xl mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
