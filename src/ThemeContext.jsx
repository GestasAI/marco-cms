import React, { createContext, useState, useEffect, useCallback } from 'react';
import { acideService } from './acide/acideService';

// 1. Crear el Contexto
export const ThemeContext = createContext();

/**
 * 2. Crear el Proveedor (Provider)
 * Este componente envolverá tu aplicación y proveerá el estado y las funciones del tema.
 */
export const ThemeProvider = ({ children }) => {
    const [activeTheme, setActiveTheme] = useState('gestasai-default');
    const [themeConfig, setThemeConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar el CSS del tema
    const loadThemeCSS = useCallback((themeId) => {
        // Remover CSS del tema anterior
        const oldLink = document.getElementById('theme-css');
        if (oldLink) {
            oldLink.remove();
        }

        // Cargar CSS del nuevo tema
        const link = document.createElement('link');
        link.id = 'theme-css';
        link.rel = 'stylesheet';
        link.href = `/themes/${themeId}/theme.css`;
        document.head.appendChild(link);

        console.log(`✅ Tema "${themeId}" cargado`);
    }, []);

    // Función para cargar la configuración del tema
    const loadThemeConfig = useCallback(async (themeId) => {
        try {
            const response = await fetch(`/themes/${themeId}/theme.json`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar theme.json para ${themeId}`);
            }
            const config = await response.json();
            setThemeConfig(config);
            return config;
        } catch (err) {
            console.error('Error cargando configuración del tema:', err);
            return null;
        }
    }, []);

    // Cargar tema activo al iniciar
    useEffect(() => {
        const loadActiveTheme = async () => {
            try {
                setIsLoading(true);

                // Intentar obtener el tema activo desde ACIDE
                let themeId = 'gestasai-default';

                try {
                    const settings = await acideService.getSettings();
                    if (settings && settings.active_theme) {
                        themeId = settings.active_theme;
                    }
                } catch (err) {
                    console.warn('No se pudo obtener tema activo desde ACIDE, usando default');
                }

                // Cargar CSS y configuración del tema
                loadThemeCSS(themeId);
                await loadThemeConfig(themeId);
                setActiveTheme(themeId);

            } catch (err) {
                setError('No se pudo cargar el tema.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadActiveTheme();
    }, [loadThemeCSS, loadThemeConfig]);

    // Función para cambiar el tema activo
    const changeTheme = useCallback(async (themeId) => {
        try {
            // Activar tema en ACIDE
            await acideService.activateTheme(themeId);

            // Cargar CSS y configuración del nuevo tema
            loadThemeCSS(themeId);
            await loadThemeConfig(themeId);
            setActiveTheme(themeId);

            console.log(`✅ Tema cambiado a "${themeId}"`);
            return true;
        } catch (err) {
            console.error('Error cambiando tema:', err);
            return false;
        }
    }, [loadThemeCSS, loadThemeConfig]);

    const value = {
        activeTheme,
        themeConfig,
        isLoading,
        error,
        changeTheme,
        loadThemeCSS,
        loadThemeConfig
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }
    return context;
};