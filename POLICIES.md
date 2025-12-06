# 📜 Políticas de Desarrollo de Marco CMS

Para garantizar la calidad, escalabilidad y la visión de "Sistema Agnóstico", todo desarrollo en Marco CMS debe adherirse estrictamente a estas políticas.

## 🛡️ 1. Política de Sistema Agnóstico (DECRETO SUPREMO)

> **El sistema NO debe conocer DÓNDE está corriendo.**

*   **Prohibido**: Hardcodear URLs absolutas (`http://localhost:3000`, `https://gestasai.com`).
*   **Obligatorio**: Usar rutas relativas (`/api/auth`) o variables de entorno inyectadas en tiempo de construcción/ejecución.
*   **Meta**: El build final (`dist/`) debe poder subirse a CUALQUIER dominio o subdominio y funcionar sin recompilar.

## 💾 2. Política de Datos (GestasCore-ACIDE)

> **ACIDE es la única fuente de verdad.**

*   **Almacenamiento**: NO usar `localStorage` para datos persistentes del negocio (posts, configuraciones). Usar **GestasCore-ACIDE** a través del API Bridge.
*   **Estructura**: Los datos deben guardarse como **Documentos JSON**.
*   **Validación**: Todo dato debe ser validado por `SchemaValidator` antes de persistir.
*   **Consultas**: Usar `QueryEngine` para búsquedas, filtros y relaciones. NO iterar arrays manualmente en el frontend si el motor puede hacerlo.

## 🎨 3. Política de UI/UX "Espectacular"

> **La primera impresión es la única que cuenta.**

*   **Diseño**: Debe ser moderno, limpio y con atención al detalle (sombras suaves, bordes redondeados, espaciado consistente).
*   **Feedback**: El usuario siempre debe saber qué está pasando (loaders, notificaciones toast, estados de error claros).
*   **Responsive**: Mobile-first. No se acepta que un componente se rompa en pantallas pequeñas.
*   **Temas**: Todo componente debe usar variables CSS del tema (`var(--color-primary)`), NUNCA colores hexadeciales hardcodeados (`#3B82F6`).

## 🔍 4. Política de SEO & AI

> **Optimizado para máquinas y humanos.**

*   **Estructura Semántica**: Uso correcto de HTML5 (`<header>`, `<main>`, `<article>`, `<h1>`-`<h6>`).
*   **Meta Datos**: Cada página debe inyectar sus etiquetas `<title>`, `<meta description>`, y OpenGraph dinámicamente.
*   **Sitemap**: El sistema debe generar un sitemap automático accesible para los buscadores.
*   **AI-Ready**: El contenido debe estructurarse de forma que sea fácil de ingerir por agentes de IA (JSON-LD, estructura clara).

## 🧩 5. Política de Arquitectura (Modularidad)

> **Divide y vencerás.**

*   **Atomicidad**: Componentes pequeños y reutilizables.
*   **Granularidad**: Servicios específicos para tareas específicas (`auth.js`, `content.js`, `theme.js`).
*   **Desacoplamiento**: El frontend no debe saber cómo funciona el backend, solo cumplir el contrato de la API.

---

**Cualquier PR o commit que viole estas políticas será rechazado hasta su corrección.**
