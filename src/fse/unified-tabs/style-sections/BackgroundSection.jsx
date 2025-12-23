import React from 'react';
import { ColorControl } from '../../style-controls/ColorControl';
import { GradientControl } from '../../style-controls/GradientControl';

export function BackgroundSection({
    selectedElement,
    customStyles,
    handleCustomStyleChange,
    handleSettingsChange
}) {
    const isContainer = ['container', 'section', 'grid', 'card', 'nav', 'columns', 'column'].includes(selectedElement.element);
    const bgType = selectedElement.settings?.background?.type || 'none';

    return (
        <>
            <div className="section-header-compact">Fondo y Superficie</div>

            {isContainer && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Tipo de Fondo</label>
                    <select
                        className="form-input-compact"
                        value={bgType}
                        onChange={(e) => handleSettingsChange('background.type', e.target.value)}
                    >
                        <option value="none">Ninguno</option>
                        <option value="color">Color Sólido</option>
                        <option value="gradient">Degradado</option>
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                    </select>
                </div>
            )}

            {/* Controles según tipo */}
            {(bgType === 'color' || !isContainer) && (
                <ColorControl
                    label="Color de Fondo"
                    value={selectedElement.settings?.background?.color || customStyles['backgroundColor'] || ''}
                    onChange={(val) => {
                        if (isContainer && selectedElement.settings?.background) {
                            handleSettingsChange('background.color', val);
                        } else {
                            handleCustomStyleChange('backgroundColor', val);
                        }
                    }}
                />
            )}

            {bgType === 'gradient' && (
                <div className="mt-sm">
                    <label className="form-label-compact">Degradado</label>
                    <GradientControl
                        value={selectedElement.settings?.background?.gradient || customStyles['backgroundImage']}
                        onChange={(val) => handleSettingsChange('background.gradient', val)}
                    />
                </div>
            )}

            {bgType === 'image' && (
                <div className="mt-sm">
                    <label className="form-label-compact">URL de Imagen</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.settings?.background?.image || ''}
                        onChange={(e) => handleSettingsChange('background.image', e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            )}

            {bgType === 'video' && (
                <div className="mt-sm">
                    <label className="form-label-compact">URL de Video (MP4)</label>
                    <input
                        type="text"
                        className="form-input-compact"
                        value={selectedElement.settings?.background?.video || ''}
                        onChange={(e) => handleSettingsChange('background.video', e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            )}

            {/* Overlay */}
            {isContainer && bgType !== 'none' && (
                <div className="mt-md p-2 bg-gray-50 rounded border border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-600">Overlay</label>
                        <input
                            type="checkbox"
                            checked={selectedElement.settings?.background?.overlay?.enabled || false}
                            onChange={(e) => handleSettingsChange('background.overlay.enabled', e.target.checked)}
                        />
                    </div>

                    {selectedElement.settings?.background?.overlay?.enabled && (
                        <>
                            <ColorControl
                                label="Color"
                                value={selectedElement.settings?.background?.overlay?.color || 'rgba(0,0,0,0.5)'}
                                onChange={(val) => handleSettingsChange('background.overlay.color', val)}
                            />
                            <div className="form-group-compact mt-2">
                                <label className="form-label-compact">Opacidad</label>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={selectedElement.settings?.background?.overlay?.opacity || 0.5}
                                    onChange={(e) => handleSettingsChange('background.overlay.opacity', parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
