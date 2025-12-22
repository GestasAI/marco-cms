<?php

class Utils
{

    /**
     * Send a JSON response and exit
     * 
     * @param mixed $data Data to send
     * @param int $statusCode HTTP status code (default 200)
     */
    public static function sendResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Send an error response
     * 
     * @param string $message Error message
     * @param int $statusCode HTTP status code (default 500)
     * @param mixed $debugInfo Optional debug info
     */
    public static function sendError($message, $statusCode = 500, $debugInfo = null)
    {
        $response = [
            'status' => 'error',
            'message' => $message
        ];

        if ($debugInfo) {
            $response['debug'] = $debugInfo;
        }

        self::sendResponse($response, $statusCode);
    }
}
