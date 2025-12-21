import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout'; // Admin Layout
import './styles/dashboard/variables.css';
import './styles/dashboard/dashboard.css';
import './index.css';
import './styles/academy.css';

// Public Pages
import PageResolver from './pages/PageResolver';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Pages from './pages/Pages';
import Products from './pages/Products';
import Ads from './pages/Ads';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Media from './pages/Media';
import Themes from './pages/Themes';
import ThemeParts from './pages/ThemeParts';
import Settings from './pages/Settings';
import SeoSettings from './pages/SeoSettings';
import Editor from './pages/Editor';
import AcademyAdmin from './pages/AcademyAdmin';
import AcademyLayout from './components/layout/AcademyLayout';
import AcademyHome from './pages/AcademyHome';
import Users from './pages/Users';
import BuildSite from './pages/BuildSite';

// Placeholder components for Academy student sections
const AcademyPlaceholder = ({ title }) => (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>Esta sección estará disponible próximamente.</p>
        <a href="/academy" className="mt-6 text-blue-600 font-bold hover:underline">Volver a Mis Cursos</a>
    </div>
);

// Context
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('marco_token');
    const user = JSON.parse(localStorage.getItem('marco_user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const roleName = (user.roleName || user.role_name || '').toLowerCase();
    const isStudent = roleName === 'estudiante' || roleName === 'cliente';

    // Si es estudiante e intenta entrar a admin, redirigir a academia
    if (isStudent && requireAdmin) {
        return <Navigate to="/academy" replace />;
    }

    return children;
};

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/login" element={<Login />} />

                    {/* ADMIN ROUTES (Protected) */}
                    <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute requireAdmin={true}>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="posts" element={<Posts />} />
                        <Route path="pages" element={<Pages />} />
                        <Route path="products" element={<Products />} />
                        <Route path="ads" element={<Ads />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="tags" element={<Tags />} />
                        <Route path="media" element={<Media />} />
                        <Route path="themes" element={<Themes />} />
                        <Route path="theme-parts" element={<ThemeParts />} />
                        <Route path="seo" element={<SeoSettings />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="academy" element={<AcademyAdmin />} />
                        <Route path="users" element={<Users />} />
                        <Route path="build" element={<BuildSite />} />
                    </Route>

                    {/* FSE Editor (Full Screen - Protected) */}
                    <Route path="/editor/:collection/:id" element={
                        <ProtectedRoute requireAdmin={true}>
                            <Editor />
                        </ProtectedRoute>
                    } />

                    {/* ACADEMY PUBLIC ROUTES */}
                    <Route path="/academy" element={<ProtectedRoute><AcademyHome /></ProtectedRoute>} />
                    <Route path="/academy/discover" element={<ProtectedRoute><AcademyPlaceholder title="Descubrir" /></ProtectedRoute>} />
                    <Route path="/academy/tutor" element={<ProtectedRoute><AcademyPlaceholder title="Tutorías" /></ProtectedRoute>} />
                    <Route path="/academy/profile" element={<ProtectedRoute><AcademyPlaceholder title="Mi Perfil" /></ProtectedRoute>} />
                    <Route path="/academy/:courseSlug" element={<AcademyLayout />} />
                    <Route path="/academy/:courseSlug/:lessonId" element={<AcademyLayout />} />

                    {/* PUBLIC FSE PAGES (Dynamic Content - NO AUTH REQUIRED) */}
                    <Route path="/" element={<PageResolver />} />
                    <Route path="/:slug" element={<PageResolver />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

