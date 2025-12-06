import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores (útil para búsquedas y auto-guardado)
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {any} Valor debounced
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500);
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
