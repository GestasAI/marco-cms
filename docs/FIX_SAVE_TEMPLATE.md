# 🔧 Corrección Crítica: Guardar Template en ACIDE

## Problema Identificado

Los cambios inline se guardan en memoria pero NO se persisten en ACIDE porque:
- El template modificado NO se guarda en `document.content`
- ACIDE solo recibe el documento sin el template actualizado
- El frontend renderiza desde `document.content` (JSON del template)

## Solución

### En `handleSave` (Editor.jsx línea 184-218)

**ANTES** (Incorrecto):
```javascript
const dataToSave = { ...document };
const savedDoc = await acideService.update(collection, finalId, dataToSave);
```

**DESPUÉS** (Correcto):
```javascript
const dataToSave = { 
    ...document,
    content: JSON.stringify(template)  // ← CRÍTICO: Guardar template modificado
};
const savedDoc = await acideService.update(collection, finalId, dataToSave);
```

### Código Completo de handleSave

```javascript
const handleSave = async () => {
    if (!document) return;
    setSaving(true);
    try {
        if (collection === 'theme-parts') {
            const customCSS = generateCustomCSS();
            console.log("Guardando theme part:", { id, template, customCSS });
            // TODO: Implementar endpoint backend para theme parts
            alert("Theme part guardado (simulado)");
            setHasChanges(false);
            setSaving(false);
            return;
        }

        // PAGES / POSTS
        const finalId = id === 'new' ? undefined : id;
        const dataToSave = { 
            ...document,
            content: JSON.stringify(template)  // ← Guardar template modificado
        };
        
        if (!dataToSave.slug && dataToSave.title) {
            dataToSave.slug = dataToSave.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }

        console.log('💾 Guardando en ACIDE:', dataToSave);
        const savedDoc = await acideService.update(collection, finalId, dataToSave);
        
        setDocument(savedDoc);
        setHasChanges(false);

        if (id === 'new' && savedDoc.id) {
            navigate(`/editor/${collection}/${savedDoc.id}`, { replace: true });
        } else {
            // Recargar para ver cambios
            alert('✅ Guardado exitosamente. Recargando...');
            setTimeout(() => window.location.reload(), 500);
        }
        
    } catch (err) {
        console.error('Error guardando:', err);
        alert("❌ Error: " + err.message);
    } finally {
        setSaving(false);
    }
};
```

## Flujo Correcto

```
1. Usuario edita inline (doble click)
   ↓
2. handleContentUpdate actualiza template en memoria
   ↓
3. Usuario click "Guardar"
   ↓
4. handleSave serializa template → document.content
   ↓
5. acideService.update envía a ACIDE
   ↓
6. ACIDE persiste en JSON
   ↓
7. PageResolver carga document.content
   ↓
8. Frontend renderiza template actualizado
```

## Cómo Aplicar

Reemplazar la función `handleSave` en `src/pages/Editor.jsx` (líneas 184-218) con el código de arriba.

## Verificación

Después de aplicar:
1. Editar un título (doble click)
2. Cambiar texto
3. Click "Guardar"
4. Ir a la página pública (`/inicio`)
5. ✅ Los cambios deben aparecer

---

**Prioridad**: CRÍTICA
**Estado**: Solución lista para aplicar
**Archivo**: `src/pages/Editor.jsx`
**Líneas**: 184-218
