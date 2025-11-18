# 🌿 AROMARA - B2B Fragrance & Essential Oil Marketplace

> Platform B2B Indonesia yang menghubungkan supplier essential oil dengan pembeli terverifikasi. Mempermudah transaksi bahan baku aromaterapi, parfum, dan ekstrak alami berkualitas tinggi.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Tentang Project

**AROMARA** adalah marketplace B2B untuk industri fragrance Indonesia, menghubungkan:
- 🏭 **Supplier** - Produsen essential oil & ekstrak alami
- 🛍️ **Buyer** - Manufaktur parfum, kosmetik, spa, dan distributor
- ✅ **Verifikasi** - Semua supplier terverifikasi dengan sertifikasi lengkap

### 💡 Alasan & Latar Belakang

Indonesia adalah penghasil essential oil terbesar di dunia (patchouli, clove, citronella), namun:
- ❌ Tidak ada platform terpusat untuk transaksi B2B
- ❌ Buyer kesulitan menemukan supplier terverifikasi
- ❌ Proses quotation & negosiasi tidak transparan

**AROMARA** hadir untuk:
- ✅ Mempermudah koneksi supplier-buyer
- ✅ Memberikan transparansi harga & kualitas
- ✅ Menyediakan sistem quotation yang efisien
- ✅ Mendukung pertumbuhan industri fragrance lokal

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0** - React framework with App Router & Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Pre-built accessible components

### Backend & Database
- **Supabase** - PostgreSQL database + Storage
- **Supabase Storage** - Cloud storage untuk product images
- **Row Level Security (RLS)** - Database security policies

### Tools & Libraries
- **Lucide Icons** - Modern icon library
- **SweetAlert2** - Beautiful alerts & notifications
- **Google Gemini AI** - AI assistant (MoraAI) untuk product recommendations

---

## 🚀 Cara Menggunakan

### 1️⃣ Prerequisites
```bash
Node.js >= 18.x
npm atau yarn
Git
```

### 2️⃣ Clone Repository
```bash
git clone https://github.com/FadhRach/aromara.git
cd aromara
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Setup Environment Variables
Buat file `.env.local` di root folder:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini AI (Optional)
GEMINI_API_KEY=your-gemini-api-key
```

### 5️⃣ Setup Database
Jalankan migration SQL di Supabase:
```bash
# Buka Supabase Dashboard > SQL Editor
# Jalankan file-file di folder supabase/migrations/ secara berurutan:
# 1. 001_core_schema_with_seeder.sql
```

### 6️⃣ Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 📱 Halaman & Fitur

### 🌐 Public Pages
| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| **Homepage** | `/` | Landing page dengan hero, stats, how it works |
| **Explore Suppliers** | `/explore-suppliers` | Directory supplier dengan filter & search |
| **Supplier Detail** | `/supplier/[id]` | Profile supplier + katalog produk |
| **Product Detail** | `/product/[id]` | Detail produk dengan spesifikasi lengkap |
| **Request Quote** | `/request-quote` | Form pengajuan permintaan penawaran |
| **About** | `/about` | Tentang platform Aromara |

### 🔐 Authentication
| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| **Login** | `/login` | Login untuk buyer & supplier |
| **Register** | `/register` | Registrasi akun baru |

### 📊 Supplier Dashboard
| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| **Dashboard** | `/supplier/dashboard` | Overview analytics & recent activities |
| **Products** | `/supplier/products` | CRUD produk dengan image upload |
| **Categories** | `/supplier/categories` | Manage kategori produk |
| **Inquiries** | `/supplier/inquiries` | Kelola quote requests dari buyer |

---

## ✨ Fitur Utama

### ✅ Sudah Implemented
- [x] **Homepage interaktif** - Hero, stats, how it works (with clickable steps), ingredients showcase
- [x] **Supplier directory** - Browse, filter, search suppliers
- [x] **Product CRUD** - Create, read, update, delete products
- [x] **Image Upload** - Upload ke Supabase Storage dengan preview
- [x] **Category Management** - CRUD kategori produk
- [x] **Responsive Design** - Mobile-first, optimized untuk semua device
- [x] **MoraAI Chatbot** - AI assistant untuk rekomendasi produk
- [x] **Real-time Updates** - Data sync dengan Supabase realtime

### 🚧 Coming Soon
- [ ] Authentication dengan Supabase Auth
- [ ] Quotation request system (buyer → supplier)
- [ ] Messaging system antara buyer-supplier
- [ ] Payment integration
- [ ] Order tracking & shipping
- [ ] Email notifications
- [ ] Admin panel untuk verifikasi supplier

---

## � User Roles

### 1. **Buyer/Pembeli**
- Browse & search suppliers
- Lihat katalog produk + spesifikasi
- Request quotation langsung ke supplier
- Manage orders & tracking

### 2. **Supplier**
- Manage produk & kategori
- Upload product images
- Respond to quote requests
- Analytics & reports

### 3. **Admin** (Future)
- Verifikasi supplier baru
- Manage users & content
- Platform monitoring

---

## 📁 Struktur Project

```
aromara/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (buyer)/             # Buyer pages
│   ├── (supplier)/          # Supplier dashboard
│   ├── (marketing)/         # Homepage
│   └── api/                 # API routes
├── components/              # React components
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, footer, sidebar
│   ├── shared/             # Reusable components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utilities & configs
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Auth helpers
│   ├── gemini.ts           # Google Gemini AI
│   └── utils.ts            # General utilities
├── supabase/
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

---

## 🎨 Design System

### Warna Tema
```css
Primary (Dark Green):    #252F24
Secondary (Light Green): #E1F0C9
Background (Cream):      #FAFAEE
Accent (Soft Green):     #D4E5D4
```

### Typography
- **Font**: Lexend (Google Fonts)
- **Heading**: Bold, 36-56px
- **Body**: Regular, 14-16px

---

## 🧪 Testing Accounts

Gunakan akun berikut untuk testing:

```
📧 Supplier Account
Email: supplier@aromara.com
Password: supplier123

📧 Buyer Account
Email: buyer@aromara.com
Password: buyer123
```

---

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 🤝 Contributing

Contributions are welcome! Untuk kontribusi:

1. Fork repository
2. Create branch baru: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m "Add: fitur baru"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Submit Pull Request

---

## 📄 License

© 2025 **AROMARA**. All rights reserved.

---

## 👨‍💻 Developer

Developed with ❤️ by **FadhRach** and Team **Penghuni23Paskal** for Indonesian Fragrance Industry

**Contact:**
- GitHub: [@FadhRach](https://github.com/FadhRach)
- Project: [AROMARA](https://github.com/FadhRach/aromara)

---

<div align="center">
  <strong>🌿 Empowering Indonesia's Fragrance Ecosystem 🌿</strong>
</div>


