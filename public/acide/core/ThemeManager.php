<?php

require_once 'CRUDOperations.php';

class ThemeManager
{

    private $themesDir;
    private $crud;

    public function __construct()
    {
        $this->themesDir = dirname(dirname(__DIR__)) . '/themes';
        $this->crud = new CRUDOperations();
    }

    /**
     * List all installed themes with metadata
     */
    public function listThemes()
    {
        $themes = [];
        if (!is_dir($this->themesDir))
            return [];

        $dirs = array_filter(glob($this->themesDir . '/*'), 'is_dir');

        foreach ($dirs as $dir) {
            $jsonPath = $dir . '/theme.json';
            $folderName = basename($dir);

            if (file_exists($jsonPath)) {
                $metadata = json_decode(file_get_contents($jsonPath), true);
                $metadata['id'] = $folderName; // ID is the folder name

                // Add screenshot URL if exists
                if (file_exists($dir . '/screenshot.png')) {
                    $metadata['screenshot'] = "/themes/$folderName/screenshot.png";
                } else if (file_exists($dir . '/screenshot.jpg')) {
                    $metadata['screenshot'] = "/themes/$folderName/screenshot.jpg";
                }

                $themes[] = $metadata;
            }
        }

        return $themes;
    }

    /**
     * Activate a theme
     * 
     * @param string $themeId Folder name of the theme
     */
    public function activateTheme($themeId)
    {
        if (!is_dir($this->themesDir . '/' . $themeId)) {
            throw new Exception("Theme not found: $themeId");
        }

        // Get current settings to preserve other config
        try {
            $current = $this->crud->read('theme_settings', 'current');
        } catch (Exception $e) {
            $current = [];
        }

        $current['active_theme'] = $themeId;

        // Save
        return $this->crud->update('theme_settings', 'current', $current);
    }
}
