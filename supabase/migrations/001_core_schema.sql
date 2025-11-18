-- =====================================================
-- AROMARA DATABASE SCHEMA
-- Clean & Simple Version
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. COMPANY (Suppliers, Buyers & Admin)
-- =====================================================

CREATE TYPE company_role AS ENUM ('supplier', 'buyer', 'admin');

CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    profile_img TEXT,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Indonesia',
    role company_role NOT NULL DEFAULT 'buyer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_email ON company(email);
CREATE INDEX idx_company_role ON company(role);

-- =====================================================
-- 2. PRODUCT CATEGORIES
-- =====================================================

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO product_categories (name, description) VALUES
('Essential Oils', 'Pure essential oils'),
('Synthetic Aroma', 'Lab-created fragrances'),
('Natural Extracts', 'Plant extracts'),
('Alcohol & Solvents', 'Base materials'),
('Fixatives', 'Scent stabilizers');

-- =====================================================
-- 3. PRODUCTS
-- =====================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES product_categories(id),
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_product TEXT,
    
    -- Pricing
    price_per_unit DECIMAL(15,2),
    min_order_qty DECIMAL(10,2) DEFAULT 1,
    stock_qty DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'IDR',
    
    -- Details
    stock_status VARCHAR(50) DEFAULT 'available',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category_id);

-- =====================================================
-- 4. INQUIRY (Request for Quotation)
-- =====================================================

CREATE TYPE inquiry_status AS ENUM ('open', 'negotiating', 'closed', 'ordered');

CREATE TABLE inquiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES company(id),
    buyer_id UUID NOT NULL REFERENCES company(id),
    
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    estimated_total DECIMAL(15,2),
    status inquiry_status DEFAULT 'open',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiry_supplier ON inquiry(supplier_id);
CREATE INDEX idx_inquiry_buyer ON inquiry(buyer_id);
CREATE INDEX idx_inquiry_status ON inquiry(status);

-- =====================================================
-- 5. INQUIRY ITEMS (Products in Inquiry)
-- =====================================================

CREATE TABLE inquiry_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiry(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    
    qty DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'kg',
    target_price DECIMAL(15,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiry_items_inquiry ON inquiry_items(inquiry_id);
CREATE INDEX idx_inquiry_items_product ON inquiry_items(product_id);

-- =====================================================
-- 6. ORDERS
-- =====================================================

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TABLE "order" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID REFERENCES inquiry(id),
    buyer_id UUID NOT NULL REFERENCES company(id),
    supplier_id UUID NOT NULL REFERENCES company(id),
    
    total_amount DECIMAL(15,2) NOT NULL,
    notes TEXT,
    status order_status DEFAULT 'pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_buyer ON "order"(buyer_id);
CREATE INDEX idx_order_supplier ON "order"(supplier_id);

-- =====================================================
-- 7. MESSAGES (Inquiry Communication)
-- =====================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiry(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES company(id),
    
    body TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_inquiry ON messages(inquiry_id);

-- =====================================================
-- 8. COMPANY ROLES (For team management - optional)
-- =====================================================

CREATE TABLE company_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    role_type VARCHAR(50) NOT NULL, -- 'admin', 'sales', 'procurement'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_updated_at BEFORE UPDATE ON company
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiry_updated_at BEFORE UPDATE ON inquiry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS - Allow anonymous access for demo
-- =====================================================

-- Grant all permissions to all tables for testing (NO SECURITY!)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, postgres, service_role;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - DISABLED FOR DEMO/PROTOTYPE
-- =====================================================

-- RLS DIMATIKAN - Semua data bisa diakses tanpa autentikasi
-- Ini untuk demo/prototype only, jangan untuk production!

-- TIDAK ADA RLS POLICIES - semua tabel accessible

-- =====================================================
-- SEED DATA FOR TESTING
-- =====================================================

-- Password for all accounts: "aromara123"
-- MD5 Hash: ad2aab3d23fe89dd43eed3368d03e0e2

-- Insert sample companies (Admin, Supplier, Buyer)
INSERT INTO company (name, email, password, role, phone, address, city, province, is_verified, is_active) VALUES
-- Admin Account
('Aromara Admin', 'admin@aromara.id', 'ad2aab3d23fe89dd43eed3368d03e0e2', 'admin', '+62211234567', 'Jl. Sudirman No. 1', 'Jakarta', 'DKI Jakarta', true, true),

-- Supplier Accounts
('PT Aroma Nusantara', 'supplier@aromara.id', 'ad2aab3d23fe89dd43eed3368d03e0e2', 'supplier', '+62217654321', 'Jl. Raya Bogor KM 45', 'Bogor', 'Jawa Barat', true, true),
('CV Wangi Jaya', 'supplier2@aromara.id', 'ad2aab3d23fe89dd43eed3368d03e0e2', 'supplier', '+62361123456', 'Jl. Sunset Road No. 88', 'Denpasar', 'Bali', true, true),

-- Buyer Accounts
('Perfume House Indonesia', 'buyer@aromara.id', 'ad2aab3d23fe89dd43eed3368d03e0e2', 'buyer', '+62218765432', 'Jl. Thamrin No. 99', 'Jakarta Pusat', 'DKI Jakarta', true, true),
('Fragrance Co', 'buyer2@aromara.id', 'ad2aab3d23fe89dd43eed3368d03e0e2', 'buyer', '+62317654321', 'Jl. Basuki Rahmat No. 123', 'Surabaya', 'Jawa Timur', true, true);

-- Insert sample products
INSERT INTO products (supplier_id, category_id, name, description, price_per_unit, min_order_qty, stock_qty, image_product)
SELECT 
    (SELECT id FROM company WHERE email = 'supplier@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Lavender Essential Oil',
    'Premium grade lavender oil from Java highlands',
    850000,
    1,
    100,
    'https://images.unsplash.com/photo-1611251180798-0d66eb5d6b30';

INSERT INTO products (supplier_id, category_id, name, description, price_per_unit, min_order_qty, stock_qty, image_product)
SELECT 
    (SELECT id FROM company WHERE email = 'supplier@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Patchouli Oil',
    'Pure patchouli oil with earthy aroma',
    950000,
    1,
    75,
    'https://images.unsplash.com/photo-1608571423183-4cb1e60b8acc';

INSERT INTO products (supplier_id, category_id, name, description, price_per_unit, min_order_qty, stock_qty, image_product)
SELECT 
    (SELECT id FROM company WHERE email = 'supplier2@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Natural Extracts'),
    'Vanilla Absolute Bali',
    'Rich vanilla extract from Bali vanilla beans',
    1800000,
    0.5,
    30,
    'https://images.unsplash.com/photo-1623428187425-50d9d13c5d6b';

-- Insert sample inquiry
INSERT INTO inquiry (supplier_id, buyer_id, subject, message, status)
SELECT 
    (SELECT id FROM company WHERE email = 'supplier@aromara.id'),
    (SELECT id FROM company WHERE email = 'buyer@aromara.id'),
    'Request for Lavender Oil',
    'Hi, I am interested in purchasing lavender oil. Can you provide bulk pricing for 50kg?',
    'open';

COMMENT ON TABLE company IS 'Companies (both suppliers and buyers)';
COMMENT ON TABLE products IS 'Product catalog from suppliers';
COMMENT ON TABLE inquiry IS 'Inquiry/RFQ from buyers to suppliers';
COMMENT ON TABLE inquiry_items IS 'Line items in each inquiry';
COMMENT ON TABLE "order" IS 'Confirmed orders';
