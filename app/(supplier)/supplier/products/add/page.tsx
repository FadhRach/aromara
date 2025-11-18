'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface UploadedImage {
  url: string;
  path: string;
  fileName: string;
  isPrimary: boolean;
}

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [supplierData, setSupplierData] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
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
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierData(user);
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      console.log('Categories fetched:', result);
      if (result.success) {
        setCategories(result.data || []);
      } else {
        showAlert.error('Error', 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showAlert.error('Error', 'Failed to load categories');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          return {
            url: result.data.url,
            path: result.data.path,
            fileName: result.data.fileName,
            isPrimary: uploadedImages.length === 0, // First image is primary
          };
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...newImages]);
      showAlert.success('Success!', `${newImages.length} image(s) uploaded`);
    } catch (error) {
      console.error('Error uploading images:', error);
      showAlert.error('Error', 'Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = uploadedImages[index];
    
    try {
      // Delete from storage
      await fetch(`/api/upload?path=${encodeURIComponent(image.path)}`, {
        method: 'DELETE',
      });

      const newImages = uploadedImages.filter((_, i) => i !== index);
      
      // If removed image was primary, make first image primary
      if (image.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      
      setUploadedImages(newImages);
      showAlert.success('Success!', 'Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      showAlert.error('Error', 'Failed to remove image');
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    const newImages = uploadedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setUploadedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierData) {
      showAlert.error('Error', 'User data not found');
      return;
    }

    if (uploadedImages.length === 0) {
      showAlert.error('Error', 'Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        supplier_id: supplierData.id,
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description || null,
        price_per_unit: parseFloat(formData.price_per_unit),
        min_order_qty: parseInt(formData.min_order_qty),
        min_order_unit: formData.min_order_unit,
        stock_status: formData.stock_status,
        available_quantities: formData.available_quantities.split(',').map(q => q.trim()).filter(q => q),
        images: uploadedImages.map((img, index) => ({
          image_url: img.url,
          is_primary: img.isPrimary,
          display_order: index,
        })),
      };

      const response = await fetch('/api/supplier/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        showAlert.success('Success!', 'Product created successfully');
        router.push('/supplier/products');
      } else {
        showAlert.error('Error', result.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showAlert.error('Error', 'Failed to create product');
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in the details to add a new product to your catalog</p>
        </div>
      </div>

      {/* Form */}
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
                placeholder="e.g., Lavender Oil Murni"
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
                placeholder="Describe your product..."
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
                placeholder="1250000"
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
                  placeholder="1"
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
                <span className="text-gray-500 text-xs ml-2">(comma-separated, e.g., 1 kg, 5 kg, 10 kg)</span>
              </label>
              <input
                type="text"
                name="available_quantities"
                value={formData.available_quantities}
                onChange={handleChange}
                placeholder="1 kg, 5 kg, 10 kg, 25 kg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images *</h2>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <IonIcon name="cloud-upload-outline" className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mb-4">PNG, JPG, WEBP up to 5MB</p>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
              id="product-images"
            />
            <label
              htmlFor="product-images"
              className={`inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors ${
                uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImage ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </span>
              ) : (
                'Select Images'
              )}
            </label>
          </div>

          {/* Preview Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {uploadedImages.length} image(s) uploaded. Click on an image to set as primary.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      image.isPrimary ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                Creating...
              </>
            ) : (
              <>
                <IonIcon name="checkmark-circle-outline" className="text-xl mr-2" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
