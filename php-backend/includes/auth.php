<?php
/**
 * Wafa QuickEats ⚡ - Authentication & RBAC Middleware
 * Validates Tokens, Sessions, and Role Permissions
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';

class Auth {
    public static function getUser(): ?array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        // Decode token payload (Format: userId:role:timestamp:hash)
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        $payloadJson = base64_decode($parts[0]);
        $signature = $parts[1];

        $expectedSig = hash_hmac('sha256', $payloadJson, JWT_SECRET);
        if (!hash_equals($expectedSig, $signature)) {
            return null;
        }

        $payload = json_decode($payloadJson, true);
        if (!$payload || !isset($payload['user_id'])) {
            return null;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT id, name, email, phone, role, status FROM users WHERE id = :id AND status = "active" LIMIT 1');
        $stmt->execute([':id' => $payload['user_id']]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public static function requireRole(array $allowedRoles): array {
        $user = self::getUser();
        if (!$user) {
            ApiResponse::unauthorized('Valid authentication token required');
        }

        if (!in_array($user['role'], $allowedRoles, true)) {
            ApiResponse::forbidden('You do not have permission to access this resource');
        }

        return $user;
    }

    public static function generateToken(string $userId, string $role): string {
        $payload = [
            'user_id' => $userId,
            'role'    => $role,
            'time'    => time(),
            'exp'     => time() + (86400 * 30) // 30 days
        ];
        $payloadJson = json_encode($payload);
        $signature = hash_hmac('sha256', $payloadJson, JWT_SECRET);

        return base64_encode($payloadJson) . '.' . $signature;
    }
}
