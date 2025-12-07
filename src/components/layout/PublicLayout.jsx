import React from 'react';
import { Outlet, Link } from 'react-router-dom';
// ThemeContext is provided by App.jsx globally, but we can consume useTheme if needed for dynamic classes
import { useTheme } from '../../contexts/ThemeContext';

export default function PublicLayout() {
    return (
        <div className="public-layout">
            <header className="theme-header">
                <nav className="theme-nav">
                    <Link to="/" className="theme-nav-link">Inicio</Link>
                    <Link to="/login" className="theme-nav-link">Login</Link>
                </nav>
            </header>

            <main className="theme-content">
                <Outlet />
            </main>

            <footer className="theme-footer">
                <div className="theme-container">
                    © {new Date().getFullYear()} Marco CMS
                </div>
            </footer>
        </div>
    );
}
