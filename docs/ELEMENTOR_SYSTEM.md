# 🎯 Marco CMS - Sistema Completo Estilo Elementor

## Estado Actual ✅

### Implementado
- ✅ Edición inline con doble click
- ✅ Selección de bloques con single click
- ✅ BlockInspector con propiedades CSS
- ✅ BlockInspector con propiedades de contenido
- ✅ Prevención de navegación en botones

### Pendiente ⏳

## 1. Sistema de IDs Únicos

### Problema
Los bloques no tienen IDs únicos, se identifican por path (0.1.2), lo que dificulta el guardado.

### Solución
Añadir `id` único a cada bloque al cargar el template:

```javascript
// En Editor.jsx - función loadContext
const addIdsToBlocks = (blocks, prefix = 'block') => {
    return blocks.map((block, index) => {
        const id = `${prefix}-${Date.now()}-${index}`;
        const newBlock = { ...block, id };
        if (block.blocks) newBlock.blocks = addIdsToBlocks(block.blocks, id);
        if (block.innerBlocks) newBlock.innerBlocks = addIdsToBlocks(block.innerBlocks, id);
        return newBlock;
    });
};

// Después de cargar template
setTemplate({ ...tmpl, blocks: addIdsToBlocks(tmpl.blocks) });
```

## 2. Guardar Cambios Inline

### Problema
Los cambios de edición inline no se guardan en el template.

### Solución
Añadir función `handleContentUpdate` en Editor.jsx:

```javascript
const handleContentUpdate = (blockId, field, value) => {
    if (!template) return;
    
    const updateBlockById = (blocks) => {
        return blocks.map(block => {
            if (block.id === blockId) {
                return { ...block, [field]: value };
            }
            if (block.blocks) {
                return { ...block, blocks: updateBlockById(block.blocks) };
            }
            if (block.innerBlocks) {
                return { ...block, innerBlocks: updateBlockById(block.innerBlocks) };
            }
            return block;
        });
    };
    
    setTemplate({
        ...template,
        blocks: updateBlockById(template.blocks)
    });
    setHasChanges(true);
};
```

### Pasar a BlockRenderer

```javascript
<BlockRenderer
    blocks={template.blocks}
    context={{
        post: document,
        editable: true,
        updatePost: handleDocumentUpdate,
        updateContent: handleContentUpdate,  // NUEVO
        selectedBlockId,
        selectBlock: handleSelectBlock
    }}
/>
```

### Usar en BlockRenderer

```javascript
// En el handleBlur de edición inline
const handleBlur = () => {
    setIsEditing(false);
    if (context.updateContent) {
        context.updateContent(block.id, 'content', editValue);  // Para headings/paragraphs
        // o
        context.updateContent(block.id, 'text', editValue);  // Para buttons
    }
};
```

## 3. Biblioteca de Bloques Prediseñados

### Estructura
Crear archivo `src/fse/BlockLibrary.js`:

```javascript
export const BLOCK_LIBRARY = {
    heroes: [
        {
            id: 'hero-gradient',
            name: 'Hero con Gradiente',
            category: 'heroes',
            thumbnail: '/thumbnails/hero-gradient.png',
            template: {
                type: 'core/section',
                className: 'hero',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container hero-content',
                        blocks: [
                            {
                                type: 'core/heading',
                                level: 1,
                                content: 'Título Principal',
                                className: ''
                            },
                            {
                                type: 'core/paragraph',
                                content: 'Descripción del hero',
                                className: 'text-lead'
                            },
                            {
                                type: 'core/button',
                                text: 'Comenzar',
                                link: '#',
                                className: 'btn btn-gradient'
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'hero-simple',
            name: 'Hero Simple',
            category: 'heroes',
            template: {
                type: 'core/section',
                className: 'section py-5xl text-center',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container',
                        blocks: [
                            {
                                type: 'core/heading',
                                level: 1,
                                content: 'Bienvenido',
                                className: ''
                            },
                            {
                                type: 'core/paragraph',
                                content: 'Tu descripción aquí',
                                className: 'text-body'
                            }
                        ]
                    }
                ]
            }
        }
    ],
    features: [
        {
            id: 'features-grid-3',
            name: 'Grid de Características 3 Columnas',
            category: 'features',
            template: {
                type: 'core/section',
                className: 'section',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container',
                        blocks: [
                            {
                                type: 'core/heading',
                                level: 2,
                                content: 'Características',
                                className: 'text-center mb-2xl'
                            },
                            {
                                type: 'core/group',
                                className: 'grid grid-3',
                                blocks: [
                                    {
                                        type: 'core/group',
                                        className: 'card',
                                        blocks: [
                                            {
                                                type: 'core/heading',
                                                level: 3,
                                                content: 'Característica 1'
                                            },
                                            {
                                                type: 'core/paragraph',
                                                content: 'Descripción de la característica'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'core/group',
                                        className: 'card',
                                        blocks: [
                                            {
                                                type: 'core/heading',
                                                level: 3,
                                                content: 'Característica 2'
                                            },
                                            {
                                                type: 'core/paragraph',
                                                content: 'Descripción de la característica'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'core/group',
                                        className: 'card',
                                        blocks: [
                                            {
                                                type: 'core/heading',
                                                level: 3,
                                                content: 'Característica 3'
                                            },
                                            {
                                                type: 'core/paragraph',
                                                content: 'Descripción de la característica'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ],
    cta: [
        {
            id: 'cta-centered',
            name: 'Call to Action Centrado',
            category: 'cta',
            template: {
                type: 'core/section',
                className: 'section text-center',
                blocks: [
                    {
                        type: 'core/container',
                        className: 'container',
                        blocks: [
                            {
                                type: 'core/heading',
                                level: 2,
                                content: '¿Listo para comenzar?'
                            },
                            {
                                type: 'core/paragraph',
                                content: 'Únete a miles de usuarios satisfechos',
                                className: 'text-lead mb-xl'
                            },
                            {
                                type: 'core/button',
                                text: 'Empezar Ahora',
                                link: '#',
                                className: 'btn btn-primary btn-lg'
                            }
                        ]
                    }
                ]
            }
        }
    ]
};
```

