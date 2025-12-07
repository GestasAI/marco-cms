# 🏗️ Arquitectura Full Site Editor (FSE) - Marco CMS

## 1. Visión General
El objetivo es eliminar la distinción entre "backend" y "frontend" durante la creación de contenido. El usuario no rellena un formulario abstracto; **edita el sitio tal como se verá**.

Al crear una Entrad, Página o Producto, el sistema carga el **Template** correspondiente, completa los "agujeros" con datos por defecto o vacíos, y permite al usuario escribir directamente sobre el diseño final.

## 2. Jerarquía de Templates

Los temas en Marco CMS deben seguir una estructura estricta basada en JSON para definir la disposición de los bloques.

### Estructura de Archivos
```
/public/themes/[nombre-tema]/
├── theme.json        # Configuración global (colores, fuentes)
├── templates/        # Estructuras de página completas
│   ├── index.json    # Home por defecto
│   ├── single.json   # Entrada individual / Producto
│   ├── page.json     # Página estática
│   ├── archive.json  # Listados (Categorías, Tags)
│   └── 404.json      # Error
└── parts/            # Fragmentos reutilizables
    ├── header.json
    ├── footer.json
    └── sidebar.json
```

### Definición de un Template (`single.json`)
El template es una lista ordenada de bloques.

```json
{
  "version": 1,
  "type": "template",
  "slug": "single",
  "name": "Entrada Individual",
  "blocks": [
    {
      "type": "core/template-part",
      "slug": "header",
      "locked": true  // El usuario no edita el header al crear un post
    },
    {
      "type": "core/group",
      "className": "container py-xl",
      "blocks": [
        {
          "type": "core/post-title", // Bloque dinámico: se vincula al título del post
          "placeholder": "Añade un título..."
        },
        {
          "type": "core/post-featured-image",
          "placeholder": "Seleccionar imagen destacada"
        },
        {
          "type": "core/post-content", // El cuerpo del contenido
          "placeholder": "Escribe tu historia..."
        }
      ]
    },
    {
      "type": "core/template-part",
      "slug": "footer",
      "locked": true
    }
  ]
}
```

## 3. Lógica del Editor (FSE Logic)

### Flujo de Creación de Contenido
1.  **Init**: El usuario pulsa "Añadir Entrada".
2.  **Resolver**:
    *   El sistema busca `single.json` en el tema activo.
    *   Genera un objeto Post "en memoria" (borrador) con ID temporal.
3.  **Renderizado**:
    *   El motor renderiza el Template `single.json`.
    *   Los bloques `core/template-part` cargan sus archivos correspondientes (`header.json`).
    *   Los bloques `core/post-*` se vuelven **editables**.
4.  **Edición**:
    *   El usuario hace clic en el Título ("Hola Mundo") y escribe.
    *   El estado local del Post se actualiza (`post.title = "Hola Mundo"`).
    *   El usuario hace clic en "Imagen Destacada", se abre el `Media.jsx` modal, selecciona, y se actualiza `post.featured_media`.
5.  **Guardado**:
    *   Al pulsar "Publicar", se separan los datos:
        *   **Contenido**: Se guarda en la colección `posts` (solo el HTML/JSON del `post-content` + metadatos como título, imagen, fecha).
        *   **Estructura**: NO se modifica (el template `single.json` permanece intacto).

### Flujo de Edición de Template (Site Editor)
Si el usuario entra en "Apariencia > Editor > Single", entonces:
1.  Todos los bloques se vuelven manipulables.
2.  Puede mover el Título debajo de la Imagen.
3.  Al guardar, se sobrescribe `single.json`.

## 4. Bloques del Sistema (Core Blocks)

Para que esto funcione, necesitamos implementar estos componentes React (`src/blocks/`):

1.  **`PostTitle`**: Input transparente, H1, vincula con `post.title`.
2.  **`PostContent`**: Editor de texto enriquecido (RichText), vincula con `post.content`.
3.  **`FeaturedImage`**: Placeholder clickable -> Modal Medios -> Renderiza `<img>`.
4.  **`TemplatePart`**: Carga otro JSON y lo renderiza recursivamente.
5.  **`QueryLoop`**: Para listados (Blog, Productos). Itera sobre una consulta `acideService.query()` y repite su bloque interno (Post Template).

## 5. Templates por Defecto (Fallback)

Si el tema no tiene templates, el sistema usará estos defaults en memoria:

**Default Single:**
Header + Container(Title, Meta, FeaturedImage, Content) + Footer.

**Default Archive:**
Header + Container(ArchiveTitle, Grid(QueryLoop(Title, Excerpt, ReadMore))) + Footer.
