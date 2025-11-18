/**
 * Utility functions for handling product images
 */

const SUPABASE_PROJECT_ID = 'uefdvcdpturypqyzavjq';
const SUPABASE_STORAGE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/product-images`;

/**
 * Convert relative or malformed URLs to full Supabase Storage URLs
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Relative path starting with /
  if (url.startsWith('/')) {
    return `https://${SUPABASE_PROJECT_ID}.supabase.co${url}`;
  }

  // Path without leading slash (e.g., "products/image.jpg")
  return `${SUPABASE_STORAGE_URL}/${url}`;
}

/**
 * Get the primary or first image from a product's images array
 */
export function getProductPrimaryImage(images: Array<{
  image_url: string;
  is_primary: boolean;
  sort_order?: number;
}>): string | null {
  if (!images || images.length === 0) return null;

  // Find primary image
  const primaryImage = images.find(img => img.is_primary);
  const imageUrl = primaryImage?.image_url || images[0]?.image_url;

  return normalizeImageUrl(imageUrl);
}

/**
 * Validate if a URL is accessible (client-side check)
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Image validation failed:', url, error);
    return false;
  }
}
