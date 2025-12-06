import React from 'react';
import PropTypes from 'prop-types';

/**
 * 🃏 Card - Componente Atómico
 * 
 * Contenedor genérico con estilos de elevación y bordes del tema.
 */
export const Card = ({ children, className = '', noPadding = false, ...props }) => {
    return (
        <div
            className={`card ${className}`}
            style={noPadding ? { padding: 0 } : {}}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
    <div className={`card-header flex justify-between items-center ${className}`}>
        <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>
        {children}
    </div>
);

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    noPadding: PropTypes.bool
};
