# 🚀 Wafa QuickEats ⚡ - InfinityFree & cPanel Deployment Guide

**Brand:** Wafa Zone by Mehedi364  
**Developer:** Md. Mehedi Hasan (Mehedi364)  
**Tagline:** “Fast Food. Live Tracking. Smart Delivery.”  
**Official Domain:** `wafaquickeats.site.je`  

---

## 1. Prerequisites on InfinityFree or cPanel

* **Domain / Subdomain:** `wafaquickeats.site.je` configured in your account.
* **PHP Version:** PHP 8.1, 8.2, or 8.3 (configured in cPanel Select PHP Version).
* **MySQL Database:** 1 MySQL database created via control panel.
* **phpMyAdmin:** Access to phpMyAdmin to import tables.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Create MySQL Database in InfinityFree / cPanel
1. Log in to your InfinityFree client area or cPanel dashboard.
2. Go to **MySQL Databases**.
3. Create a new database named (e.g. `if0_38000000_wafaquickeats`).
4. Note your database credentials:
   - **MySQL Host:** (e.g. `sql204.infinityfree.com` or `sql300.epizy.com` — **Do NOT assume localhost on InfinityFree!**)
   - **Database Name:** `if0_38000000_wafaquickeats`
   - **MySQL Username:** `if0_38000000`
   - **MySQL Password:** `your_vpanel_password`

### Step 2: Import Database Schema
1. Open **phpMyAdmin** from your control panel.
2. Select your newly created database.
3. Click on the **Import** tab.
4. Choose the file: `php-backend/database/schema.sql`.
5. Click **Go / Import**.
6. All 38+ production tables will be created and seeded with Sultan's Dine, Chillox Burgers, Star Kabab, test riders, and coupons.

### Step 3: Configure `config.php`
1. Navigate to `php-backend/config/`.
2. Rename or copy `config.example.php` to `config.php`.
3. Open `config.php` and set your real database credentials:
   ```php
   define('DB_HOST', 'sql204.infinityfree.com'); // Your specific MySQL hostname
   define('DB_PORT', '3306');
   define('DB_NAME', 'if0_38000000_wafaquickeats');
   define('DB_USER', 'if0_38000000');
   define('DB_PASSWORD', 'YourPasswordHere');
   define('BASE_URL', 'https://wafaquickeats.site.je');
   ```

### Step 4: Upload to `htdocs/`
1. Connect via FTP (e.g. FileZilla) using your FTP Host, Username, and Password, or use cPanel File Manager.
2. Navigate to your domain's document root (usually `/htdocs` or `/public_html`).
3. Upload all files from `php-backend/` into `htdocs/`.
4. Upload the built frontend assets (or index.html with Vite build output).
5. Ensure `.htaccess` is uploaded to the root of `htdocs/`.

### Step 5: Enable Free SSL (HTTPS)
1. In InfinityFree, go to **Free SSL Certificates**.
2. Select `wafaquickeats.site.je` and choose **Let's Encrypt** or **ZeroSSL**.
3. Complete the CNAME DNS record verification and install the certificate with 1 click.

---

## 3. Default Demo Accounts

All demo accounts are created with password: `Wafa@2026`

* **Super Admin:** `admin@wafaquickeats.site.je` (Full platform control, audit logs, AI manager, verification)
* **Customer:** `customer@wafaquickeats.site.je` (Ordering, tracking, loyalty points)
* **Restaurant Manager:** `sultans@wafaquickeats.site.je` (Kitchen dashboard, menu editor, accept orders)
* **Rider Pilot:** `tanvir@wafaquickeats.site.je` (Live GPS broadcaster, OTP verification, rider notes)

---

## 4. API Endpoints Ready for Android App

All endpoints return JSON in the standard format:
* `POST /api/auth/login.php`
* `GET  /api/restaurants/index.php`
* `POST /api/orders/create.php`
* `GET  /api/gps/track.php?order_id=WQE-ORD-2026-0042`
* `POST /api/gps/update.php`
* `GET  /api/invoices/get.php?order_id=WQE-ORD-2026-0042`
