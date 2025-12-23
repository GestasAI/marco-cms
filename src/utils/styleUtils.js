/**
 * Convierte estilos a camelCase para React
 * Acepta tanto kebab-case como camelCase y siempre devuelve camelCase
 */
export function formatStyles(styles) {
    if (!styles) return {};

    const formatted = {};
    Object.keys(styles).forEach(key => {
        // Convertir a camelCase
        const camelKey = key.includes('-')
            ? key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
            : key;

        formatted[camelKey] = styles[key];
    });

    // Nota: React no soporta !important en el objeto style.
    // Si los estilos no se aplican, es porque hay una regla CSS con más especificidad.
    // Para el editor, nos aseguramos de que las propiedades críticas estén presentes.

    return formatted;
}
