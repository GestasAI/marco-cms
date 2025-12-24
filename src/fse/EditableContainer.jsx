import React, { useState, useEffect, useRef } from 'react';
import { ElementRenderer } from './components/ElementRenderer';
import { AddBlockTriggers } from './components/AddBlockTriggers';
import { BlockSelectorMenu } from './components/BlockSelectorMenu';
import { EffectRenderer } from './components/renderers/EffectRenderers';

/**
 * Contenedor principal para elementos editables en el FSE
 */
export function EditableContainer({
    element,
    document: doc,
    selectedElementId,
    onSelect,
    onAddBlock,
    onUpdate,
    parentPath = ''
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(null); // 'before', 'after', 'inside'
    const [hovering, setHovering] = useState(false);
    const containerRef = useRef(null);

    const isSelected = selectedElementId === element.id;
    const currentPath = parentPath ? `${parentPath}.${element.id}` : element.id;

    // Manejar clics
    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(element);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (['heading', 'text', 'button', 'link', 'list', 'html', 'code'].includes(element.element)) {
            setIsEditing(true);
        }
    };

    const handleTextBlur = (e) => {
        setIsEditing(false);
        const newText = e.target.innerText;
        if (element.element === 'code') {
            onUpdate(element.id, 'code', newText);
        } else if (element.element === 'html') {
            onUpdate(element.id, 'content', newText);
        } else {
            onUpdate(element.id, 'text', newText);
        }
    };

    // Renderizar video de fondo
    const renderBackgroundVideo = () => {
        const bg = element.settings?.background;
        if (bg?.type === 'video' && bg.video) {
            return (
                <video
                    className="background-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                >
                    <source src={bg.video} type="video/mp4" />
                </video>
            );
        }
        return null;
    };

    // Renderizar overlay
    const renderOverlay = () => {
        const bg = element.settings?.background;
        if (bg?.overlay?.enabled) {
            return (
                <div
                    className="background-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: bg.overlay.color || 'rgba(0,0,0,0.5)',
                        opacity: bg.overlay.opacity || 0.5,
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            );
        }
        return null;
    };

    // Renderizar animación de fondo (Three.js)
    const renderBackgroundAnimation = () => {
        const bg = element.settings?.background;
        if (bg?.type === 'animation' && bg.animation) {
            // Mapear ajustes de fondo a formato de EffectRenderer
            const effectElement = {
                id: `bg-anim-${element.id}`,
                settings: {
                    particles: {
                        count: bg.animation.count !== undefined ? bg.animation.count : 2000,
                        size: bg.animation.size || 0.06,
                        color: bg.animation.color || '#4285F4',
                        shape: bg.animation.shape || 'points'
                    },
                    animation: {
                        mode: bg.animation.mode || 'follow',
                        intensity: bg.animation.intensity || 1.5,
                        timeScale: bg.animation.timeScale || 1.2
                    },
                    layout: {
                        height: '100%',
                        background: bg.animation.backgroundColor || 'transparent'
                    }
                }
            };
            return (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
                    <EffectRenderer element={effectElement} />
                </div>
            );
        }
        return null;
    };

    // Estilos especiales para el wrapper si es un elemento de layout
    const getWrapperStyles = () => {
        const styles = {};
        if (element.element === 'column') {
            styles.flex = 1;
            styles.display = 'flex';
            styles.flexDirection = 'column';
        }
        if (element.element === 'columns') {
            styles.width = '100%';
        }
        return styles;
    };

    return (
        <div
            ref={containerRef}
            className={`editable-element-wrapper ${isSelected ? 'element-selected' : ''} ${hovering ? 'element-hovering' : ''}`}
            style={getWrapperStyles()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={handleClick}
        >
            {/* Triggers de edición (solo si está seleccionado o hovering) */}
            {(isSelected || hovering) && (
                <AddBlockTriggers
                    onAddClick={setShowAddMenu}
                    showInside={['container', 'section', 'column', 'grid', 'card'].includes(element.element)}
                />
            )}

            {/* Renderizado del elemento real */}
            <ElementRenderer
                element={element}
                doc={doc}
                isEditing={isEditing}
                handleTextBlur={handleTextBlur}
                handleClick={handleClick}
                handleDoubleClick={handleDoubleClick}
                renderBackgroundVideo={renderBackgroundVideo}
                renderOverlay={renderOverlay}
                renderBackgroundAnimation={renderBackgroundAnimation}
                EditableContainer={EditableContainer}
                selectedElementId={selectedElementId}
                onSelect={onSelect}
                onAddBlock={onAddBlock}
                onUpdate={onUpdate}
                currentPath={currentPath}
                setShowAddMenu={setShowAddMenu}
            />

            {/* Menú de selección de bloques */}
            {showAddMenu && (
                <BlockSelectorMenu
                    onSelect={(block) => {
                        onAddBlock(block, element.id, showAddMenu);
                        setShowAddMenu(null);
                    }}
                    onClose={() => setShowAddMenu(null)}
                />
            )}
        </div>
    );
}
