# 🎨 Estilos con Tailwind CSS

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Configuración

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B'
      }
    }
  },
  plugins: []
};
```

---

## 🎨 Clases Comunes

### Layout
```html
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">
<div className="container mx-auto px-4">
```

### Spacing
```html
<div className="p-4">      <!-- padding: 1rem -->
<div className="m-4">      <!-- margin: 1rem -->
<div className="mt-4">     <!-- margin-top: 1rem -->
<div className="space-y-4"> <!-- gap vertical -->
```

### Typography
```html
<h1 className="text-3xl font-bold text-gray-800">
<p className="text-sm text-gray-600">
<span className="font-medium">
```

### Colors
```html
<div className="bg-blue-500 text-white">
<div className="bg-gray-100 text-gray-800">
<div className="border border-gray-300">
```

### Buttons
```html
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
  Click me
</button>
```

### Cards
```html
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-xl font-bold mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

---

## 🎭 Componentes Estilizados

### Form
```html
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email
    </label>
    <input 
      type="email"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</form>
```

### Table
```html
<table className="min-w-full bg-white border border-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Name
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        John Doe
      </td>
    </tr>
  </tbody>
</table>
```

---

## 📱 Responsive Design

```html
<!-- Mobile first -->
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="hidden md:block">  <!-- Oculto en mobile -->
```

---

**Última actualización**: 22 de Noviembre de 2025
