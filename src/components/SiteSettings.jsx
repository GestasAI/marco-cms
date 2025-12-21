import React, { useState, useEffect } from 'react';
import './SiteSettings.css';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { acideService } from '../acide/acideService';
import ColorPicker from './ColorPicker';
import { Layout, Palette, CheckCircle, Loader } from 'lucide-react';

const SiteSettings = () => {
    const { settings, isLoading, error, saveSettings, applySettings, loadSettings } = useThemeSettings();
    const [activeTab, setActiveTab] = useState('themes');
    const [isSaving, setIsSaving] = useState(false);

    // Theme Management State
    const [themes, setThemes] = useState([]);
    const [themesLoading, setThemesLoading] = useState(false);
    const [previewSettings, setPreviewSettings] = useState(null);

    // Initial Load of themes
    useEffect(() => {
        loadThemes();
    }, []);

    const loadThemes = async () => {
        setThemesLoading(true);
        try {
            const list = await acideService.listThemes();
            setThemes(list);
        } catch (e) {
            console.error("Error loading themes:", e);
        } finally {
            setThemesLoading(false);
        }
    };

    const handleActivateTheme = async (themeId) => {
        if (!window.confirm(`¿Seguro que quieres activar el tema "${themeId}"?`)) return;

        try {
            await acideService.activateTheme(themeId);
            // Reload settings to apply changes (ThemeContext will pick up new active_theme)
            await loadSettings();
            alert(`Tema ${themeId} activado correctamente.`);
            // Reload page to apply new theme
            window.location.reload();
        } catch (e) {
            alert('Error al activar el tema.');
            console.error(e);
        }
    };

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
        applySettings(newSettings);
    };

    const handleSaveColors = async () => {
        if (!previewSettings) return;
        setIsSaving(true);
        const success = await saveSettings(previewSettings);
        if (success) {
            setPreviewSettings(null);
            alert('Configuración guardada.');
        } else {
            alert('Error al guardar.');
        }
        setIsSaving(false);
    };

    const handleResetColors = () => {
        setPreviewSettings(null);
        applySettings(settings);
    };

    const currentDisplaySettings = previewSettings || settings;

    return (
        <div className="site-settings container mx-auto p-6">
            <header className="mb-8">
                <h1 className="heading-2 mb-2">Ajustes del Sitio</h1>
                <p className="text-secondary">Gestiona la apariencia y el tema de tu sitio.</p>
            </header>

            {(isLoading) && <div className="text-center p-8">Cargando configuración...</div>}

            {!isLoading && (
                <>
                    <div className="flex gap-4 mb-8 border-b border-gray-200">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'themes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('themes')}
                        >
                            <Layout size={18} />
                            Temas
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'colors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('colors')}
                        >
                            <Palette size={18} />
                            Personalizar Colores
                        </button>
                    </div>

                    <div className="settings-content min-h-[400px]">
                        {/* THEMES TAB */}
                        {activeTab === 'themes' && (
                            <div>
                                {themesLoading ? (
                                    <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
                                        <Loader className="animate-spin" /> Cargando temas disponibles...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {themes.map(theme => {
                                            const isActive = settings.active_theme === theme.id;
                                            return (
                                                <div key={theme.id} className={`border rounded-lg overflow-hidden transition-all ${isActive ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-lg border-gray-200'}`}>
                                                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                                        {theme.screenshot ? (
                                                            <img src={theme.screenshot} alt={theme.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-400 text-3xl font-bold uppercase">{theme.name?.[0] || 'T'}</span>
                                                        )}

                                                        {/* Hover Overlay */}
                                                        {!isActive && (
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    className="bg-white text-black px-6 py-2 rounded-full font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                                                    onClick={() => handleActivateTheme(theme.id)}
                                                                >
                                                                    Activar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="font-bold text-lg">{theme.name || theme.id}</h3>
                                                                <p className="text-xs text-gray-500">v{theme.version || '1.0'}</p>
                                                            </div>
                                                            {isActive && <span className="text-green-600 flex items-center text-sm font-medium gap-1"><CheckCircle size={14} /> Activo</span>}
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{theme.description || 'Sin descripción.'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* COLORS TAB */}
                        {activeTab === 'colors' && currentDisplaySettings && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <ColorPicker label="Color Primario" value={currentDisplaySettings.colors?.primary || '#3b82f6'} onChange={(val) => handleColorChange('primary', val)} />
                                    <ColorPicker label="Color Secundario" value={currentDisplaySettings.colors?.secondary || '#8b5cf6'} onChange={(val) => handleColorChange('secondary', val)} />
                                    <ColorPicker label="Acento" value={currentDisplaySettings.colors?.accent || '#10b981'} onChange={(val) => handleColorChange('accent', val)} />
                                    <ColorPicker label="Fondo" value={currentDisplaySettings.colors?.bg || '#ffffff'} onChange={(val) => handleColorChange('bg', val)} />
                                    <ColorPicker label="Superficies" value={currentDisplaySettings.colors?.surface || '#f9fafb'} onChange={(val) => handleColorChange('surface', val)} />
                                    <ColorPicker label="Texto" value={currentDisplaySettings.colors?.text || '#1f2937'} onChange={(val) => handleColorChange('text', val)} />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleResetColors}
                                        disabled={isSaving || !previewSettings}
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveColors}
                                        disabled={isSaving || !previewSettings}
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SiteSettings;
