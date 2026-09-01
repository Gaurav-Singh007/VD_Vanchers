-- ============================================================
-- E-Commerce Sales Dashboard — Complete PostgreSQL Setup
-- ============================================================
-- Compatible with: PostgreSQL 12+
--
-- HOW TO USE:
--   1. Install PostgreSQL + pgAdmin
--   2. Create a database called "ecommerce_dashboard"
--   3. Open the Query Tool and run this entire file
-- ============================================================

-- ===== STEP 1: CREATE TABLES =====

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

-- ===== STEP 2: CREATE INDEXES =====

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ===== STEP 3: ENABLE ROW LEVEL SECURITY =====

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ===== STEP 4: CREATE SELECT-ONLY POLICIES =====

CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_select_customers" ON customers FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

-- ===== STEP 5: INSERT CATEGORIES =====

INSERT INTO categories (name, slug) VALUES
  ('Apparel', 'apparel'),
  ('Beauty', 'beauty'),
  ('Electronics', 'electronics'),
  ('Home & Kitchen', 'home-kitchen'),
  ('Sports & Outdoors', 'sports-outdoors'),
  ('Toys & Games', 'toys-games')
ON CONFLICT (slug) DO NOTHING;

-- ===== STEP 6: INSERT PRODUCTS =====

INSERT INTO products (name, category_id, price, cost)
SELECT v.name, c.id, v.price, v.cost
FROM (VALUES
  ('4K Monitor', 'electronics', 349.99, 180.00),
  ('Adjustable Dumbbells', 'sports-outdoors', 199.99, 90.00),
  ('Air Fryer', 'home-kitchen', 99.99, 40.00),
  ('Bluetooth Speaker', 'electronics', 79.99, 30.00),
  ('Board Game', 'toys-games', 34.99, 12.00),
  ('Building Blocks', 'toys-games', 49.99, 18.00),
  ('Camping Tent', 'sports-outdoors', 159.99, 70.00),
  ('Chef''s Knife', 'home-kitchen', 59.99, 22.00),
  ('Cotton T-Shirt', 'apparel', 24.99, 8.00),
  ('Denim Jacket', 'apparel', 89.99, 35.00),
  ('Espresso Machine', 'home-kitchen', 299.99, 120.00),
  ('Hair Dryer', 'beauty', 89.99, 35.00),
  ('Matte Lipstick', 'beauty', 18.99, 5.00),
  ('Moisturizer', 'beauty', 27.99, 9.00),
  ('Mountain Bike', 'sports-outdoors', 599.99, 280.00),
  ('Nonstick Cookware Set', 'home-kitchen', 149.99, 60.00),
  ('Plush Toy', 'toys-games', 19.99, 6.00),
  ('Remote Car', 'toys-games', 44.99, 16.00),
  ('Running Shoes', 'apparel', 119.99, 45.00),
  ('Smart Watch', 'electronics', 199.99, 80.00),
  ('Vitamin C Serum', 'beauty', 34.99, 10.00),
  ('Wireless Headphones', 'electronics', 129.99, 55.00),
  ('Wool Sweater', 'apparel', 69.99, 28.00),
  ('Yoga Mat', 'sports-outdoors', 39.99, 14.00)
) AS v(name, cat_slug, price, cost)
JOIN categories c ON c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- ===== STEP 7: GENERATE CUSTOMERS, ORDERS & ORDER ITEMS =====

DO $$
DECLARE
  i integer;
  j integer;
  k integer;
  v_customer_id uuid;
  v_order_id uuid;
  v_product_id uuid;
  v_qty integer;
  v_price numeric;
  v_total numeric;
  v_order_date timestamptz;
  v_num_items integer;
  v_num_orders integer;
  v_first_order date;
  r float;
BEGIN
  -- Generate 200 customers
  FOR i IN 1..200 LOOP
    INSERT INTO customers (name, email)
    VALUES ('Customer ' || i, 'customer' || i || '@example.com')
    RETURNING id INTO v_customer_id;
  END LOOP;

  -- Generate orders for each customer
  FOR i IN 1..200 LOOP
    SELECT id INTO v_customer_id FROM customers WHERE name = 'Customer ' || i;

    -- Realistic customer distribution:
    --   ~35% one-time buyers (1 order)
    --   ~40% repeat buyers (2-5 orders)
    --   ~25% loyal buyers (6-20 orders)
    r := random();
    IF r < 0.35 THEN
      v_num_orders := 1;
    ELSIF r < 0.75 THEN
      v_num_orders := floor(random() * 4) + 2;   -- 2 to 5
    ELSE
      v_num_orders := floor(random() * 15) + 6;   -- 6 to 20
    END IF;

    v_first_order := NULL;

    FOR j IN 1..v_num_orders LOOP
      -- Random date between Jan 2023 and Jun 2025
      v_order_date := '2023-01-01'::timestamptz +
        (random() * (now() - '2023-01-01'::timestamptz));

      IF v_first_order IS NULL OR v_order_date::date < v_first_order THEN
        v_first_order := v_order_date::date;
      END IF;

      -- Create the order
      INSERT INTO orders (customer_id, order_date, total, status)
      VALUES (v_customer_id, v_order_date, 0, 'completed')
      RETURNING id INTO v_order_id;

      -- Add 1 to 4 items per order
      v_num_items := floor(random() * 4) + 1;
      v_total := 0;

      FOR k IN 1..v_num_items LOOP
        SELECT id, price INTO v_product_id, v_price
        FROM products
        ORDER BY random()
        LIMIT 1;

        v_qty := floor(random() * 3) + 1;
        v_total := v_total + (v_price * v_qty);

        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (v_order_id, v_product_id, v_qty, v_price);
      END LOOP;

      -- Update order total
      UPDATE orders SET total = v_total WHERE id = v_order_id;
    END LOOP;

    -- Update first order date
    UPDATE customers SET first_order_date = v_first_order
    WHERE id = v_customer_id;
  END LOOP;

  RAISE NOTICE 'Data generation complete!';
END $$;

-- ===== STEP 8: VERIFY DATA =====

SELECT 'categories' as table_name, count(*) as rows FROM categories
UNION ALL
SELECT 'products', count(*) FROM products
UNION ALL
SELECT 'customers', count(*) FROM customers
UNION ALL
SELECT 'orders', count(*) FROM orders
UNION ALL
SELECT 'order_items', count(*) FROM order_items;

-- ===== DONE =====
-- Expected output:
--   categories  → 6
--   products    → 24
--   customers   → 200
--   orders      → ~1,500 to 2,500
--   order_items → ~3,000 to 6,000
