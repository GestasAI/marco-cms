import React, { useState, useEffect } from 'react';
import { Image, Plus, X, Monitor, Tablet, Smartphone, User, Tag, Calendar, Eye } from 'lucide-react';
import { acideService } from '../../acide/acideService';

/**
 * Pestaña Documento - Configuración global de la página
 */
export function DocumentTab({ document, setDocument, pageData, setPageData }) {
    const [categories, setCategories] = useState([]);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const cats = await acideService.list('categories');
            setCategories(cats || []);
        } catch (err) {
            console.error('Error cargando categorías:', err);
        }
    };

    const handleUpdate = (field, value) => {
        setDocument(prev => ({ ...prev, [field]: value }));
    };

    const handleSEOUpdate = (field, value) => {
        setDocument(prev => ({
            ...prev,
            seo: { ...prev.seo, [field]: value }
        }));
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const cat = { name: newCategory, slug: newCategory.toLowerCase().replace(/\s+/g, '-') };
            await acideService.update('categories', cat.slug, cat);
            setCategories(prev => [...prev, cat]);
            handleUpdate('category', cat.slug);
            setNewCategory('');
            setShowNewCategory(false);
        } catch (err) {
            alert('Error al crear categoría');
        }
    };

    const handleVisibilityUpdate = (condition, value) => {
        const currentVisibility = document.visibility || {};
        handleUpdate('visibility', { ...currentVisibility, [condition]: value });
    };

    return (
        <div className="tab-content document-tab">
            {/* Título y Slug */}
            <div className="section-header-compact">General</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Título de la Página</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={document.title || ''}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Slug (URL)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={document.slug || ''}
                    onChange={(e) => handleUpdate('slug', e.target.value)}
                />
            </div>

            {/* Imagen Destacada */}
            <div className="divider-compact"></div>
            <div className="section-header-compact">Imagen Destacada</div>
            <div className="featured-image-preview">
                {document.featured_image ? (
                    <div className="relative group">
                        <img src={document.featured_image} alt="Destacada" className="w-full h-32 object-cover rounded" />
                        <button
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleUpdate('featured_image', null)}
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <button className="featured-image-placeholder" onClick={() => alert('Abrir Media Library')}>
                        <Image size={24} />
                        <span>Añadir Imagen</span>
                    </button>
                )}
            </div>

            {/* Categorías y Etiquetas */}
            <div className="divider-compact"></div>
            <div className="section-header-compact">Organización</div>

            <div className="form-group-compact">
                <label className="form-label-compact flex justify-between">
                    Categoría
                    <button className="text-primary text-[10px]" onClick={() => setShowNewCategory(!showNewCategory)}>
                        {showNewCategory ? 'Cancelar' : '+ Nueva'}
                    </button>
                </label>

                {showNewCategory ? (
                    <div className="flex gap-1 mt-1">
                        <input
                            type="text"
                            className="form-input-compact"
                            placeholder="Nombre..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button className="btn-primary-compact" onClick={handleAddCategory}>OK</button>
                    </div>
                ) : (
                    <select
                        className="form-input-compact"
                        value={document.category || ''}
                        onChange={(e) => handleUpdate('category', e.target.value)}
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Etiquetas (separadas por coma)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    value={document.tags ? document.tags.join(', ') : ''}
                    onChange={(e) => handleUpdate('tags', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="ia, tutorial, academia"
                />
            </div>

            {/* Página Superior */}
            <div className="form-group-compact">
                <label className="form-label-compact">Página Superior</label>
                <select
                    className="form-input-compact"
                    value={document.parent || ''}
                    onChange={(e) => handleUpdate('parent', e.target.value)}
                >
                    <option value="">(Ninguna)</option>
                    <option value="home">Inicio</option>
                    <option value="cursos">Cursos</option>
                </select>
            </div>

            {/* Visibilidad Dinámica */}
            <div className="divider-compact"></div>
            <div className="section-header-compact flex items-center gap-1">
                <Eye size={12} /> Visibilidad Dinámica
            </div>

            <div className="visibility-grid">
                <button
                    className={`visibility-btn ${document.visibility?.desktop !== false ? 'active' : ''}`}
                    onClick={() => handleVisibilityUpdate('desktop', !document.visibility?.desktop)}
                    title="Escritorio"
                >
                    <Monitor size={14} />
                </button>
                <button
                    className={`visibility-btn ${document.visibility?.tablet !== false ? 'active' : ''}`}
                    onClick={() => handleVisibilityUpdate('tablet', !document.visibility?.tablet)}
                    title="Tablet"
                >
                    <Tablet size={14} />
                </button>
                <button
                    className={`visibility-btn ${document.visibility?.mobile !== false ? 'active' : ''}`}
                    onClick={() => handleVisibilityUpdate('mobile', !document.visibility?.mobile)}
                    title="Móvil"
                >
                    <Smartphone size={14} />
                </button>
            </div>

            <div className="form-group-compact mt-2">
                <label className="form-label-compact">Condición de Usuario</label>
                <select
                    className="form-input-compact"
                    value={document.visibility?.user_role || 'all'}
                    onChange={(e) => handleVisibilityUpdate('user_role', e.target.value)}
                >
                    <option value="all">Todos</option>
                    <option value="logged">Solo registrados</option>
                    <option value="guest">Solo invitados</option>
                    <option value="admin">Solo administradores</option>
                </select>
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Condición Personalizada (JS)</label>
                <input
                    type="text"
                    className="form-input-compact"
                    placeholder="day === 15 || hasCategory('premium')"
                    value={document.visibility?.custom_condition || ''}
                    onChange={(e) => handleVisibilityUpdate('custom_condition', e.target.value)}
                />
            </div>

            {/* CSS Personalizado */}
            <div className="divider-compact"></div>
            <div className="section-header-compact">CSS Personalizado</div>
            <div className="form-group-compact">
                <textarea
                    className="form-input-compact font-mono text-[10px]"
                    rows="6"
                    placeholder=".mi-clase { color: red; }"
                    value={document.custom_css || ''}
                    onChange={(e) => handleUpdate('custom_css', e.target.value)}
                />
            </div>
        </div>
    );
}
