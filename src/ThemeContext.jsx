import React, { createContext, useState, useEffect, useCallback } from 'react';

// 1. Crear el Contexto
export const ThemeContext = createContext();

// Valores por defecto que coinciden con tu theme.css
const defaultSettings = {
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
        bg: '#ffffff',
        surface: '#f9fafb',
        dark: '#1f2937',
        text: '#1f2937',
        textLight: '#6b7280',
    },
    // Aquí podrías añadir tipografía, espaciado, etc.
};

/**
 * 2. Crear el Proveedor (Provider)
 * Este componente envolverá tu aplicación y proveerá el estado y las funciones del tema.
 */
export const ThemeProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para aplicar los estilos al DOM
    const applySettings = useCallback((newSettings) => {
        const root = document.documentElement;
        Object.entries(newSettings.colors).forEach(([key, value]) => {
            // Convertimos camelCase (e.g., textLight) a kebab-case (e.g., --color-text-light)
            const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, value);
        });
    }, []);

    // Cargar configuración inicial (simulado, podría venir de una API)
    useEffect(() => {
        try {
            // Intenta cargar desde localStorage o una API
            const savedSettings = localStorage.getItem('themeSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings(parsedSettings);
                applySettings(parsedSettings);
            } else {
                // Si no hay nada guardado, aplica los por defecto
                applySettings(settings);
            }
        } catch (err) {
            setError('No se pudo cargar la configuración del tema.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [applySettings]);

    // Función para guardar la configuración
    const saveSettings = async (newSettings) => {
        try {
            // Aquí harías la llamada a tu API para guardar en backend
            // Por ahora, lo guardamos en localStorage
            localStorage.setItem('themeSettings', JSON.stringify(newSettings));
            setSettings(newSettings);
            applySettings(newSettings);
            return true; // Éxito
        } catch (err) {
            console.error("Error al guardar la configuración:", err);
            return false; // Fallo
        }
    };

    const value = { settings, setSettings, isLoading, error, applySettings, saveSettings };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};