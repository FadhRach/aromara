-- =====================================================
-- AROMARA DATABASE SCHEMA
-- Revised based on Figma Design
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. COMPANY (Suppliers & Buyers)
-- =====================================================

CREATE TYPE company_role AS ENUM ('supplier', 'buyer');

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
    
    -- Supplier-specific fields
    company_description TEXT,
    established_year INTEGER,
    website VARCHAR(255),
    shipping_coverage VARCHAR(100), -- 'Seluruh Dunia', 'Indonesia Only', etc
    total_supply_partners INTEGER DEFAULT 0,
    company_video_url TEXT,
    
    -- Certifications
    certification_halal BOOLEAN DEFAULT FALSE,
    certification_coa BOOLEAN DEFAULT FALSE,
    certification_msds BOOLEAN DEFAULT FALSE,
    certification_organic BOOLEAN DEFAULT FALSE,
    
    -- Buyer-specific fields
    company_type VARCHAR(100), -- 'Manufacturer', 'Distributor', 'Retailer'
    business_license VARCHAR(255),
    tax_id VARCHAR(100),
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_email ON company(email);
CREATE INDEX idx_company_role ON company(role);

-- =====================================================
-- 2. SUPPLIER BUSINESS TYPES
-- =====================================================

CREATE TYPE supplier_business_type AS ENUM (
    'essential_oil_producer',
    'fragrance_producer',
    'supplier_packaging',
    'laboratory_certification'
);

CREATE TABLE supplier_business_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    business_type supplier_business_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_business_types_supplier ON supplier_business_types(supplier_id);

-- =====================================================
-- 3. SUPPLIER CAPABILITIES
-- =====================================================

CREATE TABLE supplier_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    capability_type VARCHAR(100) NOT NULL, -- 'Distributor', 'Manufaktur', etc
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_capabilities_supplier ON supplier_capabilities(supplier_id);

-- =====================================================
-- 4. PRODUCT CATEGORIES
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
('Fragrance Compounds', 'Fragrance blends and compounds'),
('Natural Extracts', 'Plant and botanical extracts'),
('Aroma Chemicals', 'Synthetic aroma ingredients'),
('Base Materials', 'Carrier oils and solvents');

-- =====================================================
-- 5. PRODUCTS
-- =====================================================

CREATE TYPE product_stock_status AS ENUM ('ready_stock', 'pre_order', 'out_of_stock');

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
    min_order_unit VARCHAR(50) DEFAULT 'kg',
    stock_qty DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'IDR',
    
    -- Stock status
    stock_status product_stock_status DEFAULT 'ready_stock',
    is_pre_order BOOLEAN DEFAULT FALSE,
    available_quantities TEXT, -- JSON format: ["200 kg", "500 kg", "1 ton"]
    
    -- Media
    product_video_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category_id);

-- =====================================================
-- 6. PRODUCT IMAGES (Multiple images per product)
-- =====================================================

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =====================================================
-- 7. PRODUCT INGREDIENTS/COMPOSITIONS
-- =====================================================

CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5,2), -- Optional
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_ingredients_product ON product_ingredients(product_id);

-- =====================================================
-- 8. INQUIRY (Request/Contact Supplier)
-- =====================================================

CREATE TYPE inquiry_status AS ENUM ('pending', 'responded', 'closed');

CREATE TYPE packaging_type AS ENUM (
    'drum_aluminium',
    'karung_jute_bag',
    'vacuum_sealed_bag',
    'no_preference'
);

CREATE TABLE inquiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES company(id),
    buyer_id UUID REFERENCES company(id), -- NULL if not logged in
    
    -- Contact Info (for non-logged in users)
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    
    -- Service Details
    service_type VARCHAR(100), -- 'Melempak Tani Kenanga Sari'
    estimated_delivery_time VARCHAR(100), -- 'Kurang dari 24 Jam', etc
    total_quantity VARCHAR(100), -- 'Contoh: 200 kg, 500 pcs, 10 liter'
    
    -- Certifications needed
    required_certifications TEXT[], -- ['halal', 'coa', 'msds', 'organic']
    
    -- Packaging
    packaging_preference packaging_type,
    
    -- Message
    subject VARCHAR(255),
    message TEXT NOT NULL,
    additional_details TEXT,
    
    -- Status
    status inquiry_status DEFAULT 'pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiry_supplier ON inquiry(supplier_id);
