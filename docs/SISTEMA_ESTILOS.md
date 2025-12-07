# 🎨 Sistema Inteligente de Estilos

## ❌ Problema de WordPress

En WordPress/Elementor, cuando cambias el estilo de un elemento:
- ✅ Cambias la clase `.heading-1`
- ❌ **TODOS** los `.heading-1` de la web cambian
- ❌ Se genera CSS basura
- ❌ No puedes tener estilos únicos por elemento

## ✅ Nuestra Solución

### Sistema Híbrido de 3 Niveles

```
┌─────────────────────────────────────────┐
│  1. CLASES DEL TEMA (Globales)          │
│     - heading-1, btn-primary, etc.      │
│     - Definidas en theme.css            │
│     - Reutilizables en toda la web      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. CLASE ÚNICA POR ELEMENTO            │
│     - heading-hero-title-0012           │
│     - Generada automáticamente          │
│     - Solo para ese elemento            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. ESTILOS PERSONALIZADOS (Inline)     │
│     - color: #ff0000                    │
│     - font-size: 24px                   │
│     - Solo si necesitas personalizar    │
└─────────────────────────────────────────┘
```

## 📝 Ejemplo Práctico

### Elemento en el JSON:
```json
{
    "element": "heading",
    "id": "hero-title-0012",
    "class": "heading-1 text-white",
    "tag": "h1",
    "text": "Bienvenido a Marco CMS",
    "customStyles": {
        "font-size": "4rem",
        "letter-spacing": "-0.05em"
    }
}
```

### HTML Generado:
```html
<h1 class="heading-1 text-white heading-hero-title-0012" 
    style="font-size: 4rem; letter-spacing: -0.05em;">
    Bienvenido a Marco CMS
</h1>
```

### CSS Generado:
```css
/* theme.css - Estilos globales */
.heading-1 {
    font-size: 3.75rem;
    font-weight: 800;
    line-height: 1.1;
}

.text-white {
    color: #ffffff;
}

/* custom-styles.css - Estilos únicos */
.heading-hero-title-0012 {
    font-size: 4rem;
    letter-spacing: -0.05em;
}
```

## 🎯 Cómo Funciona

### 1. Usuario Selecciona Elemento
```javascript
// ID: hero-title-0012
// Tipo: heading
```

### 2. Aplica Clase del Tema
```javascript
// Click en "heading-1" en el panel de estilos
applyThemeClass('hero-title-0012', 'heading', 'heading-1');

// Resultado: "heading-1 heading-hero-title-0012"
```

### 3. Personaliza Estilo Específico
```javascript
// Cambia font-size solo para ESTE elemento
applyCustomStyle('hero-title-0012', 'heading', 'font-size', '4rem');

// Se añade a customStyles del elemento
// NO afecta a otros heading-1
```

## ✅ Ventajas

1. **Sin CSS Basura**
   - Solo se genera CSS para elementos personalizados
   - Las clases del tema se reutilizan

2. **Estilos Únicos**
   - Cada elemento puede tener su propio estilo
   - No afecta a otros elementos

3. **Reutilización**
   - Las clases del tema siguen siendo globales
   - Puedes cambiar el tema y afecta a todos

4. **Limpio y Organizado**
   - theme.css → Estilos base
   - custom-styles.css → Personalizaciones
   - Fácil de mantener

## 📊 Estructura de Datos

### En el JSON del Documento:
```json
{
    "content": [
        {
            "element": "heading",
            "id": "hero-title-0012",
            "class": "heading-1 text-white",
            "customStyles": {
                "font-size": "4rem"
            }
        }
    ],
    "customStyles": {
        "hero-title-0012": {
            "elementId": "hero-title-0012",
            "elementType": "heading",
            "uniqueClass": "heading-hero-title-0012",
            "themeClasses": ["heading-1", "text-white"],
            "customStyles": {
                "font-size": "4rem"
            }
        }
    }
}
```

## 🔧 Implementación

### Usar en el Editor:
```javascript
import { PageStylesManager } from './elementStyles';

const stylesManager = new PageStylesManager();

// Aplicar clase del tema
stylesManager.applyThemeClass('hero-title-0012', 'heading', 'heading-1');

// Aplicar estilo personalizado
stylesManager.applyCustomStyle('hero-title-0012', 'heading', 'font-size', '4rem');

// Generar CSS personalizado
const customCSS = stylesManager.generateCustomCSS();

// Guardar en JSON
const stylesData = stylesManager.toJSON();
```

## 🎨 En el Panel de Estilos

### Clases del Tema (Botones Toggle):
- ✅ Click → Añade/quita clase global
- ✅ Afecta solo al elemento actual
- ✅ Usa estilos del theme.css

### Estilos Personalizados (Sliders/Inputs):
- ✅ Cambia valores específicos
- ✅ Solo para este elemento
- ✅ Genera CSS único

## 🚀 Resultado Final

- ✅ **Flexibilidad total**: Usa clases del tema O personaliza
- ✅ **Sin CSS basura**: Solo genera lo necesario
- ✅ **Mantenible**: Claro qué es del tema y qué es personalizado
- ✅ **Escalable**: Funciona con miles de elementos
- ✅ **Limpio**: No contamina el theme.css

---

**¡El mejor de ambos mundos!** 🎉
