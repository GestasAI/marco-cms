<?php
/**
 * StaticGenerator - Genera HTML estático optimizado desde JSON
 * 
 * Convierte documentos JSON en HTML puro con:
 * - SEO optimizado
 * - CSS inline del tema
 * - Meta tags completos
 * - Sitemap automático
 * - Mejores prácticas de Google
 */

class StaticGenerator
{
    private $aiGenerator;
    private $themesDir;
    private $dataDir;
    private $outputDir;
    private $crud;

    public function __construct($themesDir, $dataDir, $outputDir, $crud)
    {
        $this->themesDir = $themesDir;
        $this->dataDir = $dataDir;
        $this->outputDir = $outputDir;
        $this->crud = $crud;
        $this->aiGenerator = new AIContentGenerator();
    }

    /**
     * Obtiene el tema activo
     */
    private function getActiveTheme()
    {
        try {
            $settings = $this->crud->read('theme_settings', 'current');
            return $settings['active_theme'] ?? 'gestasai-default';
        } catch (Exception $e) {
            return 'gestasai-default';
        }
    }

    /**
     * Carga la configuración del tema (theme.json)
     */
    private function loadThemeConfig($themeId)
    {
        $configPath = $this->themesDir . '/' . $themeId . '/theme.json';
        if (!file_exists($configPath)) {
            throw new Exception("Theme config not found: $configPath");
        }

        $json = file_get_contents($configPath);
        return json_decode($json, true);
    }

    /**
     * Carga el CSS del tema
     */
    private function loadThemeCSS($themeId)
    {
        $cssPath = $this->themesDir . '/' . $themeId . '/theme.css';
        if (!file_exists($cssPath)) {
            return '';
        }

        return file_get_contents($cssPath);
    }

    /**
     * Renderiza un elemento del JSON a HTML
     */
    private function renderElement($element)
    {
        if (!isset($element['element'])) {
            return '';
        }

        $type = $element['element'];
        $id = $element['id'] ?? '';
        $class = $element['class'] ?? '';
        $customStyles = $element['customStyles'] ?? [];

        // Construir atributos style
        $styleAttr = '';
        if (!empty($customStyles)) {
            $styles = [];
            foreach ($customStyles as $prop => $value) {
                $styles[] = "$prop: $value";
            }
            $styleAttr = ' style="' . implode('; ', $styles) . '"';
        }

        $html = '';

        switch ($type) {
            case 'heading':
                $tag = $element['tag'] ?? 'h2';
                $text = htmlspecialchars($element['text'] ?? '', ENT_QUOTES, 'UTF-8');
                $html = "<$tag id=\"$id\" class=\"$class\"$styleAttr>$text</$tag>";
                break;

            case 'text':
                $tag = $element['tag'] ?? 'p';
                $text = htmlspecialchars($element['text'] ?? '', ENT_QUOTES, 'UTF-8');
                $html = "<$tag id=\"$id\" class=\"$class\"$styleAttr>$text</$tag>";
                break;

            case 'button':
                $text = htmlspecialchars($element['text'] ?? 'Button', ENT_QUOTES, 'UTF-8');
                $link = htmlspecialchars($element['link'] ?? '#', ENT_QUOTES, 'UTF-8');
                $target = $element['target'] ?? '_self';
                $html = "<a href=\"$link\" target=\"$target\" id=\"$id\" class=\"$class\"$styleAttr>$text</a>";
                break;

            case 'link':
                $text = htmlspecialchars($element['text'] ?? 'Link', ENT_QUOTES, 'UTF-8');
                $link = htmlspecialchars($element['link'] ?? '#', ENT_QUOTES, 'UTF-8');
                $html = "<a href=\"$link\" id=\"$id\" class=\"$class\"$styleAttr>$text</a>";
                break;

            case 'image':
                $src = htmlspecialchars($element['src'] ?? '', ENT_QUOTES, 'UTF-8');
                $alt = htmlspecialchars($element['alt'] ?? '', ENT_QUOTES, 'UTF-8');
                $html = "<img src=\"$src\" alt=\"$alt\" id=\"$id\" class=\"$class\"$styleAttr />";
                break;

            case 'video':
                if ($element['type'] === 'youtube') {
                    $youtubeId = $element['youtubeId'] ?? '';
                    $html = "<iframe id=\"$id\" class=\"$class\"$styleAttr src=\"https://www.youtube.com/embed/$youtubeId\" frameborder=\"0\" allowfullscreen></iframe>";
                } else {
                    $src = htmlspecialchars($element['src'] ?? '', ENT_QUOTES, 'UTF-8');
                    $html = "<video id=\"$id\" class=\"$class\"$styleAttr controls><source src=\"$src\" /></video>";
                }
                break;

            case 'container':
            case 'section':
            case 'grid':
            case 'card':
            case 'nav':
                $tag = $type === 'section' ? 'section' : 'div';
                $content = $this->renderContent($element['content'] ?? []);
                $html = "<$tag id=\"$id\" class=\"$class\"$styleAttr>$content</$tag>";
                break;

            default:
                // Elemento genérico
                $content = $this->renderContent($element['content'] ?? []);
                $html = "<div id=\"$id\" class=\"$class\"$styleAttr>$content</div>";
                break;
        }

        return $html;
    }

