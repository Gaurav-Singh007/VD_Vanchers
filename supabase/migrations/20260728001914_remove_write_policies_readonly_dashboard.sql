/*
# Remove write policies — dashboard is read-only

1. Security Changes
- This app is a read-only analytics dashboard. The frontend never inserts, updates,
  or deletes rows — all queries are SELECT-only.
- Removed all INSERT, UPDATE, and DELETE policies from all 5 tables.
- Kept only SELECT policies (USING (true), TO anon, authenticated) so the anon-key
  frontend can read the intentionally public demo data.
- This eliminates all "RLS Policy Always True" warnings for write operations.

2. Tables Modified
- categories: dropped insert/update/delete policies
- products: dropped insert/update/delete policies
- customers: dropped insert/update/delete policies
- orders: dropped insert/update/delete policies
- order_items: dropped insert/update/delete policies

3. Notes
- No data changes — only policy definitions removed.
- RLS remains enabled on all tables.
- SELECT policies remain unchanged and are not flagged.
*/

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
DROP POLICY IF EXISTS "anon_update_categories" ON categories;
DROP POLICY IF EXISTS "anon_delete_categories" ON categories;

DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;

DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
DROP POLICY IF EXISTS "anon_update_customers" ON customers;
DROP POLICY IF EXISTS "anon_delete_customers" ON customers;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;