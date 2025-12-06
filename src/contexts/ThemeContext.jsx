import React, { createContext, useState, useEffect, useCallback } from 'react';
import { acideService } from '../acide/acideService';

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
    typography: {
        fontFamily: "'Inter', sans-serif",
        fontHeading: "'Inter', sans-serif",
    }
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
    const applySettings = useCallback((settingsToApply) => {
        if (!settingsToApply) return;
        const root = document.documentElement;

        // Aplicar colores
        if (settingsToApply.colors) {
            Object.entries(settingsToApply.colors).forEach(([key, value]) => {
                const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                root.style.setProperty(cssVarName, value);
            });
        }
    }, []);

    // Cargar configuración inicial desde el servicio
    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const savedSettings = await acideService.get('theme_settings', 'current');
            const mergedSettings = { ...defaultSettings, ...savedSettings };
            setSettings(mergedSettings);
            applySettings(mergedSettings);
        } catch (err) {
            if (err.message.includes('404')) {
                console.warn('No se encontró configuración guardada. Usando y guardando valores por defecto.');
                setSettings(defaultSettings);
                applySettings(defaultSettings);
                // Guardamos los valores por defecto la primera vez
                await acideService.update('theme_settings', 'current', defaultSettings);
            } else {
                setError('No se pudo cargar la configuración del tema.');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [applySettings]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // Función para guardar la configuración
    const saveSettings = async (newSettings) => {
        try {
            await acideService.update('theme_settings', 'current', newSettings);
            setSettings(newSettings);
            applySettings(newSettings);
            return true; // Éxito
        } catch (err) {
            console.error("Error al guardar la configuración:", err);
            setError('No se pudo guardar la configuración.');
            return false; // Fallo
        }
    };

    const value = { settings, isLoading, error, applySettings, saveSettings, loadSettings };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};