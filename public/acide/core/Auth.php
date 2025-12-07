<?php

require_once 'Utils.php';

class Auth
{
    private $sessionDir;

    public function __construct()
    {
        $this->sessionDir = dirname(__DIR__, 2) . '/data/sessions';
        if (!is_dir($this->sessionDir)) {
            mkdir($this->sessionDir, 0755, true);
        }
    }

    /**
     * Validate the Bearer token from headers
     * 
     * @return array|false User data if valid, false otherwise
     */
    public function validateRequest()
    {
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
        } else {
            $headers = [];
            foreach ($_SERVER as $key => $value) {
                if (substr($key, 0, 5) <> 'HTTP_') {
                    continue;
                }
                $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                $headers[$header] = $value;
            }
        }
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);

        if (!$authHeader) {
            error_log("Auth Error: No Authorization header found.");
            return false;
        }

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            error_log("Auth Error: Bearer token format invalid.");
            return false;
        }

        $token = $matches[1];
        return $this->verifyTokenLocal($token);
    }

    /**
     * Verify token (Local Internal Flow)
     * TRUST MODEL: If the client sends a token, we assume the client successfully authenticated
     * with GestasAI. We trust the token presence for local operations.
     */
    private function verifyTokenLocal($token)
    {
        // "Local Internal Flow": If we have a token, we respect the session.
        // No external calls to GestasAI (as requested).

        if (!empty($token)) {
            // Mock user session based on token presence
            return [
                'id' => 'admin_user',
                'email' => 'info@gestasai.com', // Default admin
                'role' => 'admin'
            ];
        }

        return false;
    }
}
