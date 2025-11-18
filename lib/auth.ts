import crypto from 'crypto'
import { supabase } from './supabase'

/**
 * Hash password menggunakan MD5
 */
export function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex')
}

/**
 * Verify password dengan MD5 hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password)
  return inputHash === hash
}

/**
 * Login function
 * @param email - Email pengguna
 * @param password - Password plain text
 * @returns User data jika berhasil, null jika gagal
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    // Hash password
    const passwordHash = hashPassword(password)

    // Get user from database
    const { data: company, error } = await supabase
      .from('company')
      .select('*')
      .eq('email', email)
      .eq('password', passwordHash)
      .eq('is_active', true)
      .single()

    if (error || !company) {
      return {
        success: false,
        error: 'Email atau password salah',
      }
    }

    return {
      success: true,
      data: company,
    }
  } catch (err) {
    return {
      success: false,
      error: 'Terjadi kesalahan saat login',
    }
  }
}

/**
 * Register function
 * @param data - Data registrasi
 * @returns Company data jika berhasil
 */
export async function registerCompany(data: {
  name: string
  email: string
  password: string
  role: 'supplier' | 'buyer'
  phone?: string
  address?: string
  city?: string
  province?: string
}) {
  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('company')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existing) {
      return {
        success: false,
        error: 'Email sudah terdaftar',
      }
    }

    // Hash password
    const passwordHash = hashPassword(data.password)

    // Insert new company
    const { data: company, error } = await supabase
      .from('company')
      .insert({
        ...data,
        password: passwordHash,
      })
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'Gagal membuat akun',
      }
    }

    return {
      success: true,
      data: company,
    }
  } catch (err) {
    return {
      success: false,
      error: 'Terjadi kesalahan saat registrasi',
    }
  }
}
