<?php
/**
 * Wafa QuickEats ⚡ - Super Admin Dashboard API
 * Method: GET
 * Headers: Authorization: Bearer <super_admin_token>
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

$user = Auth::requireRole(['admin', 'super_admin']);
$db = Database::getConnection();

// Real database KPIs
$orderStats = $db->query('SELECT COUNT(*) as total_orders, COALESCE(SUM(grand_total), 0) as total_sales, SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered_orders FROM orders')->fetch();

$riderStats = $db->query('SELECT COUNT(*) as total_riders, SUM(CASE WHEN is_online = 1 THEN 1 ELSE 0 END) as online_riders FROM riders')->fetch();

$resStats = $db->query('SELECT COUNT(*) as total_restaurants, SUM(CASE WHEN status = "open" THEN 1 ELSE 0 END) as open_restaurants, SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_restaurants FROM restaurants')->fetch();

// Recent Audit Logs
$auditLogs = $db->query('SELECT actor, actor_role, action, target, target_id, ip_address, timestamp FROM audit_logs ORDER BY id DESC LIMIT 10')->fetchAll();

ApiResponse::success('Admin statistics retrieved', [
    'kpis' => [
        'total_sales'      => floatval($orderStats['total_sales']),
        'total_orders'     => intval($orderStats['total_orders']),
        'delivered_orders' => intval($orderStats['delivered_orders']),
        'total_riders'     => intval($riderStats['total_riders']),
        'online_riders'    => intval($riderStats['online_riders']),
        'total_kitchens'   => intval($resStats['total_restaurants']),
        'open_kitchens'    => intval($resStats['open_restaurants']),
        'verified_kitchens'=> intval($resStats['verified_restaurants'])
    ],
    'recent_audit_logs' => $auditLogs,
    'server_time'       => date('c')
]);
