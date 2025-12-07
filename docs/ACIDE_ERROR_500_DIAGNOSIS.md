# 🔍 Diagnóstico ACIDE Error 500

## Problema
Al intentar guardar en el Editor, aparece "ACIDE Error 500"

## Causas Posibles

### 1. JSON muy grande
El JSON con toda la estructura `page` puede ser muy grande para PHP.

**Solución**: Verificar `php.ini`:
```ini
post_max_size = 50M
upload_max_filesize = 50M
memory_limit = 256M
```

### 2. Error de autenticación
ACIDE requiere token válido.

**Verificar**: 
```javascript
const token = localStorage.getItem('marco_token');
console.log('Token:', token);
```

### 3. Error en el JSON
El JSON puede tener caracteres especiales o estructura inválida.

**Verificar**:
```javascript
console.log('JSON válido:', JSON.stringify(dataToSave));
```

### 4. Permisos de escritura
PHP no puede escribir en `/public/data/pages/`

**Verificar**: Permisos de carpeta (777 o www-data)

## Solución Temporal

Mientras investigamos, podemos usar **guardado en localStorage**:

```javascript
const handleSave = async () => {
    try {
        // Guardar en localStorage temporalmente
        localStorage.setItem(`page_${id}`, JSON.stringify({
            ...document,
            page: updatedPageData
        }));
        
        console.log('✅ Guardado en localStorage');
        setHasChanges(false);
        
        // Intentar guardar en ACIDE
        try {
            await acideService.update(collection, id, dataToSave);
            console.log('✅ También guardado en ACIDE');
        } catch (err) {
            console.warn('⚠️ ACIDE falló, pero guardado en localStorage:', err);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
};
```

## Verificación de Rutas ACIDE

✅ **Rutas Disponibles**:
- `get` / `read` - Leer documento
- `update` / `create` - Crear/actualizar documento
- `delete` - Eliminar documento
- `list` - Listar colección
- `query` - Consultar con filtros

✅ **acideService.js**:
- `_phpRequest()` - Envía petición a PHP
- `update()` - Llama a `_phpRequest('update', ...)`

✅ **ACIDE.php**:
- Recibe action='update'
- Llama a `CRUDOperations::update()`

✅ **CRUDOperations.php**:
- Merge con datos existentes
- Guarda en archivo JSON
- Reconstruye `_index.json`

## Próximos Pasos

1. **Ver logs de PHP**: `public/acide/php_errors.log`
2. **Verificar consola del navegador**: Ver el payload exacto
3. **Probar con JSON pequeño**: Guardar solo `{ title: "Test" }`
4. **Verificar autenticación**: Token válido en localStorage

---

**Estado**: Investigando error 500
**Prioridad**: Alta
