import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PostDetail from './pages/PostDetail';
import Pages from './pages/Pages';
import Settings from './pages/Settings';
import SiteSettings from './components/SiteSettings.jsx';
import Posts from './pages/Posts.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import './themes/gestasai-default/theme.css';

/**
 * 🎨 Componente Raíz de Marco CMS
 *
 * Gestiona el estado de autenticación y el enrutamiento principal de la aplicación.
 */

// Función simple para decodificar JWT y obtener datos del usuario
const decodeToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;
        return JSON.parse(atob(payloadBase64));
    } catch (error) {
        console.error("Error al decodificar token:", error);
        return null;
    }
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedUser = decodeToken(token);
            if (decodedUser) {
                setUser(decodedUser);
                setIsAuthenticated(true);
            }
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div>Cargando...</div>; // O un componente de Spinner más elaborado
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta Pública: Home */}
                <Route path="/" element={<Home />} />

                {/* Ruta Pública: Login */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />}
                />

                {/* Ruta Pública: Detalle de Post */}
                <Route path="/post/:slug" element={<PostDetail />} />

                {/* Rutas Protegidas: Admin Panel */}
                <Route
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <MainLayout user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/pages" element={<Pages />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/theme-settings" element={<SiteSettings />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Redirección de rutas antiguas */}
                    <Route path="/site-settings" element={<Navigate to="/theme-settings" replace />} />
                    <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Catch-all: Redirigir a Home si no coincide nada */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;