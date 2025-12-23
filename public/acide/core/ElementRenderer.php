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

            case 'container':
            case 'section':
            case 'grid':
            case 'card':
            case 'nav':
                $tag = $type === 'section' ? 'section' : 'div';
                $content = $renderContentCallback($element['content'] ?? []);
                return "<$tag id=\"$id\" class=\"$class\"$styleAttr>$content</$tag>";

            default:
                $content = $renderContentCallback($element['content'] ?? []);
                return "<div id=\"$id\" class=\"$class\"$styleAttr>$content</div>";
        }
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
