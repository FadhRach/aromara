# 🚀 Cara Migrasi Database ke Supabase

## Step 1️⃣: Create Supabase Project

1. Buka [supabase.com](https://supabase.com)
2. Login atau Sign Up (bisa pakai GitHub)
3. Klik **"New Project"**
4. Isi form:
   - **Name**: `aromara` atau nama lain
   - **Database Password**: Buat password (SIMPAN INI!)
   - **Region**: Pilih `Southeast Asia (Singapore)` - terdekat sama Indonesia
   - **Pricing Plan**: Free (cukup untuk development)
5. Klik **"Create new project"**
6. Tunggu ~2 menit sampai project ready

---

## Step 2️⃣: Get Connection Details

Setelah project ready:

1. Di sidebar kiri, klik **⚙️ Settings**
2. Klik **API** di submenu
3. Copy 2 hal ini:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

---

## Step 3️⃣: Update Environment Variables

1. Buat file `.env.local` di root project (kalau belum ada)
2. Paste konfigurasi ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Ganti** `xxxxxxxxxxxxx` sama URL & Key yang kamu copy tadi!

3. Save file

---

## Step 4️⃣: Run Migration SQL

### Option A: Via Supabase Dashboard (RECOMMENDED) ✅

1. Di Supabase Dashboard, klik **🗄️ SQL Editor** di sidebar
2. Klik tombol **"New query"**
3. Buka file `/supabase/migrations/001_initial_schema.sql` di VS Code
4. **Copy SEMUA isi file** (Cmd/Ctrl + A, lalu Cmd/Ctrl + C)
5. **Paste** di SQL Editor Supabase
6. Klik tombol **"Run"** (atau tekan Cmd/Ctrl + Enter)
7. Tunggu beberapa detik
8. Kalau sukses, akan muncul **"Success. No rows returned"** ✅

### Option B: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ke project (ganti project-ref dengan ID project kamu)
supabase link --project-ref xxxxxxxxxxxxx

# Run migration
supabase db push
```

---

## Step 5️⃣: Verify Migration

### Check Tables Created:

1. Klik **📊 Table Editor** di sidebar
2. Pastikan ada tables:
   - ✅ `users`
   - ✅ `ingredients`
   - ✅ `products`
   - ✅ `quotation_requests`
   - ✅ `reviews`
   - ✅ `scent_preferences`

### Check Seed Data:

1. Klik table **`ingredients`**
   - Harus ada **27 rows** (Sandalwood, Rose, Lavender, dll)

2. Klik table **`users`**
   - Harus ada **6 rows** (1 admin, 3 suppliers, 2 consumers)

3. Klik table **`products`**
   - Harus ada **6 rows** (berbagai produk dari suppliers)

4. Klik table **`quotation_requests`**
   - Harus ada **2 rows**

5. Klik table **`reviews`**
   - Harus ada **2 rows**

6. Klik table **`scent_preferences`**
   - Harus ada **2 rows**

---

## Step 6️⃣: Test Connection dari Next.js

1. Buat file test sederhana atau jalankan di browser console:

```typescript
// Test di halaman Next.js
import { supabase } from '@/lib/supabase'

// Test query
const { data, error } = await supabase
  .from('ingredients')
  .select('*')
  .limit(5)

console.log('Ingredients:', data)
```

2. Atau buat API route untuk test:

```typescript
// app/api/test/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .limit(5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

3. Akses `http://localhost:3000/api/test` di browser
4. Kalau muncul data ingredients, berarti **SUKSES!** ✅

---

## 🔐 Security: Row Level Security (RLS)

Migration sudah include RLS policies, tapi **harus enable authentication** dulu:

1. Di Supabase Dashboard, klik **🔐 Authentication**
2. Klik **Providers**
3. Enable **Email** provider
4. Save

Policies yang sudah dibuat:
- ✅ Users can read/update their own data
- ✅ Everyone can read active products
- ✅ Suppliers can manage their own products
- ✅ Quotation requests accessible by both parties
- ✅ Everyone can read reviews, consumers can create

---

## 🎯 Quick Test Queries

### Test di SQL Editor:

```sql
-- Get all ingredients
SELECT * FROM ingredients;

-- Get all products with supplier info
SELECT p.*, i.name as ingredient_name, u.company_name
FROM products p
JOIN ingredients i ON p.ingredient_id = i.id_ingredient
JOIN users u ON p.supplier_id = u.id_user;

-- Get quotation requests with details
SELECT 
  qr.request_number,
  qr.status,
  c.username as consumer,
  s.company_name as supplier,
  p.product_name,
  qr.qty,
  qr.quoted_price
FROM quotation_requests qr
JOIN users c ON qr.consumer_id = c.id_user
JOIN users s ON qr.supplier_id = s.id_user
JOIN products p ON qr.product_id = p.id_product;

-- Get product reviews with ratings
SELECT 
  p.product_name,
  u.username,
  r.rating,
  r.comment
FROM reviews r
JOIN products p ON r.product_id = p.id_product
JOIN users u ON r.consumer_id = u.id_user;
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "permission denied for schema public"
**Solution:** Make sure you're using the **SQL Editor** in Supabase Dashboard, not pgAdmin or other tools.

### Issue 2: "relation already exists"
**Solution:** 
1. Drop existing tables first (if this is a re-migration)
2. Di SQL Editor, run:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
3. Lalu run migration lagi

### Issue 3: "authentication required"
**Solution:** 
- RLS policies requires auth. Untuk testing, temporary disable RLS:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```
- Atau gunakan service_role key (jangan untuk production!)

### Issue 4: Connection error di Next.js
**Solution:**
1. Pastikan `.env.local` ada dan benar
2. Restart Next.js dev server: `npm run dev`
3. Check di Network tab browser, pastikan request ke Supabase berhasil

---

## 📝 Next Steps After Migration

1. ✅ Migration done
2. ✅ Seed data loaded
3. ✅ Connection tested

**Lanjutan:**
- [ ] Implement authentication (Supabase Auth)
- [ ] Build product listing page
- [ ] Create quotation request form
- [ ] Add review system
- [ ] Implement AI recommendations

---

## 🆘 Need Help?

Check:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Migration file: `supabase/migrations/001_initial_schema.sql`
- Database guide: `DATABASE_SIMPLE_GUIDE.md`

---

**Good luck! 🚀**
