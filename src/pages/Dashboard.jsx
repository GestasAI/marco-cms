import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Image, Users, Palette, Search } from 'lucide-react';
import axios from 'axios';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
    const navigate = useNavigate();
    const { settings } = useThemeSettings();
    const colors = settings.colors || {};

    const [stats, setStats] = useState({
        pages: 0,
        posts: 0,
        media: 0,
        users: 0
    });
    const [plugins, setPlugins] = useState([]);
    const [themes, setThemes] = useState([]);
    const [activeTheme, setActiveTheme] = useState('gestasai-default');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load plugins
            const pluginsRes = await axios.get(`${API_URL}/api/plugins`);
            setPlugins(pluginsRes.data.plugins || []);
            // Load themes
            const themesData = await loadThemes();
            setThemes(themesData);
            // Load stats (mock data)
            setStats({ pages: 5, posts: 12, media: 48, users: 3 });
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    const loadThemes = async () => [
        {
            id: 'gestasai-default',
            name: 'GestasAI Default',
            description: 'Tema espectacular con IA, diseño moderno y responsive',
            version: '1.0.0',
            author: 'GestasAI Team',
            screenshot: '/themes/gestasai-default/screenshot.jpg',
            active: true,
            features: ['SEO Optimizado', 'AI-Native', 'Responsive', 'Dark Mode']
        }
    ];

    const handleActivateTheme = async (themeId) => {
        try {
            const token = localStorage.getItem('marco_token');
            await axios.post(
                `${API_URL}/api/bridge/insert`,
                {
                    collection: 'site_settings',
                    document: { id: 'active_theme', theme_id: themeId, updated_at: new Date().toISOString() }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveTheme(themeId);
            alert('Tema activado correctamente');
        } catch (error) {
            console.error('Error activating theme:', error);
            alert('Error al activar el tema');
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;

    // Componente interno para Stats usando Card atómica
    const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
        <Card className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', borderLeft: `4px solid ${color}`, transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '50%', background: `${color}15`, color: color }}>
                    <Icon size={24} />
                </div>
                <div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', lineHeight: 1 }}>{value}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <div>
            <div className="flex-between mb-lg">
                <div>
                    <h1 className="heading-2">Resumen General</h1>
                    <p className="text-secondary">Bienvenido al panel de control</p>
                </div>
                {/* Ejemplo de uso futuro: Botones de acción rápida */}
            </div>

            {/* Stats Cards - Grid System del Tema */}
            <div className="grid grid-4 mb-xl">
                <StatCard
                    icon={FileText}
                    title="Páginas"
                    value={stats.pages}
                    color={colors.primary || '#3b82f6'}
                    onClick={() => navigate('/pages')}
                />
                <StatCard
                    icon={BarChart3}
                    title="Posts"
                    value={stats.posts}
                    color={colors.secondary || '#8b5cf6'}
                    onClick={() => navigate('/posts')}
                />
                <StatCard
                    icon={Image}
                    title="Media"
                    value={stats.media}
                    color={colors.accent || '#10b981'}
                />
                <StatCard
                    icon={Users}
                    title="Usuarios"
                    value={stats.users}
                    color="#f59e0b"
                />
            </div>

            <div className="grid grid-2">
                {/* Themes Section */}
                <div className="mb-xl">
                    <div className="flex-between mb-md">
                        <div>
                            <h2 className="heading-3">Temas</h2>
                            <p className="text-secondary text-sm">Gestiona la apariencia</p>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Palette}
                            onClick={() => navigate('/theme-settings')}
                        >
                            Personalizar
                        </Button>
                    </div>

                    <div className="themes-grid" style={{ display: 'grid', gap: '1rem' }}>
                        {themes.map((theme) => (
                            <Card key={theme.id} style={{ display: 'flex', overflow: 'hidden' }}>
                                <div style={{ width: '100px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem' }}>
                                    🎨
                                </div>
                                <div style={{ padding: '1rem', flex: 1 }}>
                                    <div className="flex-between mb-sm">
                                        <h3 className="heading-4" style={{ margin: 0 }}>{theme.name}</h3>
                                        {theme.id === activeTheme && <span className="badge badge-success">Activo</span>}
                                    </div>
                                    <p className="text-small text-secondary mb-md">{theme.description}</p>
                                    <div className="flex gap-sm">
                                        {theme.id !== activeTheme && (
                                            <Button size="sm" onClick={() => handleActivateTheme(theme.id)}>
                                                Activar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Plugins Section */}
                <div>
                    <div className="flex-between mb-md">
                        <div>
                            <h2 className="heading-3">Plugins</h2>
                            <p className="text-secondary text-sm">Extensiones activas</p>
                        </div>
                    </div>

                    {plugins.length === 0 ? (
                        <Card className="text-center p-lg">
                            <Search size={32} className="text-secondary mb-sm mx-auto" style={{ display: 'block' }} />
                            <p className="text-secondary">No hay plugins conectados</p>
                        </Card>
                    ) : (
                        <div className="grid gap-sm">
                            {plugins.map((plugin, index) => (
                                <Card key={index} className="flex-between p-md">
                                    <div className="flex items-center gap-md">
                                        <div className="plugin-icon bg-primary-light rounded p-xs">
                                            {plugin.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{plugin.name || 'Unknown'}</h4>
                                            <p className="text-xs text-secondary">{plugin.type}</p>
                                        </div>
                                    </div>
                                    <span className="badge badge-success">Conectado</span>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, title, value, color, onClick }) {
    return (
        <div
            className="stat-card"
            style={{ '--stat-color': color }}
            onClick={onClick}
        >
            <div className="stat-icon">
                <Icon size={24} />
            </div>
            <div className="stat-info">
                <p className="stat-title">{title}</p>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );
}

function ThemeCard({ theme, isActive, onActivate, onDelete }) {
    return (
        <div className={`theme-card ${isActive ? 'active' : ''}`}>
            <div className="theme-screenshot">
                <img
                    src={theme.screenshot || '/placeholder-theme.jpg'}
                    alt={theme.name}
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18"%3E' + theme.name + '%3C/text%3E%3C/svg%3E';
                    }}
                />
                {isActive && (
                    <div className="theme-badge">
                        <span>✓ Activo</span>
                    </div>
                )}
            </div>
            <div className="theme-info">
                <h3>{theme.name}</h3>
                <p className="theme-description">{theme.description}</p>
                <div className="theme-meta">
                    <span>v{theme.version}</span>
                    <span>por {theme.author}</span>
                </div>
                {theme.features && (
                    <div className="theme-features">
                        {theme.features.map((feature, index) => (
                            <span key={index} className="feature-tag">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}
                <div className="theme-actions">
                    {!isActive ? (
                        <>
                            <button className="btn btn-primary" onClick={onActivate}>
                                Activar
                            </button>
                            <button className="btn btn-secondary" onClick={onDelete}>
                                Eliminar
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-secondary" disabled>
                            Tema Activo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function PluginCard({ plugin }) {
    return (
        <div className="plugin-card">
            <div className="plugin-header">
                <div className="plugin-icon">
                    {plugin.name?.charAt(0) || 'P'}
                </div>
                <div className="plugin-info">
                    <h3>{plugin.name || 'Unknown Plugin'}</h3>
                    <p>{plugin.type || 'Unknown Type'}</p>
                </div>
            </div>
            <div className="plugin-status">
                <span className="status-badge status-active">Conectado</span>
            </div>
        </div>
    );
}
