import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../../services/auth/authService';

/**
 * 📐 MainLayout - Componente Layout Principal
 * 
 * Estructura base para el panel de administración.
 * Integra Sidebar y Header, y renderiza el contenido de la ruta activa.
 */
export default function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(authService.getUser());

    // Efecto para refrescar la sesión si faltan datos críticos (como el rol)
    useEffect(() => {
        const checkSession = async () => {
            if (user && !user.roleName && !user.isSuperAdmin) {
                console.log('🔍 [MainLayout] Faltan datos de rol en la sesión, refrescando...');
                setIsRefreshing(true);
                try {
                    const updatedUser = await authService.refreshSession();
                    setUser(updatedUser);
                } catch (e) {
                    console.error('❌ Error refrescando sesión en layout:', e);
                } finally {
                    setIsRefreshing(false);
                }
            }
        };
        checkSession();
    }, [user]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (isRefreshing) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dashboard-color-bg)' }}>
                <div className="text-center">
                    <div className="mb-md">Verificando credenciales...</div>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-root">
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
            />

            <div className="dashboard-main-container">
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
