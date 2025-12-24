import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Film, FileText, Loader2, Plus, Sparkles } from 'lucide-react';
import { acideService } from '../../acide/acideService';

/**
 * MediaLibraryModal - RECONSTRUCCIÓN TOTAL
 * Utiliza el sistema centralizado de medios de Marco CMS (acideService).
 * Diseño idéntico al Dashboard para coherencia total.
 */
export function MediaLibraryModal({ elementType, onSelect, onClose }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('files'); // 'files' o 'animations'

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            setLoading(true);
            // Llamada al sistema centralizado
            const list = await acideService.list('media');
            const sortedList = (list || []).sort((a, b) =>
                new Date(b.created_at || 0) - new Date(a.created_at || 0)
            );
            setFiles(sortedList);
        } catch (error) {
            console.error("Error loading media:", error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            // 1. Subir el archivo físico
            const result = await acideService.upload(file);
            if (result && result.url) {
                // 2. Registrar en la colección centralizada 'media' (como hace el dashboard)
                const newMediaEntry = {
                    id: `media-${Date.now()}`,
                    title: file.name,
                    filename: result.url.split('/').pop(),
                    url: result.url,
                    type: file.type || 'application/octet-stream',
                    size: file.size,
                    created_at: new Date().toISOString()
                };
                await acideService.create('media', newMediaEntry);

                // 3. Actualizar lista local
                setFiles(prev => [newMediaEntry, ...prev]);
            }
        } catch (error) {
            console.error(error);
            alert(`Error al subir archivo: ${error.message}`);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getIconForType = (type) => {
        if (type?.includes('image')) return <ImageIcon size={32} className="text-purple-500" />;
        if (type?.includes('video')) return <Film size={32} className="text-red-500" />;
        return <FileText size={32} className="text-blue-500" />;
    };

    // Filtrado por tipo de elemento (Imagen o Video)
    const filteredFiles = files.filter(file => {
        if (!elementType) return true;
        const type = (file.type || '').toLowerCase();
        if (elementType === 'image') return type.includes('image');
        if (elementType === 'video') return type.includes('video');
        return true;
    });

    return (
        <div className="media-library-overlay" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div className="media-library-modal" style={{ maxWidth: '1000px', width: '90%', height: '85vh', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>

                {/* Header - Estilo Dashboard */}
                <div className="flex items-center justify-between p-6 border-b bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Biblioteca de Medios</h2>
                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`text-sm font-bold pb-1 border-b-2 transition-all ${activeTab === 'files' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
                            >
                                Archivos
                            </button>
                            <button
                                onClick={() => setActiveTab('animations')}
                                className={`text-sm font-bold pb-1 border-b-2 transition-all ${activeTab === 'animations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
                            >
                                Animaciones (Three.js)
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all bg-indigo-600 text-white font-bold text-sm">
                            <Plus size={18} />
                            <span>{uploading ? 'Subiendo...' : 'Añadir Nuevo'}</span>
                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                        </label>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Grid de Medios - Estilo Dashboard */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === 'animations' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[
                                { id: 'antigravity-particles', title: 'Antigravity Particles', description: 'Efecto de partículas que siguen el cursor' },
                                { id: 'starfield', title: 'Starfield', description: 'Viaje a través de las estrellas' },
                                { id: 'wave-mesh', title: 'Wave Mesh', description: 'Malla ondulante 3D' }
                            ].map(anim => (
                                <div
                                    key={anim.id}
                                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
                                    onClick={() => onSelect({ type: 'animation', id: anim.id, url: anim.id, title: anim.title })}
                                >
                                    <div className="aspect-video bg-indigo-900 rounded-lg mb-3 flex items-center justify-center">
                                        <Sparkles className="text-indigo-300" size={32} />
                                    </div>
                                    <div className="font-bold text-sm text-gray-800">{anim.title}</div>
                                    <div className="text-[10px] text-gray-500 mt-1">{anim.description}</div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
                            <p className="font-medium">Cargando medios...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-gray-700">No hay archivos multimedia</h3>
                            <p className="text-sm">Sube imágenes para usarlas en tu diseño.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredFiles.map(file => (
                                <div
                                    key={file.id}
                                    className="tarjetas-dashboard bg-white rounded-xl border border-gray-200 overflow-hidden group relative cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all"
                                    onClick={() => onSelect(file)}
                                >
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                        {file.type?.includes('image') && file.url ? (
                                            <img src={file.url} alt={file.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            getIconForType(file.type)
                                        )}

                                        {/* Overlay de Selección */}
                                        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                            <div className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-md">
                                                Insertar Medio
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-gray-100">
                                        <div className="font-bold text-[11px] text-gray-800 truncate" title={file.title}>{file.title}</div>
                                        <div className="flex justify-between mt-1 text-[9px] text-gray-400 font-bold uppercase">
                                            <span>{formatSize(file.size)}</span>
                                            <span>{(file.filename || file.url || '').split('.').pop()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
