<?php
/**
 * Wafa QuickEats ⚡ - Authentication: Login API
 * Method: POST
 * Body: { "email_or_phone": "...", "password": "..." }
 */

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ApiResponse::error('Method not allowed', ['method_not_allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$identifier = trim($input['email_or_phone'] ?? '');
$password   = $input['password'] ?? '';

if (empty($identifier) || empty($password)) {
    ApiResponse::error('Email/phone and password are required', ['missing_fields'], 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('SELECT id, name, email, phone, password_hash, role, status, avatar FROM users WHERE email = :id1 OR phone = :id2 LIMIT 1');
$stmt->execute([':id1' => $identifier, ':id2' => $identifier]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    ApiResponse::error('Invalid credentials', ['invalid_credentials'], 401);
}

if ($user['status'] !== 'active') {
    ApiResponse::error('Account is currently ' . $user['status'], ['account_status'], 403);
}

$token = Auth::generateToken($user['id'], $user['role']);

// Log in audit logs
$logStmt = $db->prepare('INSERT INTO audit_logs (actor, actor_role, action, target, target_id, ip_address) VALUES (:act, :rol, "USER_LOGIN", "User", :tid, :ip)');
$logStmt->execute([
    ':act' => $user['name'],
    ':rol' => $user['role'],
    ':tid' => $user['id'],
    ':ip'  => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
]);

unset($user['password_hash']);

ApiResponse::success('Login successful', [
    'user'  => $user,
    'token' => $token
]);
