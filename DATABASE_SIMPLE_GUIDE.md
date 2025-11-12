# 🗄️ Aromara Database Schema - Simple & Clear

## 📋 Table Structure

### 1. `users` - User Accounts
```sql
- id_user (UUID, PK)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- phone (VARCHAR)
- profile_img (TEXT)
- company_name (VARCHAR) -- untuk supplier
- company_desc (TEXT) -- untuk supplier
- address, city, province, country
- role (ENUM: consumer, supplier, admin)
- is_verified, is_active (BOOLEAN)
```

### 2. `ingredients` - Master Data Bahan Parfum
```sql
- id_ingredient (UUID, PK)
- name (VARCHAR) -- e.g., "Sandalwood", "Rose", "Lavender"
- type (ENUM) -- wood, flower, oil, alcohol, spice, resin, fruit, herb, synthetic, other
- description (TEXT)
- scent_notes (TEXT) -- e.g., "woody, warm, creamy"
- intensity (INTEGER 1-10)
```

**Ingredient Types:**
- `wood` - Sandalwood, Cedarwood, Oud, Vetiver
- `flower` - Rose, Jasmine, Lavender, Ylang Ylang
- `oil` - Bergamot Oil, Patchouli Oil, Frankincense
- `alcohol` - Ethanol, Denatured Alcohol
- `spice` - Vanilla, Cinnamon, Cardamom, Black Pepper
- `resin` - Amber, Myrrh
- `fruit` - Lemon, Orange, Bergamot
- `herb` - Mint, Basil, Rosemary
- `synthetic` - Iso E Super, Ambroxan

### 3. `products` - Supplier's Products
```sql
- id_product (UUID, PK)
- supplier_id (UUID, FK → users)
- ingredient_id (UUID, FK → ingredients)
- product_name (VARCHAR)
- description (TEXT)
- harvest_season (VARCHAR) -- e.g., "Spring 2025", "Year-round"
- extraction_method (VARCHAR) -- e.g., "Steam Distillation", "Cold Press"
- stock_qty (DECIMAL)
- unit (VARCHAR) -- kg, liter, ml, piece
- price_per_unit (DECIMAL)
- minimum_order (DECIMAL)
- image_url (TEXT)
- certifications (ARRAY) -- organic, halal, iso, gmp, etc.
- is_available (BOOLEAN)
```

**Relationship:**
- Product milik satu Supplier
- Product mengacu ke satu Ingredient (master data)
- Contoh: Supplier "Bali Essences" jual "Premium Bali Sandalwood Oil" yang ingredient-nya "Sandalwood"

### 4. `quotation_requests` - Request Quotation
```sql
- id_request (UUID, PK)
- request_number (VARCHAR) -- auto: REQ-2025-00001
- consumer_id (UUID, FK → users)
- supplier_id (UUID, FK → users)
- product_id (UUID, FK → products)
- qty (DECIMAL)
- unit (VARCHAR)
- notes (TEXT) -- consumer notes
- status (ENUM) -- pending, accepted, rejected, completed, cancelled
- quoted_price (DECIMAL) -- response dari supplier
- supplier_notes (TEXT) -- response dari supplier
- response_date (TIMESTAMP)
```

**Flow:**
1. Consumer lihat produk
2. Consumer create request quotation
3. Supplier terima notifikasi
4. Supplier response (accept/reject) dengan quoted_price
5. Consumer lihat response

### 5. `reviews` - Product Reviews
```sql
- id_review (UUID, PK)
- consumer_id (UUID, FK → users)
- product_id (UUID, FK → products)
- rating (INTEGER 1-5)
- comment (TEXT)
- created_at (TIMESTAMP)
```

### 6. `scent_preferences` - Consumer Preferences (For AI)
```sql
- id_preference (UUID, PK)
- consumer_id (UUID, FK → users)
- preferred_scent_notes (TEXT) -- e.g., "floral, woody, fresh"
- intensity_preference (INTEGER 1-10)
- liked_ingredients (UUID[]) -- array of ingredient IDs
- disliked_ingredients (UUID[])
```

---

## 💾 Seed Data (Dummy Data)

### Ingredients (27 items):
- **Woods**: Sandalwood, Cedarwood, Oud, Vetiver
- **Flowers**: Rose, Jasmine, Lavender, Ylang Ylang, Neroli
- **Oils**: Bergamot Oil, Patchouli Oil, Frankincense Oil
- **Alcohols**: Ethanol 96%, Denatured Alcohol
- **Spices**: Vanilla, Cinnamon, Cardamom, Black Pepper
- **Resins**: Amber, Myrrh
- **Fruits**: Lemon, Bergamot, Orange
- **Herbs**: Mint, Basil, Rosemary
- **Synthetics**: Iso E Super, Ambroxan

### Users:
- **Admin**: admin@aromara.id
- **Suppliers** (3):
  - Bali Natural Essences (Ubud, Bali)
  - Java Fragrance Co (Yogyakarta)
  - Sumatra Essential Oils (Medan)
