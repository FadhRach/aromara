-- =====================================================
-- AROMARA DATABASE SCHEMA WITH COMPREHENSIVE SEEDER
-- Complete schema with realistic test data
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
    
    -- Response metrics
    avg_response_time VARCHAR(50), -- 'Kurang dari 24 Jam'
    response_rate INTEGER, -- 84%
    
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
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    
    -- Portfolio count
    portfolio_count INTEGER DEFAULT 0,
    
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
-- =====================================================
-- COMPREHENSIVE SEEDER DATA
-- =====================================================
-- =====================================================

-- Password for all test accounts: "aromara123"
-- MD5 Hash: ad2aab3d23fe89dd43eed3368d03e0e2

-- =====================================================
-- Seed Regions (Indonesian Cities)
-- =====================================================

INSERT INTO regions (province, city) VALUES
('Jawa Timur', 'Surabaya'),
('Jawa Timur', 'Malang'),
('Jawa Timur', 'Banyuwangi'),
('Jawa Timur', 'Sidoarjo'),
('Jawa Timur', 'Gresik'),
('Jawa Barat', 'Bandung'),
('Jawa Barat', 'Bogor'),
('Jawa Barat', 'Bekasi'),
('Jawa Barat', 'Depok'),
('Jawa Barat', 'Cirebon'),
('DKI Jakarta', 'Jakarta Pusat'),
('DKI Jakarta', 'Jakarta Selatan'),
('DKI Jakarta', 'Jakarta Timur'),
('DKI Jakarta', 'Jakarta Barat'),
('DKI Jakarta', 'Jakarta Utara'),
('Bali', 'Denpasar'),
('Bali', 'Ubud'),
('Bali', 'Gianyar'),
('Jawa Tengah', 'Semarang'),
('Jawa Tengah', 'Solo'),
('Jawa Tengah', 'Yogyakarta'),
('Sumatera Barat', 'Padang'),
('Sumatera Barat', 'Bukittinggi'),
('Sumatera Utara', 'Medan'),
('Sumatera Utara', 'Binjai'),
('Sulawesi Selatan', 'Makassar'),
('Kalimantan Timur', 'Balikpapan'),
('Kalimantan Timur', 'Samarinda');

-- =====================================================
-- Seed Product Categories
-- =====================================================

INSERT INTO product_categories (name, description, icon) VALUES
('Essential Oils', 'Pure essential oils from natural sources', 'flask'),
('Fragrance Compounds', 'Fragrance blends and aromatic compounds', 'sparkles'),
('Natural Extracts', 'Plant and botanical extracts', 'leaf'),
('Aroma Chemicals', 'Synthetic aroma ingredients', 'beaker'),
('Base Materials', 'Carrier oils and solvents', 'water'),
('Packaging Materials', 'Bottles, containers, and packaging supplies', 'cube');

-- =====================================================
-- Seed Suppliers (10 Suppliers)
-- =====================================================

