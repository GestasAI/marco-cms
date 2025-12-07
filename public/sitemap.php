<?php

header("Content-Type: application/xml; charset=utf-8");

require_once 'acide/core/Utils.php';
require_once 'acide/core/CRUDOperations.php';

// Base URL detection
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$baseUrl = "$protocol://$host";

// Instantiate Core
$crud = new CRUDOperations();

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Home -->
    <url>
        <loc><?php echo $baseUrl; ?>/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    <?php
    // 1. Pages
    try {
        $pages = $crud->list('pages');
        foreach ($pages as $page) {
            // Skip non-published if status exists
            if (isset($page['status']) && $page['status'] !== 'published')
                continue;

            $slug = isset($page['slug']) ? $page['slug'] : $page['id'];
            $lastMod = isset($page['_updatedAt']) ? date('c', strtotime($page['_updatedAt'])) : date('c');

            echo "    <url>\n";
            echo "        <loc>$baseUrl/$slug</loc>\n";
            echo "        <lastmod>$lastMod</lastmod>\n";
            echo "        <changefreq>weekly</changefreq>\n";
            echo "        <priority>0.8</priority>\n";
            echo "    </url>\n";
        }
    } catch (Exception $e) {
        // Ignore if collection missing
    }

    // 2. Posts
    try {
        $posts = $crud->list('posts');
        foreach ($posts as $post) {
            // Skip non-published
            if (isset($post['status']) && $post['status'] !== 'published')
                continue;

            $slug = isset($post['slug']) ? $post['slug'] : $post['id'];
            $lastMod = isset($post['_updatedAt']) ? date('c', strtotime($post['_updatedAt'])) : date('c');

            echo "    <url>\n";
            echo "        <loc>$baseUrl/post/$slug</loc>\n";
            echo "        <lastmod>$lastMod</lastmod>\n";
            echo "        <changefreq>weekly</changefreq>\n";
            echo "        <priority>0.6</priority>\n";
            echo "    </url>\n";
        }
    } catch (Exception $e) {
        // Ignore
    }
    ?>
</urlset>