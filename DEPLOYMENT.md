# Aromara - B2B Fragrance Raw Materials Platform

Platform B2B untuk bahan baku parfum Indonesia. Menghubungkan petani, distiller, dan brand dalam satu ekosistem yang berkelanjutan.

## 🚀 Deployment ke Vercel

### Prerequisites
1. Akun [Vercel](https://vercel.com)
2. Akun [Supabase](https://supabase.com)
3. API Key [Google Gemini](https://ai.google.dev/) untuk MORA AI (optional)

### Environment Variables

Tambahkan environment variables berikut di Vercel Dashboard:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Gemini API (for MORA AI)
GEMINI_API_KEY=your-gemini-api-key-here
```

### Langkah Deployment

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project ke Vercel**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik "Add New Project"
   - Import repository GitHub Anda
   - Vercel akan auto-detect Next.js

3. **Configure Environment Variables**
   - Di Vercel Dashboard, masuk ke project settings
   - Pilih "Environment Variables"
   - Tambahkan semua env variables di atas

4. **Deploy**
   - Klik "Deploy"
   - Vercel akan build dan deploy secara otomatis
   - Setiap push ke main branch akan trigger auto-deployment

### 📝 Notes

- Build time: ~30-60 detik
- Next.js 16 dengan Turbopack enabled
- Static generation untuk halaman marketing
- Dynamic rendering untuk halaman product & supplier

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌟 Features

- 🔐 Authentication (Buyer & Supplier)
- 🏪 Supplier Discovery & Filtering
- 📦 Product Catalog
- 💬 MORA AI Assistant (Gemini-powered)
- 📧 Quote Request System
- 🎨 Modern UI with Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Google Gemini API
- **Icons**: Ionicons
- **Deployment**: Vercel

## 📄 License

© 2025 Aromara. All rights reserved.
