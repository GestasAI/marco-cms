# 🎯 Sistema de Botones "+" Estilo WordPress

## ✅ NUEVO SISTEMA IMPLEMENTADO

He implementado un sistema **estilo WordPress** con botones "+" para añadir bloques en cualquier posición.

### 🎨 Cómo Funciona

#### 1. **Botones "+" Automáticos**
Cuando pasas el mouse sobre cualquier elemento, aparecen botones "+":
- ➕ **Antes** del elemento (arriba)
- ➕ **Después** del elemento (abajo)
- ➕ **Dentro** del elemento (solo containers/sections)

#### 2. **Menú de Selección**
Al hacer click en un botón "+":
1. Se abre un **menú modal**
2. Muestra todos los bloques disponibles
3. Click en el bloque que quieras añadir
4. ✅ Se añade en la posición exacta

#### 3. **Visual Feedback**
- **Hover**: Outline punteado azul
- **Seleccionado**: Outline sólido azul
- **Botones +**: Círculos azules con icono

### 📊 Posiciones de Añadido

```
┌─────────────────────┐
│   ➕ ANTES          │  ← Click aquí para añadir ANTES
├─────────────────────┤
│                     │
│   ELEMENTO          │  ← Hover para ver botones
│                     │
│   ➕ DENTRO         │  ← Solo en containers
├─────────────────────┤
│   ➕ DESPUÉS        │  ← Click aquí para añadir DESPUÉS
└─────────────────────┘
```

### 🎯 Ejemplo de Uso

#### Crear una estructura Hero:

1. **Añadir Section**:
   - Click en "+" al final del canvas
   - Selecciona "Sección"
   - ✅ Section añadida

2. **Añadir Container dentro**:
   - Hover sobre la section
   - Click en "+" DENTRO
   - Selecciona "Contenedor"
   - ✅ Container dentro de section

3. **Añadir Título**:
   - Hover sobre el container
   - Click en "+" DENTRO
   - Selecciona "Título"
   - ✅ Título dentro del container

4. **Añadir Texto**:
   - Hover sobre el título
   - Click en "+" DESPUÉS
   - Selecciona "Texto"
   - ✅ Texto después del título

5. **Añadir Botón**:
   - Hover sobre el texto
   - Click en "+" DESPUÉS
   - Selecciona "Botón"
   - ✅ Botón después del texto

6. **Guardar**:
   - Click "Guardar" en toolbar
   - ✅ Estructura guardada en ACIDE

### 🎨 Estructura Final

```html
<section>
  <container>
    <h2>Título</h2>
    <p>Texto</p>
    <button>Botón</button>
  </container>
</section>
```

### 📁 Archivos Creados

1. **EditableContainer.jsx**
   - Componente con botones "+"
   - Menú selector de bloques
   - Gestión de posiciones

2. **editable-elements.css**
   - Estilos para botones "+"
   - Estilos para menú modal
   - Animaciones suaves

3. **useBlockManager.js** (actualizado)
   - Función `addBlock(block, targetId, position)`
   - Soporta: 'before', 'after', 'inside'

### 💡 Ventajas del Nuevo Sistema

✅ **Más Intuitivo**: Botones visuales claros
✅ **Más Preciso**: Control exacto de posición
✅ **Más Rápido**: No necesitas arrastrar
✅ **Estilo WordPress**: Familiar para usuarios
✅ **Sin Drag & Drop**: Más simple y confiable

### 🎨 Clases CSS

```css
.editable-element-wrapper    /* Wrapper con botones */
.add-block-trigger           /* Botón + */
.add-block-icon              /* Icono del botón */
.block-selector-menu         /* Menú modal */
.block-selector-item         /* Item de bloque */
```

### 🚀 Próximas Mejoras

1. **Copiar/Duplicar** bloques
2. **Eliminar** bloques con botón
3. **Reordenar** con drag & drop (opcional)
4. **Atajos de teclado** (Ctrl+C, Ctrl+V, Delete)

---

## ✅ Estado Actual

- ✅ Botones "+" en todas las posiciones
- ✅ Menú selector de bloques
- ✅ Añadir before/after/inside
- ✅ Visual feedback completo
- ✅ Guardado en ACIDE funcionando

**¡Ahora puedes construir páginas complejas con clicks precisos!** 🎉
