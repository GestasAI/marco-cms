import React, { useState } from 'react';
import { basicBlocks, designBlocks } from './blocks';
import { LayoutGrid, X } from 'lucide-react';

export function BlockLibrary({ onAddBlock }) {
    const [showDesignPanel, setShowDesignPanel] = useState(false);

    const handleDragStart = (e, block) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('block-id', block.id);
        e.dataTransfer.setData('block-type', block.element || block.template.element);

        // Añadir clase visual al body
        document.body.classList.add('dragging-block');
    };

    const handleDragEnd = (e) => {
        document.body.classList.remove('dragging-block');
    };

    // Combinamos los bloques de layout con los básicos para la lista principal
    const layoutBlocks = designBlocks.filter(b => b.category === 'layout');

    return (
        <div className={`block-library-container ${showDesignPanel ? 'panel-open' : ''}`}>
            {/* BARRA LATERAL FINA (ICONOS) */}
            <div className="block-library-sidebar">
                {/* Botón de Patrones / Diseños Predefinidos */}
                <button
                    className={`sidebar-btn patterns-toggle ${showDesignPanel ? 'active' : ''}`}
                    onClick={() => setShowDesignPanel(!showDesignPanel)}
                    title="Patrones de Diseño"
                >
                    <LayoutGrid size={22} />
                </button>

                <div className="sidebar-divider" />

                <div className="element-icons-list">
                    {/* Bloques de Estructura (Layout) - Color Azul */}
                    {layoutBlocks.map((block) => {
                        const Icon = block.icon;
                        return (
                            <div
                                key={block.id}
                                className="block-item layout-item"
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, block)}
                                onDragEnd={handleDragEnd}
                                onClick={() => onAddBlock && onAddBlock(block)}
                                data-label={block.label}
                                title={block.label}
                            >
                                <Icon size={20} />
                            </div>
                        );
                    })}

                    <div className="sidebar-divider-small" />

                    {/* Bloques Básicos (Contenido) - Color Negro */}
                    {basicBlocks.map((block) => {
                        const Icon = block.icon;
                        return (
                            <div
                                key={block.id}
                                className="block-item basic-item"
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, block)}
                                onDragEnd={handleDragEnd}
                                onClick={() => onAddBlock && onAddBlock(block)}
                                data-label={block.label}
                                title={block.label}
                            >
                                <Icon size={20} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PANEL DESPLEGABLE (PATRONES / DISEÑOS COMPLEJOS) */}
            {showDesignPanel && (
                <div className="block-library-flyout">
                    <div className="flyout-header">
                        <h3>Patrones de Diseño</h3>
                        <button className="close-btn" onClick={() => setShowDesignPanel(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flyout-content">
                        <p className="flyout-intro">Arrastra y suelta patrones predefinidos en el lienzo.</p>

                        <div className="design-blocks-grid">
                            {designBlocks.map((block) => {
                                return (
                                    <div
                                        key={block.id}
                                        className="design-block-card"
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, block)}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => {
                                            onAddBlock && onAddBlock(block);
                                            setShowDesignPanel(false);
                                        }}
                                    >
                                        <div className="design-preview">
                                            {block.preview ? (
                                                <img src={block.preview} alt={block.label} />
                                            ) : (
                                                <div className="preview-placeholder">
                                                    <block.icon size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="design-label">{block.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
