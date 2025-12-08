import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { basicBlocks, designBlocks } from './blocks';

/**
 * Contenedor editable con modo de edición al hacer doble click
 */
export function EditableContainer({ element, selectedElementId, onSelect, onAddBlock, parentPath = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(null);

    const isSelected = selectedElementId === element.id;
    const currentPath = [...parentPath, element.id];
    const isContainer = ['container', 'section', 'logo'].includes(element.element);
    const customStyles = element.customStyles || {};

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(element, currentPath);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleAddBlock = (block, position) => {
        onAddBlock(block, element.id, position);
        setShowAddMenu(null);
        setIsEditing(false);
    };

    // Renderizar según tipo
    const renderContent = () => {
        switch (element.element) {
            case 'heading': {
                const Tag = element.tag || 'h2';
                return (
                    <Tag
                        className={element.class}
                        style={customStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        {element.text || 'Título'}
                    </Tag>
                );
            }

            case 'text': {
                const Tag = element.tag || 'p';
                return (
                    <Tag
                        className={element.class}
                        style={customStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        {element.text || 'Texto'}
                    </Tag>
                );
            }

            case 'image': {
                // Combinar customStyles con width/height
                const imageStyles = {
                    ...customStyles,
                    width: element.width || customStyles.width || '100%',
                    height: element.height || customStyles.height || 'auto',
                    display: customStyles.display || 'block',
                    margin: customStyles.margin || (customStyles.textAlign === 'center' ? '0 auto' : '0')
                };

                return (
                    <img
                        src={element.src || '/placeholder-image.jpg'}
                        alt={element.alt || 'Imagen'}
                        className={element.class}
                        style={imageStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    />
                );
            }

            case 'video': {
                // Combinar customStyles con width/height
                const videoStyles = {
                    ...customStyles,
                    width: element.width || customStyles.width || '100%',
                    height: element.height || customStyles.height || 'auto',
                    display: customStyles.display || 'block',
                    margin: customStyles.margin || '0'
                };

                if (element.type === 'youtube' && element.youtubeId) {
                    // Si hay height personalizado, usar ese; si no, usar aspect ratio 16:9
                    const hasCustomHeight = customStyles.height || element.height;

                    // Estilos base del contenedor
                    let containerStyles = {
                        position: 'relative',
                        ...videoStyles
                    };

                    // Si NO hay height personalizado, usar aspect ratio 16:9
                    if (!hasCustomHeight) {
                        containerStyles = {
                            ...containerStyles,
                            paddingBottom: '56.25%',
                            height: 0,
                            overflow: 'hidden'
                        };
                    }

                    // Añadir poster si existe
                    if (element.poster) {
                        containerStyles = {
                            ...containerStyles,
                            backgroundImage: `url(${element.poster})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        };
                    }

                    return (
                        <div
                            className={element.class}
                            style={containerStyles}
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${element.youtubeId}${element.autoplay ? '?autoplay=1' : ''}${element.muted ? '&mute=1' : ''}`}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                }

                return (
                    <video
                        src={element.src || ''}
                        className={element.class}
                        style={videoStyles}
                        controls={element.controls !== false}
                        autoPlay={element.autoplay || false}
                        loop={element.loop || false}
                        muted={element.muted || false}
                        poster={element.poster || ''}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        Tu navegador no soporta el elemento de video.
                    </video>
                );
            }

            case 'button':
                return (
                    <a
                        href={element.link || '#'}
                        className={element.class}
                        style={customStyles}
                        target={element.target || '_self'}
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick(e);
                        }}
                        onDoubleClick={handleDoubleClick}
                    >
                        {element.text || 'Botón'}
                    </a>
                );

            case 'search':
                return (
                    <div
                        className={element.class}
                        style={customStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        <input
                            type="text"
                            placeholder={element.placeholder || 'Buscar...'}
                            className="w-full"
                            readOnly
                        />
                    </div>
                );

            case 'container':
            case 'logo':
                return (
                    <div
                        className={`${element.class} drop-zone`}
                        style={customStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        data-drop-target={element.id}
                    >
                        {element.content && element.content.length > 0 ? (
                            element.content.map(child => (
                                <EditableContainer
                                    key={child.id}
                                    element={child}
                                    selectedElementId={selectedElementId}
                                    onSelect={onSelect}
                                    onAddBlock={onAddBlock}
                                    parentPath={currentPath}
                                />
                            ))
                        ) : (
                            <div className="empty-container">
                                <p className="text-sm text-secondary">Contenedor vacío</p>
                                <p className="text-xs text-secondary">Arrastra bloques aquí</p>
                            </div>
                        )}
                    </div>
                );

            case 'section':
                return (
                    <section
                        className={`${element.class} drop-zone`}
                        style={customStyles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        data-drop-target={element.id}
                    >
                        {element.content && element.content.length > 0 ? (
                            element.content.map(child => (
                                <EditableContainer
                                    key={child.id}
                                    element={child}
                                    selectedElementId={selectedElementId}
                                    onSelect={onSelect}
                                    onAddBlock={onAddBlock}
                                    parentPath={currentPath}
                                />
                            ))
                        ) : (
                            <div className="empty-container">
                                <p className="text-sm text-secondary">Sección vacía</p>
                                <p className="text-xs text-secondary">Arrastra bloques aquí</p>
                            </div>
                        )}
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`editable-element-wrapper ${isSelected ? 'selected' : ''} ${hovering ? 'hovering' : ''}`}
            data-element-id={element.id}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Botones + solo en modo edición (doble click) */}
            {isEditing && (
                <>
                    <div className="add-block-trigger add-block-before">
                        <button
                            className="add-block-icon"
                            onClick={() => setShowAddMenu('before')}
                            title="Añadir antes"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {isContainer && (
                        <div className="add-block-trigger add-block-inside">
                            <button
                                className="add-block-icon"
                                onClick={() => setShowAddMenu('inside')}
                                title="Añadir dentro"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    <div className="add-block-trigger add-block-after">
                        <button
                            className="add-block-icon"
                            onClick={() => setShowAddMenu('after')}
                            title="Añadir después"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </>
            )}

            {/* Contenido */}
            <div className="editable-element-content">
                {renderContent()}
            </div>

            {/* Menú selector */}
            {showAddMenu && (
                <BlockSelectorMenu
                    onSelect={(block) => handleAddBlock(block, showAddMenu)}
                    onClose={() => {
                        setShowAddMenu(null);
                        setIsEditing(false);
                    }}
                />
            )}
        </div>
    );
}

/**
 * Menú selector de bloques
 */
function BlockSelectorMenu({ onSelect, onClose }) {
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
