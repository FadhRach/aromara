import { supabase, type User, type Ingredient, type Product, type QuotationRequest, type Review, type ScentPreference } from './supabase'

// =====================================================
// USER OPERATIONS
// =====================================================

export const userService = {
  // Get user by ID
  async getById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id_user', userId)
      .single()
    
    if (error) throw error
    return data as User
  },

  // Get user by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data as User
  },

  // Get all suppliers
  async getSuppliers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'supplier')
      .eq('is_verified', true)
      .eq('is_active', true)

    if (error) throw error
    return data as User[]
  },
}

// =====================================================
// INGREDIENT OPERATIONS
// =====================================================

export const ingredientService = {
  // Get all ingredients
  async getAll() {
    const { data, error} = await supabase
      .from('ingredients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data as Ingredient[]
  },

  // Get ingredients by type
  async getByType(type: string) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true })

    if (error) throw error
    return data as Ingredient[]
  },
}

// =====================================================
// PRODUCT OPERATIONS
// =====================================================

export const productService = {
  // Get all available products
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        ingredient:ingredients(*),
        supplier:users!products_supplier_id_fkey(*)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get product by ID
  async getById(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        ingredient:ingredients(*),
        supplier:users!products_supplier_id_fkey(*)
      `)
      .eq('id_product', productId)
      .single()

    if (error) throw error
    return data
  },

  // Get products by supplier
  async getBySupplier(supplierId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        ingredient:ingredients(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get products by ingredient type
  async getByIngredientType(ingredientType: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        ingredient:ingredients(*),
        supplier:users!products_supplier_id_fkey(*)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Filter by ingredient type
    return data?.filter(p => p.ingredient?.type === ingredientType) || []
  },

  // Create product (for supplier)
  async create(product: Omit<Product, 'id_product' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  // Update product
  async update(productId: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id_product', productId)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },
}

// =====================================================
// QUOTATION REQUEST OPERATIONS
// =====================================================

export const quotationService = {
  // Create quotation request
  async create(request: Omit<QuotationRequest, 'id_request' | 'request_number' | 'status' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quotation_requests')
      .insert(request)
      .select(`
        *,
        product:products(*),
        consumer:users!quotation_requests_consumer_id_fkey(*),
        supplier:users!quotation_requests_supplier_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Get requests for consumer
  async getByConsumer(consumerId: string) {
    const { data, error } = await supabase
      .from('quotation_requests')
      .select(`
        *,
        product:products(*),
        supplier:users!quotation_requests_supplier_id_fkey(*)
      `)
      .eq('consumer_id', consumerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get requests for supplier
  async getBySupplier(supplierId: string) {
    const { data, error } = await supabase
      .from('quotation_requests')
      .select(`
        *,
        product:products(*),
        consumer:users!quotation_requests_consumer_id_fkey(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update status (for supplier response)
  async updateStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'completed',
    quoted_price?: number,
    supplier_notes?: string
  ) {
    const { data, error } = await supabase
      .from('quotation_requests')
      .update({
        status,
        quoted_price,
        supplier_notes,
        response_date: new Date().toISOString(),
      })
      .eq('id_request', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// =====================================================
// REVIEW OPERATIONS
// =====================================================

export const reviewService = {
  // Create review
  async create(review: Omit<Review, 'id_review' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()

    if (error) throw error
    return data as Review
  },

  // Get reviews for product
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        consumer:users(username, profile_img)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get average rating for product
  async getProductRating(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (error) throw error

    if (!data || data.length === 0) {
      return { average: 0, count: 0 }
    }

    const sum = data.reduce((acc, review) => acc + review.rating, 0)
    return {
      average: Math.round((sum / data.length) * 10) / 10,
      count: data.length,
    }
  },
}

// =====================================================
// SCENT PREFERENCE OPERATIONS
// =====================================================

export const scentPreferenceService = {
  // Get consumer preferences
  async getByConsumer(consumerId: string) {
    const { data, error } = await supabase
      .from('scent_preferences')
      .select('*')
      .eq('consumer_id', consumerId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data as ScentPreference | null
  },

  // Update preferences
  async upsert(consumerId: string, preferences: Partial<ScentPreference>) {
    const { data, error } = await supabase
      .from('scent_preferences')
      .upsert({
        consumer_id: consumerId,
        ...preferences,
      })
      .select()
      .single()

    if (error) throw error
    return data as ScentPreference
  },

  // Get recommended products based on preferences
  async getRecommendations(consumerId: string) {
    // Get consumer preferences
    const preferences = await this.getByConsumer(consumerId)
    
    if (!preferences || !preferences.liked_ingredients) {
      return []
    }

    // Get products with liked ingredients
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        ingredient:ingredients(*),
        supplier:users!products_supplier_id_fkey(*)
      `)
      .in('ingredient_id', preferences.liked_ingredients)
      .eq('is_available', true)
      .limit(10)

    if (error) throw error
    return data
  },
}
