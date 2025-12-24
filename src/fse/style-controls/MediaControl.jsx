import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Link, X } from 'lucide-react';
import { acideService } from '../../acide/acideService';
import { MediaLibraryModal } from '../components/MediaLibraryModal';

/**
 * MediaControl - Gestión de archivos para FSE
 * Permite subir archivos, seleccionar de la biblioteca centralizada o usar URL.
 */
export function MediaControl({
    label,
    value,
    onChange,
    type = 'image',
    altValue = '',
    onAltChange = null
}) {
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Subida directa desde el botón "Subir"
    const handleDirectUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Subir archivo físico
            const result = await acideService.upload(file);
            if (result && result.url) {
                // 2. Registrar en la biblioteca centralizada (como hace el dashboard)
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

                // 3. Aplicar al elemento actual
                onChange(newMediaEntry.url, newMediaEntry);
                if (onAltChange) onAltChange(newMediaEntry.title);
            }
        } catch (error) {
            alert("Error al subir archivo: " + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // Selección desde el modal de biblioteca
    const handleSelectFromLibrary = (media) => {
        onChange(media.url, media);
        if (onAltChange && media.title) onAltChange(media.title);
        setShowModal(false);
    };

    return (
        <div className="media-control-group mt-md">
            {label && <label className="form-label-compact mb-sm uppercase text-[10px] font-bold tracking-wider">{label}</label>}

            {/* 1. Preview */}
            <div className="media-preview-box mb-sm border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                {value ? (
                    <div className="relative group">
                        {type === 'image' ? (
                            <img src={value} alt="Preview" className="w-full h-32 object-cover" />
                        ) : (
                            <video src={value} className="w-full h-32 object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                className="bg-white text-gray-800 p-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors"
                                onClick={() => setShowModal(true)}
                                title="Cambiar desde biblioteca"
                            >
                                <ImageIcon size={14} />
                            </button>
                            <button
                                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                onClick={() => onChange('', null)}
                                title="Eliminar"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-32 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon size={32} strokeWidth={1} />
                        <span className="text-[10px] mt-2 font-medium">Sin archivo seleccionado</span>
                    </div>
                )}
            </div>

            {/* 2. Botones de Acción */}
            <div className="grid grid-cols-2 gap-2 mb-sm">
                <label className="btn-secondary flex items-center justify-center py-2 cursor-pointer bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all rounded-lg">
                    <Upload size={14} className="mr-2 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-700">{uploading ? '...' : 'Subir'}</span>
                    <input type="file" className="hidden" accept={type === 'image' ? 'image/*' : 'video/*'} onChange={handleDirectUpload} />
                </label>
                <button
                    className="btn-secondary flex items-center justify-center py-2 bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all rounded-lg"
                    onClick={() => setShowModal(true)}
                >
                    <ImageIcon size={14} className="mr-2 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-700">Medios</span>
                </button>
            </div>

            {/* 3. URL Input */}
            <div className="relative mb-sm">
                <input
                    type="text"
                    className="form-input-compact py-2 text-[11px] w-full border border-gray-200 rounded-lg px-3"
                    placeholder="URL externa..."
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value, null)}
                />
            </div>

            {/* 4. Alt Text */}
            {onAltChange && (
                <div className="mt-4">
                    <label className="form-label-compact mb-1 uppercase text-[10px] font-bold text-gray-500">Texto Alternativo (Alt)</label>
                    <input
                        type="text"
                        className="form-input-compact py-2 text-[11px] w-full border border-gray-200 rounded-lg px-3"
                        placeholder="Descripción para SEO"
                        value={altValue || ''}
                        onChange={(e) => onAltChange(e.target.value)}
                    />
                </div>
            )}

            {/* MODAL DE BIBLIOTECA */}
            {showModal && (
                <MediaLibraryModal
                    elementType={type}
                    onSelect={handleSelectFromLibrary}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
