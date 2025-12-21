import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { acideService } from '../acide/acideService';

export const ThemeContext = createContext();

const defaultSettings = {
    active_theme: 'gestasai-default',
    designTokens: {} // Placeholder
};

export const ThemeProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Apply CSS Variables and Load CSS Link
    const applySettings = useCallback((settingsToApply) => {
        if (!settingsToApply) return;
        const root = document.documentElement;

        // Apply Design Tokens (CSS Variables)
        if (settingsToApply.designTokens?.colors) {
            Object.entries(settingsToApply.designTokens.colors).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        root.style.setProperty(`--theme-color-${key}-${subKey}`, subValue);
                    });
                } else {
                    root.style.setProperty(`--theme-color-${key}`, value);
                }
            });
        }

        // CSS Injection Logic
        const baseUrl = import.meta.env.BASE_URL;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

        // Determine theme URL
        const themeName = settingsToApply.active_theme || 'gestasai-default';
        const themeUrl = `${cleanBase}themes/${themeName}/theme.css`;

        let link = document.querySelector('link[id="theme-css"]');
        if (!link) {
            link = document.createElement('link');
            link.id = 'theme-css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = themeUrl;

    }, []);

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // Detect Context directly via URL window location
        // This is simple but effective for the "Separation" logic requested.
        const path = window.location.pathname;
        const isAdmin = path.includes('/dashboard') || path.includes('/login') || path.includes('admin');

        try {
            // Attempt to read configuration
            // Note: acideService.get() is now a STATIC READ (no PHP involved)
            let savedSettings = null;
            try {
                savedSettings = await acideService.get('theme_settings', 'current');
            } catch (e) {
                // If static read fails (404/Network), we handle it below
                savedSettings = null;
            }

            if (savedSettings) {
                // Happy Path: Configuration exists
                setSettings(savedSettings);
                applySettings(savedSettings);
            } else {
                // Configuration Missing
                console.warn('Theme configuration not found. Using default.');

                // FALLBACK: Use default settings in memory
                setSettings(defaultSettings);
                applySettings(defaultSettings);

                // SELF-HEALING (Admin Only)
                // If we are in Admin context, we should create the file to initialize the system.
                if (isAdmin) {
                    console.info('Admin Context detected: Initializing theme settings via Backend...');
                    try {
                        const initConfig = { ...defaultSettings, id: 'current', _createdAt: new Date().toISOString() };
                        // Create via PHP
                        await acideService.update('theme_settings', 'current', initConfig);
                        console.info('Theme settings initialized successfully.');
                    } catch (writeErr) {
                        console.error('Failed to initialize theme settings:', writeErr);
                    }
                }
            }

        } catch (err) {
            console.error('Unexpected error loading theme:', err);
            // Absolute Fallback
            setSettings(defaultSettings);
            applySettings(defaultSettings);
        } finally {
            setIsLoading(false);
        }
    }, [applySettings]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const saveSettings = async (newSettings) => {
        try {
            // Write via PHP
            await acideService.update('theme_settings', 'current', newSettings);
            setSettings(newSettings);
            applySettings(newSettings);
            return true;
        } catch (err) {
            console.error("Error saving settings:", err);
            setError('No se pudo guardar la configuración.');
            return false;
        }
    };

    
    const changeTheme = async (themeId) => {
        try {
            // Activate theme via ACIDE
            await acideService.activateTheme(themeId);
            
            // Reload settings to get new theme
            await loadSettings();
            
            // Force reload to clear any cached content
            window.location.reload();
            
            return true;
        } catch (err) {
            console.error("Error changing theme:", err);
            setError('No se pudo cambiar el tema.');
            return false;
        }
    };

    const value = { settings, isLoading, error, applySettings, saveSettings, loadSettings , changeTheme };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
