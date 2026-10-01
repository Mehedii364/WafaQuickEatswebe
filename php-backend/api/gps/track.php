<?php
/**
 * Wafa QuickEats ⚡ - Live Order Tracking API
 * Method: GET
 * Params: ?order_id=WQE-ORD-2026-0042
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

$user = Auth::requireRole(['customer', 'rider', 'restaurant_manager', 'admin', 'super_admin']);
$orderId = $_GET['order_id'] ?? '';

if (empty($orderId)) {
    ApiResponse::error('Order ID is required', ['missing_order_id'], 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('SELECT o.id, o.invoice_number, o.status, o.customer_id, o.restaurant_id, o.rider_id, o.delivery_address_json, o.otp, o.estimated_delivery_minutes, r.name as restaurant_name, r.address as restaurant_address, r.latitude as restaurant_lat, r.longitude as restaurant_lng, rd.current_lat as rider_lat, rd.current_lng as rider_lng, rd.speed as rider_speed, rd.bearing as rider_bearing, rd.accuracy as rider_accuracy, rd.last_gps_update, u.name as rider_name, u.phone as rider_phone FROM orders o JOIN restaurants r ON o.restaurant_id = r.id LEFT JOIN riders rd ON o.rider_id = rd.id LEFT JOIN users u ON rd.user_id = u.id WHERE o.id = :oid LIMIT 1');

$stmt->execute([':oid' => $orderId]);
$order = $stmt->fetch();

if (!$order) {
    ApiResponse::notFound('Order not found');
}

// Verification: If customer, ensure they own the order
if ($user['role'] === 'customer' && $order['customer_id'] !== $user['id']) {
    ApiResponse::forbidden('You are not authorized to track this delivery');
}

ApiResponse::success('Tracking data retrieved', [
    'order_id'       => $order['id'],
    'status'         => $order['status'],
    'otp'            => $order['otp'],
    'restaurant'     => [
        'name'      => $order['restaurant_name'],
        'latitude'  => floatval($order['restaurant_lat']),
        'longitude' => floatval($order['restaurant_lng'])
    ],
    'delivery_address' => json_decode($order['delivery_address_json'], true),
    'rider'          => $order['rider_id'] ? [
        'id'          => $order['rider_id'],
        'name'        => $order['rider_name'],
        'phone'       => $order['rider_phone'],
        'latitude'    => floatval($order['rider_lat']),
        'longitude'   => floatval($order['rider_lng']),
        'speed'       => intval($order['rider_speed']),
        'bearing'     => intval($order['rider_bearing']),
        'accuracy'    => intval($order['rider_accuracy']),
        'last_update' => $order['last_gps_update']
    ] : null
]);
