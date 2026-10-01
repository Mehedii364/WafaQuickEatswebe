<?php
/**
 * Wafa QuickEats ⚡ - Restaurants Discovery API
 * Method: GET
 * Query params: category, search, open_now, rating
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/response.php';

$category = $_GET['category'] ?? '';
$search   = trim($_GET['search'] ?? '');
$openNow  = isset($_GET['open_now']) && $_GET['open_now'] === '1';

$db = Database::getConnection();

$sql = 'SELECT id, name, name_bn, tagline, logo, cover_image, phone, email, address, latitude, longitude, rating, review_count, delivery_fee, min_order, estimated_prep_time, status, is_verified, is_featured, offer_badge FROM restaurants WHERE 1=1';
$params = [];

if ($openNow) {
    $sql .= ' AND status = "open"';
}

if (!empty($search)) {
    $sql .= ' AND (name LIKE :s1 OR name_bn LIKE :s2 OR address LIKE :s3)';
    $term = '%' . $search . '%';
    $params[':s1'] = $term;
    $params[':s2'] = $term;
    $params[':s3'] = $term;
}

$sql .= ' ORDER BY is_featured DESC, rating DESC';

$stmt = $db->prepare($sql);
$stmt->execute($params);
$restaurants = $stmt->fetchAll();

ApiResponse::success('Restaurants retrieved successfully', [
    'restaurants' => $restaurants,
    'total'       => count($restaurants)
]);
