<?php
/**
 * Wafa QuickEats ⚡ - Place Order API
 * Method: POST
 * Headers: Authorization: Bearer <token>
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ApiResponse::error('Method not allowed', [], 405);
}

$user = Auth::requireRole(['customer']);
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$restaurantId    = $input['restaurant_id'] ?? '';
$items           = $input['items'] ?? [];
$deliveryAddress = $input['delivery_address'] ?? [];
$paymentMethod   = $input['payment_method'] ?? 'cod';
$couponCode      = strtoupper(trim($input['coupon_code'] ?? ''));

if (empty($restaurantId) || empty($items) || empty($deliveryAddress)) {
    ApiResponse::error('Restaurant, items and delivery address are required', ['missing_fields'], 422);
}

$db = Database::getConnection();

// Verify restaurant
$resStmt = $db->prepare('SELECT id, name, phone, address, latitude, longitude, delivery_fee, estimated_prep_time, status FROM restaurants WHERE id = :id LIMIT 1');
$resStmt->execute([':id' => $restaurantId]);
$restaurant = $resStmt->fetch();

if (!$restaurant || $restaurant['status'] === 'closed') {
    ApiResponse::error('Restaurant is currently unavailable', ['restaurant_closed'], 400);
}

// Calculate subtotal
$subtotal = 0;
$processedItems = [];

foreach ($items as $item) {
    $foodStmt = $db->prepare('SELECT id, name, price, discount_price, is_available FROM foods WHERE id = :fid AND restaurant_id = :rid LIMIT 1');
    $foodStmt->execute([':fid' => $item['food_id'], ':rid' => $restaurantId]);
    $food = $foodStmt->fetch();

    if (!$food || !$food['is_available']) {
        ApiResponse::error('Item unavailable: ' . ($food['name'] ?? 'Item'), ['item_unavailable'], 400);
    }

    $unitPrice = $food['discount_price'] ?: $food['price'];
    $qty = max(1, intval($item['quantity'] ?? 1));
    $lineTotal = $unitPrice * $qty;
    $subtotal += $lineTotal;

    $processedItems[] = [
        'food_id'    => $food['id'],
        'name'       => $food['name'],
        'quantity'   => $qty,
        'unit_price' => $unitPrice,
        'total_price'=> $lineTotal
    ];
}

// Coupon validation
$discount = 0;
if (!empty($couponCode)) {
    $cpStmt = $db->prepare('SELECT code, discount_type, discount_value, min_order, max_discount, valid_until FROM coupons WHERE code = :c AND is_active = 1 LIMIT 1');
    $cpStmt->execute([':c' => $couponCode]);
    $coupon = $cpStmt->fetch();

    if ($coupon && $subtotal >= $coupon['min_order']) {
        if ($coupon['discount_type'] === 'percentage') {
            $discount = ($subtotal * $coupon['discount_value']) / 100;
            if ($coupon['max_discount']) {
                $discount = min($discount, $coupon['max_discount']);
            }
        } else {
            $discount = $coupon['discount_value'];
        }
    }
}

$deliveryFee = floatval($restaurant['delivery_fee']);
$serviceFee  = 15.00;
$taxVat      = round($subtotal * 0.05, 2); // 5% VAT
$grandTotal  = max(0, $subtotal - $discount + $deliveryFee + $serviceFee + $taxVat);

// Generate IDs
$orderId = 'WQE-ORD-' . date('Ymd') . '-' . substr(uniqid(), -4);
$invoiceNum = 'WQE-INV-' . date('Ymd') . '-' . rand(100000, 999999);
$otp = (string)rand(1000, 9999);

$db->beginTransaction();
try {
    $insOrder = $db->prepare('INSERT INTO orders (id, invoice_number, customer_id, restaurant_id, status, subtotal, discount, delivery_fee, service_fee, tax_vat, grand_total, payment_method, payment_status, delivery_address_json, otp, estimated_prep_time, estimated_delivery_minutes) VALUES (:id, :inv, :cid, :rid, "placed", :sub, :disc, :df, :sf, :tax, :gt, :pm, :ps, :addr, :otp, :ept, :edm)');

    $insOrder->execute([
        ':id'   => $orderId,
        ':inv'  => $invoiceNum,
        ':cid'  => $user['id'],
        ':rid'  => $restaurantId,
        ':sub'  => $subtotal,
        ':disc' => $discount,
        ':df'   => $deliveryFee,
        ':sf'   => $serviceFee,
        ':tax'  => $taxVat,
        ':gt'   => $grandTotal,
        ':pm'   => $paymentMethod,
        ':ps'   => $paymentMethod === 'cod' ? 'pending' : 'paid',
        ':addr' => json_encode($deliveryAddress),
        ':otp'  => $otp,
        ':ept'  => $restaurant['estimated_prep_time'],
        ':edm'  => $restaurant['estimated_prep_time'] + 15
    ]);

    // Insert order items
    $insItem = $db->prepare('INSERT INTO order_items (order_id, food_id, name, quantity, unit_price, total_price) VALUES (:oid, :fid, :name, :qty, :up, :tp)');
    foreach ($processedItems as $it) {
        $insItem->execute([
            ':oid'  => $orderId,
            ':fid'  => $it['food_id'],
            ':name' => $it['name'],
            ':qty'  => $it['quantity'],
            ':up'   => $it['unit_price'],
            ':tp'   => $it['total_price']
        ]);
    }

    // Insert timeline entry
    $insTime = $db->prepare('INSERT INTO order_timeline (order_id, status, note) VALUES (:oid, "placed", "Order submitted via API")');
    $insTime->execute([':oid' => $orderId]);

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    ApiResponse::error('Order creation failed: ' . $e->getMessage(), ['order_error'], 500);
}

ApiResponse::success('Order placed successfully', [
    'order_id'       => $orderId,
    'invoice_number' => $invoiceNum,
    'otp'            => $otp,
    'grand_total'    => $grandTotal,
    'status'         => 'placed'
], 201);
