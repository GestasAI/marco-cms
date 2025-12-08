# 📚 ANÁLISIS COMPLETO DEL SISTEMA EDITOR FSE

## 🔍 CÓMO FUNCIONA ACTUALMENTE

### 1. **Estructura de Datos**
- **contentSection**: Objeto con estructura jerárquica de elementos
- **Cada elemento tiene**:
  - `id`: Identificador único
  - `element`: Tipo (heading, text, button, image, video, container, section)
  - `class`: Clases CSS del tema (ej: "text-center p-lg")
  - `customStyles`: Objeto con estilos CSS inline personalizados
  - `content`: Array de elementos hijos (recursivo)
  - Propiedades específicas: `text`, `src`, `link`, etc.

### 2. **Sistema de Estilos CSS**
**IMPORTANTE**: El sistema NO modifica el CSS del tema. Funciona así:

#### A) **Clases CSS del Tema** (`cssClasses.js`)
- Clases predefinidas del tema: `text-center`, `p-lg`, `bg-primary`, etc.
- Se añaden/quitan de la propiedad `class` del elemento
- **NO se modifica el archivo CSS del tema**
- El tema carga su propio CSS: `/themes/gestasai-default/theme.css`

#### B) **Estilos Personalizados** (`customStyles`)
- Estilos CSS inline específicos del elemento
- Se guardan en `element.customStyles` como objeto JavaScript
- Ejemplo: `{ color: '#ff0000', fontSize: '20px', display: 'flex' }`
- Se aplican como atributo `style` en el HTML renderizado
- **NO afectan a otros elementos ni al tema**

#### C) **Clase Única por Elemento**
- Cada elemento tiene una clase única: `${element.element}-${element.id}`
- Ejemplo: `heading-abc123`, `button-xyz789`
- Permite aplicar estilos CSS específicos sin afectar otros elementos
- Se puede usar para CSS personalizado avanzado

### 3. **Gestión de Medios**
**Sistema actual** (`mediaManager.js`):
- **Upload**: Convierte archivos a Base64 temporalmente
- **Almacenamiento**: localStorage (temporal, para desarrollo)
- **Biblioteca**: Array de objetos con metadata de medios
- **Estructura de medio**:
  ```javascript
  {
    id: 'media-1234567890',
    type: 'image' | 'video',
    fileName: '1234567890-nombre.jpg',
    originalName: 'nombre.jpg',
    url: '/media/images/1234567890-nombre.jpg',
    base64: 'data:image/jpeg;base64,...', // Temporal
    size: 123456,
    mimeType: 'image/jpeg',
    uploadedAt: '2025-12-08T...'
  }
  ```
- **En producción**: Debería usar FormData y API backend

### 4. **Flujo de Edición**

#### A) **Selección de Elemento**
1. Usuario hace click en elemento en canvas
2. `selectElement(element)` actualiza estado
3. `PropertiesSidebar` y `StylesPanel` muestran propiedades

#### B) **Actualización de Propiedades**
1. Usuario cambia valor en sidebar
2. `updateElement(elementId, field, value)` se ejecuta
3. Hook busca elemento recursivamente en `contentSection`
4. Actualiza el campo específico
5. Actualiza estado y marca `hasChanges = true`
6. Elemento seleccionado se actualiza para reflejar cambios

#### C) **Actualización de Estilos CSS**
1. Usuario cambia estilo en `StylesPanel`
2. **Opción A**: Clase CSS del tema
   - `toggleClassHandler(className)` añade/quita clase
   - Actualiza `element.class`
3. **Opción B**: Estilo personalizado
   - `updateCustomStyle(elementId, property, value)` se ejecuta
   - Actualiza `element.customStyles[property]`
4. Cambios se reflejan inmediatamente en canvas

#### D) **Guardado**
1. Usuario hace click en "Guardar"
2. `saveDocument()` se ejecuta
3. **Si es theme part**: Guarda en archivo JSON
4. **Si es página/post**: Guarda en ACIDE-PHP
5. Marca `hasChanges = false`

### 5. **Componentes Actuales**

#### **PropertiesSidebar** (434 líneas)
- Muestra propiedades básicas del elemento
- Formularios específicos por tipo:
  - Heading: texto, tag (h1-h6)
  - Text: texto, tag (p, span, div)
  - Button: texto, link, target
  - Image: src, alt, upload, biblioteca
  - Video: YouTube ID o src, controls, autoplay, loop
