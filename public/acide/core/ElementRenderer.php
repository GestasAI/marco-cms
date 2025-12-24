<?php
/**
 * ElementRenderer - Renderizador atómico de elementos HTML
 */
class ElementRenderer
{
    /**
     * Renderiza un elemento individual
     */
    public static function render($element, $renderContentCallback)
    {
        if (!isset($element['element'])) {
            return '';
        }

        $type = $element['element'];
        $id = $element['id'] ?? '';
        $class = $element['class'] ?? '';
        $customStyles = $element['customStyles'] ?? [];

        // Construir atributos style
        $styleAttr = self::buildStyleAttr($customStyles);

        switch ($type) {
            case 'heading':
                $tag = $element['tag'] ?? 'h2';
                $text = htmlspecialchars($element['text'] ?? '', ENT_QUOTES, 'UTF-8');
                return "<$tag id=\"$id\" class=\"$class\"$styleAttr>$text</$tag>";

            case 'text':
                $tag = $element['tag'] ?? 'p';
                $text = htmlspecialchars($element['text'] ?? '', ENT_QUOTES, 'UTF-8');
                return "<$tag id=\"$id\" class=\"$class\"$styleAttr>$text</$tag>";

            case 'button':
            case 'link':
                $text = htmlspecialchars($element['text'] ?? ($type === 'button' ? 'Button' : 'Link'), ENT_QUOTES, 'UTF-8');
                $link = htmlspecialchars($element['link'] ?? '#', ENT_QUOTES, 'UTF-8');
                $target = $element['target'] ?? '_self';
                return "<a href=\"$link\" target=\"$target\" id=\"$id\" class=\"$class\"$styleAttr>$text</a>";

            case 'image':
                $src = htmlspecialchars($element['src'] ?? '', ENT_QUOTES, 'UTF-8');
                $alt = htmlspecialchars($element['alt'] ?? '', ENT_QUOTES, 'UTF-8');
                return "<img src=\"$src\" alt=\"$alt\" id=\"$id\" class=\"$class\"$styleAttr />";

            case 'video':
                if (isset($element['type']) && $element['type'] === 'youtube') {
                    $youtubeId = $element['youtubeId'] ?? '';
                    return "<iframe id=\"$id\" class=\"$class\"$styleAttr src=\"https://www.youtube.com/embed/$youtubeId\" frameborder=\"0\" allowfullscreen></iframe>";
                } else {
                    $src = htmlspecialchars($element['src'] ?? '', ENT_QUOTES, 'UTF-8');
                    return "<video id=\"$id\" class=\"$class\"$styleAttr controls><source src=\"$src\" /></video>";
                }

            case 'effect':
                $tag = 'div';
                $content = $renderContentCallback($element['content'] ?? []);
                $settings = $element['settings'] ?? [];
                $settingsAttr = ' data-settings=\'' . json_encode($settings) . '\'';

                // Extraer alto de los ajustes si existe
                $height = $settings['layout']['height'] ?? '400px';
                $effectStyles = "height: $height; position: relative; overflow: hidden; background: #000;";
                $finalStyleAttr = ' style="' . trim(str_replace('style="', '', $styleAttr), '"; ') . '; ' . $effectStyles . '"';

                $effectClass = trim($class . ' mc-effect-container');
                $contentLayer = "<div class=\"mc-content-layer\">$content</div>";
                return "<$tag id=\"$id\" class=\"$effectClass\"$finalStyleAttr$settingsAttr>$contentLayer</$tag>";

            case 'container':
            case 'section':
            case 'grid':
            case 'card':
            case 'nav':
                $tag = $type === 'section' ? 'section' : ($type === 'nav' ? 'nav' : 'div');
                $content = $renderContentCallback($element['content'] ?? []);
                $bgExtras = self::renderBackgroundExtras($element);
                $bgStyles = self::getBackgroundStyles($element);
                $finalStyleAttr = self::buildStyleAttr(array_merge($customStyles, $bgStyles));
                $contentLayer = "<div class=\"mc-content-layer\">$content</div>";
                return "<$tag id=\"$id\" class=\"$class\"$finalStyleAttr>$bgExtras$contentLayer</$tag>";

            default:
                $content = $renderContentCallback($element['content'] ?? []);
                return "<div id=\"$id\" class=\"$class\"$styleAttr>$content</div>";
        }
    }

    /**
     * Renderiza extras de fondo (video y overlay) en PHP
     */
    private static function renderBackgroundExtras($element)
    {
        $settings = $element['settings']['background'] ?? null;
        if (!$settings)
            return '';

        $html = '';
        if (($settings['type'] ?? '') === 'video' && isset($settings['video'])) {
            $videoUrl = $settings['video'];
            $html .= "<video autoplay muted loop playsinline style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;\">";
            $html .= "<source src=\"$videoUrl\" type=\"video/mp4\">";
            $html .= "</video>";
        }

        if (isset($settings['overlay']['enabled']) && $settings['overlay']['enabled']) {
            $color = $settings['overlay']['color'] ?? '#000000';
            $opacity = $settings['overlay']['opacity'] ?? 0.5;
            $html .= "<div style=\"position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: $color; opacity: $opacity; pointer-events: none; z-index: 1;\"></div>";
        }

        return $html;
    }

    /**
     * Obtiene estilos de fondo para PHP
     */
    private static function getBackgroundStyles($element)
    {
        $settings = $element['settings']['background'] ?? null;
        if (!$settings)
            return [];

        $styles = [];
        switch ($settings['type'] ?? '') {
            case 'color':
                $styles['backgroundColor'] = $settings['color'] ?? '';
                break;
            case 'gradient':
                $styles['backgroundImage'] = $settings['gradient'] ?? '';
                break;
            case 'image':
                $styles['backgroundImage'] = "url(" . ($settings['image'] ?? '') . ")";
                $styles['backgroundSize'] = 'cover';
                $styles['backgroundPosition'] = 'center';
                break;
        }
        return $styles;
    }

    /**
     * Construye el atributo style convirtiendo camelCase a kebab-case
     */
    private static function buildStyleAttr($customStyles)
    {
        if (empty($customStyles)) {
            return '';
        }

        $styles = [];
        foreach ($customStyles as $prop => $value) {
            if (empty($value))
                continue;

            // Convertir camelCase a kebab-case (ej: flexDirection -> flex-direction)
            $kebabProp = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $prop));

            // Añadir !important a propiedades que suelen ser sobrescritas por el tema
            $important = '';
            if (in_array($kebabProp, ['color', 'background-color', 'background-image', 'font-size', 'font-family'])) {
                $important = ' !important';
            }

            $styles[] = "$kebabProp: $value$important";
        }

        return empty($styles) ? '' : ' style="' . implode('; ', $styles) . '"';
    }
}
