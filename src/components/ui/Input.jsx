import React from 'react';
import PropTypes from 'prop-types';

/**
 * ⌨️ Input - Componente Atómico
 * 
 * Campo de entrada estandarizado con soporte para iconos, etiquetas y errores.
 * Estilos definidos inline para garantizar consistencia con variables.
 */
export const Input = ({
    label,
    id,
    type = 'text',
    error,
    icon: Icon,
    className = '',
    containerClassName = '',
    ...props
}) => {
    const inputStyle = {
        width: '100%',
        padding: Icon ? '0.75rem 1rem 0.75rem 2.5rem' : '0.75rem 1rem',
        border: error ? '1px solid #ef4444' : '1px solid var(--color-border, #e5e7eb)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-base)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    return (
        <div className={`form-group ${containerClassName}`} style={{ marginBottom: '1rem' }}>
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--color-text)'
                    }}
                >
                    {label}
                </label>
            )}

            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }}>
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    className={`form-input ${className}`} // Clase para hooks de CSS externos si existen
                    style={inputStyle}
                    {...props}
                />
            </div>

            {error && (
                <p style={{ color: '#ef4444', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string,
    containerClassName: PropTypes.string
};
