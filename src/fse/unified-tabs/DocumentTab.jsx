import React, { useState, useEffect } from 'react';
import { Image, Plus, X, Monitor, Tablet, Smartphone, User, Tag, Calendar, Eye, Upload } from 'lucide-react';
import { acideService } from '../../acide/acideService';
import { MediaLibraryModal } from '../components/MediaLibraryModal';

/**
 * Pestaña Documento - Configuración global de la página
 */
export function DocumentTab({ document, setDocument, pageData, setPageData }) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (showMediaLibrary) loadMediaLibrary();
    }, [showMediaLibrary]);

    const loadMediaLibrary = async () => {
        try {
            setLoadingMedia(true);
            const list = await acideService.list('media');
            setMediaLibrary((list || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
        } catch (error) {
            console.error("Error loading media:", error);
        } finally {
            setLoadingMedia(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const uploadedFile = await acideService.upload(file);
            handleUpdate('featured_image', uploadedFile.url);
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = (field, value) => {
        setDocument(prev => ({ ...prev, [field]: value }));
    };

    const handleSEOUpdate = (field, value) => {
        setDocument(prev => ({
            ...prev,
            seo: { ...(prev.seo || {}), [field]: value }
        }));
    };

    return (
        <div className="tab-content">
            <div className="section-header-compact">Información General</div>

            <div className="form-group-compact">
                <label className="form-label-compact">Título del Documento</label>
                <input
                    type="text" className="form-input-compact"
                    value={document.title || ''}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                />
            </div>

            <div className="form-group-compact">
                <label className="form-label-compact">Extracto / Descripción</label>
                <textarea
                    className="form-input-compact" rows="3"
                    value={document.excerpt || ''}
                    onChange={(e) => handleUpdate('excerpt', e.target.value)}
                />
            </div>

            <div className="divider-compact"></div>

            <div className="section-header-compact">Imagen Destacada</div>
            <div className="featured-image-container mb-md">
                {document.featured_image ? (
                    <div className="relative group">
                        <img src={document.featured_image} alt="Featured" className="w-full h-32 object-cover rounded border" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                            <button className="btn btn-xs btn-danger mr-1" onClick={() => handleUpdate('featured_image', null)}><X size={12} /></button>
                            <button className="btn btn-xs btn-primary" onClick={() => setShowMediaLibrary(true)}>Cambiar</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button className="btn btn-sm flex-1" onClick={() => setShowMediaLibrary(true)}>Biblioteca</button>
                        <label className="btn btn-sm flex-1 text-center cursor-pointer">
                            {uploading ? '...' : 'Subir'}
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                )}
            </div>

            <div className="divider-compact"></div>

            <div className="section-header-compact">SEO & Meta</div>
            <div className="form-group-compact">
                <label className="form-label-compact">Meta Título</label>
                <input
                    type="text" className="form-input-compact"
                    value={document.seo?.title || ''}
                    onChange={(e) => handleSEOUpdate('title', e.target.value)}
                />
            </div>

            {showMediaLibrary && (
                <MediaLibraryModal
                    mediaLibrary={mediaLibrary}
                    loading={loadingMedia}
                    onSelect={(m) => { handleUpdate('featured_image', m.url); setShowMediaLibrary(false); }}
                    onClose={() => setShowMediaLibrary(false)}
                />
            )}
        </div>
    );
}
