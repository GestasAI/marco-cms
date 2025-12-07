<?php

require_once 'Utils.php';

class CRUDOperations
{

    /**
     * Create or Update a document
     * 
     * @param string $collection
     * @param string $id
     * @param array $data
     * @return array The saved data
     */
    /**
     * Rebuilds the static index file for a collection.
     * This allows the frontend to fetch the list statically without PHP.
     * 
     * @param string $collection
     */
    private function rebuildIndex($collection)
    {
        $collectionPath = DATA_ROOT . '/' . $collection;
        if (!is_dir($collectionPath))
            return;

        $files = glob($collectionPath . '/*.json');
        $indexData = [];

        foreach ($files as $file) {
            $filename = basename($file);
            // Skip the index file itself and system files
            if ($filename === 'index.json' || $filename === '_index.json' || strpos($filename, '_') === 0) {
                continue;
            }

            $content = file_get_contents($file);
            $data = json_decode($content, true);
            if ($data) {
                // Ensure ID is present
                $id = basename($file, '.json');
                if (!isset($data['id'])) {
                    $data['id'] = $id;
                }

                // Optimized index: maybe only keep summary fields? 
                // For now, keep full data for simplicity as per "Ultra Fast" requirement (single request)
                $indexData[] = $data;
            }
        }

        // Save the index file
        file_put_contents($collectionPath . '/_index.json', json_encode($indexData, JSON_PRETTY_PRINT));
    }

    /**
     * Create or Update a document
     * 
     * @param string $collection
     * @param string $id
     * @param array $data
     * @return array The saved data
     */
    public function update($collection, $id, $data)
    {
        $collectionPath = DATA_ROOT . '/' . $collection;

        // Ensure collection directory exists
        if (!is_dir($collectionPath)) {
            mkdir($collectionPath, 0777, true);
        }

        $filePath = $collectionPath . '/' . $id . '.json';

        // If it's an update check if 'current' merge is needed or complete overwrite
        // For simplicity in this first version, we do a merge if the file exists
        if (file_exists($filePath)) {
            $existingData = json_decode(file_get_contents($filePath), true);
            if (is_array($existingData)) {
                $data = array_merge($existingData, $data);
            }
        }

        // Add metadata
        $data['_updatedAt'] = date('c');
        if (!isset($data['_createdAt'])) {
            $data['_createdAt'] = date('c');
        }

        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT))) {
            // Rebuild index after write
            $this->rebuildIndex($collection);
            return $data;
        } else {
            throw new Exception("Failed to write to file: $filePath");
        }
    }

    /**
     * Read a document
     * 
     * @param string $collection
     * @param string $id
     * @return array
     */
    public function read($collection, $id)
    {
        $filePath = DATA_ROOT . '/' . $collection . '/' . $id . '.json';

        if (!file_exists($filePath)) {
            throw new Exception("Document not found: $collection/$id");
        }

        $content = file_get_contents($filePath);
        $data = json_decode($content, true);

        if ($data === null) {
            throw new Exception("Error decoding JSON from: $filePath");
        }

        return $data;
    }

    /**
     * List all documents in a collection
     * 
     * @param string $collection
     * @return array
     */
    public function list($collection)
    {
        $collectionPath = DATA_ROOT . '/' . $collection;

        // Try reading static index first (faster)
        $indexPath = $collectionPath . '/_index.json';
        if (file_exists($indexPath)) {
            $content = file_get_contents($indexPath);
            $data = json_decode($content, true);
            if ($data)
                return $data;
        }

        // Fallback to scanning
        $results = [];

        if (is_dir($collectionPath)) {
            $files = glob($collectionPath . '/*.json');
            foreach ($files as $file) {
                $filename = basename($file);
                // Skip system files
                if ($filename === '_index.json' || strpos($filename, '_') === 0)
                    continue;

                $content = file_get_contents($file);
                $data = json_decode($content, true);
                if ($data) {
                    // Add ID to data if not present, based on filename
                    $id = basename($file, '.json');
                    $data['id'] = $id;
                    $results[] = $data;
                }
            }
        }

        return $results;
    }

    /**
     * Delete a document
     * .
     * @param string $collection
     * @param string $id
     * @return bool
     */
    public function delete($collection, $id)
    {
        $filePath = DATA_ROOT . '/' . $collection . '/' . $id . '.json';

        if (file_exists($filePath)) {
            $result = unlink($filePath);
            if ($result) {
                $this->rebuildIndex($collection);
            }
            return $result;
        }

        return false;
    }
}