INSERT INTO company (
    name, email, password, role, phone, address, city, province, 
    profile_img, is_verified, is_active,
    company_description, established_year, website, shipping_coverage, 
    total_supply_partners, avg_response_time, response_rate,
    certification_halal, certification_coa, certification_msds, certification_organic
) VALUES
-- Supplier 1: Kenanga Lestari
(
    'Kenanga Lestari', 
    'kenanga@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 361 123456',
    'Jl. Kenanga Indah No. 21, Desa Sidoarjo, Kecamatan Glagah',
    'Banyuwangi',
    'Jawa Timur',
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80',
    TRUE,
    TRUE,
    'Verdancia Botanicals menyediakan essential oil, ekstrak alami, dan bahan baku aroma berkualitas tinggi dari pasar global. Produk kami digunakan oleh industri kosmetik, wellness, aromaterapi, makanan, hingga home fragrances.',
    2008,
    'https://kenanglestari.co.id',
    'Seluruh Dunia',
    120,
    'Kurang dari 24 Jam',
    84,
    TRUE,
    TRUE,
    TRUE,
    FALSE
),
-- Supplier 2: PT Aroma Nusantara
(
    'PT Aroma Nusantara', 
    'aroma.nusantara@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 21 7654321',
    'Jl. Raya Bogor KM 45, Industrial Park',
    'Bogor',
    'Jawa Barat',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&q=80',
    TRUE,
    TRUE,
    'Produsen essential oil dan fragrance berkualitas tinggi dengan standar internasional. Melayani industri kosmetik, farmasi, dan F&B di seluruh Indonesia.',
    2015,
    'https://aromanusantara.id',
    'Indonesia & ASEAN',
    50,
    '1-2 Hari',
    92,
    TRUE,
    TRUE,
    TRUE,
    TRUE
),
-- Supplier 3: Bali Essential Oils
(
    'Bali Essential Oils', 
    'bali.essential@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 361 998877',
    'Jl. Raya Ubud No. 88, Gianyar',
    'Ubud',
    'Bali',
    'https://images.unsplash.com/photo-1608571423183-4cb1e60b8acc?w=200&q=80',
    TRUE,
    TRUE,
    'Spesialis essential oil organik dari Bali. Kami menggunakan metode distilasi tradisional dengan teknologi modern untuk menghasilkan oil berkualitas premium.',
    2010,
    'https://baliessentialoils.com',
    'Seluruh Dunia',
    85,
    'Kurang dari 12 Jam',
    95,
    FALSE,
    TRUE,
    TRUE,
    TRUE
),
-- Supplier 4: Javanese Fragrance Co
(
    'Javanese Fragrance Co', 
    'javanese@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 274 556789',
    'Jl. Solo No. 123, Karanganyar',
    'Yogyakarta',
    'Jawa Tengah',
    'https://images.unsplash.com/photo-1611251180798-0d66eb5d6b30?w=200&q=80',
    TRUE,
    TRUE,
    'Produsen fragrance oil untuk industri parfum, sabun, lilin aromaterapi, dan produk home care. Pengalaman lebih dari 15 tahun melayani pasar domestik dan ekspor.',
    2009,
    'https://javanesefragrance.id',
    'Indonesia',
    65,
    '2-3 Hari',
    78,
    TRUE,
    TRUE,
    FALSE,
    FALSE
),
-- Supplier 5: Sumatran Spice Oils
(
    'Sumatran Spice Oils', 
    'sumatra.spice@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 751 234567',
    'Jl. Raya Padang-Bukittinggi KM 32',
    'Padang',
    'Sumatera Barat',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&q=80',
    TRUE,
    TRUE,
    'Spesialis essential oil dari rempah-rempah Indonesia: kayu manis, cengkeh, pala, dan jahe. Produk organik bersertifikat dengan kualitas ekspor.',
    2012,
    'https://sumatranspice.co.id',
    'Seluruh Dunia',
    45,
    '1-2 Hari',
    88,
    TRUE,
    TRUE,
    TRUE,
    TRUE
),
-- Supplier 6: PT Wangi Kencana
(
    'PT Wangi Kencana', 
    'wangi.kencana@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 31 7891234',
    'Jl. Rungkut Industri III No. 45',
    'Surabaya',
    'Jawa Timur',
    'https://images.unsplash.com/photo-1608667162993-e98d1e8de98c?w=200&q=80',
    TRUE,
    TRUE,
    'Distributor bahan baku aromaterapi dan kosmetik. Menyediakan essential oils, carrier oils, fragrance oils, dan bahan aktif untuk industri kecantikan.',
    2018,
    'https://wangikencana.id',
    'Indonesia',
    30,
    '3-5 Jam',
    90,
    FALSE,
    TRUE,
    TRUE,
    FALSE
),
-- Supplier 7: Aromindo Prima
(
    'Aromindo Prima', 
    'aromindo@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 21 8889999',
    'Jl. Gatot Subroto Kav. 88',
    'Jakarta Selatan',
    'DKI Jakarta',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&q=80',
    TRUE,
    TRUE,
    'Importir dan distributor aroma chemicals berkualitas tinggi dari Eropa dan Asia. Melayani industri parfum, kosmetik, dan manufaktur produk beraroma.',
    2005,
    'https://aromindoprima.com',
    'Indonesia & ASEAN',
    110,
    'Kurang dari 24 Jam',
    85,
    TRUE,
    TRUE,
    TRUE,
    FALSE
),
-- Supplier 8: Nature Scent Indonesia
(
    'Nature Scent Indonesia', 
    'naturescent@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 22 4567890',
    'Jl. Soreang No. 234, Bandung Selatan',
    'Bandung',
    'Jawa Barat',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=200&q=80',
    TRUE,
    TRUE,
    'Produsen natural fragrance dan essential oil blend untuk aromaterapi, spa, dan wellness industry. Fokus pada produk ramah lingkungan dan sustainable.',
    2016,
    'https://naturescent.id',
    'Indonesia',
    38,
    '1-2 Hari',
    82,
    FALSE,
    TRUE,
    FALSE,
    TRUE
),
-- Supplier 9: Essential Botanica
(
    'Essential Botanica', 
    'botanica@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 411 345678',
    'Jl. Perintis Kemerdekaan No. 99',
    'Makassar',
    'Sulawesi Selatan',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=80',
    TRUE,
    TRUE,
    'Spesialis ekstrak botanical dan herbal Indonesia. Mengolah tanaman lokal menjadi essential oils, oleoresins, dan absolutes untuk industri global.',
    2014,
    'https://essentialbotanica.id',
    'Seluruh Dunia',
    55,
    '2-4 Hari',
    76,
    TRUE,
    TRUE,
    TRUE,
    FALSE
),
-- Supplier 10: PT Harum Semerbak
(
    'PT Harum Semerbak', 
    'harum@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'supplier',
    '+62 542 678901',
    'Jl. Soekarno Hatta KM 12',
    'Balikpapan',
    'Kalimantan Timur',
    'https://images.unsplash.com/photo-1590736969955-ecc94901144?w=200&q=80',
    TRUE,
    TRUE,
    'Produsen packaging materials untuk produk aroma dan kosmetik. Menyediakan botol, drum, jar, dan kemasan custom untuk berbagai kebutuhan industri.',
    2011,
    'https://harumsemerbak.co.id',
    'Indonesia',
    70,
    'Kurang dari 24 Jam',
    89,
    FALSE,
    FALSE,
    FALSE,
    FALSE
);

