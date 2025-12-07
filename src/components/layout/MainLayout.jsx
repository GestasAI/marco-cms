import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../../services/auth';

/**
 * 📐 MainLayout - Componente Layout Principal
 * 
 * Estructura base para el panel de administración.
 * Integra Sidebar y Header, y renderiza el contenido de la ruta activa.
 */
export default function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const user = authService.getUser() || JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="dashboard-root">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header
                    onMenuClick={toggleMobileMenu}
                    onLogout={handleLogout}
                    user={user}
                />

                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
