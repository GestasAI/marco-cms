import React from 'react';
import {
    Layout, Box, Type, AlignLeft, List, CreditCard,
    Search, Image, Video, Grid, MousePointer2
} from 'lucide-react';

export default function BlockInserter({ onInsert }) {

    const handleDragStart = (e, blockType) => {
        e.dataTransfer.setData('blockType', blockType);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="editor-inserter-sidebar">
            {/* Edit / Select Tool (Default) */}
            <div className="inserter-btn active" title="Seleccionar">
                <div className="icon-wrapper"><MousePointer2 size={20} /></div>
                <span className="inserter-label">Seleccionar</span>
            </div>

            <div className="w-full h-px bg-gray-200 my-2"></div>

            {/* Layout */}
            <div className="inserter-category">Estructura</div>
            <DraggableBtn type="core/section" icon={Layout} label="Sección" onDragStart={handleDragStart} />
            <DraggableBtn type="core/container" icon={Box} label="Contenedor (Div)" onDragStart={handleDragStart} />

            {/* Text */}
            <div className="inserter-category">Texto</div>
            <DraggableBtn type="core/heading" icon={Type} label="Título" onDragStart={handleDragStart} />
            <DraggableBtn type="core/paragraph" icon={AlignLeft} label="Párrafo" onDragStart={handleDragStart} />

            {/* Content */}
            <div className="inserter-category">Contenido</div>
            <DraggableBtn type="core/list" icon={List} label="Lista" onDragStart={handleDragStart} />
            <DraggableBtn type="core/card" icon={CreditCard} label="Tarjeta" onDragStart={handleDragStart} />
            <DraggableBtn type="core/accordion" icon={List} label="Acordeón" onDragStart={handleDragStart} />

            {/* Media */}
            <div className="inserter-category">Media</div>
            <DraggableBtn type="core/image" icon={Image} label="Imagen" onDragStart={handleDragStart} />
            <DraggableBtn type="core/video" icon={Video} label="Video" onDragStart={handleDragStart} />
            <DraggableBtn type="core/search" icon={Search} label="Búsqueda" onDragStart={handleDragStart} />

            {/* Dynamic */}
            <div className="inserter-category">Dinámico</div>
            <DraggableBtn type="core/query-loop" icon={Grid} label="Grid de Contenidos" onDragStart={handleDragStart} />
        </div>
    );
}

function DraggableBtn({ type, icon: Icon, label, onDragStart }) {
    return (
        <div
            className="inserter-btn"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            title={label}
        >
            <div className="icon-wrapper">
                <Icon size={20} />
            </div>
            <span className="inserter-label">{label}</span>
        </div>
    );
}