- **Consumers** (2): 
  - consumer1, consumer2

### Products (6 products):
1. **Premium Bali Sandalwood Oil** - Rp 2,500,000/kg
2. **Bali Lavender Essential Oil** - Rp 850,000/kg
3. **Java Patchouli Absolute** - Rp 950,000/kg
4. **Premium Java Vanilla Extract** - Rp 1,800,000/kg
5. **Sumatra Bergamot Oil** - Rp 750,000/kg
6. **Organic Sumatra Vetiver** - Rp 1,200,000/kg

### Quotation Requests (2):
1. Consumer1 → Bali Supplier (5kg Sandalwood) - pending
2. Consumer2 → Java Supplier (10kg Patchouli) - accepted

### Reviews (2):
1. Consumer1 reviewed Lavender Oil - 5 stars
2. Consumer2 reviewed Patchouli - 4 stars

### Scent Preferences (2):
1. Consumer1: likes floral, fresh, citrus (intensity 6)
2. Consumer2: likes woody, earthy, spicy (intensity 8)

---

## 🔧 API Functions (TypeScript)

### User Service
```typescript
import { userService } from '@/lib/database'

// Get user by ID
const user = await userService.getById(userId)

// Get all verified suppliers
const suppliers = await userService.getSuppliers()
```

### Ingredient Service
```typescript
import { ingredientService } from '@/lib/database'

// Get all ingredients
const ingredients = await ingredientService.getAll()

// Get by type
const flowers = await ingredientService.getByType('flower')
```

### Product Service
```typescript
import { productService } from '@/lib/database'

// Get all available products
const products = await productService.getAll()

// Get product by ID (with ingredient & supplier data)
const product = await productService.getById(productId)

// Get products by supplier
const myProducts = await productService.getBySupplier(supplierId)

// Get products by ingredient type
const woodProducts = await productService.getByIngredientType('wood')

// Create product (supplier only)
const newProduct = await productService.create({
  supplier_id: 'uuid',
  ingredient_id: 'uuid',
  product_name: 'My Sandalwood Oil',
  description: 'Premium quality',
  harvest_season: 'Spring 2025',
  extraction_method: 'Steam Distillation',
  stock_qty: 50,
  unit: 'kg',
  price_per_unit: 2500000,
  minimum_order: 1,
  certifications: ['organic', 'eco'],
  is_available: true
})

// Update product
await productService.update(productId, { stock_qty: 40 })
```

### Quotation Service
```typescript
import { quotationService } from '@/lib/database'

// Create quotation request
const request = await quotationService.create({
  consumer_id: 'uuid',
  supplier_id: 'uuid',
  product_id: 'uuid',
  qty: 5,
  unit: 'kg',
  notes: 'Need COA and MSDS'
})

// Get my requests (consumer)
const myRequests = await quotationService.getByConsumer(consumerId)

// Get requests for me (supplier)
const incomingRequests = await quotationService.getBySupplier(supplierId)

// Respond to request (supplier)
await quotationService.updateStatus(
  requestId,
  'accepted',
  900000, // quoted price
  'Special price for bulk order'
)
```

### Review Service
```typescript
import { reviewService } from '@/lib/database'

// Create review
const review = await reviewService.create({
  consumer_id: 'uuid',
  product_id: 'uuid',
  rating: 5,
  comment: 'Amazing quality!'
})

// Get product reviews
const reviews = await reviewService.getByProduct(productId)

// Get average rating
const { average, count } = await reviewService.getProductRating(productId)
// e.g., { average: 4.5, count: 10 }
```

### Scent Preference Service
```typescript
import { scentPreferenceService } from '@/lib/database'

// Get preferences
const prefs = await scentPreferenceService.getByConsumer(consumerId)

// Update preferences
await scentPreferenceService.upsert(consumerId, {
  preferred_scent_notes: 'floral, woody, fresh',
  intensity_preference: 7,
  liked_ingredients: ['ingredient-uuid-1', 'ingredient-uuid-2'],
  disliked_ingredients: ['ingredient-uuid-3']
})

// Get AI recommendations
const recommended = await scentPreferenceService.getRecommendations(consumerId)
```

---

## 🚀 Setup Steps

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Copy URL & Anon Key

2. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

3. **Run Migration**
   - Open Supabase SQL Editor
   - Copy `supabase/migrations/001_initial_schema.sql`
   - Run!

4. **Verify**
   - Check tables exist
   - Check seed data (27 ingredients, 3 suppliers, 6 products, etc.)

---

## ✅ Features

- ✅ Auto-generated request numbers (REQ-2025-00001)
- ✅ Auto-update timestamps
- ✅ Row Level Security (RLS)
- ✅ Complete seed data
- ✅ TypeScript type safety
- ✅ Full CRUD operations
- ✅ AI recommendation support

---

Good luck! 🎉
