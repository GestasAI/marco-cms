import React, { useState, useEffect } from 'react';
import { acideService } from '../acide/acideService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Upload, Trash2, Image as ImageIcon, FileText, Film, Edit } from 'lucide-react';

export default function Media() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            setLoading(true);
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

    const handleUpload = () => {
        document.getElementById('media-upload-input').click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const uploadedFile = await acideService.upload(file);
            setFiles(prev => [uploadedFile, ...prev]);
        } catch (error) {
            console.error(error);
            alert(`Error al subir archivo: ${error.message}`);
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este archivo permanentemente?")) return;
        try {
            await acideService.delete('media', id);
            setFiles(files.filter(f => f.id !== id));
        } catch (error) {
            console.error(error);
            alert('Error al eliminar archivo');
        }
    };

    const handleRename = async (id, currentTitle) => {
        const newTitle = prompt("Nuevo nombre (título) para el archivo:", currentTitle);
        if (!newTitle || newTitle === currentTitle) return;

        try {
            // Optimistic update
            setFiles(files.map(f => f.id === id ? { ...f, title: newTitle } : f));

            // Backend update
            await acideService.update('media', id, { title: newTitle });
        } catch (error) {
            console.error(error);
            alert('Error al renombrar');
            loadMedia(); // Revert on fail
        }
    };

    const getIconForType = (type) => {
        if (type?.includes('image')) return <ImageIcon size={24} className="text-purple-500" />;
        if (type?.includes('video')) return <Film size={24} className="text-red-500" />;
        return <FileText size={24} className="text-blue-500" />;
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div>
            <div className="flex-between mb-xl">
                <div>
                    <h1 className="heading-2">Biblioteca de Medios</h1>
                    <p className="text-secondary">Gestiona imágenes y documentos de tu sitio.</p>
                </div>
                <Button variant="primary" onClick={handleUpload}>
                    <Upload size={18} className="mr-2" />
                    Añadir Nuevo
                </Button>
                {/* Hidden Input using inline style to ensure invisibility */}
                <input
                    type="file"
                    id="media-upload-input"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            {loading && files.length === 0 ? (
                <div className="p-xl text-center">Cargando medios...</div>
            ) : files.length === 0 ? (
                <Card className="text-center p-xl flex-column items-center gap-md">
                    <div className="p-lg rounded-full bg-gray-50 text-gray-400 mb-sm">
                        <ImageIcon size={48} />
                    </div>
                    <h3 className="heading-3">No hay archivos multimedia</h3>
                    <p className="text-secondary mb-md">Sube imágenes para usarlas en tus posts y páginas.</p>
                    <Button variant="primary" onClick={handleUpload}>
                        Subir Archivos
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-4 gap-md">
                    {files.map(file => (
                        <div key={file.id} className="dashboard-card p-0 overflow-hidden group relative">
                            <div className="aspect-square bg-gray-100 flex-center relative">
                                {file.type?.includes('image') && file.url ? (
                                    <img src={file.url} alt={file.title} className="w-full h-full object-cover" />
                                ) : (
                                    getIconForType(file.type)
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex-center gap-sm">
                                    <button
                                        onClick={() => handleRename(file.id, file.title)}
                                        className="p-sm bg-white text-blue-600 rounded-full hover:bg-blue-50 shadow-md transform hover:scale-110 transition-transform"
                                        title="Renombrar (SEO)"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="p-sm bg-white text-red-500 rounded-full hover:bg-red-50 shadow-md transform hover:scale-110 transition-transform"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-sm text-xs border-t border-gray-100 bg-white">
                                <div className="font-bold truncate text-gray-800" title={file.title}>{file.title}</div>
                                <div className="flex-between mt-1 text-secondary">
                                    <span>{formatSize(file.size)}</span>
                                    <span className="uppercase text-[10px]">{file.filename.split('.').pop()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
