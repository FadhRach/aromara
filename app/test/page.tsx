'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      console.log('Categories API Response:', result);
      setCategories(result.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Upload result:', result);
      setUploadResult(result);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Categories Test</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="mb-2">Total categories: {categories.length}</p>
            <ul className="list-disc pl-5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  {cat.name} (ID: {cat.id}, Slug: {cat.slug})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Test</h2>
        <input
          type="file"
          accept="image/*"
          onChange={testUpload}
          className="mb-2"
        />
        {uploadResult && (
          <div className="p-4 bg-gray-100 rounded">
            <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
            {uploadResult.success && (
              <img
                src={uploadResult.data.url}
                alt="Uploaded"
                className="mt-4 max-w-md"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
