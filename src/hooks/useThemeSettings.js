import { useContext } from 'react';
import { acideService } from '../acide/acideService';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * 🎨 Hook para gestionar la configuración del tema de Marco CMS.
 *
 * Encapsula la lógica para:
 * - Cargar la configuración desde el motor ACIDE.
 * - Aplicar los estilos al DOM en tiempo real.
 * - Guardar la configuración de vuelta en ACIDE.
 */

export const useThemeSettings = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeSettings debe ser usado dentro de un ThemeProvider');
    }
    return context;
};