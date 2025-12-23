import React from 'react';
import { cssClasses, parseClasses, addClass, removeClass } from '../cssClasses';
import { LayoutSection } from './style-sections/LayoutSection';
import { TypographySection } from './style-sections/TypographySection';
import { BackgroundSection } from './style-sections/BackgroundSection';
import { BorderShadowSection } from './style-sections/BorderShadowSection';
import { AdvancedSection } from './style-sections/AdvancedSection';

/**
 * Pestaña Style - Refactorizada y Modularizada
 */
export function StyleTab({
    selectedElement,
    onUpdateStyle,
    onUpdateCustomStyle,
    onUpdateMultiple,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate
}) {
    const currentClasses = parseClasses(selectedElement.class || '');
    const customStyles = selectedElement.customStyles || {};

    const hasClass = (className) => currentClasses.includes(className);

    const toggleClassHandler = (className) => {
        const currentClassString = selectedElement.class || '';
        let newClassString = hasClass(className)
            ? removeClass(currentClassString, className)
            : addClass(currentClassString, className);
        onUpdateStyle(selectedElement.id, 'class', newClassString);
    };

    const handleCustomStyleChange = (property, value) => {
        onUpdateCustomStyle(selectedElement.id, property, value);
    };

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

    const renderClassButtons = (category) => {
        const classes = cssClasses[category]?.classes || [];
        return (
            <div className="button-grid-compact">
                {classes.map(cls => (
                    <button
                        key={cls.id}
                        className={hasClass(cls.value) ? 'active' : ''}
                        onClick={() => toggleClassHandler(cls.value)}
                        title={cls.preview || cls.value}
                    >
                        {cls.color && (
                            <span style={{
                                display: 'inline-block', width: '10px', height: '10px',
                                backgroundColor: cls.color, borderRadius: '2px', marginRight: '4px'
                            }}></span>
                        )}
                        <span style={{ fontSize: '10px' }}>{cls.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="tab-content">
            {/* Cabecera de Acciones */}
            <div className="action-icons-row mb-md">
                <button className="action-icon-btn" onClick={() => onMoveUp(selectedElement.id)}>↑</button>
                <button className="action-icon-btn" onClick={() => onMoveDown(selectedElement.id)}>↓</button>
                <button className="action-icon-btn" onClick={() => onDuplicate(selectedElement.id)}>⎘</button>
                <button className="action-icon-btn action-icon-delete" onClick={() => onDelete(selectedElement.id)}>🗑</button>
            </div>

            <LayoutSection
                customStyles={customStyles}
                handleCustomStyleChange={handleCustomStyleChange}
                selectedElement={selectedElement}
                onUpdateStyle={onUpdateStyle}
            />

            <div className="divider-compact"></div>

            <TypographySection
                selectedElement={selectedElement}
                customStyles={customStyles}
                handleCustomStyleChange={handleCustomStyleChange}
                onUpdateStyle={onUpdateStyle}
                onUpdateMultiple={onUpdateMultiple}
            />

            <div className="divider-compact"></div>

            <BackgroundSection
                selectedElement={selectedElement}
                customStyles={customStyles}
                handleCustomStyleChange={handleCustomStyleChange}
                handleSettingsChange={handleSettingsChange}
            />

            <div className="divider-compact"></div>

            <BorderShadowSection
                customStyles={customStyles}
                handleCustomStyleChange={handleCustomStyleChange}
            />

            <div className="divider-compact"></div>

            <AdvancedSection
                selectedElement={selectedElement}
                onUpdateStyle={onUpdateStyle}
                renderClassButtons={renderClassButtons}
            />
        </div>
    );
}