-- =====================================================
-- Seed Buyers (5 Buyers)
-- =====================================================

INSERT INTO company (
    name, email, password, role, phone, address, city, province,
    is_verified, is_active, company_type, business_license, tax_id
) VALUES
-- Buyer 1: Perfume House Indonesia
(
    'Perfume House Indonesia', 
    'buyer@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 21 8765432',
    'Jl. Thamrin No. 99, Grand Indonesia',
    'Jakarta Pusat',
    'DKI Jakarta',
    TRUE,
    TRUE,
    'Manufacturer',
    'SIU-1234567890',
    'NPWP-01.234.567.8-901.000'
),
-- Buyer 2: Fragrance Co
(
    'Fragrance Distributor Co', 
    'fragrance.dist@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 31 7654321',
    'Jl. Basuki Rahmat No. 123',
    'Surabaya',
    'Jawa Timur',
    TRUE,
    TRUE,
    'Distributor',
    'SIU-0987654321',
    'NPWP-02.345.678.9-012.000'
),
-- Buyer 3: Spa & Wellness Center
(
    'Bali Spa & Wellness', 
    'balispa@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 361 887766',
    'Jl. Sunset Road No. 88',
    'Denpasar',
    'Bali',
    TRUE,
    TRUE,
    'Retailer',
    'SIU-1122334455',
    'NPWP-03.456.789.0-123.000'
),
-- Buyer 4: Cosmetics Manufacturer
(
    'Beauty Cosmetics Indonesia', 
    'beautycos@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 22 5566778',
    'Jl. Cihampelas No. 234',
    'Bandung',
    'Jawa Barat',
    TRUE,
    TRUE,
    'Manufacturer',
    'SIU-5566778899',
    'NPWP-04.567.890.1-234.000'
),
-- Buyer 5: Aromatherapy Store
(
    'Aroma Therapy Store', 
    'aromatherapy@aromara.id', 
    'ad2aab3d23fe89dd43eed3368d03e0e2', 
    'buyer',
    '+62 274 334455',
    'Jl. Malioboro No. 45',
    'Yogyakarta',
    'Jawa Tengah',
    TRUE,
    TRUE,
    'Retailer',
    'SIU-9988776655',
    'NPWP-05.678.901.2-345.000'
);

