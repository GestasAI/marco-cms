import React from 'react';
import { formatStyles } from '../../utils/styleUtils';
import {
    ListRenderer,
    HtmlRenderer,
    CodeRenderer,
    TextRenderer,
    ButtonRenderer,
    SearchRenderer
} from './renderers/BasicRenderers';
import { ImageRenderer, VideoRenderer } from './renderers/MediaRenderers';
import { ContainerRenderer, ColumnsRenderer } from './renderers/LayoutRenderers';
import { EffectRenderer } from './renderers/EffectRenderers';

/**
 * Renderizador de elementos para el editor
 */
export function ElementRenderer(props) {
    const { element, doc, isEditing, handleTextBlur, handleClick, handleDoubleClick } = props;

    const customStyles = element.customStyles || {};
    const baseStyles = formatStyles(customStyles);

    // Procesar configuraciones de fondo avanzadas
    const getBackgroundStyles = (settings) => {
        if (!settings?.background) return {};
        const { background } = settings;
        const bgStyles = {};

        switch (background.type) {
            case 'color':
                bgStyles.backgroundColor = background.color;
                break;
            case 'gradient':
                bgStyles.backgroundImage = background.gradient;
                break;
            case 'image':
                bgStyles.backgroundImage = `url(${background.image})`;
                bgStyles.backgroundSize = 'cover';
                bgStyles.backgroundPosition = 'center';
                break;
            default:
                break;
        }
        return bgStyles;
    };

    const styles = { ...baseStyles, ...getBackgroundStyles(element.settings) };

    const commonProps = {
        element,
        doc,
        styles,
        handleClick,
        handleDoubleClick
    };

    const textProps = {
        ...commonProps,
        isEditing,
        handleTextBlur
    };

    switch (element.element) {
        case 'list':
            return <ListRenderer {...commonProps} />;

        case 'html':
            return <HtmlRenderer {...commonProps} />;

        case 'code':
            return <CodeRenderer {...commonProps} />;

        case 'heading':
            return <TextRenderer {...textProps} type="heading" />;

        case 'text':
            return <TextRenderer {...textProps} type="text" />;

        case 'image':
            return <ImageRenderer {...props} customStyles={customStyles} />;

        case 'video':
            return <VideoRenderer {...props} customStyles={customStyles} />;

        case 'button':
        case 'link':
            return <ButtonRenderer {...textProps} />;

        case 'search':
            return <SearchRenderer {...commonProps} />;

        case 'container':
        case 'logo':
        case 'grid':
        case 'card':
        case 'nav':
        case 'section':
        case 'column':
            return <ContainerRenderer {...props} styles={styles} ElementRenderer={ElementRenderer} />;

        case 'columns':
            return <ColumnsRenderer {...props} styles={styles} ElementRenderer={ElementRenderer} />;

        case 'effect':
            return <EffectRenderer {...props} />;

        default:
            return null;
    }
}
