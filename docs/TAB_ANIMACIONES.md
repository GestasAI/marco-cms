# Documentación del Sistema de Animaciones (Three.js) - Marco CMS

Este documento describe la arquitectura, el flujo de datos y la implementación técnica de los efectos visuales avanzados (como Antigravity Hero) integrados en Marco CMS.

## 1. Arquitectura del Sistema

El sistema de animaciones es **tripartito**, asegurando que el efecto funcione de forma idéntica en tres entornos distintos:

1.  **Editor FSE (React)**: Ubicado en `src/fse/components/renderers/EffectRenderers.jsx`. Optimizado para edición en tiempo real.
2.  **Frontend Dinámico (React)**: Ubicado en `src/pages/PageResolver/renderers/EffectRenderers.jsx`. Utilizado por el `PageResolver` para previsualización.
3.  **Web Estática (Vanilla JS)**: Inyectado por `public/acide/core/StaticGenerator.php`. Permite que la web final sea ultrarrápida y no dependa de React.

## 2. Flujo de Datos y Comunicación con ACIDE

### Persistencia (Escritura)
Cuando el usuario ajusta un mando en la pestaña de "Animación" del FSE:
1.  `AnimationTab.jsx` captura el cambio.
2.  Se actualiza el objeto `settings` del elemento.
3.  `acideService.update` envía el JSON completo a `ACIDE.php`.
4.  ACIDE guarda el cambio en el archivo `.json` correspondiente en `public/data/pages/`.

### Recuperación (Lectura)
1.  **Frontend**: El `PageResolver` lee el JSON y lo pasa al `renderEffectElement`.
2.  **Web Estática**: El `StaticGenerator.php` lee el JSON, extrae los `settings` y los inyecta en el atributo `data-settings` del contenedor HTML.

## 3. Implementación Técnica: Diseño Atómico

Para evitar que la animación "parpadee" o se reinicie bruscamente al editar, el motor separa dos tipos de cambios:

### A. Cambios Estructurales (Reinician la Escena)
Se activan mediante el array de dependencias de `useEffect`.
- Cambio de ID de elemento.
- Cambio en la **cantidad** de partículas.
- Cambio de **color** base o **tamaño** base.
- Cambio de altura del bloque.

### B. Cambios de Parámetros "Vivos" (Tiempo Real)
Se gestionan mediante un `useRef` llamado `liveSettings`. El loop de animación lee de este `ref` en cada frame.
- **Intensidad**: Fuerza de repulsión del cursor.
- **Velocidad de Tiempo**: Factor de escala del reloj de Three.js.
- **Seguimiento de Cursor**: Activa/desactiva la interacción.

## 4. Componentes del DOM

Cada bloque de efecto genera la siguiente estructura:
```html
<div class="mc-effect-container" style="height: 500px; position: relative;">
    <!-- Capa 1: El motor de renderizado (Canvas) -->
    <canvas style="position: absolute; z-index: 1;"></canvas>
    
    <!-- Capa 2: El contenido (Textos, Botones) -->
    <div class="mc-content-layer" style="position: relative; z-index: 2;">
        <!-- Elementos hijos -->
    </div>
</div>
```

## 5. El Runtime Estático (StaticGenerator.php)

Para la web final, ACIDE inyecta un script ligero que:
1.  Busca todos los elementos con la clase `.mc-effect-container`.
2.  Parsea el atributo `data-settings`.
3.  Inicializa una instancia de `THREE.Scene` para cada contenedor.
4.  Implementa un `ResizeObserver` para que el canvas siempre ocupe el 100% del espacio, incluso en móviles o al cambiar la orientación.

## 6. Solución de Problemas Comunes

*   **El bloque se ve negro**: Comprobar que el canvas tenga `position: absolute` y `z-index: 1`. Si el canvas no es absoluto, el contenido lo empuja hacia abajo.
*   **No hay animación**: Verificar que el contenedor tenga un alto (`height`) definido. Three.js no puede renderizar en un contenedor de altura 0.
*   **La interacción no sigue el ratón**: Asegurarse de que `mc-content-layer` tenga `pointer-events: none` y sus hijos tengan `pointer-events: auto`. Esto permite que el movimiento del ratón llegue al canvas que está debajo.

---
*Documento generado para la posteridad y el mantenimiento del motor de efectos de GestasAI.*
