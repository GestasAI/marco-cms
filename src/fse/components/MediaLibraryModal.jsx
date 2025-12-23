import React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

/**
 * Modal de Biblioteca de Medios compartido
 */
export function MediaLibraryModal({ mediaLibrary, loading, elementType, onSelect, onClose }) {
    return (
        <div className="block-selector-overlay" onClick={onClose}>
            <div className="block-selector-menu" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-lg">
                    <h4 className="heading-5">Biblioteca de Medios</h4>
                    <button className="action-icon-btn" onClick={onClose}><X size={20} /></button>
                </div>

                {loading ? (
                    <div className="text-center p-xl">Cargando medios...</div>
                ) : (
                    <div className="media-grid-library" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '12px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '4px'
                    }}>
                        {mediaLibrary.length === 0 ? (
                            <div className="col-span-full text-center p-xl text-gray-400">
                                No hay archivos en la biblioteca
                            </div>
                        ) : (
                            mediaLibrary.map((media) => (
                                <div
                                    key={media.id}
                                    className="media-item-card"
                                    style={{
                                        cursor: 'pointer',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        aspectRatio: '1'
                                    }}
                                    onClick={() => onSelect(media)}
                                >
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.url}
                                            alt={media.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: '#f8f9fa'
                                        }}>
                                            <ImageIcon size={32} color="#ccc" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-lg flex justify-end">
                    <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
