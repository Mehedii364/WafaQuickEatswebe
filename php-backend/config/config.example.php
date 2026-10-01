<?php
/**
 * Wafa QuickEats ⚡ - Configuration Template
 * Brand: Wafa Zone by Mehedi364
 * Copy this file to config.php and set your real database credentials.
 * Compatible with InfinityFree (e.g. sql100.infinityfree.com), cPanel, and shared hosting.
 */

// -------------------------------------------------------------
// Database Connection Settings (Do not assume localhost)
// -------------------------------------------------------------
define('DB_HOST', getenv('DB_HOST') ?: 'sqlXXX.infinityfree.com'); // e.g. sql204.epizy.com or localhost
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'if0_38000000_wafaquickeats');
define('DB_USER', getenv('DB_USER') ?: 'if0_38000000');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'YourDatabasePassword');

// -------------------------------------------------------------
// Application & Domain Settings
// -------------------------------------------------------------
define('APP_NAME', 'Wafa QuickEats ⚡');
define('APP_BRAND', 'Wafa Zone by Mehedi364');
define('APP_TAGLINE', 'Fast Food. Live Tracking. Smart Delivery.');
define('OFFICIAL_DOMAIN', 'wafaquickeats.site.je');
define('BASE_URL', getenv('BASE_URL') ?: 'https://wafaquickeats.site.je');
define('APP_ENV', 'production'); // 'development' or 'production'
define('APP_DEBUG', false);

// -------------------------------------------------------------
// Security & Authentication Secrets
// -------------------------------------------------------------
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'wafa_quickeats_super_secret_jwt_key_2026_mehedi364');
define('PASSWORD_PEPPER', 'wafa_zone_pepper_364');

// -------------------------------------------------------------
// External Service API Keys (Configured via Admin Portal)
// -------------------------------------------------------------
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
define('OPENROUTER_API_KEY', getenv('OPENROUTER_API_KEY') ?: '');
define('MAPS_API_KEY', getenv('MAPS_API_KEY') ?: ''); // OpenStreetMap / OSRM is default free provider
