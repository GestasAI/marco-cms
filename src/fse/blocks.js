export * from './blocks/basicBlocks';
export * from './blocks/designBlocks';
export * from './blocks/effectBlocks';

/**
 * Asigna IDs únicos a un elemento y sus hijos de forma recursiva
 */
export function assignIds(element) {
    const newElement = { ...element };

    // Generar ID único estructurado: mc-[tipo]-[timestamp corto]-[random]
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000);
    newElement.id = `mc-${element.element}-${timestamp}-${random}`;

    // Asegurar que los elementos de layout tengan la clase base mc-
    const layoutElements = ['section', 'container', 'columns', 'column', 'grid', 'card', 'nav'];
    if (layoutElements.includes(element.element)) {
        const baseClass = `mc-${element.element}`;
        if (!newElement.class) {
            newElement.class = baseClass;
        } else if (!newElement.class.includes(baseClass)) {
            newElement.class = `${baseClass} ${newElement.class}`;
        }
    }

    if (newElement.content && Array.isArray(newElement.content)) {
        newElement.content = newElement.content.map(child => assignIds(child));
    }

    return newElement;
}
