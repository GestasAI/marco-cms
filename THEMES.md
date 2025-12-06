# 🎨 Sistema de Temas de Marco CMS

Marco CMS implementa un sistema de temas dinámico y flexible, diseñado para integrarse con **GestasCore-ACIDE**. Esto permite cambiar la apariencia del sitio en tiempo real sin necesidad de recompilar la aplicación.

## 🏗️ Arquitectura

El sistema de temas se basa en tres pilares:

1.  **ACIDE Storage**: La configuración del tema se almacena en la colección `theme_settings` de la base de datos.
2.  **ThemeContext**: Un contexto de React que carga la configuración y la distribuye a toda la aplicación.
3.  **Variables CSS**: El sistema inyecta variables CSS en el elemento `:root` del DOM, permitiendo que los estilos se actualicen instantáneamente.

## 📂 Estructura de un Tema

Actualmente, los temas residen en `src/themes/`. El tema por defecto es `gestasai-default`.

Un tema se define por su configuración JSON, que incluye:

```json
{
  "id": "current-theme",
  "theme_key": "gestasai-default",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "background": "#FFFFFF",
    "text": "#1F2937"
    // ... más colores
  },
  "typography": {
    "fontFamily": "'Inter', sans-serif",
    "headingFont": "'Outfit', sans-serif"
  },
  "layout": {
    "containerWidth": "1280px",
    "borderRadius": "0.5rem"
  }
}
```

## 🛠️ Cómo Crear un Nuevo Tema

Para crear un nuevo tema, no necesitas crear archivos físicos si solo quieres cambiar estilos. Puedes hacerlo desde el panel de administración:

1.  Ve a **Dashboard > Ajustes del Sitio > Tema**.
2.  Usa el personalizador visual para cambiar colores, fuentes y espaciado.
3.  Haz clic en **Guardar**.

Esto actualizará la configuración en ACIDE.

### Crear un Tema Físico (Avanzado)

Si deseas añadir archivos específicos (como imágenes o CSS personalizado):

1.  Crea una carpeta en `src/themes/nombre-de-tu-tema/`.
2.  Añade un archivo `theme.css` si necesitas reglas CSS específicas que no se cubren con variables.
3.  Registra el tema en `src/pages/Dashboard.jsx` (en la función `loadThemes`).

## 🧩 Componentes del Sistema

### `ThemeContext.jsx`
Maneja el estado global del tema. Carga la configuración al inicio y expone funciones para actualizarla.

### `useThemeSettings.js`
Hook personalizado para acceder y modificar la configuración del tema desde cualquier componente.

### `ThemeSettings.jsx`
Panel de control visual que permite a los usuarios editar el tema. Incluye selectores de color (`ColorPicker`) y fuentes (`FontPicker`).

## 🔄 Flujo de Datos

1.  **Carga**: Al iniciar la app, `ThemeService` consulta a ACIDE (`/api/bridge/query`) por la configuración `current-theme`.
2.  **Aplicación**: `ThemeContext` recibe la configuración y llama a `applySettings`, que actualiza las variables CSS en el DOM.
3.  **Edición**: El usuario modifica un valor en el panel. El estado local se actualiza y se refleja inmediatamente en la UI gracias a las variables CSS.
4.  **Guardado**: Al dar clic en Guardar, se envía la nueva configuración a ACIDE (`/api/bridge/update` o `insert`).

## 🎨 Variables CSS Disponibles

El sistema genera automáticamente variables CSS basadas en la configuración. Ejemplo:

- `settings.colors.primary` -> `--color-primary`
- `settings.typography.fontSize.xl` -> `--font-size-xl`
- `settings.layout.spacing.md` -> `--spacing-md`

Puedes usar estas variables en cualquier archivo CSS de la aplicación:

```css
.mi-boton {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```