## 4. Actualizar BlockInserter

Modificar `src/fse/BlockInserter.jsx` para mostrar bloques prediseñados:

```javascript
import { BLOCK_LIBRARY } from './BlockLibrary';

export default function BlockInserter({ onInsert }) {
    const [activeCategory, setActiveCategory] = useState('heroes');
    
    const categories = [
        { id: 'heroes', label: '🎯 Heroes', icon: '🎯' },
        { id: 'features', label: '⭐ Características', icon: '⭐' },
        { id: 'cta', label: '📢 Call to Action', icon: '📢' }
    ];
    
    return (
        <div className="block-inserter">
            <div className="block-inserter-header">
                <h3>Biblioteca de Bloques</h3>
            </div>
            
            <div className="block-categories">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>
            
            <div className="block-list">
                {BLOCK_LIBRARY[activeCategory]?.map(block => (
                    <div
                        key={block.id}
                        className="block-item"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('block-template', JSON.stringify(block.template));
                        }}
                        onClick={() => onInsert(block.template)}
                    >
                        <div className="block-thumbnail">
                            {block.thumbnail ? (
                                <img src={block.thumbnail} alt={block.name} />
                            ) : (
                                <div className="block-placeholder">📦</div>
                            )}
                        </div>
                        <div className="block-name">{block.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

## 5. Implementar Drag & Drop

### En Editor.jsx

```javascript
const handleInsertBlock = (blockTemplate) => {
    if (!template) return;
    
    // Añadir ID único al bloque
    const newBlock = {
        ...blockTemplate,
        id: `block-${Date.now()}`
    };
    
    // Añadir al final de los bloques
    const updatedTemplate = {
        ...template,
        blocks: [...template.blocks, newBlock]
    };
    
    setTemplate(updatedTemplate);
    setHasChanges(true);
};
```

### En Canvas (Editor.jsx)

```javascript
<div 
    className="editor-canvas-container" 
    onClick={handleCanvasClick}
    onDrop={(e) => {
        e.preventDefault();
        const blockData = e.dataTransfer.getData('block-template');
        if (blockData) {
            handleInsertBlock(JSON.parse(blockData));
        }
    }}
    onDragOver={(e) => e.preventDefault()}
>
```

## 6. Guardar en JSON

### Para Theme Parts

```javascript
const saveThemePart = async () => {
    // Generar CSS personalizado
    const customCSS = generateCustomCSS();
    
    // Guardar JSON (necesita endpoint backend)
    const response = await fetch(`/api/theme-parts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            template,
            customCSS
        })
    });
    
    if (response.ok) {
        setHasChanges(false);
        alert('Guardado exitosamente');
    }
};
```

## Resumen de Archivos a Modificar

1. ✅ `src/pages/Editor.jsx` - Añadir handleContentUpdate, IDs únicos
2. ✅ `src/fse/BlockRenderer.jsx` - Usar updateContent en handleBlur
3. ✅ `src/fse/BlockLibrary.js` - CREAR biblioteca de bloques
4. ✅ `src/fse/BlockInserter.jsx` - Mostrar bloques prediseñados
5. ✅ Backend - Endpoint para guardar theme parts

## Próximos Pasos

1. Implementar sistema de IDs
2. Conectar handleContentUpdate
3. Crear biblioteca de bloques
4. Implementar drag & drop
5. Crear endpoint de guardado

---

**Estado**: Documentación completa lista para implementación
**Prioridad**: Alta
**Estimación**: 2-3 horas de desarrollo
