import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Film, FileText, Search, Upload } from 'lucide-react';
import { acideService } from '../../acide/acideService';

const MediaPicker = ({ isOpen, onClose, onSelect, type = 'all' }) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(type);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilter(type);
    }, [type]);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const list = await acideService.list('media');
            setMedia(list || []);
        } catch (error) {
            console.error("Error loading media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        try {
            setLoading(true);
            // 1. Physical upload
            const result = await acideService.upload(file);
            if (result && result.url) {
                // 2. ACIDE Registration
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

                // 3. Refresh and select
                await loadMedia();
                const newList = await acideService.list('media');
                const newItem = newList.find(m => m.url === result.url);
                if (newItem) onSelect(newItem);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error al subir archivo: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedia = media.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'image') return matchesSearch && item.type?.includes('image');
        if (filter === 'video') return matchesSearch && item.type?.includes('video');
        if (filter === 'document') return matchesSearch && (item.type?.includes('pdf') || item.type?.includes('document') || item.url.endsWith('.pdf'));
        return matchesSearch;
    });


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Biblioteca de Medios</h2>
                        <p className="text-sm text-gray-500">Selecciona un archivo para tu lección</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar archivos..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter('image')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Imágenes
                        </button>
                        <button
                            onClick={() => setFilter('video')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Videos
                        </button>
                        <button
                            onClick={() => setFilter('document')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'document' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Documentos
                        </button>
                    </div>
                </div>

                {/* Grid / Upload Area */}
                <div
                    className={`flex-1 overflow-y-auto p-6 custom-scrollbar-light transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-blue-50/50'); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-blue-50/50'); }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('bg-blue-50/50');
                        const file = e.dataTransfer.files[0];
                        if (file) handleUpload(file);
                    }}
                >
                    {loading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-blue-600 font-black text-sm animate-pulse">PROCESANDO Y REGISTRANDO...</p>
                        </div>
                    )}

                    {filteredMedia.length === 0 && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 border-4 border-dashed border-gray-100 rounded-3xl p-12">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <Upload size={40} className="text-gray-200" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-500">No hay archivos aquí</p>
                                <p className="text-xs">Arrastra un archivo aquí para subirlo instantáneamente</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredMedia.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => onSelect(item)}
                                    className="group cursor-pointer space-y-2"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-blue-500 transition-all relative shadow-sm">
                                        {item.type?.includes('image') ? (
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : item.type?.includes('video') ? (
                                            <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
                                                <Film size={32} />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                                                <FileText size={32} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-700 truncate px-1 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            id="media-upload"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleUpload(file);
                            }}
                        />
                        <button
                            onClick={() => document.getElementById('media-upload').click()}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            <Upload size={16} /> Subir Archivo
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaPicker;
