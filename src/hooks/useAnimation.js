import { useState, useEffect, useRef } from 'react';

/**
 * Hook para animaciones al hacer scroll (Intersection Observer)
 * @param {Object} options - Opciones del Intersection Observer
 * @returns {Array} [ref, isVisible] - Ref para el elemento y estado de visibilidad
 * 
 * @example
 * const [ref, isVisible] = useAnimation();
 * <div ref={ref} className={isVisible ? 'fade-in' : ''}>Content</div>
 */
export function useAnimation(options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.once) {
                    observer.disconnect();
                }
            } else if (!options.once) {
                setIsVisible(false);
            }
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px'
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options.threshold, options.rootMargin, options.once]);

    return [ref, isVisible];
}
