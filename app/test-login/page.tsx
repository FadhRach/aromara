'use client'

import { useState } from 'react'
import { loginWithEmail, hashPassword, verifyPassword } from '@/lib/auth'

export default function TestLoginPage() {
  const [email, setEmail] = useState('supplier@aromara.id')
  const [password, setPassword] = useState('aromara123')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setResult(null)
    
    const response = await loginWithEmail(email, password)
    setResult(response)
    setLoading(false)
  }

  const testHash = () => {
    const hash = hashPassword(password)
    setResult({
      type: 'hash',
      password: password,
      hash: hash,
      verify: verifyPassword(password, hash),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">🔐 Login Test</h1>
          <p className="text-gray-600 mb-6">Test login dengan MD5 password hash</p>

          {/* Test Credentials */}
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-900 mb-2">Test Accounts:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Admin:</strong> admin@aromara.id</p>
              <p><strong>Supplier:</strong> supplier@aromara.id</p>
              <p><strong>Buyer:</strong> buyer@aromara.id</p>
              <p className="text-purple-700 mt-2"><strong>Password:</strong> aromara123</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@aromara.id"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="aromara123"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? '⏳ Logging in...' : '🔑 Login'}
              </button>

              <button
                onClick={testHash}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                🔐 Test Hash
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6">
              {result.type === 'hash' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold text-purple-900 mb-2">MD5 Hash Test</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Password:</strong> {result.password}</p>
                    <p><strong>Hash:</strong> <code className="bg-purple-100 px-2 py-1 rounded">{result.hash}</code></p>
                    <p><strong>Verify:</strong> {result.verify ? '✅ Valid' : '❌ Invalid'}</p>
                  </div>
                </div>
              ) : result.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">✅ Login Berhasil!</h3>
                  <div className="mt-3 bg-white p-4 rounded border">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">❌ Login Gagal</h3>
                  <p className="text-red-700 text-sm">{result.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-gray-900 mb-3">Quick Test:</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setEmail('admin@aromara.id')
                  setPassword('aromara123')
                }}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  setEmail('supplier@aromara.id')
                  setPassword('aromara123')
                }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
              >
                Supplier
              </button>
              <button
                onClick={() => {
                  setEmail('buyer@aromara.id')
                  setPassword('aromara123')
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
              >
                Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
