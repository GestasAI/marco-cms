import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Correcto
import Header from './Header'; // Correcto
import './Layout.css'; // Correcto

/**
 * 🏗️ Componente de Layout Principal
 *
 * Estructura que contiene el Sidebar, Header y el contenido de la página.
 */
const MainLayout = ({ user, onLogout, themeMode, toggleTheme }) => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content-wrapper">
                <Header user={user} onLogout={onLogout} themeMode={themeMode} toggleTheme={toggleTheme} />
                <main className="main-content">
                    <Outlet /> {/* Aquí se renderizarán las rutas anidadas */}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;