import React from 'react';
import { basicBlocks, designBlocks, effectBlocks } from '../blocks';
import { Layers, Sparkles } from 'lucide-react';

/**
 * Menú selector de bloques
 */
export function BlockSelectorMenu({ onSelect, onClose }) {
    return (
        <div className="block-selector-overlay" onClick={onClose}>
            <div className="block-selector-menu" onClick={(e) => e.stopPropagation()}>
                <h4 className="section-header-compact mb-md">Bloques Básicos</h4>

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
                                <Icon size={20} />
                                <span>{block.label}</span>
                            </button>
                        );
                    })}
                </div>

                <h4 className="section-header-compact mt-lg mb-md">Bloques de Diseño</h4>
                <div className="block-selector-grid">
                    {designBlocks.map(block => (
                        <button
                            key={block.id}
                            className="block-selector-item block-selector-design"
                            onClick={() => onSelect(block)}
                            title={block.label}
                        >
                            <Layers size={20} />
                            <span>{block.label}</span>
                        </button>
                    ))}
                </div>

                <h4 className="section-header-compact mt-lg mb-md">Efectos & Animaciones</h4>
                <div className="block-selector-grid">
                    {effectBlocks.map(block => (
                        <button
                            key={block.id}
                            className="block-selector-item block-selector-effect"
                            onClick={() => onSelect(block)}
                            title={block.label}
                        >
                            <Sparkles size={20} />
                            <span>{block.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
