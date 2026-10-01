<?php
/**
 * Wafa QuickEats ⚡ - Rider Live GPS Broadcaster API
 * Method: POST
 * Headers: Authorization: Bearer <rider_token>
 * Body: { "latitude": 23.7482, "longitude": 90.3735, "speed": 28, "bearing": 142, "accuracy": 4, "order_id": "..." }
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ApiResponse::error('Method not allowed', [], 405);
}

$user = Auth::requireRole(['rider', 'super_admin']);
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$lat      = floatval($input['latitude'] ?? 0);
$lng      = floatval($input['longitude'] ?? 0);
$speed    = intval($input['speed'] ?? 0);
$bearing  = intval($input['bearing'] ?? 0);
$accuracy = intval($input['accuracy'] ?? 5);
$orderId  = $input['order_id'] ?? null;

if ($lat == 0 || $lng == 0) {
    ApiResponse::error('Valid latitude and longitude required', ['invalid_coords'], 422);
}

$db = Database::getConnection();

// Update rider's current position
$upStmt = $db->prepare('UPDATE riders SET current_lat = :lat, current_lng = :lng, speed = :spd, bearing = :brg, accuracy = :acc, last_gps_update = CURRENT_TIMESTAMP WHERE user_id = :uid LIMIT 1');
$upStmt->execute([
    ':lat' => $lat,
    ':lng' => $lng,
    ':spd' => $speed,
    ':brg' => $bearing,
    ':acc' => $accuracy,
    ':uid' => $user['id']
]);

// Log GPS breadcrumb in history table
$rdrStmt = $db->prepare('SELECT id FROM riders WHERE user_id = :uid LIMIT 1');
$rdrStmt->execute([':uid' => $user['id']]);
$rider = $rdrStmt->fetch();

if ($rider) {
    $insGps = $db->prepare('INSERT INTO gps_locations (rider_id, order_id, latitude, longitude, speed, bearing, accuracy) VALUES (:rid, :oid, :lat, :lng, :spd, :brg, :acc)');
    $insGps->execute([
        ':rid' => $rider['id'],
        ':oid' => $orderId,
        ':lat' => $lat,
        ':lng' => $lng,
        ':spd' => $speed,
        ':brg' => $bearing,
        ':acc' => $accuracy
    ]);
}

ApiResponse::success('GPS position recorded', [
    'latitude'  => $lat,
    'longitude' => $lng,
    'speed'     => $speed,
    'timestamp' => date('c')
]);
