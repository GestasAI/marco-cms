# Estándar de Temas Marco CMS (v1.0)

Este documento define la estructura y el "diccionario" de elementos que Marco CMS y su Full Site Editor (FSE) utilizan para garantizar la compatibilidad total entre temas y el motor de edición.

## 1. Estructura de Página (JSON)

Cada página debe seguir esta jerarquía básica:

```json
{
  "id": "slug-de-la-pagina",
  "title": "Título Humano",
  "slug": "url-amigable",
  "page": {
    "sections": [
      { "section": "header", ... },
      { "section": "content", ... },
      { "section": "footer", ... }
    ]
  }
}
```

### Secciones Reservadas
- **header**: Contenido global superior.
- **content**: Área principal editable por el FSE.
- **footer**: Contenido global inferior.

## 2. Diccionario de Elementos (Blocks)

El FSE reconoce los siguientes tipos de elementos (`element`). Cada uno tiene propiedades específicas:

| Elemento | Propiedades Clave | Descripción |
| :--- | :--- | :--- |
| `heading` | `text`, `tag` (h1-h6) | Títulos de sección. |
| `text` | `text`, `tag` (p, span) | Bloques de texto o párrafos. |
| `image` | `src`, `alt`, `width`, `height` | Imágenes con soporte para Media Library. |
| `video` | `src`, `type` (youtube/local), `youtubeId` | Vídeos embebidos o locales. |
| `button` | `text`, `link`, `target` | Botones de acción y enlaces. |
| `container` | `content` (array), `class` | Divisor lógico para agrupar elementos. |
| `section` | `content` (array), `id`, `class` | Sección de alto nivel con ID para anclas. |
| `nav` | `content` (array), `class` | Contenedor de navegación semántico. |
| `link` | `text`, `link`, `target` | Enlace de texto simple (sin apariencia de botón). |
| `grid` | `content` (array), `class` | Contenedor con soporte para columnas. |
| `card` | `content` (array), `class` | Bloque pre-estilizado para contenido repetitivo. |

## 3. Sistema de Estilos (customStyles)

Marco CMS utiliza un objeto `customStyles` para inyectar CSS inline dinámico. El FSE mapea los controles visuales a estas propiedades:

- **Layout**: `display`, `flex-direction`, `justify-content`, `align-items`, `gap`.
- **Dimensiones**: `width`, `height`, `max-width`, `margin`, `padding`.
- **Tipografía**: `color`, `font-size`, `font-weight`, `text-align`, `line-height`.
- **Decoración**: `background-color`, `border-radius`, `border`, `box-shadow`.

## 4. Mejores Prácticas para Desarrolladores de Temas

1. **Clases Semánticas**: Utiliza clases como `.container`, `.btn-primary`, `.card-title` para que el CSS del tema sea predecible.
2. **IDs Únicos**: Cada elemento en el JSON debe tener un `id` único (ej: `hero-title-001`) para que el FSE pueda rastrear los cambios.
3. **Variables CSS**: Define colores y fuentes en `:root` dentro de `theme.css` para permitir cambios globales desde el panel de Ajustes del Tema.
4. **Referencia**: Incluye este comentario en el `index.html` de tu tema:
   `<!-- Marco CMS Theme Standard v1.0 | Docs: /dashboard/documentation -->`

---
*Documento generado por Antigravity para Gestas AI - 2025*
