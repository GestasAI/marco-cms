import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, Type, Image as ImageIcon, Box, Layout, MousePointer, List, Code, FileCode, Columns, Video, Search, Star, Zap, Layers } from 'lucide-react';

export function TreeItem({ element, level, selectedId, onSelect, onNavigate, onRename, expandedIds, onToggleExpand }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(element.id);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: `${level * 16}px`,
        opacity: isDragging ? 0.5 : 1
    };

    const isExpanded = expandedIds.includes(element.id);
    const hasChildren = element.content && element.content.length > 0;

    const getIcon = (type) => {
        switch (type) {
            case 'heading': return <Type size={14} />;
            case 'text': return <Type size={14} />;
            case 'image': return <ImageIcon size={14} />;
            case 'video': return <Video size={14} />;
            case 'button': return <MousePointer size={14} />;
            case 'container': return <Box size={14} />;
            case 'section': return <Layout size={14} />;
            case 'columns': return <Columns size={14} />;
            case 'column': return <Box size={14} />;
            case 'list': return <List size={14} />;
            case 'html': return <Code size={14} />;
            case 'code': return <FileCode size={14} />;
            default: return <Box size={14} />;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={`tree-item ${selectedId === element.id ? 'active' : ''}`}>
            <div className="tree-item-content" onClick={() => onSelect(element)} {...attributes} {...listeners}>
                {hasChildren && (
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); onToggleExpand(element.id); }}>
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                )}
                <span className="tree-icon">{getIcon(element.element)}</span>
                <span className="tree-label">{element.id}</span>
            </div>

            {isExpanded && hasChildren && (
                <div className="tree-children">
                    {element.content.map(child => (
                        <TreeItem
                            key={child.id} element={child} level={level + 1}
                            selectedId={selectedId} onSelect={onSelect}
                            onNavigate={onNavigate} onRename={onRename}
                            expandedIds={expandedIds} onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
