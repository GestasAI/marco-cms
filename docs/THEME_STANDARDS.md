# 🎨 Marco CMS: Estándares y Políticas del Sistema de Temas

Este documento define la arquitectura, el funcionamiento y las políticas estrictas para el desarrollo de interfaces en Marco CMS. El objetivo es garantizar que la aplicación sea **completamente personalizable**, **homogénea** y **centralizada**.

---

## 1. Arquitectura del Sistema ("Cómo funciona")

El sistema de temas de Marco CMS no es solo un archivo CSS; es un motor dinámico que conecta la base de datos con la interfaz de usuario en tiempo real.

### 🧩 Componentes Principales

1.  **GestasCore (ACIDE)**:
    *   Actúa como la fuente de verdad.
    *   Almacena la configuración del tema (colores, fuentes, bordes) en la colección `theme_settings` de la base de datos.
    
2.  **ThemeContext (`src/contexts/ThemeContext.jsx`)**:
    *   Es el "cerebro" en el frontend.
    *   Carga la configuración desde ACIDE al iniciar la app.
    *   **Inyecta** las variables CSS (Custom Properties) directamente en el `root` del documento HTML.
    *   Permite cambios en tiempo real sin recargar la página.

3.  **Variables CSS (`:root`)**:
    *   Son el puente entre la lógica y el estilo.
    *   Ejemplos: `--color-primary`, `--space-md`, `--radius-lg`.
    *   Todos los estilos de la aplicación **deben** referenciar estas variables, nunca valores fijos.

4.  **Editor Visual (`src/components/SiteSettings.jsx`)**:
    *   Interfaz de usuario para que el administrador modifique las variables.
    *   Usa `useThemeSettings` para previsualizar y guardar cambios.

---

## 2. Políticas de Creación de Temas y Desarrollo

Para mantener la integridad del sistema, **todo desarrollo nuevo debe adherirse estrictamente a estas reglas**:

### 🚫 Prohibiciones
1.  **NO usar valores Hexadecimales/RGB directos** para colores principales.
    *   ❌ Mal: `background-color: #3b82f6;`
    *   ❌ Mal: `class="bg-blue-500"` (Tailwind sin config).
2.  **NO crear hojas de estilo aisladas** que redefinan componentes base (botones, tarjetas).
3.  **NO hardcodear fuentes**.

### ✅ Obligaciones
1.  **USAR Variables CSS**:
    *   ✅ Bien: `background-color: var(--color-primary);`
    *   ✅ Bien: `padding: var(--space-lg);`
2.  **USAR Clases Semánticas**:
    *   Utilizar las clases utilitarias definidas en `theme.css` siempre que sea posible:
        *   `.container`, `.section`
        *   `.btn`, `.btn-primary`
        *   `.card`
        *   `.heading-1`, `.text-body`
3.  **Componentes "Theme-Aware"**:
    *   Si un componente necesita manipular colores con JavaScript (ej. Canvas, Gráficas), debe usar el hook `useThemeSettings`:
        ```javascript
        const { settings } = useThemeSettings();
        const color = settings.colors.primary;
        ```

---

## 3. Guía de Referencia de Variables

### 🎨 Colores
| Variable | Uso |
|----------|-----|
| `--color-primary` | Acción principal, enlaces, botones destacados. |
| `--color-secondary` | Elementos de apoyo, gradientes. |
| `--color-accent` | Éxito, notificaciones, detalles visuales. |
| `--color-bg` | Color de fondo principal de la página. |
| `--color-surface` | Color de fondo de tarjetas y paneles. |
| `--color-text` | Texto principal. |
| `--color-text-light` | Texto secundario o descriptivo. |

### 📐 Espaciado y Layout
| Variable | Valor Base | Uso |
|----------|------------|-----|
| `--space-xs` | 0.5rem | Gap pequeño, padding interno botones. |
| `--space-md` | 1.5rem | Margen estándar entre elementos. |
| `--space-xl` | 3rem | Separación entre secciones. |
| `--container-width`| 1280px | Ancho máximo del contenido. |

### 🔲 Bordes
| Variable | Uso |
|----------|-----|
| `--radius-sm` | Botones pequeños, inputs. |
| `--radius-lg` | Tarjetas, modales. |
| `--radius-full` | Avatares, badges. |

---

## 4. Flujo de Trabajo para Nuevas Páginas

1.  **Estructura**: Comienza con `<div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>`.
2.  **Layout**: Usa `<div className="container">` para centrar el contenido.
3.  **Texto**: Aplica clases `.heading-*` para títulos y `.text-body` para párrafos.
4.  **Interacción**: Usa `.btn` y `.btn-primary` para acciones.
5.  **Verificación**: Cambia el tema en el Dashboard y verifica que tu nueva página responda inmediatamente a los nuevos colores.
