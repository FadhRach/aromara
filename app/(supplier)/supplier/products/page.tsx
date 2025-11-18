'use client';

import { useEffect, useState } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import Link from 'next/link';
import Image from 'next/image';
import { showAlert } from '@/lib/sweetalert';
import { normalizeImageUrl, getProductPrimaryImage } from '@/lib/image-utils';

interface Product {
  id: string;
  name: string;
  category_id: string;
  price_per_unit: number;
  stock_status: 'ready_stock' | 'pre_order' | 'out_of_stock';
  min_order_qty: number;
  min_order_unit: string;
  product_categories?: {
    name: string;
  };
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

export default function SupplierProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierData, setSupplierData] = useState<any>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierData(user);
      fetchProducts(user.id);
    }
  }, []);

  const fetchProducts = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/supplier/products?supplier_id=${supplierId}`);
      const result = await response.json();
      
      if (result.success) {
        console.log('Products loaded:', result.data);
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert.error('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      showAlert.error('Error', 'Invalid product ID');
      return;
    }

    const confirm = await showAlert.confirm(
      'Delete Product?',
      'This action cannot be undone!',
      'Yes, delete it'
    );

    if (confirm) {
      try {
        console.log('Deleting product ID:', productId);
        const response = await fetch(`/api/supplier/products/${productId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          showAlert.success('Deleted!', 'Product has been deleted');
          setProducts(products.filter(p => p.id !== productId));
        } else {
          showAlert.error('Error', result.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showAlert.error('Error', 'Failed to delete product');
      }
    }
  };

  const handleImageError = (productId: string, imageUrl: string) => {
    // Silently mark as error without console spam
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getProductImage = (product: Product) => {
    if (!product.product_images || product.product_images.length === 0) {
      return null;
    }
    
    const imageUrl = getProductPrimaryImage(product.product_images);
    
    // Filter out external/dummy URLs - only use Supabase Storage
    if (imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/product-images/')) {
      return imageUrl;
    }
    
    // Return null for Unsplash or other external URLs (will show placeholder)
    return null;
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      ready_stock: 'bg-green-100 text-green-800',
      pre_order: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.ready_stock;
  };

  const getStatusText = (status: string) => {
    const text = {
      ready_stock: 'Ready Stock',
      pre_order: 'Pre Order',
      out_of_stock: 'Out of Stock',
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Link
          href="/supplier/products/add"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <IonIcon name="add-circle-outline" className="text-xl mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <IonIcon name="search-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <IonIcon name="filter-outline" className="text-xl mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <IonIcon name="cube-outline" className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Start by adding your first product</p>
          <Link
            href="/supplier/products/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <IonIcon name="add-circle-outline" className="text-xl mr-2" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200">
                {(() => {
                  const imageUrl = getProductImage(product);
                  const hasError = imageErrors.has(product.id);
                  
                  // Only render if we have a valid Supabase Storage URL
                  if (imageUrl && !hasError) {
                    return (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(product.id, imageUrl)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    );
                  }
                  
                  // Show placeholder for products without valid images
                  return (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                      <IonIcon name="image-outline" className="text-6xl text-gray-400" />
                      <p className="text-xs text-gray-500 mt-2">No image</p>
                    </div>
                  );
                })()}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.product_categories?.name || 'Uncategorized'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(product.stock_status)}`}>
                    {getStatusText(product.stock_status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="font-semibold text-gray-900">
                      Rp {product.price_per_unit?.toLocaleString('id-ID') || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Min. Order</span>
                    <span className="font-semibold text-gray-900">
                      {product.min_order_qty} {product.min_order_unit}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/supplier/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <IonIcon name="create-outline" className="text-lg mr-1" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <IonIcon name="trash-outline" className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
