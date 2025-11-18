'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { productService, companyService } from '@/lib/database'

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('loading')
      
      // Test 1: Basic Supabase connection
      const { data: healthCheck, error: healthError } = await supabase
        .from('company')
        .select('count')
        .limit(1)
      
      if (healthError) throw new Error(`Health check failed: ${healthError.message}`)

      // Test 2: Get companies
      const { data: companies, error: companiesError } = await supabase
        .from('company')
        .select('*')
      
      if (companiesError) throw new Error(`Companies query failed: ${companiesError.message}`)

      // Test 3: Get products with relations
      const products = await productService.getAll()

      // Test 4: Get suppliers
      const suppliers = await companyService.getSuppliers()

      setData({
        companies: companies || [],
        products: products || [],
        suppliers: suppliers || [],
        totalCompanies: companies?.length || 0,
        totalProducts: products?.length || 0,
        totalSuppliers: suppliers?.length || 0,
      })
      
      setStatus('success')
    } catch (err: any) {
      console.error('Test error:', err)
      setError(err.message || 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">🧪 Database Connection Test</h1>
          <p className="text-gray-600 mb-6">Testing Supabase connection & data fetching</p>

          {/* Test Credentials Info */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              🔑 Test Accounts (Password: <code className="bg-purple-100 px-2 py-1 rounded text-sm">aromara123</code>)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/60 rounded p-3">
                <p className="font-semibold text-purple-700">👤 Admin</p>
                <p className="text-gray-700 text-xs mt-1">admin@aromara.id</p>
              </div>
              <div className="bg-white/60 rounded p-3">
                <p className="font-semibold text-green-700">🏭 Supplier</p>
                <p className="text-gray-700 text-xs mt-1">supplier@aromara.id</p>
              </div>
              <div className="bg-white/60 rounded p-3">
                <p className="font-semibold text-blue-700">🛒 Buyer</p>
                <p className="text-gray-700 text-xs mt-1">buyer@aromara.id</p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 font-medium">Testing connection...</span>
              </div>
            )}
            
            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">✅ Connection successful!</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">❌ Connection failed</p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
              </div>
            )}
          </div>

          {/* Results */}
          {status === 'success' && data && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <p className="text-blue-600 text-sm font-medium">Total Companies</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{data.totalCompanies}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <p className="text-green-600 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{data.totalProducts}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <p className="text-purple-600 text-sm font-medium">Total Suppliers</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{data.totalSuppliers}</p>
                </div>
              </div>

              {/* Companies Table */}
              <div>
                <h2 className="text-xl font-bold mb-3">Companies</h2>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.companies.map((company: any) => (
                        <tr key={company.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {company.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              company.role === 'supplier' ? 'bg-green-100 text-green-800' :
                              company.role === 'buyer' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {company.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {company.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {company.is_verified ? '✅' : '❌'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h2 className="text-xl font-bold mb-3">Products</h2>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.products.map((product: any) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.supplier?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price_per_unit ? `Rp ${product.price_per_unit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock_status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw Data */}
              <details className="bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700">
                  🔍 View Raw Data (JSON)
                </summary>
                <pre className="mt-4 text-xs bg-white p-4 rounded border overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Retry Button */}
          {status === 'error' && (
            <button
              onClick={testConnection}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
