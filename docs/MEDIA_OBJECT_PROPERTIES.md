# 📸 Objeto Media - Propiedades Guardadas en Documento

## ✅ Propiedades Guardadas al Seleccionar Media

Cuando el usuario selecciona una imagen desde la **Biblioteca de Medios** o **sube una nueva**, se guardan las siguientes propiedades en el elemento del documento:

### 1. **Propiedades Básicas del Elemento**

```javascript
{
    id: "image-0001",           // ID único del elemento
    element: "image",           // Tipo de elemento
    src: "https://...",         // URL de la imagen
    mediaId: "media-uuid-123",  // ID del objeto media en acideService
    alt: "Título de la imagen", // Texto alternativo (SEO)
    width: "100%",              // Ancho (editable en FSE)
    height: "auto",             // Alto (editable en FSE)
}
```

### 2. **Metadata Completa del Media**

```javascript
{
    mediaData: {
        id: "media-uuid-123",           // ID en acideService
        filename: "fondo_Empresa.jpg",  // Nombre del archivo
        title: "fondo_Empresa",         // Título (editable en Dashboard)
        type: "image/jpeg",             // MIME type
        size: 586813,                   // Tamaño en bytes
        url: "https://...",             // URL completa
        created_at: "2025-12-08T..."    // Fecha de creación
    }
}
```

## 🎨 Propiedades Editables en FSE

El usuario puede editar estas propiedades desde las pestañas del sidebar:

### **Media Tab**:
- ✅ `src` - URL de la imagen
- ✅ `alt` - Texto alternativo
- ✅ `width` - Ancho (100%, 500px, auto)
- ✅ `height` - Alto (100%, 500px, auto)

### **Style Tab**:
- ✅ `opacity` - Opacidad (0-1)
- ✅ `border` - Bordes
- ✅ `borderRadius` - Bordes redondeados
- ✅ `boxShadow` - Sombra

### **Sections Tab**:
- ✅ `display` - Tipo de display (block, inline-block, flex)
- ✅ `alignSelf` - Alineación (flex-start, center, flex-end)
- ✅ `margin` - Márgenes
- ✅ `padding` - Relleno

### **Custom Styles**:
```javascript
{
    customStyles: {
        opacity: "0.8",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        objectFit: "cover",
        // ... cualquier CSS válido
    }
}
```

## 📊 Ejemplo Completo de Elemento Imagen

```json
{
    "id": "image-0001",
    "element": "image",
    "src": "https://storage.example.com/media/fondo_Empresa.jpg",
    "mediaId": "550e8400-e29b-41d4-a716-446655440000",
    "alt": "Fondo corporativo de la empresa",
    "width": "100%",
    "height": "auto",
    "class": "image-0001",
    "mediaData": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "filename": "fondo_Empresa.jpg",
        "title": "fondo_Empresa",
        "type": "image/jpeg",
        "size": 586813,
        "url": "https://storage.example.com/media/fondo_Empresa.jpg",
        "created_at": "2025-12-08T10:30:00Z"
    },
    "customStyles": {
        "opacity": "1",
        "borderRadius": "0px",
        "objectFit": "cover",
        "maxWidth": "100%"
    }
}
```

## 🔄 Flujo de Datos

```
1. Usuario selecciona imagen en Biblioteca
   ↓
2. handleSelectFromLibrary(media)
   ↓
3. onUpdate() guarda:
   - src (URL)
   - mediaId (ID)
   - alt (título)
   - mediaData (objeto completo)
   - width (100% por defecto)
   - height (auto por defecto)
   ↓
4. Elemento se actualiza en contentSection
   ↓
5. EditableContainer renderiza imagen
   ↓
6. Usuario puede editar CSS en sidebar
   ↓
7. customStyles se aplican vía inline styles
```

## 🎯 Ventajas de Guardar mediaData

1. **Referencia Completa**: Tenemos toda la info del archivo
2. **Trazabilidad**: Sabemos qué archivo se usó
3. **Re-sincronización**: Podemos actualizar si cambia en Dashboard
4. **Metadata**: Acceso a tipo, tamaño, fecha
5. **Debugging**: Fácil identificar problemas

## 🔍 Verificación en Console

Cuando seleccionas un media, verás en console:

```javascript
✅ Media seleccionado: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    url: "https://...",
    title: "fondo_Empresa",
    filename: "fondo_Empresa.jpg",
    type: "image/jpeg"
}
```

## 📝 Notas Importantes

- ✅ `mediaId` permite vincular con acideService
- ✅ `mediaData` es opcional pero recomendado
- ✅ `width` y `height` se establecen por defecto si no existen
- ✅ `alt` se copia del `title` del media
- ✅ Todas las propiedades son editables después
- ✅ Los cambios se guardan en el documento JSON

## 🚀 Próximos Pasos

1. ✅ Objeto media se guarda completo
2. ✅ Propiedades editables en FSE
3. ⏳ Sincronización si media cambia en Dashboard
4. ⏳ Validación de URLs rotas
5. ⏳ Lazy loading de imágenes
6. ⏳ Optimización automática de tamaños

---

**Estado**: ✅ Implementado
**Versión**: 1.0
**Fecha**: 2025-12-08
