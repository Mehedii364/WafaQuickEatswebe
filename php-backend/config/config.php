<?php
/**
 * Wafa QuickEats ⚡ - Production Configuration
 * Brand: Wafa Zone by Mehedi364
 * Developer: Md. Mehedi Hasan (Mehedi364)
 */

if (!defined('DB_HOST')) {
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: '3306');
    define('DB_NAME', getenv('DB_NAME') ?: 'wafa_quickeats');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');

    define('APP_NAME', 'Wafa QuickEats ⚡');
    define('APP_BRAND', 'Wafa Zone by Mehedi364');
    define('APP_TAGLINE', 'Fast Food. Live Tracking. Smart Delivery.');
    define('OFFICIAL_DOMAIN', 'wafaquickeats.site.je');
    define('BASE_URL', getenv('BASE_URL') ?: 'https://wafaquickeats.site.je');
    define('APP_ENV', 'production');
    define('APP_DEBUG', false);

    define('JWT_SECRET', getenv('JWT_SECRET') ?: 'wafa_quickeats_super_secret_jwt_key_2026_mehedi364');
    define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
    define('OPENROUTER_API_KEY', getenv('OPENROUTER_API_KEY') ?: '');
}
