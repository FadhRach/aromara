# AROMARA — B2B Fragrance & Essential Oil Marketplace

Platform B2B Indonesia yang menghubungkan supplier essential oil dengan pembeli terverifikasi. Mempermudah transaksi bahan baku aromaterapi, parfum, dan ekstrak alami berkualitas tinggi.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## Tentang Project

**AROMARA** adalah marketplace B2B untuk industri fragrance Indonesia, menghubungkan:

- **Supplier** — Produsen essential oil & ekstrak alami
- **Buyer** — Manufaktur parfum, kosmetik, spa, dan distributor

Indonesia adalah penghasil essential oil terbesar di dunia (patchouli, clove, citronella), namun tidak ada platform terpusat untuk transaksi B2B dan proses quotation yang transparan. AROMARA hadir untuk menjembatani hal tersebut.

---

## Tech Stack

**Frontend**
- Next.js 16.0 — React framework with App Router & Turbopack
- TypeScript
- Tailwind CSS v4
- shadcn/ui

**Backend & Database**
- Supabase — PostgreSQL database + Storage
- Row Level Security (RLS)

**Libraries**
- Lucide Icons, SweetAlert2
- Google Gemini AI (`gemini-2.0-flash`) — MoraAI chatbot untuk rekomendasi produk

---

## Cara Menjalankan

### Prerequisites

- Node.js >= 18.x
- npm
- Git

### Instalasi

```bash
git clone https://github.com/FadhRach/aromara.git
cd aromara
npm install
```

### Environment Variables

Salin `.env.example` menjadi `.env.local` dan isi nilainya:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

Semua key tersedia di Supabase Dashboard > Settings > API. Gemini API key bisa dibuat di https://aistudio.google.com/apikey.

### Setup Database

Jalankan migration di Supabase Dashboard > SQL Editor:

```
supabase/migrations/001_core_schema_with_seeder.sql
```

### Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

---

## Akun Demo

Setelah migration database selesai, gunakan akun berikut untuk mencoba aplikasi:

| Role | Email | Password |
|------|-------|----------|
| Supplier | supplier@aromara.id | aromara123 |
| Buyer | buyer@aromara.id | aromara123 |
| Admin | admin@aromara.id | aromara123 |

Atau jalankan seed script untuk membuat akun-akun tersebut secara otomatis:

```bash
node --env-file=.env.local scripts/seed-test-accounts.js
```

---

## Halaman & Fitur

**Public**

| Halaman | URL |
|---------|-----|
| Homepage | `/` |
| Explore Suppliers | `/explore-suppliers` |
| Supplier Detail | `/supplier/[id]` |
| Product Detail | `/product/[id]` |
| Request Quote | `/request-quote` |
| About | `/about` |

**Authentication**

| Halaman | URL |
|---------|-----|
| Login | `/login` |
| Register | `/register` |

**Supplier Dashboard**

| Halaman | URL |
|---------|-----|
| Dashboard | `/supplier/dashboard` |
| Products | `/supplier/products` |
| Categories | `/supplier/categories` |
| Inquiries | `/supplier/inquiries` |

---

## Fitur

**Sudah Implemented**
- Homepage interaktif — hero, stats, how it works, ingredients showcase
- Supplier directory — browse, filter, search
- Product CRUD dengan image upload ke Supabase Storage
- Category management
- Responsive design (mobile-first)
- MoraAI Chatbot — rekomendasi bahan baku berbasis Gemini AI

**Coming Soon**
- Quotation request system (buyer ke supplier)
- Messaging system
- Payment integration
- Order tracking
- Admin panel untuk verifikasi supplier

---

## Struktur Project

```
aromara/
├── app/
│   ├── (auth)/          # Login, register
│   ├── (buyer)/         # Halaman buyer
│   ├── (supplier)/      # Supplier dashboard
│   ├── (marketing)/     # Homepage
│   └── api/             # API routes
├── components/
│   ├── home/            # Sections homepage
│   ├── layout/          # Navbar, footer, sidebar
│   ├── shared/          # Komponen reusable
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── supabase.ts      # Supabase client & types
│   ├── auth.ts          # Auth helpers (custom, MD5-based)
│   ├── gemini.ts        # Google Gemini AI
│   └── database.ts      # Service layer (companyService, productService, dll)
└── supabase/
    └── migrations/
```

---

## Design System

```
Primary (Dark Green):    #252F24
Secondary (Light Green): #E1F0C9
Background (Cream):      #FAFAEE
Accent (Soft Green):     #D4E5D4
Font: Lexend (Google Fonts)
```

---

## License

© 2025 AROMARA. All rights reserved.

Developed by **FadhRach** and Team **Penghuni23Paskal**.

- GitHub: [@FadhRach](https://github.com/FadhRach)
