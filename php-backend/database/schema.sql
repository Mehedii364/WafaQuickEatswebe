-- =====================================================================
-- WAFA QUICKEATS ⚡ - PRODUCTION DATABASE SCHEMA
-- Brand: Wafa Zone by Mehedi364
-- Developer: Md. Mehedi Hasan (Mehedi364)
-- Official Domain: wafaquickeats.site.je
-- Compatible with: MySQL 8.x / MariaDB 10.x / InfinityFree / cPanel
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00"; -- Bangladesh Standard Time

-- ---------------------------------------------------------------------
-- 1. Table: users (Core Authentication)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(32) NOT NULL, -- e.g. WQE-USR-100234
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(25) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'restaurant_manager', 'rider', 'admin', 'super_admin') NOT NULL DEFAULT 'customer',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'pending', 'suspended') NOT NULL DEFAULT 'active',
  `email_verified_at` DATETIME DEFAULT NULL,
  `phone_verified_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: customers (Customer Profiles & Loyalty)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` VARCHAR(32) NOT NULL, -- WQE-CUS-100234
  `user_id` VARCHAR(32) NOT NULL UNIQUE,
  `points_balance` INT NOT NULL DEFAULT 50,
  `tier` ENUM('silver', 'gold', 'platinum') NOT NULL DEFAULT 'silver',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: saved_locations (Customer Address Book with GPS)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `saved_locations`;
