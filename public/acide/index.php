<?php
/**
 * ACIDE-PHP Bridge
 * Entry point for all Marco CMS frontend requests.
 */

// Enable CORS for development (Adjust in production if needed)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define Constants
define('ACIDE_ROOT', __DIR__);
define('DATA_ROOT', dirname(__DIR__) . '/data');

// Autoload core classes
require_once ACIDE_ROOT . '/core/Utils.php';
require_once ACIDE_ROOT . '/core/ACIDE.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Utils::sendError("Only POST requests are allowed.", 405);
}

// Parse Input
// 1. Try JSON Body
$inputJSON = file_get_contents('php://input');
$request = json_decode($inputJSON, true);

// 2. If JSON is empty/invalid, check for $_POST/$_FILES (Multipart Form Data)
if ((!$request || !is_array($request)) && (!empty($_POST) || !empty($_FILES))) {
    $request = $_POST; // Pass POST data as request array
}

// 3. Final Validation
if ((!$request || !is_array($request)) && empty($_FILES)) {
    Utils::sendError("Invalid payload. Send JSON or Multipart Data.", 400);
}

// Instantiate and Run ACIDE
try {
    $acide = new ACIDE();
    $result = $acide->execute($request ?? []); // Pass empty array if request is null but files exist

    Utils::sendResponse([
        'status' => 'success',
        'data' => $result
    ]);
} catch (Exception $e) {
    Utils::sendError($e->getMessage(), 500);
}
