import React from 'react';
import { basicBlocks, designBlocks } from '../blocks';

/**
 * Menú selector de bloques
 */
export function BlockSelectorMenu({ onSelect, onClose }) {
    return (
        <div className="block-selector-overlay" onClick={onClose}>
            <div className="block-selector-menu" onClick={(e) => e.stopPropagation()}>
                <h4 className="heading-5 mb-md">Selecciona un bloque</h4>

                <div className="block-selector-grid">
                    {basicBlocks.map(block => {
                        const Icon = block.icon;
                        return (
                            <button
                                key={block.id}
                                className="block-selector-item"
                                onClick={() => onSelect(block)}
                                title={block.label}
                            >
                                <Icon size={24} />
                                <span>{block.label}</span>
                            </button>
                        );
                    })}
                </div>

                <h5 className="heading-6 mt-lg mb-sm">Bloques de Diseño</h5>
                <div className="block-selector-grid">
                    {designBlocks.map(block => (
                        <button
                            key={block.id}
                            className="block-selector-item block-selector-design"
                            onClick={() => onSelect(block)}
                        >
                            <span>{block.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
