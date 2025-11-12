import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type UserRole = 'consumer' | 'supplier' | 'admin'
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
export type CertificationType = 'organic' | 'halal' | 'iso' | 'gmp' | 'haccp' | 'eco' | 'other'
export type IngredientType = 'wood' | 'flower' | 'oil' | 'alcohol' | 'spice' | 'resin' | 'fruit' | 'herb' | 'synthetic' | 'other'

export interface User {
  id_user: string
  username: string
  email: string
  password: string
  phone?: string
  profile_img?: string
  company_name?: string
  company_desc?: string
  address?: string
  city?: string
  province?: string
  country?: string
  role: UserRole
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id_ingredient: string
  name: string
  type: IngredientType
  description?: string
  scent_notes?: string
  intensity?: number
  created_at: string
}

export interface Product {
  id_product: string
  supplier_id: string
  ingredient_id: string
  product_name: string
  description?: string
  harvest_season?: string
  extraction_method?: string
  stock_qty: number
  unit: string
  price_per_unit: number
  minimum_order: number
  image_url?: string
  certifications?: CertificationType[]
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface QuotationRequest {
  id_request: string
  request_number: string
  consumer_id: string
  supplier_id: string
  product_id: string
  qty: number
  unit: string
  notes?: string
  status: RequestStatus
  quoted_price?: number
  supplier_notes?: string
  response_date?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id_review: string
  consumer_id: string
  product_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface ScentPreference {
  id_preference: string
  consumer_id: string
  preferred_scent_notes?: string
  intensity_preference?: number
  liked_ingredients?: string[]
  disliked_ingredients?: string[]
  created_at: string
  updated_at: string
}

