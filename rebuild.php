<?php
define('DATA_ROOT', __DIR__ . '/public/data');
require_once __DIR__ . '/public/acide/core/Utils.php';
require_once __DIR__ . '/public/acide/core/CRUDOperations.php';
require_once __DIR__ . '/public/acide/core/ThemeManager.php';
require_once __DIR__ . '/public/acide/core/ThemeFileManager.php';
require_once __DIR__ . '/public/acide/core/StaticGenerator.php';
require_once __DIR__ . '/public/acide/core/AIContentGenerator.php';

$crud = new CRUDOperations();
$generator = new StaticGenerator(
    __DIR__ . '/public/themes',
    DATA_ROOT,
    __DIR__ . '/public/dist',
    $crud
);

echo "Rebuilding site...\n";
$results = $generator->buildSite();
foreach ($results as $result) {
    echo $result . "\n";
}