-- =====================================================
-- Seed Supplier Business Types
-- =====================================================

-- Kenanga Lestari
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'essential_oil_producer'::supplier_business_type FROM company WHERE email = 'kenanga@aromara.id'
UNION ALL
SELECT id, 'fragrance_producer'::supplier_business_type FROM company WHERE email = 'kenanga@aromara.id';

-- PT Aroma Nusantara
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'essential_oil_producer'::supplier_business_type FROM company WHERE email = 'aroma.nusantara@aromara.id'
UNION ALL
SELECT id, 'laboratory_certification'::supplier_business_type FROM company WHERE email = 'aroma.nusantara@aromara.id';

-- Bali Essential Oils
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'essential_oil_producer'::supplier_business_type FROM company WHERE email = 'bali.essential@aromara.id';

-- Javanese Fragrance Co
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'fragrance_producer'::supplier_business_type FROM company WHERE email = 'javanese@aromara.id';

-- Sumatran Spice Oils
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'essential_oil_producer'::supplier_business_type FROM company WHERE email = 'sumatra.spice@aromara.id';

-- PT Harum Semerbak (Packaging)
INSERT INTO supplier_business_types (supplier_id, business_type)
SELECT id, 'supplier_packaging'::supplier_business_type FROM company WHERE email = 'harum@aromara.id';

-- =====================================================
-- Seed Supplier Capabilities
-- =====================================================

-- Kenanga Lestari Capabilities
INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT id, 'Distributor', 'Melayani distributor di seluruh Indonesia'
FROM company WHERE email = 'kenanga@aromara.id'
UNION ALL
SELECT id, 'Manufaktur', 'Menyuplai bahan baku untuk manufaktur'
FROM company WHERE email = 'kenanga@aromara.id'
UNION ALL
SELECT id, 'Metode Produksi', 'Fermentasi alami'
FROM company WHERE email = 'kenanga@aromara.id';

-- PT Aroma Nusantara Capabilities
INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT id, 'Distributor', 'Jaringan distribusi ASEAN'
FROM company WHERE email = 'aroma.nusantara@aromara.id'
UNION ALL
SELECT id, 'Manufaktur', 'OEM/ODM untuk brand internasional'
FROM company WHERE email = 'aroma.nusantara@aromara.id'
UNION ALL
SELECT id, 'Metode Produksi', 'Steam distillation & Cold press'
FROM company WHERE email = 'aroma.nusantara@aromara.id';

-- Bali Essential Oils Capabilities
INSERT INTO supplier_capabilities (supplier_id, capability_type, description)
SELECT id, 'Distributor', 'Ekspor ke pasar global'
FROM company WHERE email = 'bali.essential@aromara.id'
UNION ALL
SELECT id, 'Metode Produksi', 'Organic steam distillation'
FROM company WHERE email = 'bali.essential@aromara.id';

-- =====================================================
-- Seed Products (30+ Products)
-- =====================================================

