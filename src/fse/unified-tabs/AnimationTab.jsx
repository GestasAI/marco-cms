import React from 'react';
import { AnimationSection } from './style-sections/AnimationSection';

export function AnimationTab({ selectedElement, onUpdateStyle }) {
    const handleSettingsChange = (path, value) => {
        const settings = { ...(selectedElement.settings || {}) };
        const keys = path.split('.');
        let current = settings;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        onUpdateStyle(selectedElement.id, 'settings', settings);
    };

    if (selectedElement.element !== 'effect') {
        return (
            <div className="tab-content p-md text-center text-gray-500">
                <p>Este elemento no soporta animaciones avanzadas de Three.js.</p>
                <p className="text-xs mt-sm">Selecciona un bloque de la categoría "Efectos".</p>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <AnimationSection
                selectedElement={selectedElement}
                handleSettingsChange={handleSettingsChange}
            />
        </div>
    );
}
