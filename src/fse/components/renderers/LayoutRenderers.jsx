import React from 'react';

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

    const finalStyles = { ...styles, position: 'relative' };

    if (element.element === 'grid') {
        finalStyles.display = 'grid';
        finalStyles.gridTemplateColumns = `repeat(${element.settings?.columns || 3}, 1fr)`;
        finalStyles.gap = element.settings?.gap || '20px';
    }

    return (
        <ContainerTag
            id={element.id}
            className={`${element.class} ${!readOnly ? 'drop-zone layout-element' : ''} ${element.element}`}
            style={finalStyles}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            data-drop-target={element.id}
        >
            {renderBackgroundVideo()}
            {renderOverlay()}

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
    return (
        <div
            id={element.id}
            className={`${element.class} columns`}
            style={{
                ...styles,
                display: 'flex',
                gap: element.settings?.gap || '20px',
                alignItems: element.settings?.align || 'stretch'
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
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
