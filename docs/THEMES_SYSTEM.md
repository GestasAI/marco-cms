# Sistema de Temas de Marco CMS

Este documento describe la arquitectura y el funcionamiento del sistema de temas de Marco CMS, diseñado para ser modular, rápido y fácil de extender.

## 1. Estructura de un Tema

Cada tema reside en su propia carpeta dentro de `public/themes/`. La estructura mínima recomendada es:

```text
nombre-del-tema/
├── theme.json          # Metadatos del tema (nombre, autor, versión)
├── theme.css           # Estilos globales del tema
├── screenshot.png      # Previsualización para el panel de control
└── pages/
    └── home.json       # Contenido específico de la página de inicio para este tema
```

### Creación de un nuevo tema
Para crear un tema nuevo (ej. "Academia"):
1.  **Copiar Base**: Puedes tomar el archivo `theme.css` del tema `gestasai-default` como punto de partida.
2.  **Personalizar**: Ajusta las variables CSS en `:root` para cambiar colores, tipografías y bordes (ej. estilo "Apple Premium").
3.  **Contenido Propio**: Define el `home.json` dentro de la carpeta `pages/` del tema. Este archivo será el que se cargue automáticamente cuando el tema esté activo.

## 2. Funcionamiento Técnico

### Activación de un Tema
Cuando se activa un tema desde el panel de control, interviene la clase `ThemeManager.php`:

*   **`activateTheme($themeId)`**: Actualiza el archivo de configuración global `public/data/theme_settings/current.json` estableciendo la clave `active_theme`.
*   **Persistencia**: Una vez guardado, todo el sistema (backend y frontend) sabrá qué tema debe renderizar.

### Lectura Automática de la Home
El sistema prioriza el contenido del tema activo sobre el contenido genérico:

1.  **API Backend**: El método `ThemeManager::getActiveThemeHome()` busca el archivo `home.json` dentro de la carpeta del tema activo.
2.  **Frontend**: El archivo `src/pages/PageResolver/pageLoader.js` realiza una petición a la API para obtener este contenido específico del tema. Si el tema no tiene una `home.json` propia, el sistema puede caer (fallback) a la página por defecto en `public/data/pages/home.json`.

## 3. Regeneración Estática Automática

Marco CMS es un CMS híbrido que genera un sitio estático para máxima velocidad.

*   **Trigger Automático**: En `public/acide/core/ACIDE.php`, dentro del caso `update`, existe un disparador (trigger):
    ```php
    if ($collection === 'pages') {
        $this->staticGenerator->buildSite();
    }
    ```
*   **Resultado**: Cada vez que guardas una página desde el editor (FSE), el sistema llama a `StaticGenerator::buildSite()`, el cual lee los JSON y regenera todos los archivos HTML en la carpeta `public/dist`. No es necesario realizar pasos manuales.

## 4. Estándares de Codificación y Caracteres

Para garantizar que los acentos y caracteres especiales (ñ, á, é...) se visualicen correctamente:

*   **Archivos**: Todos los archivos JSON deben guardarse en formato **UTF-8 sin BOM**.
*   **PHP**: Todas las funciones `json_encode` utilizan el flag `JSON_UNESCAPED_UNICODE`.
*   **Headers**: El sistema envía siempre la cabecera `Content-Type: application/json; charset=utf-8`.

---
*Documentación generada para el equipo de desarrollo de GestasAI.*
