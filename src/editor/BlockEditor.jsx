import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useBlocks } from '../../hooks/useBlocks';
import BlockLibrary from './BlockLibrary';
import BlockInspector from './BlockInspector';
import { Save, Eye, Undo, Redo } from 'lucide-react';
import './BlockEditor.css';

/**
 * BlockEditor - Full Site Editor principal
 * Permite crear y editar páginas con drag & drop
 */
export default function BlockEditor({ initialBlocks = [], onSave }) {
    const {
        blocks,
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        reorderBlocks,
        setBlocks
    } = useBlocks(initialBlocks);

    const [selectedBlock, setSelectedBlock] = useState(null);
    const [history, setHistory] = useState([initialBlocks]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [previewMode, setPreviewMode] = useState(false);

    // Guardar estado en historial
    const saveToHistory = useCallback((newBlocks) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    // Undo
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setBlocks(history[newIndex]);
        }
    };

    // Redo
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setBlocks(history[newIndex]);
        }
    };

    // Drag & Drop
    const onDragEnd = (result) => {
        if (!result.destination) return;

        reorderBlocks(result.source.index, result.destination.index);
        saveToHistory(blocks);
    };

    // Agregar bloque
    const handleAddBlock = (blockType) => {
        addBlock(blockType);
        saveToHistory([...blocks, { type: blockType }]);
    };

    // Actualizar bloque
    const handleUpdateBlock = (blockId, updates) => {
        updateBlock(blockId, updates);
        saveToHistory(blocks);
    };

    // Guardar página
    const handleSave = async () => {
        if (onSave) {
            await onSave(blocks);
        }
    };

    return (
        <div className="block-editor">
            {/* Toolbar */}
            <div className="editor-toolbar">
                <div className="toolbar-left">
                    <h2>Editor de Sitio</h2>
                </div>
                <div className="toolbar-center">
                    <button
                        onClick={handleUndo}
                        disabled={historyIndex === 0}
                        className="toolbar-btn"
                        title="Deshacer"
                    >
                        <Undo size={20} />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={historyIndex === history.length - 1}
                        className="toolbar-btn"
                        title="Rehacer"
                    >
                        <Redo size={20} />
                    </button>
                </div>
                <div className="toolbar-right">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="toolbar-btn"
                    >
                        <Eye size={20} />
                        {previewMode ? 'Editar' : 'Vista Previa'}
                    </button>
                    <button onClick={handleSave} className="toolbar-btn btn-primary">
                        <Save size={20} />
                        Guardar
                    </button>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="editor-layout">
                {/* Block Library */}
                {!previewMode && (
                    <div className="editor-sidebar editor-sidebar-left">
                        <BlockLibrary onAddBlock={handleAddBlock} />
                    </div>
                )}

                {/* Canvas */}
                <div className="editor-canvas">
                    {previewMode ? (
                        <PreviewMode blocks={blocks} />
                    ) : (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="blocks">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`blocks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''
                                            }`}
                                    >
                                        {blocks.length === 0 ? (
                                            <div className="empty-state">
                                                <p>Arrastra bloques aquí para comenzar</p>
                                            </div>
                                        ) : (
                                            blocks.map((block, index) => (
                                                <Draggable
                                                    key={block.id}
                                                    draggableId={block.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`block-wrapper ${selectedBlock === block.id
                                                                    ? 'selected'
                                                                    : ''
                                                                } ${snapshot.isDragging
                                                                    ? 'dragging'
                                                                    : ''
                                                                }`}
                                                            onClick={() =>
                                                                setSelectedBlock(block.id)
                                                            }
                                                        >
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="block-handle"
                                                            >
                                                                ⋮⋮
                                                            </div>
                                                            <BlockRenderer
                                                                block={block}
                                                                onUpdate={(updates) =>
                                                                    handleUpdateBlock(
                                                                        block.id,
                                                                        updates
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    deleteBlock(block.id)
                                                                }
                                                                onDuplicate={() =>
                                                                    duplicateBlock(block.id)
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>

                {/* Block Inspector */}
                {!previewMode && selectedBlock && (
                    <div className="editor-sidebar editor-sidebar-right">
                        <BlockInspector
                            block={blocks.find((b) => b.id === selectedBlock)}
                            onUpdate={(updates) =>
                                handleUpdateBlock(selectedBlock, updates)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Renderiza un bloque según su tipo
 */
function BlockRenderer({ block, onUpdate, onDelete, onDuplicate }) {
    const blockComponents = {
        heading: HeadingBlock,
        paragraph: ParagraphBlock,
        image: ImageBlock,
        button: ButtonBlock,
        spacer: SpacerBlock
    };

    const BlockComponent = blockComponents[block.type] || DefaultBlock;

    return (
        <div className="block-content">
            <BlockComponent block={block} onUpdate={onUpdate} />
            <div className="block-actions">
                <button onClick={onDuplicate} title="Duplicar">
                    📋
                </button>
                <button onClick={onDelete} title="Eliminar">
                    🗑️
                </button>
            </div>
        </div>
    );
}

/**
 * Componentes de bloques individuales
 */
function HeadingBlock({ block, onUpdate }) {
    return (
        <div className="block-heading">
            <select
                value={block.settings?.level || 2}
                onChange={(e) =>
                    onUpdate({
                        settings: { ...block.settings, level: parseInt(e.target.value) }
                    })
                }
            >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                        H{level}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={block.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Escribe el título..."
                className="heading-input"
            />
        </div>
    );
}

function ParagraphBlock({ block, onUpdate }) {
    return (
        <textarea
            value={block.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Escribe el párrafo..."
            className="paragraph-input"
            rows={4}
        />
    );
}

function ImageBlock({ block, onUpdate }) {
    return (
        <div className="block-image">
            <input
                type="text"
                value={block.settings?.src || ''}
                onChange={(e) =>
                    onUpdate({ settings: { ...block.settings, src: e.target.value } })
                }
                placeholder="URL de la imagen"
            />
            {block.settings?.src && (
                <img src={block.settings.src} alt={block.settings?.alt || ''} />
            )}
        </div>
    );
}

function ButtonBlock({ block, onUpdate }) {
    return (
        <div className="block-button">
            <input
                type="text"
                value={block.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Texto del botón"
            />
            <input
                type="text"
                value={block.settings?.href || ''}
                onChange={(e) =>
                    onUpdate({ settings: { ...block.settings, href: e.target.value } })
                }
                placeholder="URL del enlace"
            />
        </div>
    );
}

function SpacerBlock({ block, onUpdate }) {
    return (
        <div className="block-spacer">
            <label>
                Altura:
                <input
                    type="range"
                    min="10"
                    max="200"
                    value={block.settings?.height || 50}
                    onChange={(e) =>
                        onUpdate({
                            settings: { ...block.settings, height: parseInt(e.target.value) }
                        })
                    }
                />
                <span>{block.settings?.height || 50}px</span>
            </label>
        </div>
    );
}

function DefaultBlock({ block }) {
    return <div className="block-default">Bloque: {block.type}</div>;
}

/**
 * Modo de vista previa
 */
function PreviewMode({ blocks }) {
    return (
        <div className="preview-mode">
            {blocks.map((block) => (
                <div key={block.id} className="preview-block">
                    {block.type === 'heading' && (
                        React.createElement(
                            `h${block.settings?.level || 2}`,
                            {},
                            block.content
                        )
                    )}
                    {block.type === 'paragraph' && <p>{block.content}</p>}
                    {block.type === 'image' && (
                        <img src={block.settings?.src} alt={block.settings?.alt} />
                    )}
                    {block.type === 'button' && (
                        <a href={block.settings?.href} className="btn">
                            {block.content}
                        </a>
                    )}
                    {block.type === 'spacer' && (
                        <div style={{ height: `${block.settings?.height || 50}px` }} />
                    )}
                </div>
            ))}
        </div>
    );
}
