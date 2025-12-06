import { useState, useEffect, useCallback } from 'react';
import { acideService } from '../acide/acideService'; // Correcto

/**
 * 🎨 Hook para gestionar la configuración del tema de Marco CMS.
 *
 * Encapsula la lógica para:
 * - Cargar la configuración desde el motor ACIDE.
 * - Aplicar los estilos al DOM en tiempo real.
 * - Guardar la configuración de vuelta en ACIDE.
 */

// Helper para convertir camelCase a kebab-case para variables CSS
const toKebabCase = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

export const useThemeSettings = (defaultSettings) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [themeMode, setThemeMode] = useState('light'); // 'light' o 'dark'
    const [error, setError] = useState(null);

    /**
     * Aplica un objeto de configuración a las variables CSS de :root.
     */
    const applySettings = useCallback((newSettings) => {
        if (!newSettings) return;

        const root = document.documentElement;

        // Itera sobre las categorías de ajustes (colors, typography, etc.)
        for (const category in newSettings) {
            const group = newSettings[category];
            for (const key in group) {
                // Construye el nombre de la variable CSS, ej: --color-primary
                const cssVar = `--${category.slice(0, -1)}-${toKebabCase(key)}`;
                root.style.setProperty(cssVar, group[key]);
            }
        }
    }, []);

    /**
     * Carga la configuración desde ACIDE al iniciar.
     */
    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        
        // Cargar preferencia de modo (light/dark)
        const savedMode = localStorage.getItem('themeMode') || 'light';
        setThemeMode(savedMode);
        document.documentElement.setAttribute('data-theme', savedMode);

        setError(null);
        try {
            // 'theme_settings' es el schema, 'current' es el ID del documento
            const savedSettings = await acideService.get('theme_settings', 'current');
            console.log('[useThemeSettings] Configuración cargada desde ACIDE:', savedSettings);
            // Fusionar con los valores por defecto para evitar errores si faltan claves
            const mergedSettings = { ...defaultSettings, ...savedSettings };
            setSettings(mergedSettings);
            applySettings(savedSettings);
        } catch (err) {
            // Si no se encuentra (404), usamos los ajustes por defecto.
            if (err.message.includes('404') || err.message.includes('no encontrado')) {
                console.warn('[useThemeSettings] No se encontró configuración guardada. Usando valores por defecto.');
                setSettings(defaultSettings);
                applySettings(defaultSettings);
            } else {
                console.error('[useThemeSettings] Error al cargar la configuración:', err);
                setError('No se pudo cargar la configuración del tema.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [applySettings, defaultSettings]);

    /**
     * Guarda la configuración actual en ACIDE.
     */
    const saveSettings = async (currentSettings) => {
        try {
            await acideService.update('theme_settings', 'current', currentSettings);
            console.log('[useThemeSettings] Configuración guardada en ACIDE.');
            return true;
        } catch (err) {
            console.error('[useThemeSettings] Error al guardar la configuración:', err);
            setError('No se pudo guardar la configuración.');
            return false;
        }
    };

    const toggleTheme = useCallback(() => {
        setThemeMode(prevMode => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            document.documentElement.setAttribute('data-theme', newMode);
            console.log(`[useThemeSettings] Tema cambiado a: ${newMode}`);
            return newMode;
        });
    }, []);

    // Cargar la configuración inicial al montar el hook
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return { settings, setSettings, isLoading, error, applySettings, saveSettings, loadSettings, themeMode, toggleTheme };
};