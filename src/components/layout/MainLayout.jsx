import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * 📐 MainLayout - Componente Layout Principal
 * 
 * Estructura base para el panel de administración.
 * Integra Sidebar y Header, y renderiza el contenido de la ruta activa.
 */
export default function MainLayout({ user, onLogout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
            {/* Sidebar tiene position: fixed según su CSS */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '250px', // Espacio para el sidebar fijo
                transition: 'margin-left 0.3s ease'
            }} className="layout-content">

                <Header
                    onMenuClick={toggleMobileMenu}
                    onLogout={onLogout}
                    user={user}
                />

                <main style={{ padding: 'var(--space-lg)', flex: 1, background: 'var(--color-bg)' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
