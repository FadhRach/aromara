-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('consumer', 'supplier', 'admin');

-- Request status enum
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');

-- Certification type enum
CREATE TYPE certification_type AS ENUM ('organic', 'halal', 'iso', 'gmp', 'haccp', 'eco', 'other');

-- Ingredient type enum
CREATE TYPE ingredient_type AS ENUM ('wood', 'flower', 'oil', 'alcohol', 'spice', 'resin', 'fruit', 'herb', 'synthetic', 'other');

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE users (
    id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    profile_img TEXT,
    
    -- Company info (untuk supplier)
    company_name VARCHAR(255),
    company_desc TEXT,
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Indonesia',
    
    -- Role & Status
    role user_role NOT NULL DEFAULT 'consumer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- INGREDIENTS TABLE (Master Data Bahan Parfum)
-- =====================================================

CREATE TABLE ingredients (
    id_ingredient UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type ingredient_type NOT NULL,
    description TEXT,
    
    -- Scent characteristics
    scent_notes TEXT, -- e.g., "woody, earthy, warm"
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10), -- 1-10
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ingredients_type ON ingredients(type);

-- =====================================================
-- PRODUCTS TABLE (Supplier's Products)
-- =====================================================

CREATE TABLE products (
    id_product UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id_ingredient) ON DELETE RESTRICT,
    
    -- Product details
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Harvest & Processing
    harvest_season VARCHAR(100), -- e.g., "Spring 2025", "Year-round"
    extraction_method VARCHAR(100), -- e.g., "Steam Distillation", "Cold Press", "Solvent"
    
    -- Stock & Pricing
    stock_qty DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'kg', -- kg, liter, ml, etc.
    price_per_unit DECIMAL(10, 2) NOT NULL,
    minimum_order DECIMAL(10, 2) DEFAULT 1,
    
    -- Media
    image_url TEXT,
    
    -- Certification
    certifications certification_type[],
    
    -- Status
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_ingredient ON products(ingredient_id);
CREATE INDEX idx_products_available ON products(is_available);

-- =====================================================
-- QUOTATION REQUESTS
-- =====================================================

CREATE TABLE quotation_requests (
    id_request UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Parties
    consumer_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id_product) ON DELETE CASCADE,
    
    -- Request details
    qty DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    notes TEXT,
    
    -- Status
    status request_status DEFAULT 'pending',
    
    -- Supplier response
    quoted_price DECIMAL(10, 2),
    supplier_notes TEXT,
    response_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requests_consumer ON quotation_requests(consumer_id);
CREATE INDEX idx_requests_supplier ON quotation_requests(supplier_id);
CREATE INDEX idx_requests_status ON quotation_requests(status);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE reviews (
    id_review UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id_product) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_consumer ON reviews(consumer_id);

-- =====================================================
-- SCENT PREFERENCES (For AI Integration)
-- =====================================================

CREATE TABLE scent_preferences (
    id_preference UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    
    -- Preferences
    preferred_scent_notes TEXT, -- e.g., "floral, woody, fresh"
    intensity_preference INTEGER CHECK (intensity_preference >= 1 AND intensity_preference <= 10),
    
    -- Liked/Disliked
    liked_ingredients UUID[], -- Array of ingredient IDs
    disliked_ingredients UUID[],
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scent_preferences_consumer ON scent_preferences(consumer_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON quotation_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scent_preferences_updated_at BEFORE UPDATE ON scent_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate request number
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.request_number := 'REQ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
                          LPAD(NEXTVAL('request_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE request_number_seq START 1;

CREATE TRIGGER set_request_number BEFORE INSERT ON quotation_requests
    FOR EACH ROW EXECUTE FUNCTION generate_request_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid() = id_user);

-- Everyone can read active products
CREATE POLICY products_read_all ON products
    FOR SELECT USING (is_available = true);

-- Suppliers can manage their own products
CREATE POLICY products_supplier_manage ON products
    FOR ALL USING (auth.uid() = supplier_id);

-- Quotation requests: consumer and supplier can access
CREATE POLICY requests_access ON quotation_requests
    FOR ALL USING (auth.uid() = consumer_id OR auth.uid() = supplier_id);

-- Reviews: everyone can read, consumers can create
CREATE POLICY reviews_read_all ON reviews
    FOR SELECT USING (true);
    
CREATE POLICY reviews_create_own ON reviews
    FOR INSERT WITH CHECK (auth.uid() = consumer_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Ingredients (Master Data)
INSERT INTO ingredients (name, type, description, scent_notes, intensity) VALUES
-- Wood
('Sandalwood', 'wood', 'Warm, creamy, woody aroma from sandalwood tree', 'woody, creamy, warm', 7),
('Cedarwood', 'wood', 'Fresh, woody scent with slight pencil shavings note', 'woody, dry, clean', 6),
('Oud', 'wood', 'Rich, dark, resinous wood scent', 'woody, smoky, deep', 9),
('Vetiver', 'wood', 'Earthy, woody, slightly smoky grass root', 'earthy, woody, green', 7),

-- Flowers
('Rose', 'flower', 'Classic floral scent, sweet and romantic', 'floral, sweet, romantic', 8),
('Jasmine', 'flower', 'Intense, sweet, exotic floral aroma', 'floral, sweet, exotic', 9),
('Lavender', 'flower', 'Fresh, herbal, calming floral scent', 'floral, herbal, fresh', 6),
('Ylang Ylang', 'flower', 'Sweet, exotic, slightly fruity floral', 'floral, sweet, exotic', 8),
('Neroli', 'flower', 'Fresh, citrusy, honeyed orange blossom', 'floral, citrus, fresh', 7),

-- Oils
('Bergamot Oil', 'oil', 'Citrus essential oil with sweet-tart aroma', 'citrus, fresh, sweet', 6),
('Patchouli Oil', 'oil', 'Deep, earthy, musky essential oil', 'earthy, musky, deep', 8),
('Frankincense Oil', 'oil', 'Resinous, slightly citrus, woody oil', 'resinous, woody, spicy', 7),

-- Alcohol
('Ethanol 96%', 'alcohol', 'Pure perfumer\'s alcohol base', 'neutral, clean', 1),
('Denatured Alcohol', 'alcohol', 'Denatured ethanol for fragrance base', 'neutral', 1),

-- Spices
('Vanilla', 'spice', 'Sweet, creamy, comforting aroma', 'sweet, creamy, warm', 8),
('Cinnamon', 'spice', 'Warm, spicy, sweet scent', 'spicy, warm, sweet', 7),
('Cardamom', 'spice', 'Warm, slightly sweet, eucalyptus-like spice', 'spicy, warm, fresh', 6),
('Black Pepper', 'spice', 'Sharp, spicy, woody aroma', 'spicy, sharp, woody', 7),

-- Resin
('Amber', 'resin', 'Warm, powdery, sweet resinous note', 'warm, powdery, sweet', 8),
('Myrrh', 'resin', 'Warm, slightly medicinal, balsamic resin', 'balsamic, warm, earthy', 7),

-- Fruits
('Lemon', 'fruit', 'Fresh, zesty, bright citrus', 'citrus, fresh, zesty', 7),
('Bergamot', 'fruit', 'Sweet-tart citrus with floral notes', 'citrus, sweet, floral', 7),
('Orange', 'fruit', 'Sweet, fresh, juicy citrus', 'citrus, sweet, fresh', 6),

-- Herbs
('Mint', 'herb', 'Cool, fresh, invigorating herbal scent', 'fresh, cool, minty', 7),
('Basil', 'herb', 'Green, slightly spicy, fresh herb', 'herbal, green, spicy', 6),
('Rosemary', 'herb', 'Fresh, herbaceous, slightly camphoraceous', 'herbal, fresh, woody', 6),

-- Synthetic
('Iso E Super', 'synthetic', 'Modern synthetic with velvety woody scent', 'woody, velvety, smooth', 5),
('Ambroxan', 'synthetic', 'Synthetic amber, warm and musky', 'amber, warm, musky', 6);

-- Insert Admin User
INSERT INTO users (username, email, password, role, is_verified, is_active) VALUES
('admin', 'admin@aromara.id', '$2a$10$placeholder', 'admin', true, true);

-- Insert Sample Suppliers
INSERT INTO users (username, email, password, phone, company_name, company_desc, address, city, province, role, is_verified) VALUES
('supplier_bali', 'supplier@bali-essences.com', '$2a$10$placeholder', '+62812345678', 'Bali Natural Essences', 'Premium essential oils from Bali', 'Jl. Raya Ubud No. 123', 'Ubud', 'Bali', 'supplier', true),
('supplier_java', 'contact@java-fragrance.com', '$2a$10$placeholder', '+62812345679', 'Java Fragrance Co', 'Traditional Indonesian fragrance ingredients', 'Jl. Malioboro No. 45', 'Yogyakarta', 'DIY Yogyakarta', 'supplier', true),
('supplier_sumatra', 'info@sumatra-oils.id', '$2a$10$placeholder', '+62812345680', 'Sumatra Essential Oils', 'Organic essential oils from Sumatra forests', 'Jl. Ahmad Yani No. 78', 'Medan', 'Sumatera Utara', 'supplier', true);

-- Insert Sample Consumers
INSERT INTO users (username, email, password, phone, city, province, role) VALUES
('consumer1', 'user1@example.com', '$2a$10$placeholder', '+62812345681', 'Jakarta', 'DKI Jakarta', 'consumer'),
('consumer2', 'user2@example.com', '$2a$10$placeholder', '+62812345682', 'Bandung', 'Jawa Barat', 'consumer');

-- Get IDs for relationships (in real scenario, you'd use actual UUIDs from previous inserts)
-- For demonstration, we'll use subqueries

-- Insert Sample Products from Suppliers
INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, certifications, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_bali' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Sandalwood' LIMIT 1),
    'Premium Bali Sandalwood Oil',
    'High-grade sandalwood essential oil from sustainable Bali forests. Aged for 2 years.',
    'Year-round',
    'Steam Distillation',
    50.00,
    'kg',
    2500000.00,
    1.00,
    ARRAY['organic'::certification_type, 'eco'::certification_type],
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108';

INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, certifications, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_bali' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Lavender' LIMIT 1),
    'Bali Lavender Essential Oil',
    'Pure lavender oil from highland Bali farms. Calming and therapeutic grade.',
    'Spring-Summer',
    'Steam Distillation',
    100.00,
    'kg',
    850000.00,
    2.00,
    ARRAY['organic'::certification_type],
    'https://images.unsplash.com/photo-1611251180798-0d66eb5d6b30';

INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, certifications, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_java' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Patchouli Oil' LIMIT 1),
    'Java Patchouli Absolute',
    'Dark, earthy patchouli from Java plantations. Perfect for oriental fragrances.',
    'Year-round',
    'Solvent Extraction',
    75.00,
    'kg',
    950000.00,
    1.00,
    ARRAY['organic'::certification_type, 'halal'::certification_type],
    'https://images.unsplash.com/photo-1608571423183-4cb1e60b8acc';

INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_java' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Vanilla' LIMIT 1),
    'Premium Java Vanilla Extract',
    'Rich vanilla extract from Java beans. Sweet and creamy aroma.',
    'Summer',
    'Solvent Extraction',
    30.00,
    'kg',
    1800000.00,
    0.5,
    'https://images.unsplash.com/photo-1623428187425-50d9d13c5d6b';

INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, certifications, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_sumatra' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Bergamot Oil' LIMIT 1),
    'Sumatra Bergamot Oil',
    'Fresh bergamot essential oil from Sumatra highlands.',
    'Spring',
    'Cold Press',
    80.00,
    'kg',
    750000.00,
    2.00,
    ARRAY['organic'::certification_type],
    'https://images.unsplash.com/photo-1590759668628-05b0fc34e5ff';

INSERT INTO products (supplier_id, ingredient_id, product_name, description, harvest_season, extraction_method, stock_qty, unit, price_per_unit, minimum_order, certifications, image_url)
SELECT 
    (SELECT id_user FROM users WHERE username = 'supplier_sumatra' LIMIT 1),
    (SELECT id_ingredient FROM ingredients WHERE name = 'Vetiver' LIMIT 1),
    'Organic Sumatra Vetiver',
    'Earthy vetiver root oil from organic Sumatra farms.',
    'Year-round',
    'Steam Distillation',
    60.00,
    'kg',
    1200000.00,
    1.00,
    ARRAY['organic'::certification_type, 'eco'::certification_type],
    'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e';

-- Insert Sample Quotation Requests
INSERT INTO quotation_requests (consumer_id, supplier_id, product_id, qty, unit, notes, status)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer1' LIMIT 1),
    (SELECT id_user FROM users WHERE username = 'supplier_bali' LIMIT 1),
    (SELECT id_product FROM products WHERE product_name = 'Premium Bali Sandalwood Oil' LIMIT 1),
    5.00,
    'kg',
    'Need for premium perfume line. Please include COA.',
    'pending';

INSERT INTO quotation_requests (consumer_id, supplier_id, product_id, qty, unit, notes, status, quoted_price, supplier_notes, response_date)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer2' LIMIT 1),
    (SELECT id_user FROM users WHERE username = 'supplier_java' LIMIT 1),
    (SELECT id_product FROM products WHERE product_name = 'Java Patchouli Absolute' LIMIT 1),
    10.00,
    'kg',
    'Bulk order for commercial production.',
    'accepted',
    900000.00,
    'Special price for bulk order. Can deliver in 2 weeks.',
    CURRENT_TIMESTAMP - INTERVAL '2 days';

-- Insert Sample Reviews
INSERT INTO reviews (consumer_id, product_id, rating, comment)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer1' LIMIT 1),
    (SELECT id_product FROM products WHERE product_name = 'Bali Lavender Essential Oil' LIMIT 1),
    5,
    'Amazing quality! The scent is pure and therapeutic. Very satisfied with this purchase.';

INSERT INTO reviews (consumer_id, product_id, rating, comment)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer2' LIMIT 1),
    (SELECT id_product FROM products WHERE product_name = 'Java Patchouli Absolute' LIMIT 1),
    4,
    'Good quality patchouli. Strong earthy scent perfect for my blend. Fast shipping!';

-- Insert Sample Scent Preferences
INSERT INTO scent_preferences (consumer_id, preferred_scent_notes, intensity_preference, liked_ingredients)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer1' LIMIT 1),
    'floral, fresh, citrus',
    6,
    ARRAY[
        (SELECT id_ingredient FROM ingredients WHERE name = 'Lavender' LIMIT 1),
        (SELECT id_ingredient FROM ingredients WHERE name = 'Bergamot' LIMIT 1),
        (SELECT id_ingredient FROM ingredients WHERE name = 'Rose' LIMIT 1)
    ];

INSERT INTO scent_preferences (consumer_id, preferred_scent_notes, intensity_preference, liked_ingredients, disliked_ingredients)
SELECT 
    (SELECT id_user FROM users WHERE username = 'consumer2' LIMIT 1),
    'woody, earthy, spicy',
    8,
    ARRAY[
        (SELECT id_ingredient FROM ingredients WHERE name = 'Patchouli Oil' LIMIT 1),
        (SELECT id_ingredient FROM ingredients WHERE name = 'Sandalwood' LIMIT 1),
        (SELECT id_ingredient FROM ingredients WHERE name = 'Vetiver' LIMIT 1)
    ],
    ARRAY[
        (SELECT id_ingredient FROM ingredients WHERE name = 'Mint' LIMIT 1)
    ];

-- Comments
COMMENT ON TABLE users IS 'User accounts: consumers, suppliers, and admins';
COMMENT ON TABLE ingredients IS 'Master data for perfume ingredients';
COMMENT ON TABLE products IS 'Products offered by suppliers (linked to ingredients)';
COMMENT ON TABLE quotation_requests IS 'Consumer quotation requests to suppliers';
COMMENT ON TABLE reviews IS 'Product reviews from consumers';
COMMENT ON TABLE scent_preferences IS 'Consumer scent preferences for AI recommendations';
