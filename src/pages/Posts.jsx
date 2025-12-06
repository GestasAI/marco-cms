import React, { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import './Posts.css';

/**
 * ✍️ Página para gestionar los Posts del Blog
 *
 * Permite crear y listar artículos. Utiliza el `usePosts` hook
 * para interactuar con el `acideService`.
 */
const Posts = () => {
    const { posts, isLoading, error, createPost } = usePosts();
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) {
            alert('Por favor, completa el título y el contenido.');
            return;
        }
        setIsSubmitting(true);
        const success = await createPost(newPost);
        if (success) {
            setNewPost({ title: '', content: '' }); // Limpiar formulario
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            <h1 className="heading-2 mb-8">Gestionar Posts</h1>

            <div className="posts-page-grid">
                {/* Columna del Formulario */}
                <aside>
                    <div className="card post-form-card">
                        <div className="card-header">
                            <h3 className="card-title">Nuevo Post</h3>
                        </div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-input"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    placeholder="Título del artículo"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content" className="form-label">Contenido</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="form-textarea"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    placeholder="Escribe tu artículo aquí..."
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Publicando...' : 'Publicar Post'}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Columna de la Lista de Posts */}
                <section>
                    {isLoading && <p>Cargando posts...</p>}
                    {error && <div className="alert alert-error">{error}</div>}
                    
                    {!isLoading && !error && (
                        <div className="post-list">
                            {posts.length === 0 ? (
                                <p>No hay posts todavía. ¡Crea el primero!</p>
                            ) : (
                                posts.map(post => (
                                    <div key={post.id} className="card post-card">
                                        <div className="card-body">
                                            <h4 className="card-title">{post.title}</h4>
                                            <p className="card-text text-sm text-secondary">{post.content.substring(0, 100)}...</p>
                                        </div>
                                        <div className="card-footer">
                                            <button className="btn btn-outline btn-sm">Editar</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Posts;