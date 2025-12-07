import React, { useState } from 'react';
import { basicBlocks, designBlocks, assignIds } from './blocks';

/**
 * Biblioteca de bloques - Con drag visual nativo
 */
export function BlockLibrary({ onAddBlock }) {
    const [activeTab, setActiveTab] = useState('elements');

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
        <div className="block-library">
            <div className="block-library-tabs">
                <button
                    className={`tab ${activeTab === 'elements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('elements')}
                >
                    Elementos
                </button>
                <button
                    className={`tab ${activeTab === 'blocks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blocks')}
                >
                    Bloques
                </button>
            </div>

            <div className="block-library-content">
                {activeTab === 'elements' && (
                    <BlockList
                        blocks={basicBlocks}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                )}
                {activeTab === 'blocks' && (
                    <BlockList
                        blocks={designBlocks}
                        isDesign
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                )}
            </div>

            <div className="block-library-info">
                <p className="text-xs text-secondary text-center">
                    🖱️ <strong>Arrastra</strong> bloques al canvas o <strong>doble click</strong> en elementos para usar botones +
                </p>
            </div>
        </div>
    );
}

function BlockList({ blocks, isDesign = false, onDragStart, onDragEnd }) {
    return (
        <div className="block-list">
            {blocks.map((block) => (
                <div
                    key={block.id}
                    className="block-item"
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, block)}
                    onDragEnd={onDragEnd}
                >
                    {!isDesign ? (
                        <BlockItemBasic block={block} />
                    ) : (
                        <BlockItemDesign block={block} />
                    )}
                </div>
            ))}
        </div>
    );
}

function BlockItemBasic({ block }) {
    const Icon = block.icon;
    return (
        <div className="block-item-basic">
            <Icon size={20} />
            <span>{block.label}</span>
        </div>
    );
}

function BlockItemDesign({ block }) {
    return (
        <div className="block-item-design">
            <div className="block-preview">
                {block.preview ? (
                    <img src={block.preview} alt={block.label} />
                ) : (
                    <div className="block-preview-placeholder">
                        {block.label}
                    </div>
                )}
            </div>
            <span className="block-label">{block.label}</span>
        </div>
    );
}
