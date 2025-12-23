export * from './blocks/basicBlocks';
export * from './blocks/designBlocks';

/**
 * Asigna IDs únicos a un elemento y sus hijos de forma recursiva
 */
export function assignIds(element) {
    const newElement = { ...element };

    // Generar ID único si no tiene o para asegurar unicidad al duplicar/añadir
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    newElement.id = `${element.element}-${timestamp}-${random}`;

    if (newElement.content && Array.isArray(newElement.content)) {
        newElement.content = newElement.content.map(child => assignIds(child));
    }

    return newElement;
}
