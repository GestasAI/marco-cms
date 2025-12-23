import React from 'react';

export function LayoutEditor({ styles, onUpdateStyle }) {
    return (
        <>
            <div className="tab-section-divider"></div>
            <div className="tab-section-title">Dimensiones</div>
            <div className="form-row-compact">
                <div className="form-group-compact half">
                    <label className="form-label-compact">Ancho</label>
                    <input type="text" className="form-input-compact" value={styles.width || ''} onChange={(e) => onUpdateStyle('width', e.target.value)} placeholder="auto" />
                </div>
                <div className="form-group-compact half">
                    <label className="form-label-compact">Alto</label>
                    <input type="text" className="form-input-compact" value={styles.height || ''} onChange={(e) => onUpdateStyle('height', e.target.value)} placeholder="auto" />
                </div>
            </div>

            <div className="tab-section-divider"></div>
            <div className="tab-section-title">Padding (Interno)</div>
            <div className="granular-grid">
                <div className="form-group-compact">
                    <label className="form-label-compact">Arriba</label>
                    <input type="text" className="form-input-compact" value={styles.paddingTop || ''} onChange={(e) => onUpdateStyle('paddingTop', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Abajo</label>
                    <input type="text" className="form-input-compact" value={styles.paddingBottom || ''} onChange={(e) => onUpdateStyle('paddingBottom', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Izq</label>
                    <input type="text" className="form-input-compact" value={styles.paddingLeft || ''} onChange={(e) => onUpdateStyle('paddingLeft', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Der</label>
                    <input type="text" className="form-input-compact" value={styles.paddingRight || ''} onChange={(e) => onUpdateStyle('paddingRight', e.target.value)} placeholder="0px" />
                </div>
            </div>

            <div className="tab-section-divider"></div>
            <div className="tab-section-title">Margen (Externo)</div>
            <div className="granular-grid">
                <div className="form-group-compact">
                    <label className="form-label-compact">Arriba</label>
                    <input type="text" className="form-input-compact" value={styles.marginTop || ''} onChange={(e) => onUpdateStyle('marginTop', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Abajo</label>
                    <input type="text" className="form-input-compact" value={styles.marginBottom || ''} onChange={(e) => onUpdateStyle('marginBottom', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Izq</label>
                    <input type="text" className="form-input-compact" value={styles.marginLeft || ''} onChange={(e) => onUpdateStyle('marginLeft', e.target.value)} placeholder="0px" />
                </div>
                <div className="form-group-compact">
                    <label className="form-label-compact">Der</label>
                    <input type="text" className="form-input-compact" value={styles.marginRight || ''} onChange={(e) => onUpdateStyle('marginRight', e.target.value)} placeholder="0px" />
                </div>
            </div>

            <div className="tab-section-divider"></div>
            <div className="tab-section-title">Posicionamiento</div>
            <div className="form-group-compact">
                <label className="form-label-compact">Posición</label>
                <select className="form-input-compact" value={styles.position || 'static'} onChange={(e) => onUpdateStyle('position', e.target.value)}>
                    <option value="static">Estático (Normal)</option>
                    <option value="relative">Relativo</option>
                    <option value="absolute">Absoluto</option>
                    <option value="fixed">Fijo</option>
                    <option value="sticky">Pegajoso (Sticky)</option>
                </select>
            </div>
            {styles.position && styles.position !== 'static' && (
                <div className="granular-grid mt-xs">
                    <div className="form-group-compact">
                        <label className="form-label-compact">Top</label>
                        <input type="text" className="form-input-compact" value={styles.top || ''} onChange={(e) => onUpdateStyle('top', e.target.value)} placeholder="0px" />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Bottom</label>
                        <input type="text" className="form-input-compact" value={styles.bottom || ''} onChange={(e) => onUpdateStyle('bottom', e.target.value)} placeholder="0px" />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Left</label>
                        <input type="text" className="form-input-compact" value={styles.left || ''} onChange={(e) => onUpdateStyle('left', e.target.value)} placeholder="0px" />
                    </div>
                    <div className="form-group-compact">
                        <label className="form-label-compact">Right</label>
                        <input type="text" className="form-input-compact" value={styles.right || ''} onChange={(e) => onUpdateStyle('right', e.target.value)} placeholder="0px" />
                    </div>
                </div>
            )}
        </>
    );
}
