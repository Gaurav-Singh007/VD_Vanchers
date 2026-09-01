-- ============================================================
-- E-Commerce Sales Dashboard — MySQL / MySQL Workbench Setup
-- ============================================================
-- Compatible with: MySQL 8.0+
--
-- HOW TO USE:
--   1. Open MySQL Workbench
--   2. Connect to your local MySQL server
--   3. Click File > Open SQL Script and select this file
--   4. Click the lightning bolt (Execute All) button
-- ============================================================

-- ===== STEP 1: CREATE DATABASE =====

CREATE DATABASE IF NOT EXISTS ecommerce_dashboard;
USE ecommerce_dashboard;

-- ===== STEP 2: DROP TABLES (clean slate) =====

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
SET FOREIGN_KEY_CHECKS = 1;

-- ===== STEP 3: CREATE TABLES =====

CREATE TABLE categories (
  id       CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  name     VARCHAR(100) NOT NULL,
  slug     VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
  id          CHAR(36)       PRIMARY KEY DEFAULT (UUID()),
  name        VARCHAR(200)   NOT NULL,
  category_id CHAR(36)       NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  cost        DECIMAL(10,2)  NOT NULL DEFAULT 0,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE customers (
  id               CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  name             VARCHAR(200) NOT NULL,
  email            VARCHAR(200) NOT NULL UNIQUE,
  first_order_date DATE
);

CREATE TABLE orders (
  id          CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
  customer_id CHAR(36)      NOT NULL,
  order_date  DATETIME      NOT NULL DEFAULT NOW(),
  total       DECIMAL(12,2) NOT NULL DEFAULT 0,
  status      VARCHAR(50)   NOT NULL DEFAULT 'completed',
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id         CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
  order_id   CHAR(36)      NOT NULL,
  product_id CHAR(36)      NOT NULL,
  quantity   INT           NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ===== STEP 4: CREATE INDEXES =====

CREATE INDEX idx_orders_customer_id  ON orders(customer_id);
CREATE INDEX idx_orders_order_date   ON orders(order_date);
CREATE INDEX idx_products_category   ON products(category_id);
CREATE INDEX idx_items_order_id      ON order_items(order_id);
CREATE INDEX idx_items_product_id    ON order_items(product_id);

-- ===== STEP 5: INSERT CATEGORIES =====

INSERT INTO categories (id, name, slug) VALUES
  (UUID(), 'Apparel',          'apparel'),
  (UUID(), 'Beauty',           'beauty'),
  (UUID(), 'Electronics',      'electronics'),
  (UUID(), 'Home & Kitchen',   'home-kitchen'),
  (UUID(), 'Sports & Outdoors','sports-outdoors'),
  (UUID(), 'Toys & Games',     'toys-games');

-- ===== STEP 6: INSERT PRODUCTS =====

INSERT INTO products (id, name, category_id, price, cost)
SELECT UUID(), v.name, c.id, v.price, v.cost
FROM (
  SELECT '4K Monitor'            AS name, 'electronics'      AS cat_slug, 349.99 AS price, 180.00 AS cost UNION ALL
  SELECT 'Adjustable Dumbbells',         'sports-outdoors',              199.99,           90.00          UNION ALL
  SELECT 'Air Fryer',                    'home-kitchen',                  99.99,           40.00          UNION ALL
  SELECT 'Bluetooth Speaker',            'electronics',                   79.99,           30.00          UNION ALL
  SELECT 'Board Game',                   'toys-games',                    34.99,           12.00          UNION ALL
  SELECT 'Building Blocks',              'toys-games',                    49.99,           18.00          UNION ALL
  SELECT 'Camping Tent',                 'sports-outdoors',              159.99,           70.00          UNION ALL
  SELECT 'Chefs Knife',                  'home-kitchen',                  59.99,           22.00          UNION ALL
  SELECT 'Cotton T-Shirt',               'apparel',                       24.99,            8.00          UNION ALL
  SELECT 'Denim Jacket',                 'apparel',                       89.99,           35.00          UNION ALL
  SELECT 'Espresso Machine',             'home-kitchen',                 299.99,          120.00          UNION ALL
  SELECT 'Hair Dryer',                   'beauty',                        89.99,           35.00          UNION ALL
  SELECT 'Matte Lipstick',               'beauty',                        18.99,            5.00          UNION ALL
  SELECT 'Moisturizer',                  'beauty',                        27.99,            9.00          UNION ALL
  SELECT 'Mountain Bike',                'sports-outdoors',              599.99,          280.00          UNION ALL
  SELECT 'Nonstick Cookware Set',        'home-kitchen',                 149.99,           60.00          UNION ALL
  SELECT 'Plush Toy',                    'toys-games',                    19.99,            6.00          UNION ALL
  SELECT 'Remote Car',                   'toys-games',                    44.99,           16.00          UNION ALL
  SELECT 'Running Shoes',                'apparel',                      119.99,           45.00          UNION ALL
  SELECT 'Smart Watch',                  'electronics',                  199.99,           80.00          UNION ALL
  SELECT 'Vitamin C Serum',              'beauty',                        34.99,           10.00          UNION ALL
  SELECT 'Wireless Headphones',          'electronics',                  129.99,           55.00          UNION ALL
  SELECT 'Wool Sweater',                 'apparel',                       69.99,           28.00          UNION ALL
  SELECT 'Yoga Mat',                     'sports-outdoors',               39.99,           14.00
) AS v
JOIN categories c ON c.slug = v.cat_slug;

-- ===== STEP 7: GENERATE CUSTOMERS =====

INSERT INTO customers (id, name, email)
WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 200
)
SELECT UUID(), CONCAT('Customer ', n), CONCAT('customer', n, '@example.com')
FROM nums;

-- ===== STEP 8: GENERATE ORDERS & ORDER ITEMS =====
-- Uses a stored procedure so MySQL can loop over customers.

DROP PROCEDURE IF EXISTS generate_orders;

DELIMITER //

CREATE PROCEDURE generate_orders()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_customer_id CHAR(36);
  DECLARE v_order_id    CHAR(36);
  DECLARE v_product_id  CHAR(36);
  DECLARE v_price       DECIMAL(10,2);
  DECLARE v_qty         INT;
  DECLARE v_total       DECIMAL(12,2);
  DECLARE v_order_date  DATETIME;
  DECLARE v_num_orders  INT;
  DECLARE v_num_items   INT;
  DECLARE v_first_date  DATE;
  DECLARE cust_cur CURSOR FOR SELECT id FROM customers;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cust_cur;

  customer_loop: LOOP
    FETCH cust_cur INTO v_customer_id;
    IF done THEN LEAVE customer_loop; END IF;

    -- Realistic mix:
    --   ~35% customers get 1 order  (one-time buyers)
    --   ~40% customers get 2-5 orders (repeat)
    --   ~25% customers get 6-20 orders (loyal)
    SET @r = FLOOR(RAND() * 100);
    IF @r < 35 THEN
      SET v_num_orders = 1;
    ELSEIF @r < 75 THEN
      SET v_num_orders = 2 + FLOOR(RAND() * 4);   -- 2 to 5
    ELSE
      SET v_num_orders = 6 + FLOOR(RAND() * 15);  -- 6 to 20
    END IF;

    SET v_first_date = NULL;

    order_loop: WHILE v_num_orders > 0 DO
      -- Random date between Jan 2023 and Jun 2025
      SET v_order_date = DATE_ADD(
        '2023-01-01',
        INTERVAL FLOOR(RAND() * 880) DAY
      );
      SET v_order_date = DATE_ADD(v_order_date, INTERVAL FLOOR(RAND() * 86400) SECOND);

      IF v_first_date IS NULL OR DATE(v_order_date) < v_first_date THEN
        SET v_first_date = DATE(v_order_date);
      END IF;

      SET v_order_id = UUID();
      INSERT INTO orders (id, customer_id, order_date, total, status)
      VALUES (v_order_id, v_customer_id, v_order_date, 0, 'completed');

      -- 1 to 4 items per order
      SET v_num_items = 1 + FLOOR(RAND() * 4);
      SET v_total = 0;

      WHILE v_num_items > 0 DO
        SELECT id, price INTO v_product_id, v_price
        FROM products ORDER BY RAND() LIMIT 1;

        SET v_qty = 1 + FLOOR(RAND() * 3);
        SET v_total = v_total + (v_price * v_qty);

        INSERT INTO order_items (id, order_id, product_id, quantity, unit_price)
        VALUES (UUID(), v_order_id, v_product_id, v_qty, v_price);

        SET v_num_items = v_num_items - 1;
      END WHILE;

      UPDATE orders SET total = v_total WHERE id = v_order_id;
      SET v_num_orders = v_num_orders - 1;
    END WHILE order_loop;

    UPDATE customers SET first_order_date = v_first_date WHERE id = v_customer_id;

  END LOOP customer_loop;

  CLOSE cust_cur;
END //

DELIMITER ;

-- Run the generator (this may take 10-30 seconds)
CALL generate_orders();

-- Clean up the procedure
DROP PROCEDURE IF EXISTS generate_orders;

-- ===== STEP 9: VERIFY DATA =====

SELECT 'categories'  AS table_name, COUNT(*) AS row_count FROM categories  UNION ALL
SELECT 'products',                   COUNT(*)              FROM products     UNION ALL
SELECT 'customers',                  COUNT(*)              FROM customers    UNION ALL
SELECT 'orders',                     COUNT(*)              FROM orders       UNION ALL
SELECT 'order_items',                COUNT(*)              FROM order_items;

-- Expected output:
-- categories  → 6
-- products    → 24
-- customers   → 200
-- orders      → ~1,500 to 2,500
-- order_items → ~3,000 to 6,000

-- ===== DONE! =====
