-- =====================================================
-- RESET DATABASE - Hapus semua tables & objects
-- Untuk mulai fresh dari awal
-- =====================================================

-- Drop all tables (cascade will remove related objects)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS company_roles CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS inquiry_items CASCADE;
DROP TABLE IF EXISTS inquiry CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS company CASCADE;

-- Drop types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS inquiry_status CASCADE;
DROP TYPE IF EXISTS company_role CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- FIX PERMISSIONS (Important!)
-- =====================================================

-- Grant permissions to public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres, service_role;

-- Grant permissions to all tables in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, service_role;

-- Grant SELECT to anon & authenticated for all future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

-- ✅ Database reset complete & permissions fixed!
-- Now run: 001_core_schema.sql
