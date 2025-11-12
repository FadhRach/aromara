# Aromara Project Structure

## 📁 Folder Structure

```
aromara/
├── app/
│   ├── (auth)/                    # Auth pages group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Register page
│   ├── (dashboard)/              # Dashboard pages group
│   │   ├── user/
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # User dashboard
│   │   ├── supplier/
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Supplier dashboard
│   │   └── admin/
│   │       └── dashboard/
│   │           └── page.tsx      # Admin dashboard
│   ├── (marketing)/              # Public pages group
│   │   ├── page.tsx              # Homepage
│   │   └── suppliers/
│   │       └── page.tsx          # Supplier directory
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root redirect
│
├── components/
│   ├── home/                     # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── stats-section.tsx
│   │   ├── ingredients-section.tsx
│   │   ├── why-aromara-section.tsx
│   │   └── how-it-works-section.tsx
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx           # General navbar
│   │   └── footer.tsx           # General footer
│   ├── shared/                   # Reusable components
│   │   └── supplier-card.tsx    # Supplier card component
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
│
└── lib/
    ├── supabase.ts              # Supabase client
    └── utils.ts                 # Utility functions
```

## 🎨 Color Scheme

- Primary: `#252F24` (Dark Green)
- Secondary: `#E1F0C9` (Light Green)
- White: `#FFFFFF`

## 🚀 Pages & Routes

### Public Pages
- `/` - Homepage
- `/suppliers` - Supplier Directory
- `/login` - Login page
- `/register` - Register page

### Dashboard Pages
- `/user/dashboard` - User/Buyer dashboard
- `/supplier/dashboard` - Supplier dashboard
- `/admin/dashboard` - Admin dashboard

## 🔑 User Roles

1. **User/Buyer** - Browse suppliers, request quotations
2. **Supplier** - Manage products, respond to quotations
3. **Admin** - Platform management, verify suppliers

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Backend**: Supabase (To be implemented)
- **Icons**: Lucide React
- **Language**: TypeScript

## 📝 Development Notes

### Component Organization

1. **Layout Components** (`components/layout/`)
   - General navbar with variants (default, dashboard)
   - Footer for all pages

2. **Shared Components** (`components/shared/`)
   - Reusable components across different pages
   - SupplierCard with light/dark variants

3. **Page-Specific Components** (`components/home/`, etc.)
   - Components specific to certain pages

### Route Groups

- `(auth)` - Authentication pages without navbar/footer
- `(marketing)` - Public pages with full navbar/footer
- `(dashboard)` - Protected dashboard pages with simplified navbar

## 🔄 Next Steps

1. Implement Supabase authentication
2. Create database schema for users, suppliers, products
3. Add protected routes middleware
4. Implement actual CRUD operations
5. Add image upload functionality
6. Create quotation request system

## 🎯 Features to Implement

- [ ] User authentication with Supabase
- [ ] Role-based access control
- [ ] Supplier verification workflow
- [ ] Product management (CRUD)
- [ ] Quotation request system
- [ ] Search and filter functionality
- [ ] Image upload for products
- [ ] Email notifications
- [ ] Dashboard analytics
- [ ] Admin panel for user management