    /**
     * Renderiza un array de contenido
     */
    private function renderContent($content)
    {
        if (!is_array($content)) {
            return '';
        }

        $html = '';
        foreach ($content as $item) {
            $html .= $this->renderElement($item);
        }

        return $html;
    }

    /**
     * Genera el HTML completo de una página
     */
    public function generatePage($pageData, $themeId = null)
    {
        if (!$themeId) {
            $themeId = $this->getActiveTheme();
        }

        $themeConfig = $this->loadThemeConfig($themeId);
        $themeCSS = $this->loadThemeCSS($themeId);

        // SEO
        $title = $pageData['seo']['meta_title'] ?? $pageData['title'] ?? 'Page';
        $description = $pageData['seo']['meta_description'] ?? '';
        $keywords = $pageData['seo']['meta_keywords'] ?? '';
        $ogImage = $pageData['seo']['og_image'] ?? '';
        $canonical = $pageData['seo']['canonical'] ?? '';

        // Generar contenido para IA
        $schema = $this->aiGenerator->generateSchema($pageData, $canonical ?: 'https://gestasai.com');
        $aiMetaTags = $this->aiGenerator->generateAIMetaTags($pageData);
        $breadcrumbSchema = $this->aiGenerator->generateBreadcrumbSchema($pageData, $canonical ?: 'https://gestasai.com');

        // Renderizar contenido
        $bodyContent = '';
        if (isset($pageData['page']['sections'])) {
            foreach ($pageData['page']['sections'] as $section) {
                $sectionTag = $section['section'] ?? 'div';
                $sectionId = $section['id'] ?? '';
                $sectionClass = $section['class'] ?? '';
                $sectionContent = $this->renderContent($section['content'] ?? []);
                
                $bodyContent .= "<$sectionTag id=\"$sectionId\" class=\"$sectionClass\">$sectionContent</$sectionTag>";
            }
        }

        // Construir HTML
        $html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title</title>
    <meta name="description" content="$description">
    <meta name="keywords" content="$keywords">
    
    <!-- AI-Optimized Meta Tags -->
    $aiMetaTags
    
    <!-- Open Graph -->
    <meta property="og:title" content="$title">
    <meta property="og:description" content="$description">
    <meta property="og:image" content="$ogImage">
    <meta property="og:type" content="website">
    
    <!-- Canonical -->
    <link rel="canonical" href="$canonical">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
$schema
    </script>
    
    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
$breadcrumbSchema
    </script>
    
    <!-- Theme CSS -->
    <style>
$themeCSS
    </style>
</head>
<body>
$bodyContent
</body>
</html>
HTML;

        return $html;
    }

    /**
     * Genera todas las páginas del sitio
     */
    public function buildSite()
    {
        $themeId = $this->getActiveTheme();
        $results = [];

        // Crear directorio de salida si no existe
        if (!is_dir($this->outputDir)) {
            mkdir($this->outputDir, 0755, true);
        }

        // Generar home desde el tema
        $homeJsonPath = $this->themesDir . '/' . $themeId . '/pages/home.json';
        if (file_exists($homeJsonPath)) {
            $homeData = json_decode(file_get_contents($homeJsonPath), true);
            $homeHTML = $this->generatePage($homeData, $themeId);
            
            $outputPath = $this->outputDir . '/index.html';
            file_put_contents($outputPath, $homeHTML);
            $results[] = "✅ Generated: index.html";
        }

        // Generar todas las páginas de /data/pages
        $pagesDir = $this->dataDir . '/pages';
        if (is_dir($pagesDir)) {
            $files = glob($pagesDir . '/*.json');
            foreach ($files as $file) {
                $filename = basename($file, '.json');
                
                // Saltar archivos especiales
                if ($filename === '_index' || $filename === 'home') {
                    continue;
                }

                $pageData = json_decode(file_get_contents($file), true);
                $pageHTML = $this->generatePage($pageData, $themeId);
                
                $outputPath = $this->outputDir . '/' . $filename . '.html';
                file_put_contents($outputPath, $pageHTML);
                $results[] = "✅ Generated: $filename.html";
            }
        }

        return $results;
    }

    /**
     * Genera el sitemap.xml
     */
    public function generateSitemap($baseUrl = 'https://example.com')
    {
        $urls = [];
        
        // Home
        $urls[] = [
            'loc' => $baseUrl . '/',
            'priority' => '1.0',
            'changefreq' => 'daily'
        ];

        // Páginas
        $pagesDir = $this->dataDir . '/pages';
        if (is_dir($pagesDir)) {
            $files = glob($pagesDir . '/*.json');
            foreach ($files as $file) {
                $filename = basename($file, '.json');
                if ($filename === '_index' || $filename === 'home') {
                    continue;
                }

                $urls[] = [
                    'loc' => $baseUrl . '/' . $filename,
                    'priority' => '0.8',
                    'changefreq' => 'weekly'
                ];
            }
        }

        // Construir XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        
        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$url['loc']}</loc>\n";
            $xml .= "    <priority>{$url['priority']}</priority>\n";
            $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            $xml .= "  </url>\n";
        }
        
        $xml .= '</urlset>';

        file_put_contents($this->outputDir . '/sitemap.xml', $xml);
        return '✅ Generated: sitemap.xml';
    }
}


