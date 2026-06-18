'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  name: string;
  category_id: string;
  description: string;
  price_per_unit: string;
  min_order_qty: string;
  min_order_unit: string;
  stock_status: string;
  available_quantities: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newImagePath, setNewImagePath] = useState<string>('');
  const [formData, setFormData] = useState<ProductFormData>({
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
  }, [productId]);

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
        showAlert.error('Error', 'Data user tidak ditemukan');
        router.push('/supplier/products');
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`/api/supplier/products?supplier_id=${user.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        const product = result.data.find((p: { id: string }) => p.id === productId);

        if (product) {
          setCurrentImage(product.image_product || '');
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
          showAlert.error('Error', 'Produk tidak ditemukan');
          router.push('/supplier/products');
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showAlert.error('Error', 'Gagal memuat produk');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formPayload = new FormData();
      formPayload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      });
      const result = await response.json();

      if (result.success) {
        if (newImagePath) {
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: newImagePath }),
          });
        }
        setNewImageUrl(result.data.url);
        setNewImagePath(result.data.path);
        showAlert.success('Upload berhasil', 'Gambar baru siap digunakan');
      } else {
        showAlert.error('Upload gagal', result.error || 'Gagal mengupload gambar');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showAlert.error('Error', 'Gagal mengupload gambar');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveNewImage = async () => {
    if (newImagePath) {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newImagePath }),
      });
    }
    setNewImageUrl('');
    setNewImagePath('');
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
        available_quantities: formData.available_quantities
          .split(',')
          .map(q => q.trim())
          .filter(q => q),
        ...(newImageUrl ? { image_product: newImageUrl } : {}),
      };

      const response = await fetch(`/api/supplier/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        showAlert.success('Berhasil!', 'Produk berhasil diperbarui');
        router.push('/supplier/products');
      } else {
        showAlert.error('Error', result.error || 'Gagal memperbarui produk');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showAlert.error('Error', 'Gagal memperbarui produk');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const displayImage = newImageUrl || currentImage;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IonIcon name="arrow-back" className="text-2xl" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi produk Anda</p>
        </div>
      </div>

      {/* Image Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Foto Produk</h2>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {displayImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={displayImage}
                  alt="Foto produk"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IonIcon name="image-outline" className="text-4xl text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            {newImageUrl && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <IonIcon name="checkmark-circle-outline" className="text-base" />
                Gambar baru siap disimpan
              </p>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <span className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengupload...
                  </>
                ) : (
                  <>
                    <IonIcon name="cloud-upload-outline" className="text-base mr-2" />
                    {currentImage || newImageUrl ? 'Ganti Foto' : 'Upload Foto'}
                  </>
                )}
              </span>
            </label>
            {newImageUrl && (
              <button
                type="button"
                onClick={handleRemoveNewImage}
                className="block text-sm text-red-500 hover:text-red-700"
              >
                Batal ganti foto
              </button>
            )}
            <p className="text-xs text-gray-500">JPG, PNG. Maks 5MB</p>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
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
                Kategori *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Pilih kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Stok *
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
                Deskripsi
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Harga & Kuantitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga per Unit (IDR) *
              </label>
              <input
                type="number"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="min_order_qty"
                  value={formData.min_order_qty}
                  onChange={handleChange}
                  required
                  min="1"
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
                Kuantitas Tersedia
                <span className="text-gray-400 font-normal ml-2 text-xs">(pisah dengan koma)</span>
              </label>
              <input
                type="text"
                name="available_quantities"
                value={formData.available_quantities}
                onChange={handleChange}
                placeholder="Contoh: 1kg, 5kg, 10kg"
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
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <IonIcon name="checkmark-circle-outline" className="text-xl mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
