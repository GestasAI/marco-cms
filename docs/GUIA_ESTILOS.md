# 🎨 Guía de Uso: Sistema de Estilos

## ✅ Sistema Completamente Implementado

El editor ahora tiene un sistema completo de estilos que combina:
- **Clases del tema** (globales, reutilizables)
- **Estilos personalizados** (únicos por elemento)

---

## 📋 Cómo Usar

### 1️⃣ Seleccionar un Elemento

1. **Click** en cualquier elemento del canvas
2. Se abre el panel de **Propiedades** (derecha)
3. Se abre el panel de **Estilos** (debajo)

### 2️⃣ Aplicar Clases del Tema

**Panel de Estilos → Pestañas**

#### 📐 Layout
- Container, Flex, Grid
- Utilidades (width, rounded, shadow)

#### 📏 Spacing
- **Padding**: XS, SM, MD, LG, XL, 2XL
- **Margin**: XS, SM, MD, LG, XL, 2XL

#### 🔤 Typography
- **Títulos**: H1, H2, H3, H4, H5, H6
- **Texto**: Lead, Body, Small, XSmall
- **Alineación**: Left, Center, Right

#### 🎨 Colors
- **Color de Texto**: Primary, Secondary, White, Black
- **Color de Fondo**: Primary, Secondary, White, Gradient
- **Botones**: Primary, Secondary, Outline (solo para botones)
- **Secciones**: Hero, Section Dark (solo para secciones)

**Cómo funciona**:
- ✅ Click en un botón → Añade la clase
- ✅ Click de nuevo → Quita la clase
- ✅ Botón azul = Clase aplicada
- ✅ Botón blanco = Clase no aplicada

### 3️⃣ Estilos Personalizados

**Panel de Estilos → Pestaña "Personalizado" (icono sliders)**

Controles disponibles:

#### Tamaño de Fuente
```
Ejemplo: 2rem, 24px, 1.5em
```

#### Color
- **Color picker** (selector visual)
- **Input manual** (#ff0000, rgb(255,0,0))

#### Color de Fondo
- **Color picker** (selector visual)
- **Input manual** (#ffffff, rgba(255,255,255,0.5))

#### Padding
```
Ejemplos:
- 1rem (todos los lados)
- 10px 20px (vertical horizontal)
- 5px 10px 15px 20px (top right bottom left)
```

#### Margin
```
Misma sintaxis que padding
```

#### Border Radius
```
Ejemplos:
- 0.5rem (todos los bordes)
- 8px
- 50% (círculo)
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Título Hero Personalizado

1. **Selecciona** el título
2. **Pestaña Typography**:
   - Click en "H1"
3. **Pestaña Colors**:
   - Click en "White"
4. **Pestaña Personalizado**:
   - Font Size: `4rem`
   - Letter Spacing: `-0.05em`
5. **Guardar**

**Resultado**:
```html
<h1 class="heading-1 text-white heading-hero-title-0012"
    style="font-size: 4rem; letter-spacing: -0.05em;">
    Bienvenido
</h1>
```

### Ejemplo 2: Botón con Estilo Único

1. **Selecciona** el botón
2. **Pestaña Colors**:
   - Click en "Primary"
3. **Pestaña Personalizado**:
   - Background Color: `#ff6b6b` (rojo)
   - Padding: `1rem 2rem`
   - Border Radius: `2rem`
4. **Guardar**

**Resultado**:
```html
<a class="btn btn-primary button-cta-0045"
   style="background-color: #ff6b6b; padding: 1rem 2rem; border-radius: 2rem;">
    Comenzar
</a>
```

---

## 🎯 Ventajas del Sistema

### ✅ Clases del Tema
- **Reutilizables** en toda la web
- **Consistentes** con el diseño
- **Fáciles de cambiar** (cambias el tema, cambia todo)

### ✅ Estilos Personalizados
- **Únicos** por elemento
- **No afectan** a otros elementos
- **Sin CSS basura**

### ✅ Combinación Perfecta
```html
<!-- Usa clases del tema + personalización -->
<h1 class="heading-1 text-white"
    style="font-size: 5rem;">
    Título Único
</h1>
```

---

## 📊 Estructura en el JSON

```json
{
    "element": "heading",
    "id": "hero-title-0012",
    "class": "heading-1 text-white heading-hero-title-0012",
    "tag": "h1",
    "text": "Bienvenido a Marco CMS",
    "customStyles": {
        "font-size": "4rem",
        "letter-spacing": "-0.05em"
    }
}
```

**Explicación**:
- `class`: Clases del tema + clase única
- `customStyles`: Solo estilos personalizados

---

## 🔧 Gestión de Clases

### Ver Clases Aplicadas
En el panel de estilos, al final:
- **Clases Aplicadas** (tags con ×)
- Click en × para remover

### Input Manual
Si necesitas añadir clases manualmente:
```
container flex-center p-lg gap-md
```

---

## 🚀 Flujo de Trabajo Recomendado

1. **Empieza con clases del tema**
   - Usa heading-1, btn-primary, etc.
   - Mantén consistencia

2. **Personaliza solo cuando sea necesario**
   - Font size diferente
   - Color específico
   - Spacing único

3. **Guarda frecuentemente**
   - Los cambios se guardan en el JSON
   - Se pueden revertir

---

## ✅ Checklist

- ✅ Clases del tema funcionando
- ✅ Estilos personalizados funcionando
- ✅ Color pickers funcionando
- ✅ Guardar/cargar funcionando
- ✅ Sin CSS basura
- ✅ Cada elemento puede ser único

---

**¡El sistema está completo y listo para usar!** 🎉
