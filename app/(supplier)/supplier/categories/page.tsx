"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IonIcon from "@/components/shared/IonIcon";
import Swal from 'sweetalert2';

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/supplier/categories');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Category name is required',
      });
      return;
    }

    try {
      const url = editingId 
        ? `/api/supplier/categories/${editingId}`
        : '/api/supplier/categories';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingId ? 'Category updated successfully' : 'Category created successfully',
          timer: 1500,
          showConfirmButton: false,
        });

        // Reset form
        setFormData({ name: "", description: "", slug: "" });
        setIsAdding(false);
        setEditingId(null);
        
        // Refresh categories
        fetchCategories();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save category',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      slug: category.slug,
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/supplier/categories/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Category deleted successfully',
            timer: 1500,
            showConfirmButton: false,
          });

          fetchCategories();
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        console.error('Error deleting category:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete category',
        });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", slug: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
          </div>
          
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-[#252F24] hover:bg-[#252F24]/90 text-white"
            >
              <IonIcon name="add-outline" className="text-xl mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="mb-6 border-2 border-[#252F24]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Essential Oils"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <Input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#252F24] focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-[#252F24] hover:bg-[#252F24]/90 text-white"
                  >
                    <IonIcon name="checkmark-outline" className="text-xl mr-2" />
                    {editingId ? 'Update' : 'Create'} Category
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <IonIcon name="file-tray-outline" className="text-6xl text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No categories yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first category to organize products</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                        {category.slug}
                      </p>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {new Date(category.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <IonIcon name="create-outline" className="text-lg" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <IonIcon name="trash-outline" className="text-lg" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
