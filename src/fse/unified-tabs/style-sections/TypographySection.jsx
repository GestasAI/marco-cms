import React from 'react';
import { ColorControl } from '../../style-controls/ColorControl';
import { TypographyControl } from '../../style-controls/TypographyControl';

export function TypographySection({
    selectedElement,
    customStyles,
    handleCustomStyleChange,
    onUpdateStyle,
    onUpdateMultiple
}) {
    const isTextElement = ['heading', 'text', 'button', 'link', 'nav', 'logo'].includes(selectedElement.element);
    const isContainer = ['container', 'section', 'grid', 'card', 'nav', 'columns', 'column'].includes(selectedElement.element);
    const canHaveTextColor = isTextElement || isContainer;

    if (!canHaveTextColor) return null;

    return (
        <>
            <div className="section-header-compact">Configuración de Texto</div>

            {(selectedElement.element === 'heading' || selectedElement.element === 'text') && (
                <div className="form-group-compact">
                    <label className="form-label-compact">Etiqueta (Tag)</label>
                    <select
                        className="form-input-compact"
                        value={selectedElement.tag || (selectedElement.element === 'heading' ? 'h2' : 'p')}
                        onChange={(e) => {
                            const newTag = e.target.value;
                            if (selectedElement.element === 'heading') {
                                const newClass = (selectedElement.class || '').replace(/heading-[1-6]/, `heading-${newTag.charAt(1)}`);
                                onUpdateMultiple(selectedElement.id, { tag: newTag, class: newClass });
                            } else {
                                onUpdateStyle(selectedElement.id, 'tag', newTag);
                            }
                        }}
                    >
                        {selectedElement.element === 'heading' ? [
                            <option key="h1" value="h1">H1</option>,
                            <option key="h2" value="h2">H2</option>,
                            <option key="h3" value="h3">H3</option>,
                            <option key="h4" value="h4">H4</option>
                        ] : [
                            <option key="p" value="p">Párrafo</option>,
                            <option key="span" value="span">Span</option>,
                            <option key="div" value="div">Div</option>
                        ]}
                    </select>
                </div>
            )}

            <ColorControl
                label="Color de Texto"
                value={customStyles['color'] || ''}
                onChange={(val) => handleCustomStyleChange('color', val)}
            />

            <div className="mt-sm">
                <TypographyControl
                    styles={customStyles}
                    onChange={handleCustomStyleChange}
                />
            </div>
        </>
    );
}
