import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        // Tema fijo (definido en build o config)
        // En el futuro esto vendrá de import.meta.env.VITE_ACTIVE_THEME
        const themeName = 'gestasai-default';

        // Cargar CSS del tema
        // Usamos BASE_URL para garantizar que funcione en subcarpetas
        const baseUrl = import.meta.env.BASE_URL;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const themeUrl = `${cleanBase}themes/${themeName}/theme.css`;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = themeUrl;
        link.onload = () => setThemeLoaded(true);
        // Si falla (ej ya existe o red), igual marcamos como loaded para mostrar contenido
        link.onerror = () => setThemeLoaded(true);
        document.head.appendChild(link);
    };

    if (!themeLoaded) {
        // Retornamos null o loading spinner minimalista
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme: 'gestasai-default' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
