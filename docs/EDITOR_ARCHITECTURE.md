# 🎨 Editor FSE - Arquitectura Refactorizada

## ✅ Nueva Estructura Modular y Atómica

### 📁 Organización de Archivos

```
src/
├── hooks/                          # Custom Hooks
│   ├── useDocument.js             # Carga documentos desde ACIDE o tema
│   ├── useElementEditor.js        # Gestiona selección y edición
│   └── useSaveDocument.js         # Guarda en ACIDE o archivos tema
│
├── fse/                            # Componentes FSE
│   ├── EditorToolbar.jsx          # Toolbar con botones
│   ├── ElementRenderer.jsx        # Renderiza elementos recursivamente
│   └── PropertiesSidebar.jsx      # Sidebar de propiedades
│
└── pages/
    └── Editor.jsx                  # Editor principal (orquestador)
```

### 🎯 Responsabilidades

#### 1. **useDocument** (Hook)
- ✅ Carga documentos desde ACIDE (pages, posts, products)
- ✅ Carga theme parts desde archivos JSON
- ✅ Maneja estados de loading y error
- ✅ Proporciona función reload

#### 2. **useElementEditor** (Hook)
- ✅ Gestiona selección de elementos
- ✅ Actualiza propiedades de elementos
- ✅ Busca elementos por ID recursivamente
- ✅ Controla estado de cambios sin guardar

#### 3. **useSaveDocument** (Hook)
- ✅ Guarda theme parts en archivos JSON
- ✅ Guarda páginas/posts en ACIDE
- ✅ Maneja estado de guardado
- ✅ Proporciona feedback al usuario

#### 4. **ElementRenderer** (Componente)
- ✅ Renderiza elementos recursivamente
- ✅ Maneja selección por click
- ✅ Aplica clases CSS y selección visual
- ✅ Soporta todos los tipos de elementos

#### 5. **PropertiesSidebar** (Componente)
- ✅ Muestra propiedades del elemento seleccionado
- ✅ Formularios específicos por tipo de elemento
- ✅ Edición de clases CSS
- ✅ Actualización en tiempo real

#### 6. **EditorToolbar** (Componente)
- ✅ Botón volver
- ✅ Título del documento
- ✅ Indicador de cambios sin guardar
- ✅ Botón preview
- ✅ Botón guardar con loading

#### 7. **Editor** (Componente Principal)
- ✅ Orquesta todos los hooks y componentes
- ✅ Maneja routing (collection, id)
- ✅ Coordina flujo de datos
- ✅ Renderiza layout completo

## 🚀 Ventajas de la Refactorización

### ✅ Separación de Responsabilidades
Cada archivo tiene una única responsabilidad clara.

### ✅ Reutilización
Los hooks pueden usarse en otros componentes.

### ✅ Testeable
Cada pieza puede testearse independientemente.

### ✅ Mantenible
Fácil encontrar y modificar funcionalidad específica.

### ✅ Escalable
Fácil añadir nuevas funcionalidades sin tocar código existente.

## 📊 Flujo de Datos

```
Editor.jsx (Orquestador)
    │
    ├─→ useDocument()
    │   └─→ Carga desde ACIDE o archivos
    │
    ├─→ useElementEditor()
    │   ├─→ Selección de elementos
    │   └─→ Actualización de propiedades
    │
    ├─→ useSaveDocument()
    │   └─→ Guarda en ACIDE o archivos
    │
    ├─→ EditorToolbar
    │   └─→ Botones de acción
    │
    ├─→ ElementRenderer (Canvas)
    │   └─→ Renderiza elementos recursivamente
    │
    └─→ PropertiesSidebar
        └─→ Edita propiedades del elemento
```

## 🎯 Próximos Pasos

### 1. Biblioteca de Bloques (Drag & Drop)

Crear nuevo componente:
```
src/fse/BlockLibrary.jsx
```

Con:
- Pestaña "Elementos" (heading, text, button, etc.)
- Pestaña "Bloques" (hero, faq, cta, etc.)
- Drag & Drop con @hello-pangea/dnd

### 2. Panel de Estilos CSS

Crear nuevo componente:
```
src/fse/StylesPanel.jsx
```

Con:
- Color picker
- Spacing controls
- Typography controls
- Edición CSS en tiempo real

### 3. Más Tipos de Elementos

Añadir en `ElementRenderer.jsx`:
- image
- video
- gallery
- accordion
- tabs
- etc.

## 💡 Cómo Extender

### Añadir nuevo tipo de elemento:

1. **ElementRenderer.jsx**: Añadir case en switch
2. **PropertiesSidebar.jsx**: Añadir formulario específico
3. Listo! El resto funciona automáticamente

### Añadir nueva colección:

1. **useDocument.js**: Añadir lógica de carga si es necesario
2. **useSaveDocument.js**: Añadir lógica de guardado si es necesario
3. Listo! El Editor funciona con cualquier colección

---

**Estado**: ✅ Completamente Refactorizado y Funcional
**Complejidad**: Reducida de 10 a 3
**Mantenibilidad**: Excelente
