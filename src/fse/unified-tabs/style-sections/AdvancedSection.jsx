import React from 'react';
import { cssClasses, parseClasses, addClass, removeClass } from '../../cssClasses';

export function AdvancedSection({
    selectedElement,
    onUpdateStyle,
    renderClassButtons
}) {
    return (
        <>
            <div className="section-header-compact">Estilos Rápidos (Tema)</div>
            <div className="form-label-compact">Colores de Texto</div>
            {renderClassButtons('textColors')}
            <div className="mt-sm">
                <div className="form-label-compact">Colores de Fondo</div>
                {renderClassButtons('bgColors')}
            </div>
            <div className="mt-sm">
                <div className="form-label-compact">Espaciado (Padding)</div>
                {renderClassButtons('padding')}
            </div>
            <div className="mt-sm">
                <div className="form-label-compact">Margen (Margin)</div>
                {renderClassButtons('margin')}
            </div>

            <div className="divider-compact"></div>

            <div className="section-header-compact">Avanzado</div>
            <div className="form-group-compact">
                <label className="form-label-compact">ID del Elemento</label>
                <input
                    type="text"
                    className="form-input-compact font-mono"
                    value={selectedElement.id || ''}
                    onChange={(e) => onUpdateStyle(selectedElement.id, 'id', e.target.value)}
                    placeholder="ej: mi-titulo"
                />
            </div>
            <div className="form-group-compact">
                <label className="form-label-compact">Clases CSS</label>
                <input
                    type="text"
                    className="form-input-compact font-mono"
                    value={selectedElement.class || ''}
                    onChange={(e) => onUpdateStyle(selectedElement.id, 'class', e.target.value)}
                    placeholder="ej: mt-10 shadow-lg"
                />
            </div>
        </>
    );
}
