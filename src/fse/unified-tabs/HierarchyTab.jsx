import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TreeItem } from '../components/TreeItem';

/**
 * Pestaña Hierarchy - Árbol interactivo
 */
export function HierarchyTab({
    selectedElement,
    contentSection,
    onSelectElement,
    onMoveBlock,
    onUpdate,
    onDelete,
    onDuplicate
}) {
    const [expandedIds, setExpandedIds] = useState([]);
    const sensors = useSensors(useSensor(PointerSensor));

    const handleToggleExpand = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onMoveBlock(active.id, over.id);
        }
    };

    const renderTree = (elements, level = 0) => {
        return (
            <SortableContext items={elements.map(e => e.id)} strategy={verticalListSortingStrategy}>
                {elements.map(element => (
                    <TreeItem
                        key={element.id}
                        element={element}
                        level={level}
                        selectedId={selectedElement?.id}
                        onSelect={onSelectElement}
                        onRename={(id, newLabel) => onUpdate(id, 'label', newLabel)}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        expandedIds={expandedIds}
                        onToggleExpand={handleToggleExpand}
                    />
                ))}
            </SortableContext>
        );
    };

    return (
        <div className="tab-content hierarchy-tab">
            <div className="section-header-compact">Estructura del Documento</div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="tree-container">
                    {contentSection?.content ? renderTree(contentSection.content) : <p className="p-md text-gray-400">Sin contenido</p>}
                </div>
            </DndContext>
        </div>
    );
}
