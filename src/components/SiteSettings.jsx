import React, { useState } from 'react';
import './SiteSettings.css';
import { useThemeSettings } from '../hooks/useThemeSettings';
import ColorPicker from './ColorPicker';
import FontPicker from './FontPicker'; // Asumiendo que quieres usarlo

const SiteSettings = () => {
    const { settings, isLoading, error, saveSettings, applySettings, loadSettings } = useThemeSettings();
    const [activeTab, setActiveTab] = useState('colors');
    const [isSaving, setIsSaving] = useState(false);
    // Usamos un estado local para previsualizar los cambios antes de guardarlos
    const [previewSettings, setPreviewSettings] = useState(null);

  const handleColorChange = (key, value) => {
    const currentSettings = previewSettings || settings;
    const newSettings = {
      ...currentSettings,
      colors: {
        ...(currentSettings.colors || {}),
        [key]: value,
      },
    };
    setPreviewSettings(newSettings);
    applySettings(newSettings); // Aplica para previsualización en tiempo real
  };

    const handleSave = async () => {
        if (!previewSettings) {
            alert("No hay cambios para guardar.");
            return;
        }
        setIsSaving(true);
        const success = await saveSettings(previewSettings);
        if (success) {
            alert('¡Configuración guardada con éxito!');
            setPreviewSettings(null); // Limpia la previsualización
        } else {
            alert('Error al guardar la configuración.');
        }
        setIsSaving(false);
    };

    const handleReset = () => {
        if (window.confirm('¿Descartar los cambios no guardados?')) {
            setPreviewSettings(null);
            applySettings(settings); // Vuelve a aplicar los ajustes guardados
        }
    };

    // El reset ahora se manejaría borrando el localStorage y recargando,
    // o teniendo una función `resetSettings` en el context.
    // Por simplicidad, lo dejamos fuera por ahora.

    const currentDisplaySettings = previewSettings || settings;

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

            {!isLoading && !error && currentDisplaySettings && (
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
                                        <ColorPicker label="Color Primario" value={currentDisplaySettings.colors.primary || ''} onChange={(val) => handleColorChange('primary', val)} />
                                        <ColorPicker label="Color Secundario" value={currentDisplaySettings.colors.secondary || ''} onChange={(val) => handleColorChange('secondary', val)} />
                                        <ColorPicker label="Acento" value={currentDisplaySettings.colors.accent || ''} onChange={(val) => handleColorChange('accent', val)} />
                                        <ColorPicker label="Fondo Principal" value={currentDisplaySettings.colors.bg || ''} onChange={(val) => handleColorChange('bg', val)} />
                                        <ColorPicker label="Fondo Superficies" value={currentDisplaySettings.colors.surface || ''} onChange={(val) => handleColorChange('surface', val)} />
                                        <ColorPicker label="Texto Principal" value={currentDisplaySettings.colors.text || ''} onChange={(val) => handleColorChange('text', val)} />
                                        <ColorPicker label="Texto Secundario" value={currentDisplaySettings.colors.textLight || ''} onChange={(val) => handleColorChange('textLight', val)} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="settings-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={isSaving || !previewSettings}
                        >
                            Descartar Cambios
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isSaving || !previewSettings}
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