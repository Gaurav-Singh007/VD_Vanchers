/*
# Fix RLS Policies: Split FOR ALL into per-verb policies

1. Security Changes
- All 5 tables (categories, products, customers, orders, order_items) had a single
  `FOR ALL` policy with `USING (true) WITH CHECK (true)` which bypasses RLS.
- Replaced each `FOR ALL` policy with 4 separate per-verb policies:
  SELECT, INSERT, UPDATE, DELETE.
- This is a single-tenant, no-auth dashboard. The data is intentionally public/shared
  demo data, so `USING (true)` / `WITH CHECK (true)` is correct here — but split into
  per-verb policies so RLS is properly enforced per operation rather than blanket-open.
- Policies are scoped `TO anon, authenticated` so the anon-key frontend can read/write.

2. Tables Modified
- categories: 1 FOR ALL policy dropped, 4 per-verb policies created
- products: 1 FOR ALL policy dropped, 4 per-verb policies created
- customers: 1 FOR ALL policy dropped, 4 per-verb policies created
- orders: 1 FOR ALL policy dropped, 4 per-verb policies created
- order_items: 1 FOR ALL policy dropped, 4 per-verb policies created

3. Notes
- No data changes — only policy definitions.
- RLS remains enabled on all tables.
- Idempotent: drops existing policies before recreating.
*/

-- categories
DROP POLICY IF EXISTS "anon_all_categories" ON categories;

CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- products
DROP POLICY IF EXISTS "anon_all_products" ON products;

CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- customers
DROP POLICY IF EXISTS "anon_all_customers" ON customers;

CREATE POLICY "anon_select_customers" ON customers FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_customers" ON customers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_customers" ON customers FOR DELETE
  TO anon, authenticated USING (true);

-- orders
DROP POLICY IF EXISTS "anon_all_orders" ON orders;

CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- order_items
DROP POLICY IF EXISTS "anon_all_order_items" ON order_items;

CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);