-- Kenanga Lestari Products (10 products)
INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, is_pre_order, available_quantities, portfolio_count
)
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Lavender Oil Murni (Prancis)',
    'Minyak lavender murni dari Prancis dengan aroma segar dan menenangkan. Cocok untuk aromaterapi, kosmetik, dan produk perawatan kulit.',
    1250000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["1 kg", "5 kg", "10 kg", "25 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Lemongrass Oil Drum',
    'Essential oil sereh berkualitas tinggi dalam kemasan drum. Aroma segar citrus untuk produk pembersih dan aromaterapi.',
    850000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["5 kg", "25 kg", "50 kg", "100 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Peppermint Oil Organik',
    'Peppermint oil organik bersertifikat dengan aroma mint yang kuat dan menyegarkan.',
    1450000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["1 kg", "5 kg", "10 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Ekstrak Rosemary Grade AA',
    'Ekstrak rosemary grade premium untuk industri kosmetik dan food & beverage.',
    1150000,
    2,
    'kg',
    'pre_order'::product_stock_status,
    TRUE,
    '["2 kg", "5 kg", "10 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Bergamot FCF Oil',
    'Bergamot oil FCF (Furocoumarin Free) aman untuk produk skincare.',
    1650000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["1 kg", "5 kg", "10 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Jasmine Absolute Blend',
    'Jasmine absolute premium blend dengan aroma floral yang elegan dan tahan lama.',
    2500000,
    0.5,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["500 g", "1 kg", "5 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Eucalyptus Oil',
    'Minyak kayu putih murni dengan aroma segar untuk produk kesehatan.',
    750000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["5 kg", "25 kg", "50 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Tea Tree Oil Australia',
    'Tea tree oil dari Australia untuk produk anti-acne dan skincare.',
    1850000,
    1,
    'kg',
    'pre_order'::product_stock_status,
    TRUE,
    '["1 kg", "5 kg", "10 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Ylang Ylang Oil',
    'Essential oil ylang ylang dengan aroma floral eksotis untuk parfum dan kosmetik.',
    2200000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["1 kg", "5 kg", "10 kg"]',
    87
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Base Materials'),
    'Jojoba Carrier Oil',
    'Carrier oil jojoba organik untuk campuran essential oil dan produk perawatan kulit.',
    950000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    FALSE,
    '["5 kg", "25 kg", "50 kg"]',
    87;

-- PT Aroma Nusantara Products (8 products)
INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, portfolio_count
)
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Patchouli Oil Indonesia',
    'Patchouli oil grade ekspor dengan aroma earthy yang kuat dan tahan lama.',
    1350000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Citronella Oil Java',
    'Minyak sereh wangi dari Jawa untuk repellent dan aromaterapi.',
    680000,
    10,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Clove Bud Oil',
    'Minyak cengkeh murni untuk produk kesehatan gigi dan aromaterapi.',
    1100000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Sandalwood Fragrance Oil',
    'Fragrance oil dengan aroma sandalwood untuk parfum dan produk spa.',
    1750000,
    2,
    'kg',
    'pre_order'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Ginger Essential Oil',
    'Essential oil jahe dengan aroma hangat dan pedas untuk aromaterapi.',
    980000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Cinnamon Leaf Oil',
    'Minyak daun kayu manis dengan aroma manis dan pedas.',
    1250000,
    3,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Aroma Chemicals'),
    'Vanillin Crystals',
    'Kristal vanillin untuk produk F&B dan fragrance.',
    850000,
    10,
    'kg',
    'ready_stock'::product_stock_status,
    56
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Base Materials'),
    'Fractionated Coconut Oil',
    'Carrier oil kelapa terfraksionasi untuk kosmetik dan massage oil.',
    450000,
    25,
    'kg',
    'ready_stock'::product_stock_status,
    56;

-- Bali Essential Oils Products (6 products)
INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, portfolio_count
)
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Frangipani Absolute',
    'Absolut kamboja organik dari Bali dengan aroma floral eksotis.',
    3500000,
    0.5,
    'kg',
    'ready_stock'::product_stock_status,
    43
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Vetiver Oil Organic',
    'Minyak akar wangi organik bersertifikat dari Bali.',
    1950000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    43
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Lemongrass Bali Organic',
    'Sereh organik khas Bali dengan aroma citrus yang segar.',
    1150000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    43
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Natural Extracts'),
    'Turmeric Extract CO2',
    'Ekstrak kunyit CO2 untuk produk anti-inflammatory skincare.',
    2750000,
    1,
    'kg',
    'pre_order'::product_stock_status,
    43
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Patchouli Bali Premium',
    'Patchouli oil premium dari Bali dengan aroma earthy yang kompleks.',
    1650000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    43
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Base Materials'),
    'Virgin Coconut Oil',
    'VCO organik dari Bali untuk produk perawatan rambut dan kulit.',
    350000,
    25,
    'kg',
    'ready_stock'::product_stock_status,
    43;

-- Sumatran Spice Oils Products (5 products)
INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, portfolio_count
)
SELECT 
    (SELECT id FROM company WHERE email = 'sumatra.spice@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Cinnamon Bark Oil Sumatra',
    'Minyak kulit kayu manis dari Sumatera dengan aroma manis dan hangat.',
    1850000,
    2,
    'kg',
    'ready_stock'::product_stock_status,
    34
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'sumatra.spice@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Nutmeg Oil Organic',
    'Minyak pala organik bersertifikat dari Sumatera Barat.',
    2250000,
    1,
    'kg',
    'ready_stock'::product_stock_status,
    34
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'sumatra.spice@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Black Pepper Oil',
    'Essential oil lada hitam dengan aroma pedas yang kuat.',
    2650000,
    1,
    'kg',
    'pre_order'::product_stock_status,
    34
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'sumatra.spice@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Essential Oils'),
    'Cardamom Oil',
    'Minyak kapulaga premium untuk produk F&B dan aromaterapi.',
    3250000,
    0.5,
    'kg',
    'ready_stock'::product_stock_status,
    34
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'sumatra.spice@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Natural Extracts'),
    'Ginger Oleoresin',
    'Oleoresin jahe dengan kandungan gingerol tinggi.',
    1550000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    34;

-- Javanese Fragrance Co Products (4 products)
INSERT INTO products (
    supplier_id, category_id, name, description, 
    price_per_unit, min_order_qty, min_order_unit,
    stock_status, portfolio_count
)
SELECT 
    (SELECT id FROM company WHERE email = 'javanese@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Rose Fragrance Oil',
    'Fragrance oil mawar untuk sabun, lilin, dan produk home fragrance.',
    680000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    28
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'javanese@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Ocean Breeze Fragrance',
    'Fragrance compound dengan aroma segar laut untuk produk laundry.',
    550000,
    10,
    'kg',
    'ready_stock'::product_stock_status,
    28
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'javanese@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Vanilla Fragrance Oil',
    'Fragrance oil vanilla yang manis dan creamy.',
    750000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    28
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'javanese@aromara.id'),
    (SELECT id FROM product_categories WHERE name = 'Fragrance Compounds'),
    'Lavender Fragrance Blend',
    'Blend fragrance lavender untuk produk relaksasi dan spa.',
    620000,
    5,
    'kg',
    'ready_stock'::product_stock_status,
    28;

-- =====================================================
-- Seed Product Images
-- =====================================================

-- Images for Lavender Oil
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1611251180798-0d66eb5d6b30?w=800&q=80', TRUE, 0
FROM products WHERE name = 'Lavender Oil Murni (Prancis)'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1608571423183-4cb1e60b8acc?w=800&q=80', FALSE, 1
FROM products WHERE name = 'Lavender Oil Murni (Prancis)';

-- Images for Lemongrass Oil
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1608667162993-e98d1e8de98c?w=800&q=80', TRUE, 0
FROM products WHERE name = 'Lemongrass Oil Drum'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80', FALSE, 1
FROM products WHERE name = 'Lemongrass Oil Drum';

-- Images for Jasmine Absolute
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', TRUE, 0
FROM products WHERE name = 'Jasmine Absolute Blend';

-- Images for Patchouli Oil
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', TRUE, 0
FROM products WHERE name = 'Patchouli Oil Indonesia';

-- Images for Frangipani
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80', TRUE, 0
FROM products WHERE name = 'Frangipani Absolute';

-- =====================================================
-- Seed Product Ingredients
-- =====================================================

-- Lavender Oil Ingredients
INSERT INTO product_ingredients (product_id, ingredient_name, percentage, description, sort_order)
SELECT id, 'Lavandula Angustifolia', 100.00, 'Pure French lavender essential oil', 0
FROM products WHERE name = 'Lavender Oil Murni (Prancis)';

-- Lemongrass Oil Ingredients
INSERT INTO product_ingredients (product_id, ingredient_name, percentage, description, sort_order)
SELECT id, 'Cymbopogon Citratus', 100.00, 'Pure lemongrass essential oil', 0
FROM products WHERE name = 'Lemongrass Oil Drum';

-- Jasmine Absolute Ingredients
INSERT INTO product_ingredients (product_id, ingredient_name, description, sort_order)
SELECT id, 'Jasmine Absolute', 'High-grade jasmine absolute', 0
FROM products WHERE name = 'Jasmine Absolute Blend'
UNION ALL
SELECT id, 'Natural Carrier', 'Natural carrier oil blend', 1
FROM products WHERE name = 'Jasmine Absolute Blend';

-- Peppermint Oil Ingredients
INSERT INTO product_ingredients (product_id, ingredient_name, percentage, description, sort_order)
SELECT id, 'Mentha Piperita', 100.00, 'Organic peppermint essential oil', 0
FROM products WHERE name = 'Peppermint Oil Organik';

-- =====================================================
-- Seed Inquiries (Sample inquiries from buyers)
-- =====================================================

INSERT INTO inquiry (
    supplier_id, buyer_id, contact_name, contact_email, contact_phone,
    country, city, service_type, estimated_delivery_time, total_quantity,
    required_certifications, packaging_preference, subject, message, status
)
SELECT 
    (SELECT id FROM company WHERE email = 'kenanga@aromara.id'),
    (SELECT id FROM company WHERE email = 'buyer@aromara.id'),
    'John Doe',
    'buyer@aromara.id',
    '+62 21 8765432',
    'Indonesia',
    'Jakarta',
    'Bulk Essential Oil Supply',
    'Kurang dari 7 hari',
    '100 kg Lavender Oil',
    ARRAY['halal', 'coa'],
    'drum_aluminium'::packaging_type,
    'Request Quote for Lavender Oil',
    'Saya tertarik untuk memesan 100 kg Lavender Oil. Mohon informasi harga dan ketersediaan stok.',
    'pending'::inquiry_status
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'aroma.nusantara@aromara.id'),
    (SELECT id FROM company WHERE email = 'fragrance.dist@aromara.id'),
    'Jane Smith',
    'fragrance.dist@aromara.id',
    '+62 31 7654321',
    'Indonesia',
    'Surabaya',
    'Essential Oil Distribution',
    '1-2 minggu',
    '500 kg Patchouli Oil',
    ARRAY['coa', 'msds'],
    'drum_aluminium'::packaging_type,
    'Partnership Opportunity',
    'Kami ingin menjalin kerjasama distribusi untuk wilayah Jawa Timur.',
    'responded'::inquiry_status
UNION ALL
SELECT 
    (SELECT id FROM company WHERE email = 'bali.essential@aromara.id'),
    NULL,
    'Michael Johnson',
    'michael@example.com',
    '+1 555 123 4567',
    'United States',
    'Los Angeles',
    'Organic Essential Oils',
    'Fleksibel',
    '50 kg Organic Vetiver Oil',
    ARRAY['organic', 'coa'],
    'vacuum_sealed_bag'::packaging_type,
    'Export Inquiry',
    'We are interested in importing organic essential oils from Bali for our US market.',
    'pending'::inquiry_status;

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
-- SUMMARY & COMMENTS
-- =====================================================

COMMENT ON TABLE company IS 'Companies (both suppliers and buyers) - 15 records total';
COMMENT ON TABLE supplier_business_types IS 'Business types for suppliers';
COMMENT ON TABLE supplier_capabilities IS 'Capabilities and certifications of suppliers';
COMMENT ON TABLE products IS 'Product catalog from suppliers - 33 products total';
COMMENT ON TABLE product_images IS 'Multiple images for each product';
COMMENT ON TABLE product_ingredients IS 'Ingredients/compositions of products';
COMMENT ON TABLE inquiry IS 'Inquiry/contact requests from buyers to suppliers';
COMMENT ON TABLE inquiry_items IS 'Line items in each inquiry';
COMMENT ON TABLE regions IS 'Indonesian regions for filtering - 28 regions';
COMMENT ON TABLE product_categories IS 'Product categories - 6 categories';

-- =====================================================
-- SEEDER SUMMARY
-- =====================================================
-- ✅ 28 Regions (Indonesian cities)
-- ✅ 6 Product Categories
-- ✅ 10 Suppliers with complete data
-- ✅ 5 Buyers
-- ✅ 33 Products across all suppliers
-- ✅ Multiple product images
-- ✅ Product ingredients/compositions
-- ✅ Supplier capabilities and business types
-- ✅ 3 Sample inquiries
-- 
-- Test Accounts (Password: aromara123):
-- - kenanga@aromara.id (Supplier)
-- - aroma.nusantara@aromara.id (Supplier)
-- - bali.essential@aromara.id (Supplier)
-- - buyer@aromara.id (Buyer - Manufacturer)
-- - fragrance.dist@aromara.id (Buyer - Distributor)
-- =====================================================
