import React, { useState } from 'react';
import { basicBlocks, designBlocks } from './blocks';
import { Plus, X } from 'lucide-react';

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

    return (
        <div className={`block-library-container ${showDesignPanel ? 'panel-open' : ''}`}>
            {/* BARRA LATERAL FINA (ELEMENTOS) */}
            <div className="block-library-sidebar">
                <button
                    className={`sidebar-btn design-toggle ${showDesignPanel ? 'active' : ''}`}
                    onClick={() => setShowDesignPanel(!showDesignPanel)}
                    title="Explorar Bloques de Diseño"
                >
                    <Plus size={24} />
                </button>

                <div className="sidebar-divider" />

                <div className="element-icons-list">
                    {basicBlocks.map((block) => {
                        const Icon = block.icon;
                        return (
                            <div
                                key={block.id}
                                className="block-item"
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

            {/* PANEL DESPLEGABLE (BLOQUES DE DISEÑO) */}
            {showDesignPanel && (
                <div className="block-library-flyout">
                    <div className="flyout-header">
                        <h3>Bloques</h3>
                        <button className="close-btn" onClick={() => setShowDesignPanel(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flyout-content">
                        <p className="flyout-intro">Arrastra y suelta patrones en el lienzo.</p>

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
