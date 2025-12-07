import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acideService } from '../acide/acideService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { useThemeSettings } from '../hooks/useThemeSettings';

export default function PostDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtenemos colores del tema para detalles visuales
    const { settings } = useThemeSettings();
    const colors = settings.colors || {};

    useEffect(() => {
        loadPost();
    }, [slug]);

    const loadPost = async () => {
        try {
            setLoading(true);

            // Use ACIDE Query Engine to find post by slug
            const result = await acideService.query('posts', {
                where: [['slug', '=', slug]],
                limit: 1
            });

            if (result && result.items && result.items.length > 0) {
                setPost(result.items[0]);
            } else {
                setError('Contenido no encontrado');
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar el contenido');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando contenido...</div>;

    if (error || !post) return (
        <div className="container max-w-2xl mx-auto py-12 text-center">
            <h2 className="heading-2 mb-4">😕 Ups</h2>
            <p className="text-secondary mb-8">{error || 'El contenido que buscas no existe.'}</p>
            <Button onClick={() => navigate('/posts')}>Volver al listado</Button>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Button
                variant="ghost"
                size="sm"
                className="mb-md"
                onClick={() => navigate(-1)}
                icon={ArrowLeft}
            >
                Volver
            </Button>

            <article>
                {/* Header del Post */}
                <header className="mb-xl">
                    <div className="flex gap-sm mb-sm">
                        {post.category && (
                            <span className="badge badge-primary">{post.category}</span>
                        )}
                        <span className="badge badge-secondary">{post.status}</span>
                    </div>

                    <h1 className="heading-1 mb-md">{post.title}</h1>

                    <div className="flex items-center gap-md text-secondary text-sm border-b border-gray-200 pb-md">
                        <div className="flex items-center gap-xs">
                            <Calendar size={16} />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-xs">
                            <User size={16} />
                            <span>{post.author || 'Admin'}</span>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal */}
                <Card className="p-lg mb-xl">
                    <div className="prose max-w-none text-body">
                        {/* Aquí iría un parser de Markdown o HTML seguro */}
                        {post.content ? (
                            post.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-md">{paragraph}</p>
                            ))
                        ) : (
                            <p className="italic text-secondary">Sin contenido textual.</p>
                        )}
                    </div>
                </Card>

                {/* Tags / Metadatos Extra */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-sm flex-wrap">
                        {post.tags.map(tag => (
                            <div key={tag} className="flex items-center gap-xs text-secondary bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <Tag size={14} />
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </div>
    );
}
