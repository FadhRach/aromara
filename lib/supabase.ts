import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // Fallback for build time

// =====================================================
// DATABASE TYPES (matching Supabase schema)
// =====================================================

export type CompanyRole = 'supplier' | 'buyer' | 'admin'
export type InquiryStatus = 'open' | 'negotiating' | 'closed' | 'ordered'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Company (Suppliers & Buyers)
export interface Company {
  id: string
  name: string
  email: string
  password: string
  phone?: string
  profile_img?: string
  address?: string
  city?: string
  province?: string
  country?: string
  role: CompanyRole
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Product Category
export interface ProductCategory {
  id: string
  name: string
  description?: string
  created_at: string
}

// Product
export interface Product {
  id: string
  supplier_id: string
  category_id: string
  name: string
  description?: string
  image_product?: string
  price_per_unit?: number
  min_order_qty?: number
  stock_qty?: number
  currency?: string
  stock_status?: string
  created_at: string
  updated_at: string
  
  // Relations (populated via joins)
  supplier?: Company
  category?: ProductCategory
}

// Inquiry (RFQ)
export interface Inquiry {
  id: string
  supplier_id: string
  buyer_id: string
  subject: string
  message: string
  estimated_total?: number
  status: InquiryStatus
  created_at: string
  updated_at: string
  
  // Relations
  supplier?: Company
  buyer?: Company
  items?: InquiryItem[]
}

// Inquiry Items
export interface InquiryItem {
  id: string
  inquiry_id: string
  product_id: string
  qty: number
  unit?: string
  target_price?: number
  created_at: string
  updated_at: string
  
  // Relations
  product?: Product
}

// Order
export interface Order {
  id: string
  inquiry_id?: string
  buyer_id: string
  supplier_id: string
  total_amount: number
  notes?: string
  status: OrderStatus
  created_at: string
  updated_at: string
  
  // Relations
  buyer?: Company
  supplier?: Company
}

// Message
export interface Message {
  id: string
  inquiry_id: string
  sender_id: string
  body: string
  created_at: string
  updated_at: string
  
  // Relations
  sender?: Company
}

