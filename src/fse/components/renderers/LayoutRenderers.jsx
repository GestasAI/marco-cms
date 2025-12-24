import React from 'react';

/**
 * Renderizador para elementos de contenedor (Section, Container, Grid, Card, Nav, Column)
 */
export const ContainerRenderer = ({
    element,
    styles,
    readOnly,
    handleClick,
    handleDoubleClick,
    renderBackgroundVideo,
    renderOverlay,
    doc,
    selectedElementId,
    onSelect,
    onAddBlock,
    onUpdate,
    currentPath,
    setShowAddMenu,
    EditableContainer,
    ElementRenderer
}) => {
    const ContainerTag =
        element.element === 'nav' ? 'nav' :
            element.element === 'section' ? 'section' : 'div';

    // Combinar estilos base con configuraciones específicas de layout
    const settings = element.settings || {};
    const finalStyles = { ...styles, position: 'relative' };

    // Aplicar configuraciones de Spacing (Padding/Margin)
    if (settings.spacing) {
        if (settings.spacing.padding) finalStyles.padding = settings.spacing.padding;
        if (settings.spacing.margin) finalStyles.margin = settings.spacing.margin;
    }

    // Aplicar configuraciones de Layout (Width/MaxWidth)
    if (settings.layout) {
        if (settings.layout.width === 'boxed') {
            finalStyles.maxWidth = settings.layout.maxWidth || '1200px';
            finalStyles.marginLeft = 'auto';
            finalStyles.marginRight = 'auto';
        } else if (settings.layout.width === 'full-width') {
            finalStyles.maxWidth = '100%';
            finalStyles.width = '100%';
        }

        // Grid settings
        if (element.element === 'grid' || element.element === 'grid-layout') {
            finalStyles.display = 'grid';
            finalStyles.gridTemplateColumns = `repeat(${settings.layout.columns || 3}, 1fr)`;
            finalStyles.gap = settings.layout.gap || '20px';
        }

        // Flex alignment for Nav/Container
        if (settings.layout.justify) finalStyles.justifyContent = settings.layout.justify;
        if (settings.layout.align) finalStyles.alignItems = settings.layout.align;
    }

    // Aplicar Border settings
    if (settings.border) {
        if (settings.border.radius) finalStyles.borderRadius = settings.border.radius;
        if (settings.border.width) finalStyles.borderWidth = settings.border.width;
        if (settings.border.color) finalStyles.borderColor = settings.border.color;
        if (settings.border.style) finalStyles.borderStyle = settings.border.style;
    }

    return (
        <ContainerTag
            id={element.id}
            className={`${element.class} ${!readOnly ? 'drop-zone layout-element' : ''}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            data-drop-target={element.id}
        >
            {renderBackgroundVideo && renderBackgroundVideo()}
            {renderOverlay && renderOverlay()}

            {element.content && element.content.length > 0 ? (
                element.content.map((child, idx) => (
                    readOnly ? (
                        <ElementRenderer
                            key={child.id || `child-${idx}`}
                            element={child}
                            doc={doc}
                            readOnly={true}
                        />
                    ) : (
                        <EditableContainer
                            key={child.id || `child-${idx}`}
                            element={child}
                            document={doc}
                            selectedElementId={selectedElementId}
                            onSelect={onSelect}
                            onAddBlock={onAddBlock}
                            onUpdate={onUpdate}
                            parentPath={currentPath}
                        />
                    )
                ))
            ) : (
                !readOnly && (
                    <div className="empty-layout-placeholder" onClick={() => setShowAddMenu('inside')}>
                        <div className="empty-icon">
                            <span style={{ fontSize: '20px' }}>+</span>
                        </div>
                        <p className="empty-text">
                            {element.element === 'column' ? 'Columna vacía' :
                                element.element === 'section' ? 'Sección vacía' : 'Contenedor vacío'}
                        </p>
                        <span className="empty-subtext">Haz clic para añadir bloques</span>
                    </div>
                )
            )}
        </ContainerTag>
    );
};

/**
 * Renderizador específico para el sistema de columnas (Flexbox)
 */
export const ColumnsRenderer = ({
    element,
    styles,
    readOnly,
    handleClick,
    handleDoubleClick,
    doc,
    selectedElementId,
    onSelect,
    onAddBlock,
    onUpdate,
    currentPath,
    EditableContainer,
    ElementRenderer
}) => {
    const settings = element.settings || {};
    const finalStyles = {
        ...styles,
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        gap: settings.layout?.gap || '20px',
        alignItems: settings.layout?.align || 'stretch',
        justifyContent: settings.layout?.justify || 'flex-start'
    };

    // Aplicar Spacing
    if (settings.spacing) {
        if (settings.spacing.padding) finalStyles.padding = settings.spacing.padding;
        if (settings.spacing.margin) finalStyles.margin = settings.spacing.margin;
    }

    return (
        <div
            id={element.id}
            className={`${element.class} ${!readOnly ? 'drop-zone layout-element' : ''}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            data-drop-target={element.id}
        >
            {element.content && element.content.map((child, idx) => (
                readOnly ? (
                    <ElementRenderer
                        key={child.id || `child-${idx}`}
                        element={child}
                        doc={doc}
                        readOnly={true}
                    />
                ) : (
                    <EditableContainer
                        key={child.id || `child-${idx}`}
                        element={child}
                        document={doc}
                        selectedElementId={selectedElementId}
                        onSelect={onSelect}
                        onAddBlock={onAddBlock}
                        onUpdate={onUpdate}
                        parentPath={currentPath}
                    />
                )
            ))}
        </div>
    );
};
