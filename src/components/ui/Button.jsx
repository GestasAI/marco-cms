import React from 'react';
import PropTypes from 'prop-types';

/**
 * 🔘 Button - Componente Atómico
 * 
 * Wrapper para botones estandarizados del sistema de temas.
 * Utiliza las clases .btn definidas en theme.css
 */
export const Button = ({
    children,
    variant = 'primary', // primary, secondary, ghost, outline
    size = 'md', // sm, md, lg, xl
    fullWidth = false,
    className = '',
    disabled = false,
    loading = false,
    icon: Icon = null,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';
    const widthClass = fullWidth ? 'btn-block' : '';
    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                // Simple spinner usando CSS borders o un icono si quisieramos
                <span className="animate-spin mr-2">⏳</span>
            ) : Icon ? (
                <Icon size={18} className="mr-2" />
            ) : null}
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    icon: PropTypes.elementType
};
