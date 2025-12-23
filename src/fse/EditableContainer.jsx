import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { basicBlocks, designBlocks } from './blocks';
import { formatStyles } from '../utils/styleUtils';

/**
 * Contenedor editable con modo de edición al hacer doble click
 */
export function EditableContainer({ element, selectedElementId, onSelect, onAddBlock, onUpdate, parentPath = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(null);

    const isSelected = selectedElementId === element.id;
    const currentPath = [...parentPath, element.id];
    const isContainer = ['container', 'section', 'logo', 'grid', 'card', 'nav'].includes(element.element);
    const customStyles = element.customStyles || {};

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(element, currentPath);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (['heading', 'text', 'button'].includes(element.element)) {
            setIsEditing(true);
        }
    };

    const handleTextBlur = (e) => {
        const newText = e.target.innerText;
        if (newText !== element.text) {
            onUpdate(element.id, 'text', newText);
        }
        setIsEditing(false);
    };

    const handleDragStart = (e) => {
        // Solo permitir arrastrar si no estamos editando texto
        if (isEditing) {
            e.preventDefault();
            return;
        }

        // Detener propagación para evitar que padres también inicien arrastre
        e.stopPropagation();

        e.dataTransfer.setData('element-id', element.id);
        e.dataTransfer.setData('text/plain', element.id); // Compatibilidad
        e.dataTransfer.effectAllowed = 'move';

        console.log('📤 handleDragStart:', element.id);

        // Añadir clase visual al arrastrar
        const target = e.currentTarget;
        setTimeout(() => {
            target.classList.add('dragging-element');
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('dragging-element');
    };

    const handleAddBlock = (block, position) => {
        onAddBlock(block, element.id, position);
        setShowAddMenu(null);
        setIsEditing(false);
    };

    // Renderizar según tipo
    const renderContent = () => {
        const styles = formatStyles(customStyles);

        switch (element.element) {
            case 'heading': {
                const Tag = element.tag || 'h2';
                return (
                    <Tag
                        id={element.id}
                        className={element.class}
                        style={{
                            ...styles,
                            outline: isEditing ? '2px solid #2196f3' : 'none',
                            minWidth: '20px'
                        }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={handleTextBlur}
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
                        id={element.id}
                        className={element.class}
                        style={{
                            ...styles,
                            outline: isEditing ? '2px solid #2196f3' : 'none',
                            minWidth: '20px'
                        }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={handleTextBlur}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        {element.text || 'Texto'}
                    </Tag>
                );
            }

            case 'image': {
                // Combinar customStyles con width/height
                const imageStyles = formatStyles({
                    ...customStyles,
                    width: element.width || customStyles.width || '100%',
                    height: element.height || customStyles.height || 'auto',
                    display: customStyles.display || 'block',
                    margin: customStyles.margin || (customStyles.textAlign === 'center' ? '0 auto' : '0')
                });

                return (
                    <img
                        id={element.id}
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
                const videoStyles = formatStyles({
                    ...customStyles,
                    width: element.width || customStyles.width || '100%',
                    height: element.height || customStyles.height || 'auto',
                    display: customStyles.display || 'block',
                    margin: customStyles.margin || '0'
                });

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
            case 'link':
                return (
                    <a
                        id={element.id}
                        href={element.link || '#'}
                        className={element.class}
                        style={{
                            ...styles,
                            outline: isEditing ? '2px solid #2196f3' : 'none',
                            display: styles.display || 'inline-block'
                        }}
                        target={element.target || '_self'}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={handleTextBlur}
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick(e);
                        }}
                        onDoubleClick={handleDoubleClick}
                    >
                        {element.text || (element.element === 'link' ? 'Enlace' : 'Botón')}
                    </a>
                );

            case 'search':
                return (
                    <div
                        className={element.class}
                        style={styles}
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
            case 'grid':
            case 'card':
            case 'nav':
                const ContainerTag = element.element === 'nav' ? 'nav' : 'div';
                return (
                    <ContainerTag
                        id={element.id}
                        className={`${element.class} drop-zone`}
                        style={styles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        data-drop-target={element.id}
                    >
                        {element.content && element.content.length > 0 ? (
                            element.content.map(child => (
                                <EditableContainer
                                    key={child.id || `child-${Math.random()}`}
                                    element={child}
                                    selectedElementId={selectedElementId}
                                    onSelect={onSelect}
                                    onAddBlock={onAddBlock}
                                    onUpdate={onUpdate}
                                    parentPath={currentPath}
                                />
                            ))
                        ) : (
                            <div className="empty-container">
                                <p className="text-sm text-secondary">{element.element.charAt(0).toUpperCase() + element.element.slice(1)} vacío</p>
                                <p className="text-xs text-secondary">Arrastra bloques aquí</p>
                            </div>
                        )}
                    </ContainerTag>
                );

            case 'section':
                return (
                    <section
                        id={element.id}
                        className={`${element.class} drop-zone`}
                        style={styles}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        data-drop-target={element.id}
                    >
                        {element.content && element.content.length > 0 ? (
                            element.content.map(child => (
                                <EditableContainer
                                    key={child.id || `child-${Math.random()}`}
                                    element={child}
                                    selectedElementId={selectedElementId}
                                    onSelect={onSelect}
                                    onAddBlock={onAddBlock}
                                    onUpdate={onUpdate}
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
            className={`editable-element-wrapper drop-zone ${isSelected ? 'element-selected' : ''} ${hovering ? 'hovering' : ''}`}
            data-element-id={element.id}
            data-element-type={element.element}
            data-drop-target={element.id}
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
