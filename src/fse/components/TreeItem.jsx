import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, Type, Image as ImageIcon, Box, Layout, MousePointer, List, Code, FileCode, Columns, Video, Search, Star, Zap, Layers, Copy, Trash2 } from 'lucide-react';

export function TreeItem({ element, level, selectedId, onSelect, onRename, onDelete, onDuplicate, expandedIds, onToggleExpand }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(element.label || element.element);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: `${level * 12}px`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1
    };

    const isExpanded = expandedIds.includes(element.id);
    const hasChildren = element.content && element.content.length > 0;

    const getIcon = (type) => {
        switch (type) {
            case 'heading': return <Type size={12} />;
            case 'text': return <Type size={12} />;
            case 'image': return <ImageIcon size={12} />;
            case 'video': return <Video size={12} />;
            case 'button': return <MousePointer size={12} />;
            case 'container': return <Box size={12} />;
            case 'section': return <Layout size={12} />;
            case 'columns': return <Columns size={12} />;
            case 'column': return <Box size={12} />;
            case 'list': return <List size={12} />;
            case 'html': return <Code size={12} />;
            case 'code': return <FileCode size={12} />;
            default: return <Layers size={12} />;
        }
    };

    const handleRename = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (onRename) onRename(element.id, tempText);
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setTempText(element.label || element.element);
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={`tree-item-wrapper ${selectedId === element.id ? 'active' : ''}`}>
            <div className="tree-item-main" onClick={() => onSelect(element)}>
                <div className="tree-item-drag-handle" {...attributes} {...listeners}>
                    <Zap size={10} />
                </div>

                {hasChildren ? (
                    <button className="tree-expand-btn" onClick={(e) => { e.stopPropagation(); onToggleExpand(element.id); }}>
                        {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </button>
                ) : <div className="tree-expand-spacer" />}

                <span className="tree-type-icon">{getIcon(element.element)}</span>

                {isEditing ? (
                    <input
                        autoFocus
                        className="tree-rename-input"
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        onKeyDown={handleRename}
                        onBlur={() => { setIsEditing(false); if (onRename) onRename(element.id, tempText); }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="tree-label" onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                        {element.label || element.element}
                    </span>
                )}

                <div className="tree-item-actions">
                    <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); if (onRename) setIsEditing(true); }} title="Renombrar">
                        <Type size={10} />
                    </button>
                    <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); if (onDuplicate) onDuplicate(element.id); }} title="Duplicar">
                        <Copy size={10} />
                    </button>
                    <button className="tree-action-btn tree-action-delete" onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(element.id); }} title="Eliminar">
                        <Trash2 size={10} />
                    </button>
                </div>
            </div>

            {isExpanded && hasChildren && (
                <div className="tree-children-container">
                    {element.content.map(child => (
                        <TreeItem
                            key={child.id} element={child} level={level + 1}
                            selectedId={selectedId} onSelect={onSelect}
                            onRename={onRename}
                            expandedIds={expandedIds} onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
