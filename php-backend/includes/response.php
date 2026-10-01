<?php
/**
 * Wafa QuickEats ⚡ - Unified API Response Helper
 * Matches Exact Section 42 API response standard:
 * {
 *   "success": true,
 *   "message": "Operation completed successfully",
 *   "data": {},
 *   "errors": [],
 *   "pagination": {}
 * }
 */

class ApiResponse {
    public static function json(
        bool $success,
        string $message,
        $data = null,
        array $errors = [],
        int $statusCode = 200,
        array $pagination = []
    ): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

        $response = [
            'success'    => $success,
            'message'    => $message,
            'data'       => $data ?? new stdClass(),
            'errors'     => $errors,
            'pagination' => !empty($pagination) ? $pagination : new stdClass()
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(string $message = 'Success', $data = null, int $statusCode = 200, array $pagination = []): void {
        self::json(true, $message, $data, [], $statusCode, $pagination);
    }

    public static function error(string $message, array $errors = [], int $statusCode = 400): void {
        self::json(false, $message, null, $errors, $statusCode);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::error($message, ['unauthorized'], 401);
    }

    public static function forbidden(string $message = 'Forbidden'): void {
        self::error($message, ['forbidden'], 403);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, ['not_found'], 404);
    }
}