CREATE INDEX idx_inquiry_buyer ON inquiry(buyer_id);
CREATE INDEX idx_inquiry_status ON inquiry(status);

-- =====================================================
-- 9. INQUIRY ITEMS (Optional - if inquiry has specific products)
-- =====================================================

CREATE TABLE inquiry_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiry(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    
    product_name VARCHAR(255), -- If product not in catalog
    qty DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'kg',
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiry_items_inquiry ON inquiry_items(inquiry_id);

-- =====================================================
-- 10. REGIONS (for filtering)
-- =====================================================

CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Indonesia',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regions_province ON regions(province);
CREATE INDEX idx_regions_city ON regions(city);

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
-- SEED DATA FOR TESTING
-- =====================================================

-- Password for all accounts: "aromara123"
-- MD5 Hash: ad2aab3d23fe89dd43eed3368d03e0e2

-- =====================================================
-- Seed Regions
-- =====================================================

INSERT INTO regions (province, city) VALUES
('Jawa Timur', 'Surabaya'),
('Jawa Timur', 'Malang'),
('Jawa Timur', 'Banyuwangi'),
('Jawa Barat', 'Bandung'),
('Jawa Barat', 'Bogor'),
('Jawa Barat', 'Bekasi'),
('DKI Jakarta', 'Jakarta Pusat'),
('DKI Jakarta', 'Jakarta Selatan'),
('DKI Jakarta', 'Jakarta Timur'),
('Bali', 'Denpasar'),
('Bali', 'Ubud'),
('Jawa Tengah', 'Semarang'),
('Jawa Tengah', 'Solo'),
('Yogyakarta', 'Yogyakarta'),
('Sumatera Barat', 'Padang'),
('Sumatera Utara', 'Medan');

-- =====================================================
-- Seed Companies
-- =====================================================

-- Insert Suppliers
INSERT INTO company (
    name, email, password, role, phone, address, city, province, 
    is_verified, is_active,
    company_description, established_year, shipping_coverage, 
    total_supply_partners,
    certification_halal, certification_coa, certification_msds
) VALUES
(
    'Kenanga Lestari', 
    'kenanga@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 361 123456',
    'Jl. Kenanga Indah No. 21, Desa Sidoarjo, Kecamatan Glagah, Banyuwangi, Jawa Timur',
    'Banyuwangi',
    'Jawa Timur',
    TRUE,
    TRUE,
    'Vendencia Bulanicola menyediakan essential oil, ekstrak alami, dan bahan baku aroma berkualitas tinggi untuk pasar global. Produk kami digunakan oleh industri kosmetik, wellness, aromaterapi, makanan, hingga home fragrance.',
    2008,
    'Seluruh Dunia',
    120,
    TRUE,
    TRUE,
    FALSE
),
(
    'PT Aroma Nusantara', 
    'supplier2@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 21 7654321',
    'Jl. Raya Bogor KM 45',
    'Bogor',
    'Jawa Barat',
    TRUE,
    TRUE,
    'Produsen essential oil dan fragrance berkualitas tinggi',
    2015,
    'Indonesia',
    50,
    TRUE,
    TRUE,
    TRUE
);

-- Insert Buyers
INSERT INTO company (
    name, email, password, role, phone, address, city, province,
    is_verified, is_active, company_type
) VALUES
(
    'Perfume House Indonesia', 
    'buyer@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 21 8765432',
    'Jl. Thamrin No. 99',
    'Jakarta Pusat',
    'DKI Jakarta',
    TRUE,
    TRUE,
    'Manufacturer'
),
(
    'Fragrance Co', 
    'buyer2@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 31 7654321',
    'Jl. Basuki Rahmat No. 123',
    'Surabaya',
    'Jawa Timur',
    TRUE,
    TRUE,
    'Distributor'
);

-- =====================================================
-- Seed Supplier Capabilities
-- =====================================================

INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT 
    id,
    'Perizinan',
    'Seluruh Dunia'
FROM company WHERE email = 'kenanga@aromara.id';

INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT 
    id,
    'Sertifikasi',
    'Halal, COA'
FROM company WHERE email = 'kenanga@aromara.id';

INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT 
    id,
    'Supply',
    '120 Perusahaan'
FROM company WHERE email = 'kenanga@aromara.id';

INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT 
    id,
    'Metode',
    'Fermentasi alami'
FROM company WHERE email = 'kenanga@aromara.id';

INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT 
    id,
    'Perizinan untuk',
    'Distributor dan Manufaktur'
FROM company WHERE email = 'kenanga@aromara.id';

-- =====================================================
-- Seed Supplier Business Types
-- =====================================================

INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'essential_oil_producer'
FROM company WHERE email = 'kenanga@aromara.id';

INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'fragrance_producer'
FROM company WHERE email = 'kenanga@aromara.id';

-- =====================================================
-- Seed Products
-- =====================================================

INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, is_pre_order, available_quantities
)
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Jasmine Essential Oil 10 ML',
    'Minyak Esensial Jasmine adalah minyak esensial yang diekstrak dari bunga melati segar yang murni, elegan, dan menenangkan, memberikan keharuman floral khas yang memperkaya karakter parfum',
    400000,
    0.4,
    'ml',
    'ready_stock',
    FALSE,
    '["10 ml", "50 ml", "100 ml"]';

