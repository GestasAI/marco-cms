import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Componente de elemento individual del árbol
 */
function TreeItem({ element, level, selectedId, onSelect, onNavigate, onRename, expandedIds, onToggleExpand }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(element.text || element.element);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 9999 : 'auto',
        position: isDragging ? 'relative' : 'static',
        cursor: isDragging ? 'grabbing' : 'pointer',
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
    };

    const hasChildren = element.content && element.content.length > 0;
    const isSelected = element.id === selectedId;
    const isExpanded = expandedIds.has(element.id);

    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditValue(element.text || element.element);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (editValue && editValue !== (element.text || element.element)) {
            onRename(element.id, editValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(element.text || element.element);
        }
    };

    const getElementIcon = (type) => {
        const icons = {
            'heading': '📝',
            'text': '📄',
            'button': '🔘',
            'image': '🖼️',
            'video': '🎬',
            'container': '📦',
            'section': '📋',
            'logo': '🎨',
            'search': '🔍'
        };
        return icons[type] || '⚪';
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 6px',
                    marginLeft: `${level * 12}px`,
                    marginBottom: '2px',
                    background: isSelected ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #2196f3' : '1px solid #e0e0e0',
                }}
                onClick={() => onSelect(element)}
                onDoubleClick={handleDoubleClick}
            >
                {/* Check Circle - Verde cuando seleccionado */}
                <span
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#4caf50' : '#ccc'}`,
                        background: isSelected ? '#4caf50' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white',
                        flexShrink: 0
                    }}
                    title={isSelected ? 'Seleccionado' : 'Click para seleccionar'}
                >
                    {isSelected && '✓'}
                </span>

                {/* Drag Handle */}
                <span
                    {...attributes}
                    {...listeners}
                    style={{
                        cursor: 'grab',
                        fontSize: '12px',
                        color: '#999',
                        lineHeight: 1,
                        padding: '0 2px',
                        flexShrink: 0
                    }}
                    title="Arrastrar para mover"
                >
                    ⋮
                </span>

                {/* Expand/Collapse */}
                {hasChildren && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(element.id);
                        }}
                        style={{
                            cursor: 'pointer',
                            fontSize: '10px',
                            width: '12px',
                            textAlign: 'center',
                            flexShrink: 0
                        }}
                    >
                        {isExpanded ? '▼' : '▶'}
                    </span>
                )}
                {!hasChildren && <span style={{ width: '12px', flexShrink: 0 }}></span>}

                {/* Icon */}
                <span style={{ fontSize: '11px', flexShrink: 0 }}>{getElementIcon(element.element)}</span>

                {/* Label - Editable */}
                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{
                            flex: 1,
                            fontSize: '10px',
                            padding: '2px 4px',
                            border: '1px solid #2196f3',
                            borderRadius: '2px',
                            outline: 'none',
                            minWidth: 0
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span
                        style={{
                            flex: 1,
                            fontWeight: isSelected ? 'bold' : 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0
                        }}
                        title={element.text || element.element}
                    >
                        {element.element}
                        {element.text && (
                            <span style={{ color: '#666', fontSize: '9px', marginLeft: '4px' }}>
                                - {element.text.substring(0, 15)}{element.text.length > 15 ? '...' : ''}
                            </span>
                        )}
                    </span>
                )}
            </div>

            {/* Children - Recursivo */}
            {hasChildren && isExpanded && (
                <div>
                    {element.content.map(child => (
                        <TreeItem
                            key={child.id}
                            element={child}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onNavigate={onNavigate}
                            onRename={onRename}
                            expandedIds={expandedIds}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Pestaña Hierarchy - Árbol interactivo con drag & drop
 */
export function HierarchyTab({
    selectedElement,
    contentSection,
    onUpdate,
    onSelectElement,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate
}) {
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Expandir automáticamente todos los elementos al cargar
    useEffect(() => {
        if (contentSection?.content) {
            const getAllIds = (elements) => {
                let ids = [];
                elements.forEach(el => {
                    ids.push(el.id);
                    if (el.content && el.content.length > 0) {
                        ids = ids.concat(getAllIds(el.content));
                    }
                });
                return ids;
            };

            const allIds = getAllIds(contentSection.content);
            setExpandedIds(new Set(allIds));
        }
    }, [contentSection]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleToggleExpand = (id) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelect = (element) => {
        // 1. Seleccionar elemento usando la función del editor
        if (onSelectElement) {
            onSelectElement(element);
        }

        // 2. Hacer scroll al elemento en canvas
        setTimeout(() => {
            const elementInCanvas = document.querySelector(`[data-element-id="${element.id}"]`);
            if (elementInCanvas) {
                elementInCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Resaltar temporalmente con borde azul
                const originalOutline = elementInCanvas.style.outline;
                elementInCanvas.style.outline = '3px solid #2196f3';
                setTimeout(() => {
                    elementInCanvas.style.outline = originalOutline;
                }, 1000);
            }
        }, 100);
    };

    const handleNavigate = (element) => {
        // Hacer scroll al elemento en el canvas
        const elementInCanvas = document.querySelector(`[data-element-id="${element.id}"]`);
        if (elementInCanvas) {
            elementInCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Resaltar temporalmente con borde verde
            const originalOutline = elementInCanvas.style.outline;
            elementInCanvas.style.outline = '3px solid #4caf50';
            setTimeout(() => {
                elementInCanvas.style.outline = originalOutline;
            }, 1500);
        }
    };

    const handleRename = (id, newText) => {
        // Actualizar el texto del elemento
        if (onUpdate) {
            onUpdate(id, 'text', newText);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Encontrar índices en el array plano
            const allIds = getAllIds(contentSection.content);
            const oldIndex = allIds.indexOf(active.id);
            const newIndex = allIds.indexOf(over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Usar onMoveUp/onMoveDown para mover
                const steps = newIndex - oldIndex;
                if (steps > 0) {
                    // Mover hacia abajo
                    for (let i = 0; i < steps; i++) {
                        onMoveDown(active.id);
                    }
                } else if (steps < 0) {
                    // Mover hacia arriba
                    for (let i = 0; i < Math.abs(steps); i++) {
                        onMoveUp(active.id);
                    }
                }
            }
        }
    };

    const getAllIds = (elements) => {
        let ids = [];
        elements.forEach(el => {
            ids.push(el.id);
            if (el.content && el.content.length > 0) {
                ids = ids.concat(getAllIds(el.content));
            }
        });
        return ids;
    };

    const allIds = contentSection?.content ? getAllIds(contentSection.content) : [];

    // Si no hay contenido, mostrar mensaje
    if (!contentSection || !contentSection.content || contentSection.content.length === 0) {
        return (
            <div className="hierarchy-tab-container">
                <div className="section-header-compact">Estructura del Documento</div>
                <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                    <p>No hay elementos en el documento</p>
                    <p style={{ fontSize: '10px', marginTop: '8px' }}>Arrastra bloques desde la izquierda</p>
                </div>
            </div>
        );
    }

    return (
        <div className="hierarchy-tab-container">
            {/* Elemento Actual - Solo si hay selección */}
            {selectedElement && (
                <div style={{
                    fontSize: '9px',
                    color: '#666',
                    marginBottom: '6px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid #e0e0e0',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    <strong style={{ color: '#000' }}>Elemento:</strong> {selectedElement.element} | <strong style={{ color: '#000' }}>ID:</strong> {selectedElement.id}
                </div>
            )}

            {/* Estructura del Documento */}
            <div className="section-header-compact">Estructura del Documento</div>

            <div className="hierarchy-tree-scroll">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={allIds}
                        strategy={verticalListSortingStrategy}
                    >
                        {contentSection.content.map(element => (
                            <TreeItem
                                key={element.id}
                                element={element}
                                level={0}
                                selectedId={selectedElement?.id}
                                onSelect={handleSelect}
                                onNavigate={handleNavigate}
                                onRename={handleRename}
                                expandedIds={expandedIds}
                                onToggleExpand={handleToggleExpand}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Acciones Rápidas - Solo si hay selección */}
            {selectedElement && (
                <div className="hierarchy-actions-fixed">
                    <div className="section-header-compact" style={{ marginTop: 0 }}>Acciones Rápidas</div>
                    <div className="action-icons-row">
                        <button className="action-icon-btn" onClick={() => onMoveUp(selectedElement.id)} title="Mover arriba">
                            ↑
                        </button>
                        <button className="action-icon-btn" onClick={() => onMoveDown(selectedElement.id)} title="Mover abajo">
                            ↓
                        </button>
                        <button className="action-icon-btn" onClick={() => onDuplicate(selectedElement.id)} title="Duplicar">
                            ⎘
                        </button>
                        <button className="action-icon-btn action-icon-delete" onClick={() => {
                            if (window.confirm('¿Eliminar este elemento?')) {
                                onDelete(selectedElement.id);
                            }
                        }} title="Eliminar">
                            🗑
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
