import React from 'react';
import './Layout.css'; // Correcto

/**
 * 🔝 Componente Header
 *
 * Barra de navegación superior dentro del layout principal.
 */
const Header = ({ user, onLogout, themeMode, toggleTheme }) => {
    return (
        <header className="header">
            <div className="header-actions">
                <button onClick={toggleTheme} className="btn btn-ghost btn-sm" title={`Cambiar a modo ${themeMode === 'light' ? 'oscuro' : 'claro'}`}>
                    {themeMode === 'light' ? '🌙' : '☀️'}
                </button>

                <div className="header-user-info">
                    <span>Bienvenido, <strong>{user?.email || 'Usuario'}</strong></span>
                </div>
                <button onClick={onLogout} className="btn btn-outline btn-sm">
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
};

export default Header;