import { useState, useEffect } from 'react';

/**
 * Hook para detectar el tamaño de pantalla y breakpoints
 * @returns {Object} Información sobre el tamaño de pantalla actual
 * 
 * @example
 * const { isMobile, isTablet, isDesktop, width } = useResponsive();
 */
export function useResponsive() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const breakpoints = {
        mobile: 640,
        tablet: 768,
        laptop: 1024,
        desktop: 1280
    };

    return {
        width: windowSize.width,
        height: windowSize.height,
        isMobile: windowSize.width < breakpoints.tablet,
        isTablet: windowSize.width >= breakpoints.tablet && windowSize.width < breakpoints.laptop,
        isLaptop: windowSize.width >= breakpoints.laptop && windowSize.width < breakpoints.desktop,
        isDesktop: windowSize.width >= breakpoints.desktop,
        breakpoints
    };
}