- Botones de acción: ↑ Subir, ↓ Bajar, ⎘ Duplicar, ✕ Eliminar
- Gestión de medios con `mediaManager`

#### **StylesPanel** (693 líneas)
- 6 pestañas con iconos:
  - Layout: display, flex, grid, position
  - Spacing: margin, padding
  - Size: width, height, max-width
  - Typography: font, size, weight, line-height
  - Colors: text, background, border
  - Advanced: border-radius, box-shadow, opacity
- Botones de clases CSS del tema
- Inputs para estilos personalizados
- Vista previa de colores

### 6. **Hooks Personalizados**

#### **useDocument**
- Carga documento desde ACIDE o archivos JSON
- Maneja estados: loading, error, document, pageData, contentSection

#### **useElementEditor**
- Gestiona selección y edición de elementos
- Funciones: updateElement, updateCustomStyle, selectElement
- Busca elementos recursivamente en árbol

#### **useSaveDocument**
- Guarda cambios en ACIDE o archivos
- Maneja estado de guardado

#### **useBlockManager**
- Añadir, eliminar, mover, duplicar bloques
- Gestiona la estructura jerárquica

## 🎯 MEJORAS SOLICITADAS

### 1. **Una Sola Columna con 5 Pestañas**
Unificar `PropertiesSidebar` + `StylesPanel` en un solo componente con pestañas:
- **Content**: Propiedades básicas (ID, clase, texto, links)
- **Sections**: Layout, display, flexbox, grid, posición
- **Style**: Colores, tipografía, spacing, bordes, sombras
- **Media**: Gestión de medios (solo para image/video)
- **Hierarchy**: Árbol de estructura + acciones

### 2. **Botones Minimalistas**
✅ **YA HECHO**: Cambiados a texto compacto (↑ Subir, ↓ Bajar, etc.)

### 3. **Vistas Más Compactas**
- Reducir padding/margin
- Inputs más pequeños
- Labels más cortos
- Mejor uso del espacio vertical

### 4. **Árbol de Estructura**
- Mostrar jerarquía completa del documento
- Drag & drop para reorganizar
- Expand/collapse de nodos
- Selección visual del elemento activo

## ⚠️ RESTRICCIONES IMPORTANTES

### **NO HACER**:
1. ❌ NO modificar archivos CSS del tema
2. ❌ NO cambiar la estructura de datos de elementos
3. ❌ NO romper la compatibilidad con ACIDE-PHP
4. ❌ NO eliminar funcionalidad existente
5. ❌ NO cambiar cómo se guardan los datos

### **SÍ HACER**:
1. ✅ Reorganizar UI para mejor UX
2. ✅ Añadir árbol de estructura
3. ✅ Compactar vistas
4. ✅ Mejorar navegación con pestañas
5. ✅ Mantener toda la funcionalidad existente

## 📋 PLAN DE IMPLEMENTACIÓN

### Fase 1: Crear Componente Unificado con Pestañas
1. Crear `UnifiedSidebar.jsx` que combine ambos sidebars
2. Usar sistema de pestañas similar al actual de `StylesPanel`
3. Migrar contenido de `PropertiesSidebar` a pestaña "Content"
4. Migrar contenido de `StylesPanel` a pestañas "Sections" y "Style"
5. Crear pestaña "Media" que detecte tipo de elemento
6. Crear pestaña "Hierarchy" con árbol de estructura

### Fase 2: Optimizar Estilos CSS
1. Reducir tamaños de fuente
2. Compactar spacing
3. Mejorar grid layouts
4. Mantener legibilidad

### Fase 3: Implementar Árbol de Estructura
1. Componente recursivo para mostrar jerarquía
2. Drag & drop para reorganizar
3. Integrar con `useBlockManager`

### Fase 4: Testing
1. Verificar que todo funciona igual
2. Probar guardado en ACIDE
3. Verificar que estilos se aplican correctamente
4. Comprobar que medios funcionan

---

**Conclusión**: El sistema está bien diseñado y funciona correctamente. Las mejoras son principalmente de UI/UX sin cambiar la lógica subyacente.
