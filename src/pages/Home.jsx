import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/content';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await contentService.getAll();
            const publishedPosts = Array.isArray(data)
                ? data.filter(p => p.status === 'published')
                : [];
            setPosts(publishedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estilos inline para secciones específicas que usan variables del tema
    const heroStyle = {
        background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
        color: 'white',
        padding: 'var(--space-3xl) 0',
        textAlign: 'center'
    };

    const heroTitleStyle = {
        color: 'white',
        marginBottom: 'var(--space-md)'
    };

    const searchInputStyle = {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        borderRadius: 'var(--radius-xl)',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        fontSize: 'var(--text-lg)',
        color: 'var(--color-text)'
    };

    return (
        <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{
                background: 'var(--color-bg)',
                borderBottom: '1px solid #e5e7eb',
                padding: '1rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container flex-between">
                    <div className="flex-center gap-sm">
                        <div style={{
                            width: 40,
                            height: 40,
                            background: 'var(--color-primary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            M
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Marco CMS</h1>
                            <p className="text-small" style={{ margin: 0 }}>Powered by GestasAI</p>
                        </div>
                    </div>
                    <Link to="/login" className="btn btn-primary btn-sm">
                        Admin
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={heroStyle}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="heading-1" style={heroTitleStyle}>
                            Bienvenido a Marco CMS
                        </h2>
                        <p className="text-lead" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--space-xl)' }}>
                            Sistema de Gestión de Contenidos moderno y potente
                        </p>

                        {/* Search Bar */}
                        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                            <Search
                                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                                size={20}
                            />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar contenidos..."
                                style={searchInputStyle}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Posts Section */}
            <section className="section">
                <div className="container">
                    <div className="mb-xl">
                        <h3 className="heading-2">Últimas Publicaciones</h3>
                        <p className="text-secondary">Explora nuestro contenido más reciente</p>
                    </div>

                    {loading ? (
                        <div className="text-center section">
                            <p>Cargando contenidos...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="card text-center section-sm">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h4 className="heading-3">
                                {searchTerm ? 'No se encontraron resultados' : 'No hay contenidos publicados'}
                            </h4>
                            <p className="text-secondary">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Pronto habrá contenido disponible'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-3">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    {/* Image Placeholder */}
                                    <div style={{
                                        height: '200px',
                                        background: 'linear-gradient(135deg, var(--color-primary), #e0e7ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '3rem' }}>📄</span>
                                    </div>

                                    <div style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h4 className="heading-4" style={{ marginBottom: 'var(--space-xs)' }}>
                                            {post.title || 'Sin título'}
                                        </h4>
                                        <p className="text-body" style={{
                                            marginBottom: 'var(--space-md)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {post.content || 'Sin contenido'}
                                        </p>

                                        <div className="flex gap-md mb-md text-small text-muted" style={{ marginTop: 'auto' }}>
                                            <div className="flex-center gap-sm">
                                                <Calendar size={16} />
                                                <span>
                                                    {post.created_at
                                                        ? new Date(post.created_at).toLocaleDateString('es-ES')
                                                        : 'Fecha desconocida'}
                                                </span>
                                            </div>
                                            <div className="flex-center gap-sm">
                                                <User size={16} />
                                                <span>Admin</span>
                                            </div>
                                        </div>

                                        <button className="btn btn-ghost" style={{ paddingLeft: 0, color: 'var(--color-primary)', justifyContent: 'flex-start' }}>
                                            Leer más <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--color-dark)', color: 'white', padding: 'var(--space-2xl) 0', marginTop: 'auto' }}>
                <div className="container text-center">
                    <h5 className="heading-3" style={{ color: 'white' }}>Marco CMS</h5>
                    <p style={{ color: '#9ca3af', marginBottom: 'var(--space-lg)' }}>
                        Powered by GestasAI Universal Bridge
                    </p>
                    <div className="flex-center gap-lg text-small">
                        <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Acerca de</a>
                        <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contacto</a>
                        <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Privacidad</a>
                    </div>
                    <p className="mt-lg text-small" style={{ color: '#6b7280' }}>
                        © 2025 Marco CMS. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
