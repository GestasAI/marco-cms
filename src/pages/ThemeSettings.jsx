import { useState } from 'react';
import { useThemeSettings } from '../hooks/useThemeSettings';
import ColorPicker from '../components/ColorPicker';
import FontPicker from '../components/FontPicker';
import { Save, RotateCcw, Eye } from 'lucide-react';
import './ThemeSettings.css';

/**
 * ThemeSettings - Panel completo de configuración del tema
 * Permite personalizar colores, fuentes, layout, etc.
 */
export default function ThemeSettings() {
    const {
        settings,
        loading,
        saving,
        updateColor,
        updateFont,
        updateLayout,
        saveSettings,
        resetSettings
    } = useThemeSettings();

    const [activeTab, setActiveTab] = useState('colors');
    const [showPreview, setShowPreview] = useState(false);

    if (loading) {
        return <div className="theme-settings-loading">Cargando configuración...</div>;
    }

    if (!settings) {
        return <div className="theme-settings-error">Error al cargar configuración</div>;
    }

    const handleSave = async () => {
        const success = await saveSettings();
        if (success) {
            alert('Configuración guardada correctamente');
        }
    };

    const handleReset = async () => {
        if (confirm('¿Estás seguro de resetear a la configuración por defecto?')) {
            await resetSettings();
        }
    };

    return (
        <div className="theme-settings">
            {/* Header */}
            <div className="settings-header">
                <h2>Configuración del Tema</h2>
                <div className="settings-actions">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="btn btn-secondary"
                    >
                        <Eye size={18} />
                        {showPreview ? 'Ocultar' : 'Vista Previa'}
                    </button>
                    <button onClick={handleReset} className="btn btn-secondary">
                        <RotateCcw size={18} />
                        Resetear
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        <Save size={18} />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="settings-tabs">
                <button
                    className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('colors')}
                >
                    Colores
                </button>
                <button
                    className={`tab ${activeTab === 'typography' ? 'active' : ''}`}
                    onClick={() => setActiveTab('typography')}
                >
                    Tipografía
                </button>
                <button
                    className={`tab ${activeTab === 'layout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('layout')}
                >
                    Layout
                </button>
                <button
                    className={`tab ${activeTab === 'header' ? 'active' : ''}`}
                    onClick={() => setActiveTab('header')}
                >
                    Header
                </button>
            </div>

            {/* Content */}
            <div className="settings-content">
                {activeTab === 'colors' && (
                    <ColorsTab settings={settings} updateColor={updateColor} />
                )}
                {activeTab === 'typography' && (
                    <TypographyTab settings={settings} updateFont={updateFont} />
                )}
                {activeTab === 'layout' && (
                    <LayoutTab settings={settings} updateLayout={updateLayout} />
                )}
                {activeTab === 'header' && (
                    <HeaderTab settings={settings} updateLayout={updateLayout} />
                )}
            </div>

            {/* Preview */}
            {showPreview && (
                <div className="settings-preview">
                    <h3>Vista Previa</h3>
                    <div className="preview-container">
                        <PreviewSample settings={settings} />
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Tab de Colores
 */
function ColorsTab({ settings, updateColor }) {
    const colorGroups = [
        {
            title: 'Colores Principales',
            colors: [
                { key: 'primary', label: 'Primario' },
                { key: 'secondary', label: 'Secundario' },
                { key: 'accent', label: 'Acento' }
            ]
        },
        {
            title: 'Colores de Fondo',
            colors: [
                { key: 'background', label: 'Fondo' },
                { key: 'surface', label: 'Superficie' }
            ]
        },
        {
            title: 'Colores de Texto',
            colors: [
                { key: 'text', label: 'Texto Principal' },
                { key: 'textLight', label: 'Texto Claro' }
            ]
        },
        {
            title: 'Colores de Estado',
            colors: [
                { key: 'success', label: 'Éxito' },
                { key: 'warning', label: 'Advertencia' },
                { key: 'error', label: 'Error' },
                { key: 'info', label: 'Información' }
            ]
        }
    ];

    return (
        <div className="colors-tab">
            {colorGroups.map((group, index) => (
                <div key={index} className="color-group">
                    <h3>{group.title}</h3>
                    <div className="color-grid">
                        {group.colors.map((color) => (
                            <ColorPicker
                                key={color.key}
                                label={color.label}
                                value={settings.colors[color.key]}
                                onChange={(value) => updateColor(color.key, value)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Tab de Tipografía
 */
function TypographyTab({ settings, updateFont }) {
    return (
        <div className="typography-tab">
            <div className="typography-section">
                <h3>Fuentes</h3>

                <FontPicker
                    label="Fuente Principal"
                    value={settings.typography.fontFamily}
                    onChange={(value) => updateFont('fontFamily', value)}
                />

                <FontPicker
                    label="Fuente de Títulos"
                    value={settings.typography.headingFont}
                    onChange={(value) => updateFont('headingFont', value)}
                />

                <FontPicker
                    label="Fuente Monoespaciada"
                    value={settings.typography.monoFont}
                    onChange={(value) => updateFont('monoFont', value)}
                />
            </div>

            <div className="typography-section">
                <h3>Tamaños de Fuente</h3>
                <div className="font-sizes">
                    {Object.entries(settings.typography.fontSize).map(([key, value]) => (
                        <div key={key} className="font-size-control">
                            <label>{key}</label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    updateFont('fontSize', {
                                        ...settings.typography.fontSize,
                                        [key]: e.target.value
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Tab de Layout
 */
function LayoutTab({ settings, updateLayout }) {
    return (
        <div className="layout-tab">
            <div className="layout-section">
                <h3>Contenedor</h3>

                <div className="layout-control">
                    <label>Ancho Máximo</label>
                    <input
                        type="text"
                        value={settings.layout.containerWidth}
                        onChange={(e) => updateLayout('containerWidth', e.target.value)}
                    />
                </div>

                <div className="layout-control">
                    <label>Padding</label>
                    <input
                        type="text"
                        value={settings.layout.containerPadding}
                        onChange={(e) => updateLayout('containerPadding', e.target.value)}
                    />
                </div>
            </div>

            <div className="layout-section">
                <h3>Espaciado</h3>
                <div className="spacing-grid">
                    {Object.entries(settings.layout.spacing).map(([key, value]) => (
                        <div key={key} className="spacing-control">
                            <label>{key}</label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    updateLayout('spacing', {
                                        ...settings.layout.spacing,
                                        [key]: e.target.value
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Tab de Header
 */
function HeaderTab({ settings, updateLayout }) {
    return (
        <div className="header-tab">
            <div className="header-section">
                <h3>Configuración del Header</h3>

                <div className="header-control">
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.header.fixed}
                            onChange={(e) =>
                                updateLayout('header', {
                                    ...settings.header,
                                    fixed: e.target.checked
                                })
                            }
                        />
                        Header Fijo
                    </label>
                </div>

                <div className="header-control">
                    <label>Altura</label>
                    <input
                        type="text"
                        value={settings.header.height}
                        onChange={(e) =>
                            updateLayout('header', {
                                ...settings.header,
                                height: e.target.value
                            })
                        }
                    />
                </div>

                <div className="header-control">
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.header.blur}
                            onChange={(e) =>
                                updateLayout('header', {
                                    ...settings.header,
                                    blur: e.target.checked
                                })
                            }
                        />
                        Efecto Blur
                    </label>
                </div>
            </div>
        </div>
    );
}

/**
 * Preview Sample
 */
function PreviewSample({ settings }) {
    return (
        <div className="preview-sample" style={{
            '--preview-primary': settings.colors.primary,
            '--preview-text': settings.colors.text,
            '--preview-font': settings.typography.fontFamily
        }}>
            <h1 style={{ fontFamily: settings.typography.headingFont }}>
                Título de Ejemplo
            </h1>
            <p style={{ fontFamily: settings.typography.fontFamily }}>
                Este es un párrafo de ejemplo para mostrar cómo se verá el texto con la configuración actual.
            </p>
            <button style={{ background: settings.colors.primary, color: 'white' }}>
                Botón de Ejemplo
            </button>
        </div>
    );
}
