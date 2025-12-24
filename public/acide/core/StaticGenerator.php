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
        return ElementRenderer::render($element, function ($content) {
            return $this->renderContent($content);
        });
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
                // Normalizar sección como elemento para el renderizador
                $sectionElement = $section;
                $sectionElement['element'] = $section['section'] ?? 'section';

                $bodyContent .= ElementRenderer::render($sectionElement, function ($content) {
                    return $this->renderContent($content);
                });
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
    .mc-effect-container { position: relative; overflow: hidden; background: #000; }
    .mc-effect-container canvas { display: block; width: 100% !important; height: 100% !important; }
    .mc-content-layer { position: relative; z-index: 2; width: 100%; height: 100%; }
    </style>
    
    <!-- Effects Runtime (Three.js) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const containers = document.querySelectorAll('.mc-effect-container');
        containers.forEach(container => {
            try {
                const settings = JSON.parse(container.getAttribute('data-settings') || '{}');
                initEffect(container, settings);
            } catch(e) { console.error("Effect init error:", e); }
        });

        function initEffect(container, settings) {
            const particleSettings = settings.particles || { count: 3000, size: 0.06, color: '#4285F4', shape: 'points' };
            const animSettings = settings.animation || { mode: 'follow', intensity: 1.5, timeScale: 1.2 };
            
            const scene = new THREE.Scene();
            const width = container.clientWidth || container.parentElement?.clientWidth || 800;
            const height = container.clientHeight || container.parentElement?.clientHeight || 400;
            const camera = new THREE.PerspectiveCamera(75, width / height || 1.6, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = '1';
            container.appendChild(renderer.domElement);

            const count = particleSettings.count || 3000;
            const shape = particleSettings.shape || 'points';
            let mesh;

            if (shape === 'points' || shape === 'lines' || shape === 'bubbles') {
                const geometry = new THREE.BufferGeometry();
                const pos = new Float32Array(count * 3);
                const initialPos = new Float32Array(count * 3);
                for(let i=0; i<count*3; i++) {
                    const v = (Math.random() - 0.5) * 10;
                    pos[i] = initialPos[i] = v;
                }
                geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                geometry.userData = { initialPos };

                if (shape === 'lines') {
                    const material = new THREE.LineBasicMaterial({ color: particleSettings.color || '#4285F4', transparent: true, opacity: 0.6 });
                    mesh = new THREE.LineSegments(geometry, material);
                } else {
                    const material = new THREE.PointsMaterial({
                        size: particleSettings.size || 0.06,
                        color: particleSettings.color || '#4285F4',
                        transparent: true,
                        opacity: shape === 'bubbles' ? 0.4 : 0.8,
                        blending: THREE.AdditiveBlending,
                        sizeAttenuation: true
                    });
                    mesh = new THREE.Points(geometry, material);
                }
            } else {
                const baseGeom = shape === 'spheres' 
                    ? new THREE.SphereGeometry(particleSettings.size || 0.06, 8, 8)
                    : new THREE.BoxGeometry(particleSettings.size || 0.06, particleSettings.size || 0.06, particleSettings.size || 0.06);
                
                const material = new THREE.MeshPhongMaterial({ color: particleSettings.color || '#4285F4', transparent: true, opacity: 0.8 });
                mesh = new THREE.InstancedMesh(baseGeom, material, count);
                
                const matrix = new THREE.Matrix4();
                const initialPos = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    const x = (Math.random() - 0.5) * 10;
                    const y = (Math.random() - 0.5) * 10;
                    const z = (Math.random() - 0.5) * 10;
                    initialPos[i*3] = x;
                    initialPos[i*3+1] = y;
                    initialPos[i*3+2] = z;
                    matrix.setPosition(x, y, z);
                    mesh.setMatrixAt(i, matrix);
                }
                mesh.userData = { initialPos };
                
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(1, 1, 2);
                scene.add(light);
                scene.add(new THREE.AmbientLight(0x404040));
            }

            scene.add(mesh);

            const mouse = { x: 0, y: 0 };
            window.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            });

            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                const elapsed = clock.getElapsedTime();
                const timeScale = animSettings.timeScale || 1.2;
                const intensity = animSettings.intensity || 1.5;
                const mode = animSettings.mode || 'follow';
                
                const initialPos = mesh.userData.initialPos;

                if (shape === 'points' || shape === 'lines' || shape === 'bubbles') {
                    const positions = mesh.geometry.attributes.position.array;
                    for(let i=0; i<count; i++) {
                        const i3 = i * 3;
                        if (mode === 'rain') {
                            positions[i3+1] -= 0.02 * timeScale;
                            if (positions[i3+1] < -5) positions[i3+1] = 5;
                        } else if (mode === 'direction') {
                            positions[i3] += 0.01 * timeScale;
                            if (positions[i3] > 5) positions[i3] = -5;
                        } else {
                            positions[i3+1] = initialPos[i3+1] + Math.sin(elapsed * timeScale + initialPos[i3]) * 0.2;
                            positions[i3] = initialPos[i3] + Math.cos(elapsed * timeScale * 0.5 + initialPos[i3+2]) * 0.1;
                        }

                        if(mode === 'follow' || mode === 'avoid') {
                            const dx = positions[i3] - mouse.x * 5;
                            const dy = positions[i3+1] - mouse.y * 5;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            if(dist < 2) {
                                const force = (2 - dist) / 2;
                                const factor = mode === 'follow' ? 1 : -1;
                                positions[i3] += dx * force * 0.05 * intensity * factor;
                                positions[i3+1] += dy * force * 0.05 * intensity * factor;
                            }
                        }
                    }
                    mesh.geometry.attributes.position.needsUpdate = true;
                } else {
                    const matrix = new THREE.Matrix4();
                    for (let i = 0; i < count; i++) {
                        const i3 = i * 3;
                        let x = initialPos[i3];
                        let y = initialPos[i3+1];
                        let z = initialPos[i3+2];

                        if (mode === 'rain') {
                            y = (y - elapsed * 0.5 * timeScale) % 10;
                            if (y < -5) y += 10;
                        } else {
                            y += Math.sin(elapsed * timeScale + x) * 0.2;
                            x += Math.cos(elapsed * timeScale * 0.5 + z) * 0.1;
                        }

                        if (mode === 'follow' || mode === 'avoid') {
                            const dx = x - mouse.x * 5;
                            const dy = y - mouse.y * 5;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 2) {
                                const force = (2 - dist) / 2;
                                const factor = mode === 'follow' ? 1 : -1;
                                x += dx * force * 0.05 * intensity * factor;
                                y += dy * force * 0.05 * intensity * factor;
                            }
                        }
                        matrix.setPosition(x, y, z);
                        mesh.setMatrixAt(i, matrix);
                    }
                    mesh.instanceMatrix.needsUpdate = true;
                }
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                const w = container.clientWidth;
                const h = container.clientHeight;
                if (w > 0 && h > 0) {
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);
                }
            });
        }
    });
    </script>
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

        // 1. Determinar qué página es la HOME (index.html)
        $homeData = null;
        $homeSource = '';

        // Prioridad 1: Página en /data/pages con slug 'home' o nombre 'home.json'
        $pagesDir = $this->dataDir . '/pages';
        if (is_dir($pagesDir)) {
            if (file_exists($pagesDir . '/home.json')) {
                $homeData = json_decode(file_get_contents($pagesDir . '/home.json'), true);
                $homeSource = $pagesDir . '/home.json';
            } else {
                // Buscar por slug
                $files = glob($pagesDir . '/*.json');
                foreach ($files as $file) {
                    $data = json_decode(file_get_contents($file), true);
                    if (isset($data['slug']) && $data['slug'] === 'home') {
                        $homeData = $data;
                        $homeSource = $file;
                        break;
                    }
                }
            }
        }

        // Prioridad 2: home.json del tema
        if (!$homeData) {
            $themeHomePath = $this->themesDir . '/' . $themeId . '/pages/home.json';
            if (file_exists($themeHomePath)) {
                $homeData = json_decode(file_get_contents($themeHomePath), true);
                $homeSource = $themeHomePath;
            }
        }

        // Generar index.html si tenemos datos de home
        if ($homeData) {
            $homeHTML = $this->generatePage($homeData, $themeId);
            file_put_contents($this->outputDir . '/index.html', $homeHTML);
            $results[] = "✅ Generated: index.html (from $homeSource)";
        }

        // 2. Generar el resto de páginas
        if (is_dir($pagesDir)) {
            $files = glob($pagesDir . '/*.json');
            foreach ($files as $file) {
                $filename = basename($file, '.json');

                // Saltar archivos especiales y la que ya usamos como home
                if ($filename === '_index' || $file === $homeSource || ($homeData && isset($homeData['id']) && $filename === $homeData['id'])) {
                    continue;
                }

                $pageData = json_decode(file_get_contents($file), true);

                // Si el slug es 'home', ya lo procesamos como index.html
                if (isset($pageData['slug']) && $pageData['slug'] === 'home') {
                    continue;
                }

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