INSERT INTO products (
    supplier_id, category_id, name, description,
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, is_pre_order, available_quantities
)
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Lavender Essential Oil 10 ML',
    'Minyak esensial lavender yang segar dan menenangkan, meningkatkan kualitas tidur herbal elegan',
    400000,
    0.4,
    'ml',
    'pre_order',
    TRUE,
    '["10 ml", "50 ml", "100 ml"]';

INSERT INTO products (
    supplier_id, category_id, name, description,
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, is_pre_order
)
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Patchouli Oil',
    'Pure patchouli oil dengan aroma earthy yang kuat',
    950000,
    1,
    'kg',
    'ready_stock',
    FALSE;

-- =====================================================
-- Seed Product Images
-- =====================================================

INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT 
    id,
    'https://images.unsplash.com/photo-1608571423183-4cb1e60b8acc',
    TRUE,
    0
FROM products WHERE name = 'Jasmine Essential Oil 10 ML';

INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT 
    id,
    'https://images.unsplash.com/photo-1611251180798-0d66eb5d6b30',
    TRUE,
    0
FROM products WHERE name = 'Lavender Essential Oil 10 ML';

-- =====================================================
-- Seed Product Ingredients
-- =====================================================

INSERT INTO product_ingredients (product_id, ingredient_name, description, sort_order)
SELECT 
    id,
    'Jasmine Hydrosol',
    'Hasil destilasi bunga jasmine',
    0
FROM products WHERE name = 'Jasmine Essential Oil 10 ML'
UNION ALL
SELECT 
    id,
    'Organic Jasmine Hydrosol',
    'Ekstrak organik jasmine',
    1
FROM products WHERE name = 'Jasmine Essential Oil 10 ML'
UNION ALL
SELECT 
    id,
    'Bulk Jasmine Hydrosol',
    'Jasmine hydrosol dalam jumlah besar',
    2
FROM products WHERE name = 'Jasmine Essential Oil 10 ML';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant all permissions to all tables for testing (NO SECURITY!)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, postgres, service_role;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE company IS 'Companies (both suppliers and buyers)';
COMMENT ON TABLE supplier_business_types IS 'Business types for suppliers';
COMMENT ON TABLE supplier_capabilities IS 'Capabilities and certifications of suppliers';
COMMENT ON TABLE products IS 'Product catalog from suppliers';
COMMENT ON TABLE product_images IS 'Multiple images for each product';
COMMENT ON TABLE product_ingredients IS 'Ingredients/compositions of products';
COMMENT ON TABLE inquiry IS 'Inquiry/contact requests from buyers to suppliers';
COMMENT ON TABLE inquiry_items IS 'Line items in each inquiry';
COMMENT ON TABLE regions IS 'Indonesian regions for filtering';
