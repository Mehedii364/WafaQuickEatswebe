<?php
/**
 * Wafa QuickEats ⚡ - Generate & Retrieve Server Invoice API
 * Method: GET
 * Params: ?invoice_number=WQE-INV-20260930-000125 or ?order_id=WQE-ORD-2026-0042
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

$user = Auth::requireRole(['customer', 'restaurant_manager', 'rider', 'admin', 'super_admin']);

$orderId = $_GET['order_id'] ?? '';
$invNum  = $_GET['invoice_number'] ?? '';

if (empty($orderId) && empty($invNum)) {
    ApiResponse::error('Order ID or Invoice Number required', ['missing_param'], 422);
}

$db = Database::getConnection();

$sql = 'SELECT o.*, r.name as restaurant_name, r.address as restaurant_address, r.phone as restaurant_phone, u.name as customer_name, u.phone as customer_phone, ru.name as rider_name, ru.phone as rider_phone FROM orders o JOIN restaurants r ON o.restaurant_id = r.id JOIN users u ON o.customer_id = u.id LEFT JOIN riders rd ON o.rider_id = rd.id LEFT JOIN users ru ON rd.user_id = ru.id WHERE 1=1';

$params = [];
if (!empty($orderId)) {
    $sql .= ' AND o.id = :oid';
    $params[':oid'] = $orderId;
} else {
    $sql .= ' AND o.invoice_number = :inv';
    $params[':inv'] = $invNum;
}

$stmt = $db->prepare($sql);
$stmt->execute($params);
$order = $stmt->fetch();

if (!$order) {
    ApiResponse::notFound('Invoice record not found');
}

// Fetch items
$itemStmt = $db->prepare('SELECT name, quantity, unit_price, total_price, selected_variant_json, selected_addons_json, special_instructions FROM order_items WHERE order_id = :oid');
$itemStmt->execute([':oid' => $order['id']]);
$items = $itemStmt->fetchAll();

ApiResponse::success('Invoice retrieved successfully', [
    'invoice_number' => $order['invoice_number'],
    'order_id'       => $order['id'],
    'date'           => $order['created_at'],
    'branding'       => [
        'name'    => 'Wafa QuickEats ⚡',
        'brand'   => 'Wafa Zone by Mehedi364',
        'domain'  => 'wafaquickeats.site.je',
        'tagline' => 'Fast Food. Live Tracking. Smart Delivery.'
    ],
    'restaurant' => [
        'name'    => $order['restaurant_name'],
        'address' => $order['restaurant_address'],
        'phone'   => $order['restaurant_phone']
    ],
    'customer' => [
        'name'             => $order['customer_name'],
        'phone'            => $order['customer_phone'],
        'delivery_address' => json_decode($order['delivery_address_json'], true)
    ],
    'rider' => $order['rider_name'] ? [
        'name'  => $order['rider_name'],
        'phone' => $order['rider_phone']
    ] : null,
    'items'        => $items,
    'subtotal'     => floatval($order['subtotal']),
    'discount'     => floatval($order['discount']),
    'points_discount' => floatval($order['points_discount']),
    'delivery_fee' => floatval($order['delivery_fee']),
    'service_fee'  => floatval($order['service_fee']),
    'tax_vat'      => floatval($order['tax_vat']),
    'grand_total'  => floatval($order['grand_total']),
    'payment'      => [
        'method' => $order['payment_method'],
        'status' => $order['payment_status']
    ],
    'immutable' => true
]);
