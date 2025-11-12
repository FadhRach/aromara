# Aromara - Indonesian Fragrance Supplier Platform

Platform untuk menghubungkan supplier fragrance Indonesia dengan buyer lokal dan internasional.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Buat file `.env.local` di root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📱 Available Pages

### Public Pages
- **Homepage**: `http://localhost:3000`
- **Supplier Directory**: `http://localhost:3000/suppliers`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`

### Dashboard Pages (After Login)
- **User Dashboard**: `http://localhost:3000/user/dashboard`
- **Supplier Dashboard**: `http://localhost:3000/supplier/dashboard`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

## 🎨 Design System

### Colors
- **Primary**: #252F24 (Dark Green)
- **Secondary**: #E1F0C9 (Light Green)
- **Background**: #FFFFFF (White)

### Components
Kami menggunakan **shadcn/ui** untuk komponen UI yang konsisten dan reusable.

Komponen yang tersedia:
- Button
- Card
- Input
- Badge

## 🏗️ Project Structure

Lihat [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) untuk detail struktur folder.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Supabase (planned)
- **Icons**: Lucide React
- **Language**: TypeScript

## 📝 Features

### Implemented ✅
- [x] Homepage dengan hero section
- [x] Supplier directory dengan search & filter
- [x] Login & Register pages
- [x] Dashboard untuk User, Supplier, dan Admin
- [x] Responsive design
- [x] Clean component architecture

### Coming Soon 🚧
- [ ] Supabase authentication integration
- [ ] Database schema & API
- [ ] Protected routes
- [ ] Product CRUD operations
- [ ] Quotation request system
- [ ] File upload
- [ ] Email notifications

## 🔐 User Roles

1. **User/Buyer**
   - Browse suppliers
   - Request quotations
   - Manage orders

2. **Supplier**
   - Manage products
   - Respond to quotations
   - View analytics

3. **Admin**
   - Verify suppliers
   - Manage users
   - Platform settings

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Untuk development:
1. Clone repository
2. Install dependencies: `npm install`
3. Buat branch baru: `git checkout -b feature/nama-fitur`
4. Commit changes: `git commit -m "Add feature"`
5. Push ke branch: `git push origin feature/nama-fitur`

## 📄 License

© 2025 Aromara. All rights reserved.

---

Developed with ❤️ for Indonesian Fragrance Industry

