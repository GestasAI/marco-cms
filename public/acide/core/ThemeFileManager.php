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
        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT))) {
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
}
