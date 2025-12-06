# 🗺️ Hoja de Ruta: Marco CMS (GestasAI Headless CMS)

Este documento define el plan estratégico para construir **Marco CMS**, el Headless CMS oficial de GestasAI. El objetivo es crear un sistema agnóstico, modular y espectacular que funcione con **GestasCore-ACIDE**.

## 🎯 Visión
Crear una **Single Page Application (SPA)** en React que funcione como un Headless CMS completo. Debe ser capaz de generar un build estático desplegable en cualquier hosting básico, mientras mantiene una conexión robusta con el ecosistema GestasAI para la gestión de datos y autenticación.

---

## 📅 Fases del Proyecto

### ✅ Fase 1: Fundamentos y Núcleo (ACIDE Integration)
*Objetivo: Establecer la comunicación con GestasCore y el motor de datos.*

- [x] **Estructura del Proyecto**: Configuración inicial de Vite + React.
- [x] **Integración de ACIDE**: Implementación de servicios para comunicar con `SchemaValidator` y `QueryEngine`.
- [x] **Sistema de Temas**: Motor de temas dinámico con variables CSS y persistencia en ACIDE.
- [ ] **Conexión Universal API**: Configurar el cliente API para usar `gestasai.com/api/universal` (o gateway local) de forma agnóstica.
- [ ] **Validación de Esquemas**: Asegurar que todos los datos (Posts, Pages, Settings) pasen por `SchemaValidator`.

### 🚧 Fase 2: Headless CMS Features
*Objetivo: Implementar las funcionalidades core de un CMS.*

- [x] **Autenticación**: Login integrado con GestasAI Auth Plugin.
- [x] **Dashboard**: Panel de administración principal.
- [ ] **Gestión de Contenidos (CRUD)**:
    - [x] Posts (Artículos de blog).
    - [ ] Pages (Páginas estáticas).
    - [ ] Media Library (Gestión de imágenes y archivos).
- [ ] **Editor de Contenido**: Implementar un editor rico (Block Editor o Markdown avanzado) para la creación de contenido.
- [ ] **Configuración del Sitio**: Panel para gestionar título, descripción, logos, etc.

### 🎨 Fase 3: Frontend & Themes (FSE)
*Objetivo: Crear la experiencia visual "espectacular" y SEO-friendly.*

- [x] **Tema Base "GestasAI Default"**: Diseño moderno, responsive y AI-Native.
- [ ] **Full Site Editing (FSE)**: Permitir al usuario editar cabeceras, pies de página y plantillas visualmente.
- [ ] **Widgets & Componentes**:
    - [ ] Bloques SEO optimizados (Schema.org automático).
    - [ ] Componentes de UI reutilizables (Botones, Cards, Heroes).
- [ ] **SEO Engine**: Generación automática de `sitemap.xml`, `robots.txt` y meta tags dinámicos basados en el contenido.

### 🚀 Fase 4: Producción y Despliegue
*Objetivo: Asegurar que el sistema sea robusto y desplegable.*

- [ ] **Build System**: Configurar Vite para generar un bundle optimizado (`dist/`).
- [ ] **Modo Offline**: Implementar capacidades PWA y sincronización local cuando no hay conexión (usando ACIDE localmente si aplica).
- [ ] **Testing**: Pruebas E2E y Unitarias para flujos críticos.
- [ ] **Documentación Final**: Guías de usuario y desarrollador completas.

---

## 🛠️ Tecnologías Clave

- **Frontend**: React, Vite, TailwindCSS.
- **Motor de Datos**: GestasCore-ACIDE (JSON Documents, QueryEngine v2).
- **API**: Universal API Bridge (REST/WebSocket).
- **Estado**: React Context + Hooks (sin Redux complejo).
- **Iconos**: Lucide React.

## 📌 Estado Actual
Estamos en la transición entre **Fase 1** y **Fase 2**. El sistema de temas y autenticación básica están funcionales. El siguiente gran paso es consolidar la gestión de contenidos (CRUD completo) y conectar firmemente con la API Universal.
