# 📚 Biblioteca de Componentes y Funciones (Marco CMS)

Esta documentación detalla los bloques de construcción atómicos y las utilidades disponibles para desarrollar en Marco CMS. Utilizar estos componentes garantiza la consistencia visual y funcional del sistema.

---

## 🏗️ Componentes de Interfaz (UI Atómica)

Ubicación: `src/components/ui/`

Los componentes atómicos son las piezas más pequeñas de la interfaz. Estilizados automáticamente con el tema activo.

### 1. `Button`
Botón interactivo con múltiples variantes.

**Uso:**
```jsx
import { Button } from '../components/ui/Button';
import { Save } from 'lucide-react';

<Button variant="primary" icon={Save} onClick={handleSave}>
  Guardar Cambios
</Button>
```

**Props:**
- `variant`: `primary` (default), `secondary`, `outline`, `ghost`.
- `size`: `sm`, `md` (default), `lg`.
- `icon`: Componente de icono (ej. Lucide).
- `loading`: `true` para mostrar spinner.

### 2. `Card`
Contenedor elevado para agrupar contenido.

**Uso:**
```jsx
import { Card, CardHeader, CardBody } from '../components/ui/Card';

<Card>
  <CardHeader title="Estadísticas" subtitle="Resumen mensual" />
  <CardBody>
    <p>Contenido del reporte...</p>
  </CardBody>
</Card>
```

### 3. `Input`
Campo de texto con etiqueta y gestión de errores integrada.

**Uso:**
```jsx
import { Input } from '../components/ui/Input';
import { Mail } from 'lucide-react';

<Input 
  id="email" 
  label="Correo Electrónico" 
  icon={Mail} 
  error={errors.email} 
/>
```

---

## 📐 Layout del Dashboard

Ubicación: `src/components/layout/`

Estructura base para las páginas administrativas.

- **`MainLayout`**: Wrapper principal que incluye Sidebar y Header.
- **`Sidebar`**: Navegación lateral.
- **`Header`**: Barra superior con usuario y notificaciones.

---

## 🪝 Hooks y Lógica de Negocio

Ubicación: `src/hooks/`

### 1. Gestión de Contenidos (`usePosts`, `usePages`)
Hooks para operaciones CRUD sobre contenidos.

```javascript
const { posts, loading, createPost, updatePost, deletePost } = usePosts();
```
- **createPost(data)**: Crea un nuevo post y genera automáticamente el slug si no se provee.
- **updatePost(id, data)**: Actualiza contenido existente.

### 2. Sistema de Temas (`useThemeSettings`)
Acceso al contexto del tema.

```javascript
const { settings, applySettings } = useThemeSettings();
console.log(settings.colors.primary); 
```

### 3. SEO Dinámico (`useSEO`)
Inyecta metadatos en `<head>` basados en la página actual.

```javascript
useSEO({
  title: 'Mi Página | Marco CMS',
  description: 'Descripción para motores de búsqueda'
});
```

---

## 🛣️ Rutas Dinámicas y Slugs

El sistema maneja URLs amigables automáticamente.

### Estructura de Rutas
- **Páginas**: `/:slug` (ej. `/nosotros`, `/contacto`)
- **Posts**: `/blog/:slug` o `/post/:slug`.
- **Productos**: `/shop/:category/:slug`.

### Cómo crear una ruta dinámica
En `App.jsx`, define el componente que resolverá el contenido basado en el slug:

```jsx
<Route path="/p/:slug" element={<DynamicPage />} />
```

Dentro de `DynamicPage`, usa `useParams` y el servicio de contenido:

```javascript
const { slug } = useParams();
const { data: page } = useQuery(['page', slug], () => contentService.getBySlug(slug));
```

---

## 🎨 Editor Visual (Roadmap)

Gracias a la atomicidad de `Card`, `Button`, e `Input`, un futuro editor visual podrá:
1.  Listar estos componentes en una paleta lateral.
2.  Arrastrar y soltar (Drag & Drop) para componer páginas.
3.  Configurar props (`variant`, `label`) mediante un inspector visual sin tocar código.
