import React from 'react';
import { ColorControl } from '../../style-controls/ColorControl';
import { GradientControl } from '../../style-controls/GradientControl';
import { MediaControl } from '../../style-controls/MediaControl';

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
                        <option value="animation">Animación (Partículas)</option>
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
                <MediaControl
                    label="Imagen de Fondo"
                    value={selectedElement.settings?.background?.image || ''}
                    type="image"
                    onChange={(url) => handleSettingsChange('background.image', url)}
                />
            )}

            {bgType === 'video' && (
                <MediaControl
                    label="Video de Fondo"
                    value={selectedElement.settings?.background?.video || ''}
                    type="video"
                    onChange={(url) => handleSettingsChange('background.video', url)}
                />
            )}

            {bgType === 'animation' && (
                <div className="mt-md p-2 bg-blue-50 rounded border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-2">Ajustes de Animación</div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Forma</label>
                        <select
                            className="form-input-compact"
                            value={selectedElement.settings?.background?.animation?.shape || 'points'}
                            onChange={(e) => handleSettingsChange('background.animation.shape', e.target.value)}
                        >
                            <option value="points">Puntos</option>
                            <option value="spheres">Esferas</option>
                            <option value="cubes">Cubos</option>
                            <option value="lines">Líneas</option>
                            <option value="bubbles">Burbujas</option>
                        </select>
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Modo</label>
                        <select
                            className="form-input-compact"
                            value={selectedElement.settings?.background?.animation?.mode || 'follow'}
                            onChange={(e) => handleSettingsChange('background.animation.mode', e.target.value)}
                        >
                            <option value="follow">Seguir Cursor</option>
                            <option value="avoid">Evitar Cursor</option>
                            <option value="rain">Lluvia</option>
                            <option value="direction">Flujo</option>
                            <option value="none">Sin Interacción</option>
                        </select>
                    </div>

                    <ColorControl
                        label="Color Partículas"
                        value={selectedElement.settings?.background?.animation?.color || '#4285F4'}
                        onChange={(val) => handleSettingsChange('background.animation.color', val)}
                    />

                    <ColorControl
                        label="Color de Fondo Anim."
                        value={selectedElement.settings?.background?.animation?.backgroundColor || '#000000'}
                        onChange={(val) => handleSettingsChange('background.animation.backgroundColor', val)}
                    />

                    <div className="form-group-compact">
                        <label className="form-label-compact">Cantidad</label>
                        <input
                            type="number"
                            className="form-input-compact"
                            value={selectedElement.settings?.background?.animation?.count !== undefined ? selectedElement.settings?.background?.animation?.count : 2000}
                            onChange={(e) => handleSettingsChange('background.animation.count', parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Tamaño ({selectedElement.settings?.background?.animation?.size || 0.06})</label>
                        <input
                            type="range" min="0.01" max="1" step="0.01"
                            className="w-full"
                            value={selectedElement.settings?.background?.animation?.size || 0.06}
                            onChange={(e) => handleSettingsChange('background.animation.size', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Intensidad ({selectedElement.settings?.background?.animation?.intensity || 1.5})</label>
                        <input
                            type="range" min="0.1" max="10" step="0.1"
                            className="w-full"
                            value={selectedElement.settings?.background?.animation?.intensity || 1.5}
                            onChange={(e) => handleSettingsChange('background.animation.intensity', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group-compact">
                        <label className="form-label-compact">Velocidad ({selectedElement.settings?.background?.animation?.timeScale || 1.2})</label>
                        <input
                            type="range" min="0.1" max="5" step="0.1"
                            className="w-full"
                            value={selectedElement.settings?.background?.animation?.timeScale || 1.2}
                            onChange={(e) => handleSettingsChange('background.animation.timeScale', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {/* Overlay */}
            {isContainer && bgType !== 'none' && (
                <div className="mt-md p-2 bg-gray-50 rounded border border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-600">Overlay (Capa)</label>
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
                                value={selectedElement.settings?.background?.overlay?.color || '#000000'}
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
