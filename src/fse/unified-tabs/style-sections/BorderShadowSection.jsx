import React from 'react';
import { BorderControl } from '../../style-controls/BorderControl';
import { ShadowControl } from '../../style-controls/ShadowControl';

export function BorderShadowSection({ customStyles, handleCustomStyleChange }) {
    return (
        <>
            <div className="section-header-compact">Bordes y Radio</div>
            <BorderControl
                styles={customStyles}
                onChange={handleCustomStyleChange}
            />

            <div className="divider-compact"></div>

            <div className="section-header-compact">Sombra de Caja</div>
            <ShadowControl
                value={customStyles['boxShadow']}
                onChange={(val) => handleCustomStyleChange('boxShadow', val)}
            />
        </>
    );
}
