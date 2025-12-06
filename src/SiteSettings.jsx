import React, { useState } from 'react';
import './SiteSettings.css';
import { useThemeSettings } from '../hooks/useThemeSettings';
import ColorPicker from './ColorPicker';
import FontPicker from './components/FontPicker'; // Asumiendo que quieres usarlo

const SiteSettings = () => {
    const { settings, isLoading, error, saveSettings, applySettings } = useThemeSettings();
    const [activeTab, setActiveTab] = useState('colors');
    const [isSaving, setIsSaving] = useState(false);

    const handleColorChange = (key, value) => {
        const newSettings = {
            ...settings,
            colors: {
                ...(settings.colors || {}),
                [key]: value,
            },
        };
        applySettings(newSettings);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // applySettings actualiza el DOM, pero necesitamos guardar el estado que se está previsualizando
        if (window.confirm('¿Guardar los cambios actuales?')) {
            alert('¡Configuración guardada con éxito!');
        } else {
            alert('¡Configuración guardada con éxito!');
        } else {
            alert('Error al guardar la configuración.');
        }
        setIsSaving(false);
    };

    // El reset ahora se manejaría borrando el localStorage y recargando,
    // o teniendo una función `resetSettings` en el context.
    // Por simplicidad, lo dejamos fuera por ahora.

    return (
        <div className="site-settings">
            <header className="settings-header">
                <h1 className="heading-2">Ajustes del Sitio</h1>
                <p className="text-secondary">Personaliza la apariencia de tu sitio en tiempo real.</p>
            </header>

            {isLoading && (
                <div className="settings-loading">Cargando configuración...</div>
            )}

            {error && (
                <div className="alert alert-error">{error}</div>
            )}

            {!isLoading && !error && settings && (
                <>
                    <div className="settings-tabs">
                        <button className={`tab ${activeTab === 'colors' ? 'active' : ''}`} onClick={() => setActiveTab('colors')}>
                            🎨 Colores
                        </button>
                    </div>

                    <div className="settings-content">
                        {activeTab === 'colors' && (
                            <section className="settings-section">
                                <div className="settings-group">
                                    <div className="color-grid">
                                        <ColorPicker label="Color Primario" value={settings.colors.primary || ''} onChange={(val) => handleColorChange('primary', val)} />
                                        <ColorPicker label="Color Secundario" value={settings.colors.secondary || ''} onChange={(val) => handleColorChange('secondary', val)} />
                                        <ColorPicker label="Fondo Principal" value={settings.colors.bg || ''} onChange={(val) => handleColorChange('bg', val)} />
                                        <ColorPicker label="Fondo Superficies" value={settings.colors.surface || ''} onChange={(val) => handleColorChange('surface', val)} />
                                        <ColorPicker label="Texto Principal" value={settings.colors.text || ''} onChange={(val) => handleColorChange('text', val)} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="settings-actions">
                        <button className="btn btn-secondary" disabled={isSaving}>
                            Restaurar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SiteSettings;