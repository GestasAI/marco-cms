import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout'; // Admin Layout
import './styles/dashboard/variables.css';
import './styles/dashboard/dashboard.css';

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

// Context
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('marco_token');
    if (!token) {
        return <Navigate to="/login" replace />;
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
                        <ProtectedRoute>
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
                    </Route>

                    {/* FSE Editor (Full Screen - Protected) */}
                    <Route path="/editor/:collection/:id" element={
                        <ProtectedRoute>
                            <Editor />
                        </ProtectedRoute>
                    } />

                    {/* PUBLIC FSE PAGES (Dynamic Content - NO AUTH REQUIRED) */}
                    <Route path="/" element={<PageResolver />} />
                    <Route path="/:slug" element={<PageResolver />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;