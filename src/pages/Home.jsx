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

    return (
        <div style={{ minHeight: '100vh', background: 'var(--theme-color-background)' }}>
            {/* Header */}
            <header className="theme-header">
                <div className="theme-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--theme-space-sm)' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            background: 'var(--theme-color-primary)',
                            borderRadius: 'var(--theme-radius-md)',
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
                            <p className="theme-text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>Powered by GestasAI</p>
                        </div>
                    </div>
                    <Link to="/login" className="theme-btn theme-btn-primary">
                        Admin
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                background: `linear-gradient(135deg, var(--theme-color-primary), var(--theme-color-secondary))`,
                color: 'white',
                padding: 'var(--theme-space-3xl) 0',
                textAlign: 'center'
            }}>
                <div className="theme-container">
                    <div className="theme-container-narrow" style={{ margin: '0 auto' }}>
                        <h2 className="heading-1" style={{ color: 'white', marginBottom: 'var(--theme-space-md)' }}>
                            Bienvenido a Marco CMS
                        </h2>
                        <p className="theme-text-xl" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--theme-space-xl)' }}>
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
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: 'var(--theme-radius-xl)',
                                    border: 'none',
                                    boxShadow: 'var(--theme-shadow-lg)',
                                    fontSize: 'var(--theme-text-lg)',
                                    color: 'var(--theme-color-text-primary)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Posts Section */}
            <section className="theme-p-xl">
                <div className="theme-container">
                    <div className="theme-mb-xl">
                        <h3 className="theme-post-title" style={{ fontSize: '1.875rem' }}>Últimas Publicaciones</h3>
                        <p className="theme-text-secondary">Explora nuestro contenido más reciente</p>
                    </div>

                    {loading ? (
                        <div className="theme-text-center theme-p-xl">
                            <p>Cargando contenidos...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="theme-card theme-text-center">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h4 className="heading-3">
                                {searchTerm ? 'No se encontraron resultados' : 'No hay contenidos publicados'}
                            </h4>
                            <p className="theme-text-secondary">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Pronto habrá contenido disponible'}
                            </p>
                        </div>
                    ) : (
                        <div className="theme-grid theme-grid-3">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="theme-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    {/* Image Placeholder */}
                                    <div style={{
                                        height: '200px',
                                        background: 'linear-gradient(135deg, var(--theme-color-primary), #e0e7ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '3rem' }}>📄</span>
                                    </div>

                                    <div style={{ padding: 'var(--theme-space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h4 className="theme-post-title" style={{ fontSize: '1.25rem', marginBottom: 'var(--theme-space-xs)' }}>
                                            {post.title || 'Sin título'}
                                        </h4>
                                        <p className="theme-post-content" style={{
                                            marginBottom: 'var(--theme-space-md)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {post.content || 'Sin contenido'}
                                        </p>

                                        <div className="flex gap-md theme-mb-md theme-text-muted" style={{ marginTop: 'auto', gap: '0.5rem', fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={16} />
                                                <span>
                                                    {post.created_at
                                                        ? new Date(post.created_at).toLocaleDateString('es-ES')
                                                        : 'Fecha desconocida'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <User size={16} />
                                                <span>Admin</span>
                                            </div>
                                        </div>

                                        <Link to={`/post/${post.slug || post.id}`} className="theme-btn theme-btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start', border: 'none', paddingLeft: 0 }}>
                                            Leer más <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="theme-footer">
                <div className="theme-container theme-text-center">
                    <h5 className="theme-post-title" style={{ color: 'white', fontSize: '1.5rem' }}>Marco CMS</h5>
                    <p className="theme-text-muted theme-mb-lg">
                        Powered by GestasAI Universal Bridge
                    </p>
                    <div className="theme-text-sm" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', opacity: 0.8 }}>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Acerca de</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contacto</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacidad</a>
                    </div>
                    <p className="theme-mt-lg theme-text-xs theme-text-muted">
                        © 2025 Marco CMS. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
