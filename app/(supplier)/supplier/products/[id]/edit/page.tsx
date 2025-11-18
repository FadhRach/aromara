'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price_per_unit: '',
    min_order_qty: '',
    min_order_unit: 'kg',
    stock_status: 'ready_stock',
    available_quantities: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        showAlert.error('Error', 'User data not found');
        router.push('/supplier/products');
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`/api/supplier/products?supplier_id=${user.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        const product = result.data.find((p: any) => p.id === params.id);
        
        if (product) {
          setFormData({
            name: product.name,
            category_id: product.category_id || '',
            description: product.description || '',
            price_per_unit: product.price_per_unit?.toString() || '',
            min_order_qty: product.min_order_qty?.toString() || '',
            min_order_unit: product.min_order_unit || 'kg',
            stock_status: product.stock_status || 'ready_stock',
            available_quantities: Array.isArray(product.available_quantities) 
              ? product.available_quantities.join(', ') 
              : '',
          });
        } else {
          showAlert.error('Error', 'Product not found');
          router.push('/supplier/products');
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showAlert.error('Error', 'Failed to load product');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description || null,
        price_per_unit: parseFloat(formData.price_per_unit),
        min_order_qty: parseInt(formData.min_order_qty),
        min_order_unit: formData.min_order_unit,
        stock_status: formData.stock_status,
        available_quantities: formData.available_quantities.split(',').map(q => q.trim()).filter(q => q),
      };

      const response = await fetch(`/api/supplier/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        showAlert.success('Success!', 'Product updated successfully');
        router.push('/supplier/products');
      } else {
        showAlert.error('Error', result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showAlert.error('Error', 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IonIcon name="arrow-back" className="text-2xl" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product information</p>
        </div>
      </div>

      {/* Form - Same as Add Product but with pre-filled data */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status *
              </label>
              <select
                name="stock_status"
                value={formData.stock_status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ready_stock">Ready Stock</option>
                <option value="pre_order">Pre Order</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Quantity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Quantity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit (IDR) *
              </label>
              <input
                type="number"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="min_order_qty"
                  value={formData.min_order_qty}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select
                  name="min_order_unit"
                  value={formData.min_order_unit}
                  onChange={handleChange}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="pcs">pcs</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantities
                <span className="text-gray-500 text-xs ml-2">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="available_quantities"
                value={formData.available_quantities}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <IonIcon name="checkmark-circle-outline" className="text-xl mr-2" />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
