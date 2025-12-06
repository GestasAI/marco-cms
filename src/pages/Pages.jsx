import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import acideService from '../services/acideService';
import { useThemeSettings } from '../hooks/useThemeSettings';

export default function Pages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            // Usamos acideService para consultar la colección 'pages'
            const data = await acideService.query('pages');
            setPages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex-between mb-lg">
                <div>
                    <h1 className="heading-2">Páginas</h1>
                    <p className="text-secondary">Gestiona el contenido estático del sitio</p>
                </div>
                <Button icon={Plus}>Nueva Página</Button>
            </div>

            <Card className="overflow-hidden">
                <div className="table-responsive">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                                <th className="p-md font-bold">Título</th>
                                <th className="p-md font-bold">Slug</th>
                                <th className="p-md font-bold">Estado</th>
                                <th className="p-md font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-md text-center text-secondary">Cargando...</td>
                                </tr>
                            ) : pages.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-md text-center text-secondary">No hay páginas creadas</td>
                                </tr>
                            ) : (
                                pages.map(page => (
                                    <tr key={page.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td className="p-md font-medium">{page.title}</td>
                                        <td className="p-md text-secondary">{page.slug}</td>
                                        <td className="p-md">
                                            <span className={`badge badge-${page.status === 'published' ? 'success' : 'warning'}`}>
                                                {page.status || 'draft'}
                                            </span>
                                        </td>
                                        <td className="p-md text-right">
                                            <div className="flex justify-end gap-xs">
                                                <Button variant="ghost" size="sm" icon={Eye} />
                                                <Button variant="ghost" size="sm" icon={Edit} />
                                                <Button variant="ghost" size="sm" icon={Trash2} style={{ color: '#ef4444' }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
