-- Disable RLS on all tables (for demo/development)
-- Run this in Supabase SQL Editor if you get 401/403 errors

ALTER TABLE company DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_business_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_capabilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE regions DISABLE ROW LEVEL SECURITY;

-- Re-grant all permissions to anon role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, postgres, service_role;
