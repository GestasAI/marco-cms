# 📸 Sistema de Gestión de Medios - Marco CMS

**Fecha**: 2025-12-08  
**Versión**: 2.0  
**Estado**: ✅ Completamente Funcional

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Integración con ACIDE-PHP](#integración-con-acide-php)
4. [Componentes Principales](#componentes-principales)
5. [Flujo de Datos](#flujo-de-datos)
6. [Renderizado de Medios](#renderizado-de-medios)
7. [Gestión de Estilos](#gestión-de-estilos)
8. [API y Funciones](#api-y-funciones)
9. [Estructura de Datos](#estructura-de-datos)
10. [Casos de Uso](#casos-de-uso)

---

## 🎯 Resumen Ejecutivo

El sistema de gestión de medios de Marco CMS permite:

- ✅ **Subir imágenes y videos** desde el FSE (Full Site Editor)
- ✅ **Acceder a biblioteca de medios** compartida con el Dashboard
- ✅ **Insertar videos de YouTube** con ID
- ✅ **Aplicar estilos CSS** (alineación, dimensiones, opacidad, etc.)
- ✅ **Guardar configuración** en ACIDE-PHP
- ✅ **Renderizar correctamente** en página final

### Características Clave:

- **Unificación**: Misma biblioteca para Dashboard y FSE
- **Persistencia**: Todos los cambios se guardan en ACIDE-PHP
- **Flexibilidad**: Soporte para imágenes, videos upload y YouTube
- **Profesionalismo**: Poster, muted, autoplay, controls, etc.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        MARCO CMS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Dashboard  │         │     FSE      │                │
│  │   (Admin)    │         │   (Editor)   │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         └────────┬───────────────┘                         │
│                  │                                         │
│         ┌────────▼────────┐                                │
│         │  acideService   │                                │
│         │  (API Client)   │                                │
│         └────────┬────────┘                                │
│                  │                                         │
└──────────────────┼─────────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │   ACIDE-PHP API   │
         │   (Backend)       │
         └─────────┬─────────┘
                   │
         ┌─────────▼─────────┐
         │   File System     │
         │  /uploads/...     │
         └───────────────────┘
```

---

## 🔌 Integración con ACIDE-PHP

### 1. **acideService** - Cliente API

**Ubicación**: `src/acide/acideService.js`

```javascript
// Listar medios
const media = await acideService.list('media');
// Retorna: Array de objetos media

// Subir archivo
const uploadedFile = await acideService.upload(file);
// Retorna: { id, filename, url, type, size, created_at }

// Guardar documento con medios
await acideService.update('pages', 'home', documentData);
```

### 2. **Endpoints ACIDE-PHP**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/media` | Lista todos los medios |
| `POST` | `/api/upload` | Sube un archivo |
| `GET` | `/api/pages/:id` | Obtiene documento con medios |
| `PUT` | `/api/pages/:id` | Guarda documento con medios |

### 3. **Estructura de Respuesta**

**Lista de Medios**:
```json
[
  {
    "id": "media_6935725c4766d",
    "filename": "fondo-empresa.jpg",
    "title": "Fondo Empresa",
    "type": "image/jpeg",
    "size": 245678,
    "url": "/uploads/2025/12/fondo-empresa-media_6935725c4766d.jpg",
    "created_at": "2025-12-08T12:00:00Z"
  }
]
```

**Upload Response**:
```json
{
  "id": "media_6935725c4766d",
  "filename": "nueva-imagen.jpg",
  "url": "/uploads/2025/12/nueva-imagen-media_6935725c4766d.jpg",
  "type": "image/jpeg",
  "size": 123456,
  "created_at": "2025-12-08T12:30:00Z"
}
```

---

## 🧩 Componentes Principales

### 1. **MediaTab** - Gestión de Medios en FSE

**Ubicación**: `src/fse/unified-tabs/MediaTab.jsx`

**Responsabilidades**:
- Mostrar preview del medio actual
- Subir nuevos archivos
- Abrir biblioteca de medios
- Configurar opciones de video (controls, autoplay, loop, muted, poster)
- Guardar propiedades completas del medio

**Funciones Clave**:

```javascript
// Cargar biblioteca desde ACIDE
const loadMediaLibrary = async () => {
    const media = await acideService.list('media');
    setMediaLibrary(media);
};

// Subir imagen/video
const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const uploadedFile = await acideService.upload(file);
    
    // Guardar TODAS las propiedades
    onUpdateMultiple(selectedElement.id, {
        src: uploadedFile.url,
        mediaId: uploadedFile.id,
        alt: uploadedFile.title || 'Imagen',
        width: '100%',
        height: 'auto',
        mediaData: { ...uploadedFile }
    });
};

// Seleccionar de biblioteca
const handleSelectFromLibrary = (media) => {
    onUpdateMultiple(selectedElement.id, {
        src: media.url,
        mediaId: media.id,
        alt: media.title || 'Imagen',
        width: '100%',
        height: 'auto',
        mediaData: { ...media }
    });
};
```

### 2. **StyleTab** - Estilos de Medios

**Ubicación**: `src/fse/unified-tabs/StyleTab.jsx`

**Controles para Imágenes y Videos**:

- **Alineación**: Izquierda, Centro, Derecha
- **Dimensiones**: Ancho, Alto
- **Object Fit**: Contain, Cover, Fill (solo imágenes)
- **Spacing**: Margin, Padding
- **Bordes**: Border Radius, Box Shadow
- **Opacidad**: 0-1

**Implementación**:

```javascript
// Alineación
handleCustomStyleChange('margin', '0 auto'); // Centro
handleCustomStyleChange('margin', '0'); // Izquierda
handleCustomStyleChange('margin', '0 0 0 auto'); // Derecha

// Dimensiones
handleCustomStyleChange('width', '80%');
handleCustomStyleChange('height', '400px');

// Object Fit
handleCustomStyleChange('object-fit', 'cover');
```

### 3. **EditableContainer** - Renderizado en Editor

**Ubicación**: `src/fse/EditableContainer.jsx`

**Renderiza medios en el canvas del editor**:

```javascript
case 'image': {
    const imageStyles = {
        ...customStyles,
        width: element.width || customStyles.width || '100%',
        height: element.height || customStyles.height || 'auto',
        display: customStyles.display || 'block',
        margin: customStyles.margin || '0'
    };

    return (
        <img
            src={element.src}
            alt={element.alt}
            style={imageStyles}
            onClick={handleClick}
        />
    );
}

case 'video': {
    // YouTube
    if (element.type === 'youtube' && element.youtubeId) {
        return (
            <div style={containerStyles}>
                <iframe src={`https://www.youtube.com/embed/${element.youtubeId}`} />
            </div>
        );
    }
    
    // Upload
    return (
        <video
            src={element.src}
            poster={element.poster}
            controls={element.controls}
            autoPlay={element.autoplay}
            loop={element.loop}
            muted={element.muted}
        />
    );
}
```

### 4. **renderElements** - Renderizado en Página Final

**Ubicación**: `src/pages/PageResolver/renderElements.jsx`

**Renderiza medios en la página pública**:

```javascript
export function renderImageElement(element, index) {
    const { src, alt, width, height, customStyles } = element;

    const baseStyles = {
        width: width || '100%',
        height: height || 'auto',
        display: 'block'
    };

    const imgStyles = formatStyles({
        ...baseStyles,
        ...customStyles  // customStyles tiene prioridad
    });

    return <img src={src} alt={alt} style={imgStyles} />;
}

export function renderVideoElement(element, index) {
    const { type, youtubeId, src, poster, customStyles } = element;

    // YouTube con altura personalizable
    if (type === 'youtube' && youtubeId) {
        const hasCustomHeight = customStyles?.height || height;
        
        let containerStyles = {
            position: 'relative',
            ...videoStyles
        };

        // Aspect ratio 16:9 solo si NO hay height personalizado
        if (!hasCustomHeight) {
            containerStyles = {
                ...containerStyles,
                paddingBottom: '56.25%',
                height: 0
            };
        }

        // Poster como background
        if (poster) {
            containerStyles.backgroundImage = `url(${poster})`;
            containerStyles.backgroundSize = 'cover';
        }

        return (
            <div style={containerStyles}>
                <iframe src={`https://www.youtube.com/embed/${youtubeId}`} />
            </div>
        );
    }

    // Video upload
    return (
        <video
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            style={videoStyles}
        />
    );
}
```

---

## 🔄 Flujo de Datos

### Flujo Completo: Subir Imagen

```
1. Usuario selecciona archivo
   ↓
2. MediaTab.handleImageUpload()
   ↓
3. acideService.upload(file)
   ↓
4. ACIDE-PHP guarda en /uploads/
   ↓
5. ACIDE-PHP retorna { id, url, ... }
   ↓
6. onUpdateMultiple() actualiza elemento
   ↓
7. useElementEditor.updateMultipleFields()
   ↓
8. setContentSection() actualiza estado
   ↓
9. setSelectedElement() actualiza selección
   ↓
10. EditableContainer re-renderiza
   ↓
11. Preview se muestra en canvas
```

### Flujo Completo: Guardar Documento

```
1. Usuario click "Guardar"
   ↓
2. Editor.handleSave()
   ↓
3. useSaveDocument.saveDocument()
   ↓
4. Prepara dataToSave con contentSection
   ↓
5. acideService.update('pages', id, dataToSave)
   ↓
6. ACIDE-PHP guarda JSON completo
   ↓
7. JSON incluye customStyles y mediaData
   ↓
8. Confirmación al usuario
```

### Flujo Completo: Renderizar Página

```
1. Usuario visita página pública
   ↓
2. PageResolver carga documento
   ↓
3. loadPageData() obtiene de ACIDE
   ↓
4. renderPageSection() procesa secciones
   ↓
5. renderElement() para cada elemento
   ↓
6. renderImageElement() o renderVideoElement()
   ↓
7. Aplica customStyles desde JSON
   ↓
8. Renderiza <img> o <video> con estilos
```

---

## 🎨 Renderizado de Medios

### Imágenes

**Propiedades Soportadas**:
- `src`: URL de la imagen
- `alt`: Texto alternativo
- `width`: Ancho (px, %, auto)
- `height`: Alto (px, %, auto, vh)
- `customStyles`: Estilos CSS personalizados
  - `margin`: Alineación (0, 0 auto, 0 0 0 auto)
  - `object-fit`: Ajuste (contain, cover, fill)
  - `border-radius`: Esquinas redondeadas
  - `opacity`: Transparencia (0-1)
  - `box-shadow`: Sombra

**Ejemplo JSON**:
```json
{
  "id": "image-001",
  "element": "image",
  "src": "/uploads/2025/12/foto.jpg",
  "alt": "Foto de empresa",
  "width": "100%",
  "height": "auto",
  "mediaId": "media_6935725c4766d",
  "mediaData": {
    "id": "media_6935725c4766d",
    "filename": "foto.jpg",
    "url": "/uploads/2025/12/foto.jpg"
  },
  "customStyles": {
    "margin": "0 auto",
    "width": "80%",
    "border-radius": "12px",
    "opacity": "0.9"
  }
}
```

### Videos Upload

**Propiedades Soportadas**:
- `src`: URL del video
- `poster`: URL de imagen de portada
- `controls`: Mostrar controles (true/false)
- `autoplay`: Reproducción automática (true/false)
- `loop`: Repetir en bucle (true/false)
- `muted`: Silenciar audio (true/false)
- `width`, `height`, `customStyles`: Igual que imágenes

**Ejemplo JSON**:
```json
{
  "id": "video-001",
  "element": "video",
  "type": "upload",
  "src": "/uploads/2025/12/video.mp4",
  "poster": "/uploads/2025/12/poster.jpg",
  "controls": true,
  "autoplay": false,
  "loop": false,
  "muted": false,
  "width": "100%",
  "height": "auto",
  "customStyles": {
    "margin": "0 auto",
    "width": "80%"
  }
}
```

### Videos YouTube

**Propiedades Soportadas**:
- `type`: "youtube"
- `youtubeId`: ID del video (ej: "dQw4w9WgXcQ")
- `poster`: Imagen de fondo antes de cargar
- `autoplay`: Reproducción automática
- `muted`: Silenciar (necesario para autoplay)
- `width`, `height`, `customStyles`: Igual que imágenes

**Características Especiales**:
- **Aspect Ratio Automático**: Si NO hay `height`, usa 16:9
- **Altura Personalizada**: Si hay `height`, respeta ese valor
- **Poster**: Se muestra como `background-image` del contenedor

**Ejemplo JSON**:
```json
{
  "id": "video-002",
  "element": "video",
  "type": "youtube",
  "youtubeId": "dQw4w9WgXcQ",
  "poster": "/uploads/2025/12/youtube-poster.jpg",
  "autoplay": true,
  "muted": true,
  "width": "100%",
  "customStyles": {
    "margin": "0 auto",
    "width": "80%",
    "height": "400px"
  }
}
```

---

## 🎛️ Gestión de Estilos

### updateCustomStyle vs updateMultipleFields

**updateCustomStyle**: Para UN solo estilo CSS
```javascript
onUpdateCustomStyle(elementId, 'margin', '0 auto');
```

**updateMultipleFields**: Para MÚLTIPLES propiedades
```javascript
onUpdateMultiple(elementId, {
    src: '/uploads/image.jpg',
    mediaId: 'media_123',
    alt: 'Imagen',
    width: '100%',
    height: 'auto',
    mediaData: { ... }
});
```

### customStyles - Prioridad

```javascript
// Orden de prioridad (mayor a menor):
1. customStyles (StyleTab)
2. element.width / element.height (MediaTab)
3. Valores por defecto ('100%', 'auto')
```

**Ejemplo**:
```javascript
// Elemento tiene:
element.width = '100%'
element.customStyles.width = '80%'

// Resultado final:
width: '80%'  // customStyles gana
```

### formatStyles - Conversión CSS

**Ubicación**: `src/pages/PageResolver/renderElements.jsx`

Convierte CSS de kebab-case a camelCase para React:

```javascript
function formatStyles(styles) {
    const formatted = {};
    Object.keys(styles).forEach(key => {
        // background-color → backgroundColor
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        formatted[camelKey] = styles[key];
    });
    return formatted;
}

// Ejemplo:
formatStyles({
    'background-color': '#fff',
    'border-radius': '12px',
    'margin': '0 auto'
})
// Retorna:
{
    backgroundColor: '#fff',
    borderRadius: '12px',
    margin: '0 auto'
}
```

---

## 📡 API y Funciones

### acideService

**Ubicación**: `src/acide/acideService.js`

```javascript
// Lista medios
acideService.list('media')
// GET /api/media
// Retorna: Array<MediaObject>

// Sube archivo
acideService.upload(file)
// POST /api/upload
// Body: FormData con file
// Retorna: MediaObject

// Obtiene documento
acideService.get('pages', 'home')
// GET /api/pages/home
// Retorna: DocumentObject

// Guarda documento
acideService.update('pages', 'home', data)
// PUT /api/pages/home
// Body: JSON con documento completo
// Retorna: { success: true }
```

### useElementEditor

**Ubicación**: `src/hooks/useElementEditor.js`

```javascript
// Actualiza UN campo
updateElement(elementId, field, value)

// Actualiza MÚLTIPLES campos (NUEVO)
updateMultipleFields(elementId, fields)

// Actualiza estilo CSS
updateCustomStyle(elementId, property, value)

// Ejemplo:
updateMultipleFields('image-001', {
    src: '/uploads/image.jpg',
    mediaId: 'media_123',
    alt: 'Imagen',
    width: '100%',
    mediaData: { id: 'media_123', url: '/uploads/image.jpg' }
});
```

### useSaveDocument

**Ubicación**: `src/hooks/useSaveDocument.js`

```javascript
const { saving, saveDocument } = useSaveDocument();

// Guardar
await saveDocument(collection, id, document, pageData, contentSection);

// Logs de debug:
console.log('💾 Guardando en ACIDE:');
console.log('  ContentSection:', contentSection);
console.log('  Elementos con customStyles:', 
    contentSection.content?.filter(el => el.customStyles)
);
```

---

## 📊 Estructura de Datos

### MediaObject (ACIDE-PHP)

```typescript
interface MediaObject {
    id: string;              // "media_6935725c4766d"
    filename: string;        // "foto.jpg"
    title: string;           // "Foto de Empresa"
    type: string;            // "image/jpeg" | "video/mp4"
    size: number;            // 245678 (bytes)
    url: string;             // "/uploads/2025/12/foto.jpg"
    created_at: string;      // "2025-12-08T12:00:00Z"
}
```

### ImageElement (Documento JSON)

```typescript
interface ImageElement {
    id: string;              // "image-001"
    element: "image";
    src: string;             // "/uploads/2025/12/foto.jpg"
    alt: string;             // "Foto de empresa"
    width: string;           // "100%" | "500px"
    height: string;          // "auto" | "300px"
    class: string;           // "image-001"
    mediaId?: string;        // "media_6935725c4766d"
    mediaData?: MediaObject; // Objeto completo
    customStyles?: {
        margin?: string;     // "0 auto" | "0"
        width?: string;      // "80%"
        height?: string;     // "400px"
        objectFit?: string;  // "cover" | "contain"
        borderRadius?: string;
        opacity?: string;
        boxShadow?: string;
        [key: string]: any;
    };
}
```

### VideoElement (Documento JSON)

```typescript
interface VideoElement {
    id: string;              // "video-001"
    element: "video";
    type: "upload" | "youtube";
    
    // Upload
    src?: string;            // "/uploads/2025/12/video.mp4"
    
    // YouTube
    youtubeId?: string;      // "dQw4w9WgXcQ"
    
    // Común
    poster?: string;         // "/uploads/2025/12/poster.jpg"
    controls?: boolean;      // true
    autoplay?: boolean;      // false
    loop?: boolean;          // false
    muted?: boolean;         // false
    width?: string;          // "100%"
    height?: string;         // "auto" | "400px"
    class?: string;
    mediaId?: string;
    mediaData?: MediaObject;
    customStyles?: {
        margin?: string;
        width?: string;
        height?: string;
        [key: string]: any;
    };
}
```

---

## 💡 Casos de Uso

### Caso 1: Subir y Centrar Imagen

```javascript
// 1. Usuario sube imagen en MediaTab
handleImageUpload(file)
  ↓
// 2. Se guarda con propiedades base
{
  src: "/uploads/2025/12/foto.jpg",
  mediaId: "media_123",
  alt: "Foto",
  width: "100%",
  height: "auto"
}
  ↓
// 3. Usuario centra en StyleTab
handleCustomStyleChange('margin', '0 auto')
handleCustomStyleChange('width', '80%')
  ↓
// 4. Resultado final en JSON
{
  src: "/uploads/2025/12/foto.jpg",
  width: "100%",
  customStyles: {
    margin: "0 auto",
    width: "80%"
  }
}
  ↓
// 5. Renderizado final
<img 
  src="/uploads/2025/12/foto.jpg"
  style={{
    width: "80%",      // customStyles gana
    height: "auto",
    display: "block",
    margin: "0 auto"   // Centrado
  }}
/>
```

### Caso 2: Video YouTube con Altura Personalizada

```javascript
// 1. Usuario añade YouTube ID
youtubeId: "dQw4w9WgXcQ"
type: "youtube"
  ↓
// 2. Usuario establece altura en StyleTab
handleCustomStyleChange('height', '400px')
handleCustomStyleChange('width', '80%')
  ↓
// 3. Resultado en JSON
{
  type: "youtube",
  youtubeId: "dQw4w9WgXcQ",
  customStyles: {
    height: "400px",
    width: "80%",
    margin: "0 auto"
  }
}
  ↓
// 4. Renderizado (NO usa paddingBottom porque hay height)
<div style={{
  position: "relative",
  width: "80%",
  height: "400px",  // ✅ Altura personalizada
  margin: "0 auto"
}}>
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
</div>
```

### Caso 3: Video con Poster y Autoplay

```javascript
// 1. Usuario configura en MediaTab
src: "/uploads/2025/12/video.mp4"
poster: "/uploads/2025/12/poster.jpg"
autoplay: true
muted: true  // Necesario para autoplay
controls: true
  ↓
// 2. Renderizado
<video
  src="/uploads/2025/12/video.mp4"
  poster="/uploads/2025/12/poster.jpg"
  autoPlay={true}
  muted={true}
  controls={true}
  style={videoStyles}
>
  Tu navegador no soporta el elemento de video.
</video>
```

---

## 🔧 Troubleshooting

### Problema: Preview no se actualiza

**Causa**: `selectedElement` no se re-renderiza  
**Solución**: Usar `key={selectedElement.src}` en el preview

```javascript
<img
    key={selectedElement.src}  // ✅ Fuerza re-render
    src={selectedElement.src}
    alt="Preview"
/>
```

### Problema: Estilos no se guardan

**Causa**: Múltiples llamadas a `onUpdate` se sobrescriben  
**Solución**: Usar `onUpdateMultiple` para actualizar todo a la vez

```javascript
// ❌ Mal - solo la última se guarda
onUpdate(id, 'src', url);
onUpdate(id, 'mediaId', id);
onUpdate(id, 'alt', title);

// ✅ Bien - todo se guarda
onUpdateMultiple(id, {
    src: url,
    mediaId: id,
    alt: title
});
```

### Problema: Altura de YouTube no funciona

**Causa**: `paddingBottom: 56.25%` y `height: 0` sobrescriben altura personalizada  
**Solución**: Solo usar `paddingBottom` si NO hay altura personalizada

```javascript
const hasCustomHeight = customStyles?.height || height;

if (!hasCustomHeight) {
    // Usar aspect ratio 16:9
    containerStyles.paddingBottom = '56.25%';
    containerStyles.height = 0;
} else {
    // Usar altura personalizada
    // NO paddingBottom
}
```

---

## 📝 Notas de Implementación

### Decisiones de Diseño

1. **customStyles tiene prioridad**: Permite al usuario sobrescribir cualquier valor base
2. **updateMultipleFields**: Evita race conditions al actualizar múltiples propiedades
3. **formatStyles**: Convierte CSS para React (kebab-case → camelCase)
4. **Poster para YouTube**: Usa `background-image` en contenedor
5. **Aspect Ratio Condicional**: Solo si NO hay altura personalizada

### Mejoras Futuras

- [ ] Crop de imágenes en el editor
- [ ] Filtros CSS (blur, brightness, contrast)
- [ ] Lazy loading automático
- [ ] Optimización de imágenes (WebP, AVIF)
- [ ] Galería de imágenes (lightbox)
- [ ] Drag & drop para subir
- [ ] Búsqueda en biblioteca de medios
- [ ] Categorías/tags para medios

---

## 📚 Referencias

- **ACIDE-PHP API**: Ver documentación en `/docs/ACIDE_API.md`
- **Estructura de Documentos**: Ver `/docs/DOCUMENT_STRUCTURE.md`
- **Propiedades de Media**: Ver `/docs/MEDIA_OBJECT_PROPERTIES.md`
- **FSE Architecture**: Ver `/docs/FSE_ARCHITECTURE.md`

---

**Última actualización**: 2025-12-08  
**Autor**: Marco CMS Team  
**Estado**: ✅ Producción
