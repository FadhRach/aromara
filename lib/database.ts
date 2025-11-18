import { supabase, type Company, type Product, type Inquiry, type InquiryItem, type ProductCategory } from './supabase'

// =====================================================
// COMPANY SERVICE
// =====================================================

export const companyService = {
  // Get company by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Company
  },

  // Get all suppliers
  async getSuppliers() {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('role', 'supplier')
      .eq('is_verified', true)
      .eq('is_active', true)

    if (error) throw error
    return data as Company[]
  },

  // Get all buyers
  async getBuyers() {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('role', 'buyer')
      .eq('is_active', true)

    if (error) throw error
    return data as Company[]
  },

  // Get all admins
  async getAdmins() {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('role', 'admin')
      .eq('is_active', true)

    if (error) throw error
    return data as Company[]
  },
}

// =====================================================
// PRODUCT SERVICE
// =====================================================

export const productService = {
  // Get all products with supplier and category info
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:company!products_supplier_id_fkey(*),
        category:product_categories(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get product by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:company!products_supplier_id_fkey(*),
        category:product_categories(*)
      `)
      .eq('id', id)
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
        category:product_categories(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get products by category
  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:company!products_supplier_id_fkey(*),
        category:product_categories(*)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Search products
  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:company!products_supplier_id_fkey(*),
        category:product_categories(*)
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Create product (supplier only)
  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  // Update product
  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },
}

// =====================================================
// CATEGORY SERVICE
// =====================================================

export const categoryService = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data as ProductCategory[]
  },
}

// =====================================================
// INQUIRY SERVICE (RFQ)
// =====================================================

export const inquiryService = {
  // Create inquiry
  async create(inquiry: {
    supplier_id: string
    buyer_id: string
    subject: string
    message: string
    items?: Array<{
      product_id: string
      qty: number
      unit?: string
      target_price?: number
    }>
  }) {
    // Create inquiry
    const { data: inquiryData, error: inquiryError } = await supabase
      .from('inquiry')
      .insert({
        supplier_id: inquiry.supplier_id,
        buyer_id: inquiry.buyer_id,
        subject: inquiry.subject,
        message: inquiry.message,
      })
      .select()
      .single()

    if (inquiryError) throw inquiryError

    // Add inquiry items if provided
    if (inquiry.items && inquiry.items.length > 0) {
      const itemsToInsert = inquiry.items.map(item => ({
        inquiry_id: inquiryData.id,
        ...item,
      }))

      const { error: itemsError } = await supabase
        .from('inquiry_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError
    }

    return inquiryData as Inquiry
  },

  // Get inquiries for buyer
  async getByBuyer(buyerId: string) {
    const { data, error } = await supabase
      .from('inquiry')
      .select(`
        *,
        supplier:company!inquiry_supplier_id_fkey(*),
        items:inquiry_items(
          *,
          product:products(*)
        )
      `)
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get inquiries for supplier
  async getBySupplier(supplierId: string) {
    const { data, error } = await supabase
      .from('inquiry')
      .select(`
        *,
        buyer:company!inquiry_buyer_id_fkey(*),
        items:inquiry_items(
          *,
          product:products(*)
        )
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update inquiry status
  async updateStatus(inquiryId: string, status: 'open' | 'negotiating' | 'closed' | 'ordered') {
    const { data, error } = await supabase
      .from('inquiry')
      .update({ status })
      .eq('id', inquiryId)
      .select()
      .single()

    if (error) throw error
    return data as Inquiry
  },

  // Get inquiry by ID with all details
  async getById(inquiryId: string) {
    const { data, error } = await supabase
      .from('inquiry')
      .select(`
        *,
        supplier:company!inquiry_supplier_id_fkey(*),
        buyer:company!inquiry_buyer_id_fkey(*),
        items:inquiry_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', inquiryId)
      .single()

    if (error) throw error
    return data
  },
}

// =====================================================
// MESSAGE SERVICE
// =====================================================

export const messageService = {
  // Send message in inquiry
  async send(inquiryId: string, senderId: string, body: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        inquiry_id: inquiryId,
        sender_id: senderId,
        body,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get messages for inquiry
  async getByInquiry(inquiryId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:company(id, name, profile_img)
      `)
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },
}
