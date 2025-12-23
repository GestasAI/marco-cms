/**
 * Resuelve el valor dinámico basado en el origen configurado
 * Compartido entre el Editor y el Frontend
 */
export function resolveDynamicValue(element, doc) {
    if (!element.dynamic?.enabled || !doc) return null;

    const { source, field } = element.dynamic;

    switch (source) {
        case 'post_title':
            return doc.title || 'Sin Título';
        case 'post_excerpt':
            return doc.excerpt || doc.description || 'Sin extracto';
        case 'post_content':
            return 'Contenido de la publicación (Vista previa)';
        case 'post_date':
            return doc.date ? new Date(doc.date).toLocaleDateString() : new Date().toLocaleDateString();
        case 'post_author':
            return doc.author || 'Administrador';
        case 'featured_image':
            return doc.featured_image || doc.image || '/placeholder-image.jpg';
        case 'author_avatar':
            return '/default-avatar.png';
        case 'custom_field':
            return field ? (doc[field] || doc.meta?.[field] || `[Campo: ${field}]`) : '[Campo no definido]';
        default:
            return null;
    }
}
