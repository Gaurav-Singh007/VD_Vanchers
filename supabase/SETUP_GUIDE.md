# Database Setup Guide — MySQL Workbench

This guide walks you through setting up the database on your laptop using MySQL Workbench. Follow each step in order.

---

## Problem: "Available Products" List is Empty in MySQL Installer

If the MySQL Installer shows an empty "Available Products" list (like in your screenshot), it means the installer cannot connect to the internet to download the product list.

### Fix Option 1: Use a different network

The most common cause is a firewall or proxy blocking the download. Try:
1. Disconnect from your current Wi-Fi
2. Connect to a different network (mobile hotspot, different Wi-Fi, etc.)
3. Reopen MySQL Installer
4. The list should now populate

### Fix Option 2: Download MySQL separately (no installer needed)

Skip the MySQL Installer entirely and download the components individually:

1. **MySQL Server** — Download from: https://dev.mysql.com/downloads/installer/
   - Choose "mysql-installer-community-8.0.x.msi" (the larger ~400MB file, not the web installer)
   - This is a standalone installer that does not need internet during installation

2. **MySQL Workbench** — Download from: https://dev.mysql.com/downloads/workbench/
   - Download the .msi file for Windows
   - Install it separately

3. Run both installers. When MySQL Server asks for a root password, **write it down** — you will need it later.

### Fix Option 3: Use offline installer

If you previously downloaded the full installer (not the web installer):
1. Go to https://dev.mysql.com/downloads/installer/
2. Download "mysql-installer-community-8.0.x.msi" (the larger file, ~400MB)
3. This version includes all products bundled — no internet needed during install
4. Run it and select "Custom" installation type
5. Pick MySQL Server and MySQL Workbench from the list

---

## Step 1: Verify MySQL is Running

After installation:

1. Open Windows Start Menu
2. Search for "Services" and open it
3. Scroll down to find "MySQL80" (or similar)
4. Make sure its status says "Running"
5. If it says "Stopped", right-click and select "Start"

---

## Step 2: Open MySQL Workbench

1. Open MySQL Workbench from your Start Menu
2. You should see a connection box like "Local instance MySQL80" — click it
3. Enter the root password you set during installation
4. You should now see the main Workbench window with a query editor

If you do not see any connection:
1. Click the "+" button next to "MySQL Connections"
2. Connection Name: `Local MySQL`
3. Hostname: `127.0.0.1`
4. Port: `3306`
5. Username: `root`
6. Password: click "Store in Vault" and enter your root password
7. Click "Test Connection" — it should say "Successfully made the connection"
8. Click "OK"

---

## Step 3: Run the SQL Setup File

The file you need is called `setup_mysql.sql`. It is inside the `supabase` folder of your downloaded project.

### If your files are in OneDrive:

Your files are likely at a path like:
`C:\Users\YourName\OneDrive\Documents\project\supabase\setup_mysql.sql`

### To run it:

1. In MySQL Workbench, click **File > Open SQL Script** from the top menu
2. Navigate to your OneDrive folder and select `setup_mysql.sql`
3. The file will load into the editor
4. Click the **lightning bolt icon** (Execute SQL Script) in the toolbar — or press **Ctrl+Shift+Enter**
5. Wait for it to finish — it will take 10-30 seconds because it generates thousands of rows
6. In the **Output** panel at the bottom, you should see "Data generation complete!"

### If you get "file not found" or OneDrive sync issues:

Copy the `setup_mysql.sql` file to your Desktop first:
1. Open File Explorer
2. Navigate to your OneDrive folder, find the `supabase` folder
3. Copy `setup_mysql.sql` to your Desktop
4. In MySQL Workbench, open the file from your Desktop instead

---

## Step 4: Verify the Data

After running the file, check that your data is there:

1. In MySQL Workbench, click the "Create New SQL Tab" button (or press Ctrl+T)
2. Paste this query:

```sql
USE ecommerce_dashboard;

SELECT 'categories' AS table_name, COUNT(*) AS row_count FROM categories
UNION ALL
SELECT 'products',   COUNT(*) FROM products
UNION ALL
SELECT 'customers',  COUNT(*) FROM customers
UNION ALL
SELECT 'orders',     COUNT(*) FROM orders
UNION ALL
SELECT 'order_items',COUNT(*) FROM order_items;
```

3. Press **Ctrl+Enter** to run it
4. You should see results like:

| table_name   | row_count |
|-------------|-----------|
| categories  | 6         |
| products    | 24        |
| customers   | 200       |
| orders      | ~2,000    |
| order_items | ~5,000    |

If you see these numbers, your database is set up correctly.

---

## Step 5: Check the Repeat Customer Rate

The previous version had a bug where almost all customers had many orders, making the repeat rate 94.5%. This is now fixed — the new seed data creates a realistic mix:

- ~35% of customers are one-time buyers (1 order)
- ~40% are repeat buyers (2-5 orders)
- ~25% are loyal buyers (6-20 orders)

This gives a realistic repeat customer rate of around 60-70%.

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"

You entered the wrong password. Reset it:
1. Stop the MySQL service (Services > MySQL80 > Stop)
2. Open Command Prompt as Administrator
3. Run: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --skip-grant-tables`
4. Open another Command Prompt and run: `mysql -u root`
5. Run: `FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';`
6. Restart the MySQL service

### "Can't connect to MySQL server on '127.0.0.1'"

MySQL is not running. Open Services (Windows) and start "MySQL80".

### "DELIMITER" syntax error

This happens if you run the procedure part of the script line-by-line instead of as a full script. Always click the "Execute SQL Script" button (lightning bolt) to run the entire file at once, not just selected lines.

### "UUID() returns NULL"

Your MySQL version is too old. You need MySQL 8.0 or newer. Check your version:

```sql
SELECT VERSION();
```

### OneDrive file won't open

OneDrive sometimes keeps files "online-only" (not downloaded to your PC). Fix:
1. Open File Explorer, go to your OneDrive folder
2. Find `setup_mysql.sql`
3. Right-click it and select "Always keep on this device"
4. Wait for the green checkmark to appear
5. Try opening it in MySQL Workbench again

---

## Quick Reference

| What | Value |
|------|-------|
| Database name | `ecommerce_dashboard` |
| Default port | `3306` |
| Default user | `root` |
| SQL file (MySQL) | `supabase/setup_mysql.sql` |
| SQL file (PostgreSQL) | `supabase/setup.sql` |
| Expected rows after setup | ~7,000 total across 5 tables |

---

## Two SQL Files Available

| File | For | Database |
|------|-----|----------|
| `supabase/setup_mysql.sql` | MySQL Workbench | MySQL 8.0+ |
| `supabase/setup.sql` | pgAdmin / psql | PostgreSQL 12+ |

Use the one that matches the database you installed. Both create the same tables and data.
