import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Image, Users, Palette, Search } from 'lucide-react';
import { acideService } from '../acide/acideService';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth/authService';

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
            // Load plugins via ACIDE (Local)
            const pluginsList = await acideService.listPlugins();
            setPlugins(pluginsList || []);

            // Load themes via ACIDE (Local)
            const themesList = await acideService.listThemes();
            setThemes(themesList || []);

            // Load stats (mock data or future implementation)
            setStats({ pages: 5, posts: 12, media: 48, users: 3 });

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    const handleActivateTheme = async (themeId) => {
        try {
            await acideService.activateTheme(themeId);
            setActiveTheme(themeId);
            alert('Tema activado correctamente');
        } catch (error) {
            console.error('Error activating theme:', error);
            alert('Error al activar el tema');
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;

    // Componente interno para Stats
    const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
        <Card
            className="flex items-center gap-md"
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                borderLeft: `4px solid ${color}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
        >
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${color}10`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon size={22} />
            </div>
            <div className="min-w-0">
                <p className="text-secondary mb-xs" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--dash-text)', margin: 0 }}>{value}</p>
            </div>
        </Card>
    );

    return (
        <div>
            <div className="flex-between mb-lg">
                <div>
                    <h1 className="heading-2">Resumen General</h1>
                    <p className="text-secondary">Bienvenido al panel de control de Marco CMS</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-4 mb-xl" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {authService.isEditor() && (
                    <StatCard
                        icon={FileText}
                        title="Páginas"
                        value={stats.pages}
                        color="#4f46e5"
                        onClick={() => navigate('/dashboard/pages')}
                    />
                )}
                {authService.isEditor() && (
                    <StatCard
                        icon={BarChart3}
                        title="Posts"
                        value={stats.posts}
                        color="#8b5cf6"
                        onClick={() => navigate('/dashboard/posts')}
                    />
                )}
                {authService.isEditor() && (
                    <StatCard
                        icon={Image}
                        title="Media"
                        value={stats.media}
                        color="#10b981"
                    />
                )}
                {authService.isAdmin() && (
                    <StatCard
                        icon={Users}
                        title="Usuarios"
                        value={stats.users}
                        color="#f59e0b"
                        onClick={() => navigate('/dashboard/users')}
                    />
                )}
            </div>

            <div className="grid grid-2" style={{ gap: '2rem' }}>
                {/* Themes Section */}
                {authService.isEditor() && (
                    <div className="flex-column">
                        <div className="flex-between mb-md">
                            <div>
                                <h2 className="heading-3">Temas Instalados</h2>
                                <p className="text-secondary text-sm">Personaliza la apariencia visual</p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={Palette}
                                onClick={() => navigate('/dashboard/theme-settings')}
                            >
                                Configurar
                            </Button>
                        </div>

                        <div className="grid gap-md">
                            {themes.map((theme) => (
                                <Card key={theme.id} noPadding className="flex overflow-hidden" style={{ minHeight: '100px' }}>
                                    <div style={{
                                        width: '100px',
                                        background: theme.id === activeTheme ? 'var(--dash-primary)' : 'var(--dash-primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: theme.id === activeTheme ? 'white' : 'var(--dash-primary)',
                                        fontSize: '2rem'
                                    }}>
                                        {theme.id === 'academia' ? '🎓' : theme.id === 'shootandrun' ? '🔫' : '🎨'}
                                    </div>
                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div className="flex-between mb-xs">
                                            <h3 className="font-bold" style={{ margin: 0, fontSize: '1rem' }}>{theme.name}</h3>
                                            {theme.id === activeTheme && <span className="badge badge-success">Activo</span>}
                                        </div>
                                        <p className="text-xs text-secondary mb-md" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {theme.description || 'Sin descripción disponible.'}
                                        </p>
                                        <div className="flex gap-sm">
                                            {theme.id !== activeTheme ? (
                                                <button className="btn-primary btn-sm" onClick={() => handleActivateTheme(theme.id)}>
                                                    Activar Tema
                                                </button>
                                            ) : (
                                                <button className="btn-outline btn-sm" onClick={() => navigate('/dashboard/theme-settings')}>
                                                    Personalizar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Plugins Section */}
                {authService.isAdmin() && (
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
                                    <div key={index} className="card flex-between p-md">
                                        <div className="flex items-center gap-md">
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'var(--dash-primary-light)',
                                                color: 'var(--dash-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}>
                                                {plugin.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold" style={{ fontSize: '0.875rem', margin: 0 }}>{plugin.name || 'Unknown'}</h4>
                                                <p className="text-xs text-secondary">{plugin.type}</p>
                                            </div>
                                        </div>
                                        <span className="badge badge-success">Conectado</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
