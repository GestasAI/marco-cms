<?php

require_once 'CRUDOperations.php';
require_once 'Auth.php';
require_once 'FileManager.php';
require_once 'QueryEngine.php';
require_once 'ThemeManager.php';
require_once 'ThemeFileManager.php';

class ACIDE
{

    private $crud;
    private $auth;
    private $fileManager;
    private $queryEngine;
    private $themeManager;
    private $themeFileManager;

    public function __construct()
    {
        $this->crud = new CRUDOperations();
        $this->auth = new Auth();
        $this->fileManager = new FileManager($this->crud);
        $this->queryEngine = new QueryEngine();
        $this->themeManager = new ThemeManager();
        $this->themeFileManager = new ThemeFileManager();
    }

    /**
     * Execute the request
     * 
     * @param array $request
     * @return mixed
     */
    public function execute($request)
    {
        // Enforce Authentication for ALL PHP operations
        // Since Reads are static, PHP is only used for Admin tasks.
        $user = $this->auth->validateRequest();
        if (!$user) {
            Utils::sendError("Unauthorized access.", 401);
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
                return $this->crud->read($collection, $id);

            case 'create':
            case 'update':
                if (!$collection)
                    throw new Exception("Collection is required.");
                if (!$id) {
                    $id = uniqid();
                }
                return $this->crud->update($collection, $id, $data);

            case 'list':
                if (!$collection)
                    throw new Exception("Collection is required.");
                return $this->crud->list($collection);

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

            default:
                throw new Exception("Unknown action: $action");
        }
    }
}