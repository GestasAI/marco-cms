import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Hook para acceder al contexto del tema
 * @returns {Object} Contexto del tema con settings y métodos
 * 
 * @example
 * const { currentTheme, themeSettings, updateSettings } = useTheme();
 */
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }

    return context;
}
