<?php

class ThemeFileManager
{
    /**
     * Save a theme part (header, footer, etc.)
     * 
     * @param string $themeId
     * @param string $partName (header, footer, etc.)
     * @param array $data
     * @return array
     */
    public function saveThemePart($themeId, $partName, $data)
    {
        $themePath = dirname(DATA_ROOT) . '/themes/' . $themeId . '/parts';

        // Ensure parts directory exists
        if (!is_dir($themePath)) {
            mkdir($themePath, 0777, true);
        }

        $filePath = $themePath . '/' . $partName . '.json';

        // Save the file
        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            return [
                'success' => true,
                'message' => "Theme part '$partName' saved successfully",
                'path' => $filePath
            ];
        } else {
            throw new Exception("Failed to write theme part: $filePath");
        }
    }

    /**
     * Load a theme part
     * 
     * @param string $themeId
     * @param string $partName
     * @return array
     */
    public function loadThemePart($themeId, $partName)
    {
        $filePath = dirname(DATA_ROOT) . '/themes/' . $themeId . '/parts/' . $partName . '.json';

        if (!file_exists($filePath)) {
            throw new Exception("Theme part not found: $partName");
        }

        $content = file_get_contents($filePath);
        $data = json_decode($content, true);

        if ($data === null) {
            throw new Exception("Error decoding JSON from: $filePath");
        }

        return $data;
    }

    /**
     * Save a theme page
     * 
     * @param string $themeId
     * @param string $pageName
     * @param array $data
     * @return array
     */
    public function saveThemePage($themeId, $pageName, $data)
    {
        $themePath = dirname(DATA_ROOT) . '/themes/' . $themeId . '/pages';

        if (!is_dir($themePath)) {
            mkdir($themePath, 0777, true);
        }

        $filePath = $themePath . '/' . $pageName . '.json';

        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            return [
                'success' => true,
                'message' => "Theme page '$pageName' saved successfully",
                'path' => $filePath
            ];
        } else {
            throw new Exception("Failed to write theme page: $filePath");
        }
    }

    /**
     * Load a theme page
     * 
     * @param string $themeId
     * @param string $pageName
     * @return array|null
     */
    public function loadThemePage($themeId, $pageName)
    {
        $filePath = dirname(DATA_ROOT) . '/themes/' . $themeId . '/pages/' . $pageName . '.json';

        if (!file_exists($filePath)) {
            return null;
        }

        $content = file_get_contents($filePath);
        $data = json_decode($content, true);

        if ($data === null) {
            throw new Exception("Error decoding JSON from: $filePath");
        }

        return $data;
    }
    /**
     * List all pages in a theme
     * 
     * @param string $themeId
     * @return array
     */
    public function listThemePages($themeId)
    {
        $themePath = dirname(DATA_ROOT) . '/themes/' . $themeId . '/pages';
        $results = [];

        if (is_dir($themePath)) {
            $files = glob($themePath . '/*.json');
            foreach ($files as $file) {
                $content = file_get_contents($file);
                $data = json_decode($content, true);
                if ($data) {
                    $id = basename($file, '.json');
                    $data['id'] = $id;
                    $data['is_theme_page'] = true; // Flag to identify it's from theme
                    $results[] = $data;
                }
            }
        }

        return $results;
    }
}
