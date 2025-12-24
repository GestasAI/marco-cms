import React from 'react';
import { ColorControl } from '../../style-controls/ColorControl';

export function AnimationSection({ selectedElement, handleSettingsChange }) {
    const settings = selectedElement.settings || {};
    const particles = settings.particles || {};
    const animation = settings.animation || {};

    return (
        <div className="animation-settings">
            <ColorControl
                label="Color de Fondo"
                value={settings.layout?.background || '#000000'}
                onChange={(val) => handleSettingsChange('layout.background', val)}
            />

            <div className="divider-compact"></div>

            <div className="section-header-compact">Configuración de Partículas</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Forma</label>
                <select
                    className="form-input-compact"
                    value={particles.shape || 'points'}
                    onChange={(e) => handleSettingsChange('particles.shape', e.target.value)}
                >
                    <option value="points">Puntos (Cuadrados)</option>
                    <option value="spheres">Esferas</option>
                    <option value="cubes">Cubos</option>
                    <option value="lines">Líneas / Guiones</option>
                    <option value="bubbles">Burbujas</option>
                </select>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Cantidad</label>
                <input
                    type="number"
                    className="form-input-compact"
                    value={particles.count || 3000}
                    onChange={(e) => handleSettingsChange('particles.count', parseInt(e.target.value))}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Tamaño</label>
                <input
                    type="range" min="0.01" max="1" step="0.01"
                    className="w-full"
                    value={particles.size || 0.06}
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

            <div className="form-group-compact">
                <label className="form-label-compact">Modo de Interacción</label>
                <select
                    className="form-input-compact"
                    value={animation.mode || 'follow'}
                    onChange={(e) => handleSettingsChange('animation.mode', e.target.value)}
                >
                    <option value="follow">Seguir Cursor</option>
                    <option value="avoid">Evitar Cursor (Repulsión)</option>
                    <option value="rain">Lluvia (Caída Constante)</option>
                    <option value="direction">Dirección Fija (Flujo)</option>
                    <option value="none">Sin Interacción</option>
                </select>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Intensidad / Fuerza</label>
                <input
                    type="range" min="0.1" max="10" step="0.1"
                    className="w-full"
                    value={animation.intensity || 1.5}
                    onChange={(e) => handleSettingsChange('animation.intensity', parseFloat(e.target.value))}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Velocidad de Tiempo</label>
                <input
                    type="range" min="0.1" max="5" step="0.1"
                    className="w-full"
                    value={animation.timeScale || 1.2}
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
                    value={settings.layout?.height || '500px'}
                    onChange={(e) => handleSettingsChange('layout.height', e.target.value)}
                    placeholder="500px"
                />
            </div>
        </div>
    );
}
