# 📋 Plan de Actualización del Editor FSE

## Estado Actual
✅ PageResolver renderiza correctamente el JSON con IDs y clases
✅ La página pública se muestra correctamente
❌ El Editor aún usa el sistema antiguo de bloques

## Objetivo
Actualizar el Editor para trabajar con la nueva estructura JSON:
- Identificar elementos por ID
- Mostrar tipo de elemento en sidebar (header, footer, hero, section, button, etc.)
- Editar inline usando IDs
- Guardar cambios en el JSON del documento

## Estructura del JSON

```json
{
  "page": {
    "sections": [
      {
        "section": "header",
        "id": "header-0002",
        "content": [
          {
            "element": "button",
            "id": "admin-btn-0008",
            "class": "btn btn-primary",
            "text": "Admin",
            "link": "/dashboard"
          }
        ]
      }
    ]
  }
}
```

## Cambios Necesarios en Editor.jsx

### 1. Cargar JSON del documento
```javascript
const loadContext = async () => {
    // Cargar documento desde ACIDE
    let docData = await acideService.get(collection, id);
    setDocument(docData);
    
    // El JSON ya está en docData.page
    setPageData(docData.page);
};
```

### 2. Renderizar con IDs seleccionables
```javascript
const renderElement = (element, path) => {
    const isSelected = selectedElementId === element.id;
    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
        setSelectedElement(element);
    };
    
    // Renderizar según element.element
    if (element.element === 'button') {
        return (
            <a 
                id={element.id}
                className={`${element.class} ${isSelected ? 'element-selected' : ''}`}
                onClick={handleClick}
            >
                {element.text}
            </a>
        );
    }
    // ... más tipos
};
```

### 3. Sidebar muestra tipo de elemento
```javascript
<div className="editor-sidebar">
    {selectedElement ? (
        <>
            <h4>Tipo: {selectedElement.element}</h4>
            <p>ID: {selectedElement.id}</p>
            <p>Sección: {getSectionType(selectedElement.id)}</p>
            
            {/* Propiedades editables */}
            {selectedElement.element === 'button' && (
                <>
                    <input 
                        value={selectedElement.text}
                        onChange={(e) => updateElement(selectedElement.id, 'text', e.target.value)}
                    />
                    <input 
                        value={selectedElement.link}
                        onChange={(e) => updateElement(selectedElement.id, 'link', e.target.value)}
                    />
                </>
            )}
        </>
    ) : (
        <p>Selecciona un elemento</p>
    )}
</div>
```

### 4. Actualizar elemento por ID
```javascript
const updateElement = (elementId, field, value) => {
    const updateInTree = (sections) => {
        return sections.map(section => ({
            ...section,
            content: section.content?.map(el => {
                if (el.id === elementId) {
                    return { ...el, [field]: value };
                }
                if (el.content) {
                    return { ...el, content: updateInTree([{ content: el.content }])[0].content };
                }
                return el;
            })
        }));
    };
    
    const updatedPage = {
        ...pageData,
        sections: updateInTree(pageData.sections)
    };
    
    setPageData(updatedPage);
    setHasChanges(true);
};
```

### 5. Guardar en ACIDE
```javascript
const handleSave = async () => {
    const dataToSave = {
        ...document,
        page: pageData  // Guardar el JSON actualizado
    };
    
    await acideService.update(collection, id, dataToSave);
    setHasChanges(false);
    alert('✅ Guardado exitosamente');
};
```

## Próximos Pasos

1. ✅ Crear nuevo Editor.jsx con la estructura correcta
2. ✅ Implementar renderizado con selección por ID
3. ✅ Sidebar dinámico según tipo de elemento
4. ✅ Función updateElement recursiva
5. ✅ Guardar en ACIDE correctamente

---

**Prioridad**: ALTA
**Estimación**: 1 hora
**Estado**: Listo para implementar
