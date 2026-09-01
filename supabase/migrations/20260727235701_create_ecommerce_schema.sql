/*
# Create e-commerce sales schema (single-tenant, no auth)

1. New Tables
- `categories` — product categories (id, name, slug)
- `products` — products belonging to a category (id, name, category_id, price, cost)
- `customers` — customer records (id, name, email, first_order_date)
- `orders` — order headers (id, customer_id, order_date, total, status)
- `order_items` — line items per order (id, order_id, product_id, quantity, unit_price)

2. Security
- Enable RLS on all tables.
- Single-tenant dashboard with no sign-in: allow anon + authenticated full CRUD on all tables
  because the data is intentionally shared/public demo data.
- Uses `USING (true)` / `WITH CHECK (true)` because this is a public demo dataset.

3. Notes
- Indexes added on foreign keys and frequently filtered columns (order_date, customer_id, category_id).
- `customers.first_order_date` is denormalized for quick "new vs repeat" segmentation.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  cost numeric(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  first_order_date date
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_date timestamptz NOT NULL DEFAULT now(),
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed'
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all_categories" ON categories;
CREATE POLICY "anon_all_categories" ON categories FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_products" ON products;
CREATE POLICY "anon_all_products" ON products FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_customers" ON customers;
CREATE POLICY "anon_all_customers" ON customers FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_orders" ON orders;
CREATE POLICY "anon_all_orders" ON orders FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_order_items" ON order_items;
CREATE POLICY "anon_all_order_items" ON order_items FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);
