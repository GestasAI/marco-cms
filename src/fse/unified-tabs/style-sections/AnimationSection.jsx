import React from 'react';
import { ColorControl } from '../../style-controls/ColorControl';

export function AnimationSection({ selectedElement, handleSettingsChange }) {
    if (selectedElement.element !== 'effect') return null;

    const settings = selectedElement.settings || {};
    const particles = settings.particles || {};
    const animation = settings.animation || {};

    return (
        <div className="animation-settings">
            <div className="section-header-compact">Configuración de Partículas</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Cantidad</label>
                <input
                    type="number"
                    className="form-input-compact"
                    value={particles.count || 2000}
                    onChange={(e) => handleSettingsChange('particles.count', parseInt(e.target.value))}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Tamaño</label>
                <input
                    type="range" min="0.01" max="0.5" step="0.01"
                    className="w-full"
                    value={particles.size || 0.05}
                    onChange={(e) => handleSettingsChange('particles.size', parseFloat(e.target.value))}
                />
            </div>

            <ColorControl
                label="Color de Partículas"
                value={particles.color || '#4285F4'}
                onChange={(val) => handleSettingsChange('particles.color', val)}
            />

            <div className="divider-compact"></div>

            <div className="section-header-compact">Animación e Interacción</div>

            <div className="form-group-compact flex items-center justify-between">
                <label className="form-label-compact">Seguir Cursor</label>
                <input
                    type="checkbox"
                    checked={animation.followCursor !== false}
                    onChange={(e) => handleSettingsChange('animation.followCursor', e.target.checked)}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Intensidad</label>
                <input
                    type="range" min="0.1" max="5" step="0.1"
                    className="w-full"
                    value={animation.intensity || 1.0}
                    onChange={(e) => handleSettingsChange('animation.intensity', parseFloat(e.target.value))}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Velocidad de Tiempo</label>
                <input
                    type="range" min="0.1" max="3" step="0.1"
                    className="w-full"
                    value={animation.timeScale || 1.0}
                    onChange={(e) => handleSettingsChange('animation.timeScale', parseFloat(e.target.value))}
                />
            </div>

            <div className="divider-compact"></div>

            <div className="section-header-compact">Dimensiones</div>
            <div className="form-group-compact">
                <label className="form-label-compact">Altura del Bloque</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={settings.layout?.height || '600px'}
                    onChange={(e) => handleSettingsChange('layout.height', e.target.value)}
                    placeholder="600px"
                />
            </div>
        </div>
    );
}
