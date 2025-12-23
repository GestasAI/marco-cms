<?php

require_once 'CRUDOperations.php';
require_once 'Auth.php';
require_once 'FileManager.php';
require_once 'QueryEngine.php';
require_once 'ThemeManager.php';
require_once 'ThemeFileManager.php';
require_once 'StaticGenerator.php';
require_once 'ElementRenderer.php';
require_once 'AIContentGenerator.php';

class ACIDE
{

    private $crud;
    private $auth;
    private $fileManager;
    private $queryEngine;
    private $themeManager;
    private $themeFileManager;
    private $staticGenerator;

    public function __construct()
    {
        $this->crud = new CRUDOperations();
        $this->auth = new Auth();
        $this->fileManager = new FileManager($this->crud);
        $this->queryEngine = new QueryEngine();
        $this->themeManager = new ThemeManager();
        $this->themeFileManager = new ThemeFileManager();
        $this->staticGenerator = new StaticGenerator(DATA_ROOT . '/../themes', DATA_ROOT, DATA_ROOT . '/../dist', $this->crud);
    }

    /**
     * Execute the request
     * 
     * @param array $request
     * @return mixed
     */
    public function execute($request)
    {
        // Forzar siempre salida UTF-8 para evitar errores de acentos
        header('Content-Type: application/json; charset=utf-8');

        // Public endpoints that don't require authentication
        $publicActions = ['get_active_theme_home', 'get_active_theme_id'];
        $action = isset($request['action']) ? $request['action'] : '';

        // Skip authentication for public endpoints
        if (!in_array($action, $publicActions)) {
            // Enforce Authentication for ALL other PHP operations
            $user = $this->auth->validateRequest();
            if (!$user) {
                Utils::sendError("Unauthorized access.", 401);
            }
        }


        // Handling Multipart/Form-Data (File Uploads)
        if (!empty($_FILES)) {
            $action = isset($_POST['action']) ? $_POST['action'] : 'upload';
            $collection = isset($_POST['collection']) ? $_POST['collection'] : null;
        } else {
            // Standard JSON Request
            if (!isset($request['action'])) {
                throw new Exception("Action is required.");
            }
            $action = $request['action'];
            $collection = isset($request['collection']) ? $request['collection'] : null;
            $id = isset($request['id']) ? $request['id'] : null;
            $data = isset($request['data']) ? $request['data'] : [];
            $params = isset($request['params']) ? $request['params'] : [];
        }

        switch ($action) {
            case 'upload':
                return $this->fileManager->upload($_FILES);

            case 'query':
                if (!$collection)
                    throw new Exception("Collection is required.");
                return $this->queryEngine->query($collection, $params);

            case 'list_themes':
                return $this->themeManager->listThemes();

            case 'get_active_theme_home':
                return $this->themeManager->getActiveThemeHome();

            case 'get_active_theme_id':
                return $this->themeManager->getActiveThemeId();

            case 'activate_theme':
                if (!isset($request['theme_id']))
                    throw new Exception("Theme ID is required.");
                return $this->themeManager->activateTheme($request['theme_id']);

            case 'get':
            case 'read':
                if (!$collection)
                    throw new Exception("Collection is required.");
                if (!$id)
                    throw new Exception("ID is required for read operations.");

                // Special case: If it's a page, check if it exists in the active theme
                if ($collection === 'pages') {
                    $activeThemeId = $this->themeManager->getActiveThemeId();
                    $themePage = $this->themeFileManager->loadThemePage($activeThemeId, $id);
                    if ($themePage) {
                        return $themePage;
                    }
                }

                return $this->crud->read($collection, $id);

            case 'create':
            case 'update':
                if (!$collection)
                    throw new Exception("Collection is required.");
                if (!$id) {
                    $id = uniqid();
                }

                // Special case: If it's a page, check if it exists in the active theme
                if ($collection === 'pages') {
                    $activeThemeId = $this->themeManager->getActiveThemeId();
                    $themePage = $this->themeFileManager->loadThemePage($activeThemeId, $id);
                    if ($themePage) {
                        $result = $this->themeFileManager->saveThemePage($activeThemeId, $id, $data);
                        // Trigger Rebuild
                        try {
                            $this->staticGenerator->buildSite();
                        } catch (Exception $e) {
                        }
                        return $result;
                    }
                }

                $result = $this->crud->update($collection, $id, $data);

                // Trigger Rebuild: Si actualizamos una página, regeneramos el sitio
                if ($collection === 'pages') {
                    try {
                        $this->staticGenerator->buildSite();
                    } catch (Exception $e) {
                        // Log error but don't stop the update
                    }
                }
                return $result;

            case 'list':
                if (!$collection)
                    throw new Exception("Collection is required.");

                $results = $this->crud->list($collection);

                // Special case: If listing pages, include theme-specific pages
                if ($collection === 'pages') {
                    $activeThemeId = $this->themeManager->getActiveThemeId();
                    $themePages = $this->themeFileManager->listThemePages($activeThemeId);

                    // Merge and avoid duplicates by ID
                    $existingIds = array_column($results, 'id');
                    foreach ($themePages as $tPage) {
                        if (!in_array($tPage['id'], $existingIds)) {
                            $results[] = $tPage;
                        }
                    }
                }

                return $results;

            case 'delete':
                if (!$collection)
                    throw new Exception("Collection is required.");
                if (!$id)
                    throw new Exception("ID is required for delete operations.");
                return $this->crud->delete($collection, $id);


            case 'save_theme_part':
                if (!isset($request['theme_id']))
                    throw new Exception("Theme ID is required.");
                if (!isset($request['part_name']))
                    throw new Exception("Part name is required.");
                return $this->themeFileManager->saveThemePart($request['theme_id'], $request['part_name'], $data);

            case 'load_theme_part':
                if (!isset($request['theme_id']))
                    throw new Exception("Theme ID is required.");
                if (!isset($request['part_name']))
                    throw new Exception("Part name is required.");
                return $this->themeFileManager->loadThemePart($request['theme_id'], $request['part_name']);

            case 'build_site':
                return $this->staticGenerator->buildSite();

            case 'generate_sitemap':
                $baseUrl = isset($request['base_url']) ? $request['base_url'] : 'https://example.com';
                return $this->staticGenerator->generateSitemap($baseUrl);

            default:
                throw new Exception("Unknown action: $action");
        }
    }
}
