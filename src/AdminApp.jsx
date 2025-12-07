import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pages from './pages/Pages';
import Settings from './pages/Settings';
import SiteSettings from './components/SiteSettings.jsx';
import Posts from './pages/Posts.jsx';
import ThemeParts from './pages/ThemeParts.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import './styles/dashboard/variables.css';
import './styles/dashboard/dashboard.css';

// Admin Theme Context (Private)
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const decodeToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;
        return JSON.parse(atob(payloadBase64));
    } catch (error) {
        return null;
    }
};

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) return <div>Cargando dashboard...</div>;

    return (
        <ThemeProvider>
            <HashRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />}
                    />

                    {/* Protected Layout */}
                    <Route
                        element={isAuthenticated ? <MainLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    >
                        <Route path="/dashboard" element={<Dashboard user={user} />} />
                        <Route path="/pages" element={<Pages />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/theme-parts" element={<ThemeParts />} />
                        <Route path="/theme-settings" element={<SiteSettings />} />
                        <Route path="/settings" element={<Settings />} />

                        {/* Default Redirect */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
}

export default AdminApp;
