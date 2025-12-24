# Documentación Técnica: Gestión de Medios en Marco CMS (FSE)

Esta documentación detalla el funcionamiento del sistema centralizado de medios dentro del Editor FSE (Full Site Editing) de Marco CMS, asegurando la coherencia con el Dashboard y la persistencia de datos.

## 1. Arquitectura del Sistema de Medios

El sistema se basa en una integración triple entre la interfaz de usuario, el servicio de datos y el almacenamiento físico.

### Componentes Clave:
- **`MediaControl.jsx`**: Punto de entrada en la barra lateral. Gestiona la previsualización, la subida directa y el acceso a la biblioteca.
- **`MediaLibraryModal.jsx`**: Modal a pantalla completa que replica el Dashboard de Medios. Permite navegar por los miles de archivos existentes y seleccionar uno para el diseño.
- **`acideService.js`**: El motor que comunica con el backend. Maneja la subida física de archivos y el registro de metadatos en la colección `media`.

---

## 2. Flujo de Trabajo Oficial (Workflow)

Para mantener la integridad de la biblioteca, cualquier acción de medios debe seguir este procedimiento:

### A. Subida de Archivos (Upload)
1. **Subida Física**: Se llama a `acideService.upload(file)`, que guarda el archivo en el servidor y devuelve una URL pública.
2. **Registro en Base de Datos**: Inmediatamente después, se debe llamar a `acideService.create('media', entry)` para registrar el archivo en la colección global. Esto garantiza que el archivo aparezca en el Dashboard de Medios.
3. **Actualización de Elemento**: Se actualiza la propiedad `src` del elemento en el editor.

### B. Selección desde Biblioteca
1. El modal carga la lista completa usando `acideService.list('media')`.
2. Se filtran los archivos por tipo (`image` o `video`) para facilitar la búsqueda.
3. Al seleccionar, se extrae la URL y los metadatos (Alt/Título) y se aplican al elemento del canvas.

---

## 3. Renderizado en el Canvas (WYSIWYG)

Para garantizar que "lo que ves es lo que tienes", el componente `MediaRenderers.jsx` aplica las siguientes reglas:

- **Proporción Natural**: Si no hay una altura definida por el usuario, se usa `height: auto` para evitar que la imagen se colapse.
- **Modo Dinámico**: Si el elemento es dinámico (ej: Imagen Destacada) pero no tiene valor aún, el renderizador muestra la imagen manual por defecto para evitar huecos vacíos en el diseño.
- **Estilos Avanzados**: Se aplican dinámicamente márgenes, rellenos (padding) y bordes configurados desde la pestaña de Estilos.

---

## 4. Gestión de Estado y Concurrencia

Debido a que el editor puede realizar múltiples actualizaciones rápidas (ej: cambiar la URL y el Alt simultáneamente), el hook `useElementEditor.js` utiliza **actualizaciones de estado funcionales** (`prev => ...`).

**REGLA DE ORO PARA IA/DESARROLLADORES:**
Nunca actualices el estado del documento usando el valor actual de la variable, usa siempre la función de retorno para evitar colisiones de datos:
```javascript
// CORRECTO
setContentSection(prev => ({ ...prev, [field]: value }));

// INCORRECTO (Causa pérdida de datos en actualizaciones rápidas)
setContentSection({ ...contentSection, [field]: value });
```

---

## 5. Ubicación de Archivos Relacionados

| Función | Archivo |
| :--- | :--- |
| Control Lateral | `src/fse/style-controls/MediaControl.jsx` |
| Modal Biblioteca | `src/fse/components/MediaLibraryModal.jsx` |
| Renderizado Imagen/Video | `src/fse/components/renderers/MediaRenderers.jsx` |
| Lógica de Datos | `src/acide/acideService.js` |
| Hook de Edición | `src/hooks/useElementEditor.js` |

---

*Documentación generada para asegurar la escalabilidad y el mantenimiento de Marco CMS.*