CREATE TABLE `saved_locations` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `customer_id` VARCHAR(32) NOT NULL,
  `label` ENUM('Home', 'Office', 'Other') NOT NULL DEFAULT 'Home',
  `full_address` TEXT NOT NULL,
  `building` VARCHAR(100) DEFAULT NULL,
  `floor` VARCHAR(50) DEFAULT NULL,
  `flat` VARCHAR(50) DEFAULT NULL,
  `landmark` VARCHAR(150) DEFAULT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `delivery_instructions` TEXT DEFAULT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cust_loc` (`customer_id`),
  CONSTRAINT `fk_saved_loc_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: restaurants (Merchant Kitchens)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id` VARCHAR(32) NOT NULL, -- WQE-RES-100101
  `owner_user_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `name_bn` VARCHAR(150) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `review_count` INT NOT NULL DEFAULT 0,
  `delivery_fee` DECIMAL(8, 2) NOT NULL DEFAULT 40.00,
  `min_order` DECIMAL(8, 2) NOT NULL DEFAULT 200.00,
  `estimated_prep_time` INT NOT NULL DEFAULT 20, -- minutes
  `status` ENUM('open', 'closed', 'busy', 'temp_closed') NOT NULL DEFAULT 'open',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `offer_badge` VARCHAR(100) DEFAULT NULL,
  `opening_hours` VARCHAR(100) DEFAULT '11:00 AM - 11:00 PM',
  `trade_license` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_res_status` (`status`),
  INDEX `idx_res_coords` (`latitude`, `longitude`),
  CONSTRAINT `fk_res_owner` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: food_categories
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `food_categories`;
CREATE TABLE `food_categories` (
  `id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(10) DEFAULT '🍲',
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: foods (Menu Items)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `foods`;
CREATE TABLE `foods` (
  `id` VARCHAR(32) NOT NULL, -- WQE-FOD-001
  `restaurant_id` VARCHAR(32) NOT NULL,
  `category_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `name_bn` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `description_bn` TEXT DEFAULT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  `discount_price` DECIMAL(8, 2) DEFAULT NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `preparation_time` INT NOT NULL DEFAULT 15,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_food_restaurant` (`restaurant_id`),
  INDEX `idx_food_category` (`category_id`),
  CONSTRAINT `fk_food_res` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_food_cat` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: food_photos (Practical Unlimited Photos Support)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `food_photos`;
CREATE TABLE `food_photos` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `food_id` VARCHAR(32) NOT NULL,
  `photo_url` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_photo_food` (`food_id`),
  CONSTRAINT `fk_photo_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: food_variants (Half / Full / Portions)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `food_variants`;
CREATE TABLE `food_variants` (
  `id` VARCHAR(32) NOT NULL,
  `food_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(100) DEFAULT NULL,
  `price_delta` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  INDEX `idx_var_food` (`food_id`),
  CONSTRAINT `fk_var_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: food_addons (Extra Borhani, Boiled Egg, Salad)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `food_addons`;
CREATE TABLE `food_addons` (
  `id` VARCHAR(32) NOT NULL,
  `food_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(100) DEFAULT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_addon_food` (`food_id`),
  CONSTRAINT `fk_addon_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table: riders (Delivery Fleet)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `riders`;
CREATE TABLE `riders` (
  `id` VARCHAR(32) NOT NULL, -- WQE-RDR-300789
  `user_id` VARCHAR(32) NOT NULL UNIQUE,
  `vehicle_type` ENUM('Bike', 'Bicycle', 'Scooter') NOT NULL DEFAULT 'Bike',
  `vehicle_plate` VARCHAR(50) NOT NULL,
  `is_online` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('verified', 'pending', 'under_review', 'rejected', 'suspended') NOT NULL DEFAULT 'pending',
  `current_lat` DECIMAL(10, 7) NOT NULL,
  `current_lng` DECIMAL(10, 7) NOT NULL,
  `bearing` INT NOT NULL DEFAULT 0,
  `speed` INT NOT NULL DEFAULT 0, -- km/h
  `accuracy` INT NOT NULL DEFAULT 5, -- meters
  `last_gps_update` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `total_deliveries` INT NOT NULL DEFAULT 0,
  `points` INT NOT NULL DEFAULT 0,
  `today_earnings` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `active_order_id` VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_rider_status` (`status`, `is_online`),
  CONSTRAINT `fk_rider_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Table: orders (Core Order Lifecycle)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(32) NOT NULL, -- WQE-ORD-2026-0042
  `invoice_number` VARCHAR(32) NOT NULL UNIQUE, -- WQE-INV-20260930-000125
  `customer_id` VARCHAR(32) NOT NULL,
  `restaurant_id` VARCHAR(32) NOT NULL,
  `rider_id` VARCHAR(32) DEFAULT NULL,
  `status` ENUM(
    'placed',
    'restaurant_accepted',
    'preparing',
    'ready_for_pickup',
    'rider_assigned',
    'rider_accepted',
    'pickup_completed',
    'on_the_way',
    'arrived',
    'delivered',
    'cancelled',
    'failed_delivery'
  ) NOT NULL DEFAULT 'placed',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `points_discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(8, 2) NOT NULL DEFAULT 40.00,
  `service_fee` DECIMAL(8, 2) NOT NULL DEFAULT 15.00,
  `tax_vat` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `grand_total` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('cod', 'bkash', 'nagad', 'rocket', 'card') NOT NULL DEFAULT 'cod',
  `payment_status` ENUM('pending', 'processing', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `delivery_address_json` TEXT NOT NULL,
  `otp` VARCHAR(4) NOT NULL,
  `distance_km` DECIMAL(5, 2) NOT NULL DEFAULT 2.00,
  `estimated_prep_time` INT NOT NULL DEFAULT 20,
  `estimated_delivery_minutes` INT NOT NULL DEFAULT 35,
  `cancellation_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_customer` (`customer_id`),
  INDEX `idx_order_restaurant` (`restaurant_id`),
  INDEX `idx_order_rider` (`rider_id`),
  CONSTRAINT `fk_ord_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_ord_res` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_ord_rider` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. Table: order_items
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `order_id` VARCHAR(32) NOT NULL,
  `food_id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(8, 2) NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `selected_variant_json` TEXT DEFAULT NULL,
  `selected_addons_json` TEXT DEFAULT NULL,
  `special_instructions` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_item_order` (`order_id`),
  CONSTRAINT `fk_item_ord` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. Table: order_timeline (State Transition Audit)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `order_timeline`;
CREATE TABLE `order_timeline` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `order_id` VARCHAR(32) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `note` TEXT DEFAULT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ot_order` (`order_id`),
  CONSTRAINT `fk_ot_ord` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. Table: gps_locations (Secure Real-Time Fleet Tracking)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `gps_locations`;
CREATE TABLE `gps_locations` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `rider_id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) DEFAULT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `speed` INT NOT NULL DEFAULT 0,
  `bearing` INT NOT NULL DEFAULT 0,
  `accuracy` INT NOT NULL DEFAULT 5,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_gps_rider` (`rider_id`),
  INDEX `idx_gps_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 15. Table: rider_notes
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `rider_notes`;
CREATE TABLE `rider_notes` (
  `id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) NOT NULL,
  `rider_id` VARCHAR(32) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `details` TEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `visibility` ENUM('admin_only', 'staff_only', 'customer_visible') NOT NULL DEFAULT 'customer_visible',
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_rn_order` (`order_id`),
  INDEX `idx_rn_rider` (`rider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 16. Table: delivery_incidents
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `delivery_incidents`;
CREATE TABLE `delivery_incidents` (
  `id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) NOT NULL,
  `rider_id` VARCHAR(32) NOT NULL,
  `incident_type` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('reported', 'under_review', 'resolved', 'dismissed') NOT NULL DEFAULT 'reported',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_inc_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 17. Table: points_ledger (Immutable Loyalty Account)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `points_ledger`;
CREATE TABLE `points_ledger` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `customer_id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) DEFAULT NULL,
  `points_change` INT NOT NULL, -- positive for earn, negative for redeem
  `balance_after` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pl_cust` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 18. Table: coupons
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `code` VARCHAR(32) NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` DECIMAL(8, 2) NOT NULL,
  `min_order` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `max_discount` DECIMAL(8, 2) DEFAULT NULL,
  `usage_count` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `valid_until` DATE NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `description_bn` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 19. Table: ratings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
  `id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) NOT NULL UNIQUE,
  `customer_id` VARCHAR(32) NOT NULL,
  `restaurant_id` VARCHAR(32) NOT NULL,
  `rider_id` VARCHAR(32) DEFAULT NULL,
  `food_rating` INT NOT NULL DEFAULT 5,
  `packaging_rating` INT NOT NULL DEFAULT 5,
  `rider_rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_rat_res` (`restaurant_id`),
  INDEX `idx_rat_rider` (`rider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 20. Table: support_tickets & messages
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets` (
  `id` VARCHAR(32) NOT NULL,
  `user_id` VARCHAR(32) NOT NULL,
  `order_id` VARCHAR(32) DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  `status` ENUM('open', 'in_progress', 'waiting', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_st_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `support_messages`;
CREATE TABLE `support_messages` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `ticket_id` VARCHAR(32) NOT NULL,
  `sender_type` ENUM('user', 'support_admin') NOT NULL,
  `sender_name` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sm_ticket` (`ticket_id`),
  CONSTRAINT `fk_sm_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 21. Table: audit_logs (Security & Root Tracking)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `actor` VARCHAR(100) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target` VARCHAR(100) NOT NULL,
  `target_id` VARCHAR(50) NOT NULL,
  `old_value` TEXT DEFAULT NULL,
  `new_value` TEXT DEFAULT NULL,
  `reason` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_al_action` (`action`),
  INDEX `idx_al_target` (`target`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 22. Table: ai_providers (Configurable LLM Gateways)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_providers`;
CREATE TABLE `ai_providers` (
  `id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('FREE', 'PREMIUM') NOT NULL DEFAULT 'FREE',
  `endpoint` VARCHAR(255) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `api_key` TEXT DEFAULT NULL,
  `priority` INT NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `timeout_ms` INT NOT NULL DEFAULT 8000,
  `last_test_status` ENUM('success', 'failed', 'untested') DEFAULT 'untested',
  `last_latency_ms` INT DEFAULT NULL,
  `last_tested_at` DATETIME DEFAULT NULL,
  `last_error_message` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED INITIAL AUTHENTIC PRODUCTION DATA
-- =====================================================================

-- Passwords hashed with bcrypt (Default password for all demo accounts: Wafa@2026)
-- Hash: $2y$10$w8.gZ0N9oZ.KjE/e7XzXae3fO6Y4uM7Vw3F3J8e6s.vQe7u1C2D4e
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `status`) VALUES
('WQE-USR-ADM01', 'Md. Mehedi Hasan (Mehedi364)', 'admin@wafaquickeats.site.je', '+8801712000000', '$2y$10$w8.gZ0N9oZ.KjE/e7XzXae3fO6Y4uM7Vw3F3J8e6s.vQe7u1C2D4e', 'super_admin', 'active'),
('WQE-USR-CUS01', 'Md. Mehedi Hasan', 'customer@wafaquickeats.site.je', '+8801712345678', '$2y$10$w8.gZ0N9oZ.KjE/e7XzXae3fO6Y4uM7Vw3F3J8e6s.vQe7u1C2D4e', 'customer', 'active'),
('WQE-USR-RES01', 'Sultan’s Dine Kitchen Manager', 'sultans@wafaquickeats.site.je', '+8801711234567', '$2y$10$w8.gZ0N9oZ.KjE/e7XzXae3fO6Y4uM7Vw3F3J8e6s.vQe7u1C2D4e', 'restaurant_manager', 'active'),
('WQE-USR-RDR01', 'Tanvir Ahmed (Rider Pilot)', 'tanvir@wafaquickeats.site.je', '+8801845678901', '$2y$10$w8.gZ0N9oZ.KjE/e7XzXae3fO6Y4uM7Vw3F3J8e6s.vQe7u1C2D4e', 'rider', 'active');

INSERT INTO `customers` (`id`, `user_id`, `points_balance`, `tier`) VALUES
('WQE-CUS-100234', 'WQE-USR-CUS01', 480, 'gold');

INSERT INTO `saved_locations` (`customer_id`, `label`, `full_address`, `building`, `floor`, `flat`, `latitude`, `longitude`, `is_default`) VALUES
('WQE-CUS-100234', 'Home', 'Apartment 4B, House 12, Road 7A, Dhanmondi R/A, Dhaka', 'Green Heritage', '4th Floor', '4B', 23.7460000, 90.3755000, 1);

INSERT INTO `restaurants` (`id`, `owner_user_id`, `name`, `name_bn`, `tagline`, `logo`, `cover_image`, `phone`, `email`, `address`, `latitude`, `longitude`, `rating`, `review_count`, `delivery_fee`, `min_order`, `estimated_prep_time`, `status`, `is_verified`, `is_featured`, `offer_badge`) VALUES
('WQE-RES-101', 'WQE-USR-RES01', 'Sultan\'s Dine', 'সুলতান্স ডাইন', 'The King of Kacchi in Dhaka', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200', '+8801711234567', 'sultans@wafaquickeats.site.je', 'Road 27, Dhanmondi, Dhaka', 23.7505000, 90.3742000, 4.85, 3420, 40.00, 250.00, 20, 'open', 1, 1, '20% OFF ON BORHANI COMBO'),
('WQE-RES-102', 'WQE-USR-RES01', 'Chillox Burgers', 'চিলক্স বার্গারস', 'Messy, Juicy, Legendary Patty Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200', '+8801819987654', 'chillox@wafaquickeats.site.je', 'Road 11, Banani, Dhaka', 23.7937000, 90.4066000, 4.75, 2890, 45.00, 200.00, 18, 'open', 1, 1, 'BUY 1 GET 1 WINGS');

INSERT INTO `food_categories` (`id`, `name`, `name_bn`, `icon`, `display_order`) VALUES
('cat-biryani', 'Biryani & Polao', 'বিরিয়ানি ও পোলাও', '🍲', 1),
('cat-burgers', 'Burgers & Fries', 'বার্গার ও ফ্রাইস', '🍔', 2),
('cat-kebabs', 'Kebab & Chaap', 'কাবাব ও চাপ', '🍢', 3);

INSERT INTO `foods` (`id`, `restaurant_id`, `category_id`, `name`, `name_bn`, `description`, `price`, `discount_price`, `is_available`, `preparation_time`, `is_popular`, `is_featured`) VALUES
('WQE-FOD-001', 'WQE-RES-101', 'cat-biryani', 'Bashmati Mutton Kacchi Platter', 'বাসমতী খাসির কাচ্চি প্ল্যাটার', 'Long grain Basmati rice with succulent tender mutton chunks, egg, and spiced potato.', 480.00, 440.00, 1, 20, 1, 1),
('WQE-FOD-003', 'WQE-RES-102', 'cat-burgers', 'Double Beef Naga Blast Burger', 'ডাবল বিফ নাগা ব্লাস্ট বার্গার', 'Double charcoal grilled beef patty with molten cheddar and Naga ghost pepper sauce.', 380.00, 340.00, 1, 15, 1, 1);

INSERT INTO `riders` (`id`, `user_id`, `vehicle_type`, `vehicle_plate`, `is_online`, `status`, `current_lat`, `current_lng`, `bearing`, `speed`, `accuracy`, `rating`, `total_deliveries`, `points`, `today_earnings`) VALUES
('WQE-RDR-300789', 'WQE-USR-RDR01', 'Bike', 'Dhaka Metro HA-42-9182', 1, 'verified', 23.7482000, 90.3735000, 142, 28, 4, 4.90, 412, 820, 1240.00);

INSERT INTO `coupons` (`code`, `discount_type`, `discount_value`, `min_order`, `max_discount`, `is_active`, `valid_until`, `description`, `description_bn`) VALUES
('WAFA50', 'percentage', 50.00, 300.00, 150.00, 1, '2026-12-31', '50% OFF up to ৳150', '৫০% ছাড় (সর্বোচ্চ ১৫০ টাকা)'),
('EATS100', 'fixed', 100.00, 400.00, NULL, 1, '2026-12-31', 'Flat ৳100 off on ৳400+', '৪০০ টাকার অর্ডারে ১০০ টাকা ছাড়');

INSERT INTO `ai_providers` (`id`, `name`, `category`, `endpoint`, `model`, `priority`, `is_active`, `timeout_ms`) VALUES
('prov-gemini', 'Google Gemini (Native Build API)', 'FREE', 'https://generativelanguage.googleapis.com/v1beta', 'gemini-2.5-flash', 1, 1, 8000),
('prov-openrouter', 'OpenRouter (Open Source LLMs)', 'PREMIUM', 'https://openrouter.ai/api/v1', 'meta-llama/llama-3.3-70b-instruct:free', 2, 1, 10000);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
