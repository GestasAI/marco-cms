import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { acideService } from '../../acide/acideService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Search, Plus, Edit, Trash2, FilePlus } from 'lucide-react';

/**
 * 🛠️ DataManager - Componente Reutilizable
 * Gestiona Listado, Búsqueda, Estado Vacío y Acciones para cualquier colección.
 * 
 * @param {string} collection - Nombre de la colección ACIDE (ej: 'posts', 'products')
 * @param {string} title - Título plural (ej: 'Productos')
 * @param {string} singularTitle - Título singular (ej: 'Producto')
 * @param {string} basePath - Ruta base para navegación (ej: '/products')
 */
export default function DataManager({ collection, title, singularTitle, basePath }) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [collection]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await acideService.list(collection);
            setItems(data || []);
        } catch (error) {
            console.error(`Error loading ${collection}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de eliminar este ${singularTitle.toLowerCase()}?`)) return;
        try {
            await acideService.delete(collection, id);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error al eliminar.");
        }
    };

    const filteredItems = items.filter(item => {
        const name = item.title || item.name || item.id || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleCreate = async () => {
        try {
            // Create empty document first
            const newDoc = {
                id: `${collection.slice(0, -1)}-${Date.now()}`,
                title: `Nuevo ${singularTitle}`,
                content: '',
                created_at: new Date().toISOString(),
                author: 'Admin'
            };

            await acideService.create(collection, newDoc);
            navigate(`/editor/${collection}/${newDoc.id}`);
        } catch (error) {
            console.error('Error creating document:', error);
            alert('Error al crear el documento');
        }
    };

    const handleEdit = (id) => {
        navigate(`/editor/${collection}/${id}`);
    };

    if (loading) return <div className="p-xl text-center">Cargando datos...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex-between mb-lg">
                <div>
                    <h1 className="heading-2">{title}</h1>
                    <p className="text-secondary">Gestiona tus {title.toLowerCase()}</p>
                </div>
                {items.length > 0 && (
                    <Button variant="primary" onClick={handleCreate} icon={Plus}>
                        Añadir {singularTitle}
                    </Button>
                )}
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
                <Card className="text-center p-xl flex-column items-center gap-md">
                    <div className="p-lg rounded-full bg-gray-50 text-gray-400 mb-sm">
                        <FilePlus size={48} />
                    </div>
                    <h3 className="heading-3">No hay {title.toLowerCase()} creados</h3>
                    <p className="text-secondary mb-md">Comienza creando tu primer {singularTitle.toLowerCase()} para mostrar contenido.</p>
                    <Button variant="primary" size="lg" onClick={handleCreate}>
                        Crea tu primer {singularTitle}
                    </Button>
                </Card>
            ) : (
                <>
                    {/* Search & Toolbar */}
                    <div className="mb-lg">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder={`Buscar ${title.toLowerCase()} por nombre...`}
                                className="form-input pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Data List (Table-like Grid) */}
                    <div className="dashboard-card p-0 overflow-hidden">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>ID / Nombre</th>
                                    <th>Creador</th>
                                    <th>Fecha</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-lg text-center text-secondary">
                                            No se encontraron resultados para "{searchTerm}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="font-bold">{item.title || item.name || item.id}</div>
                                                <div className="text-xs text-secondary font-mono">{item.id}</div>
                                            </td>
                                            <td className="text-sm">
                                                {item.author || item.creator || 'Sistema'}
                                            </td>
                                            <td className="text-sm text-secondary">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-sm">
                                                    <button
                                                        onClick={() => handleEdit(item.id)}
                                                        className="p-sm text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-sm text-red-500 hover:bg-red-50 rounded"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
