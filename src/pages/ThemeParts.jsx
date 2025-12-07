import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Edit, Layout } from 'lucide-react';

export default function ThemeParts() {
    const navigate = useNavigate();

    const parts = [
        {
            id: 'header',
            title: 'Header',
            description: 'Cabecera del sitio (logo, menú, botones)',
            icon: Layout
        },
        {
            id: 'footer',
            title: 'Footer',
            description: 'Pie de página (copyright, links, redes sociales)',
            icon: Layout
        }
    ];

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <h1 className="heading-1">Partes del Tema</h1>
                <p className="text-body">Edita las secciones globales del sitio (header, footer, etc.)</p>
            </div>

            <div className="grid grid-2 gap-lg">
                {parts.map(part => {
                    const Icon = part.icon;
                    return (
                        <div key={part.id} className="card">
                            <div className="flex items-start gap-md mb-md">
                                <div className="p-sm bg-primary-light rounded">
                                    <Icon size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="heading-3 mb-xs">{part.title}</h3>
                                    <p className="text-sm text-secondary">{part.description}</p>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/editor/theme-parts/${part.id}`)}
                            >
                                <Edit size={16} className="mr-2" />
                                Editar {part.title}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="card mt-xl bg-blue-50 border-blue-200">
                <h4 className="heading-4 mb-sm">ℹ️ Sobre las Partes del Tema</h4>
                <p className="text-sm text-secondary mb-sm">
                    Las partes del tema son secciones globales que aparecen en todas las páginas del sitio.
                </p>
                <ul className="text-sm text-secondary list-disc ml-lg">
                    <li><strong>Header</strong>: Se muestra en la parte superior de todas las páginas</li>
                    <li><strong>Footer</strong>: Se muestra en la parte inferior de todas las páginas</li>
                </ul>
                <p className="text-sm text-secondary mt-sm">
                    Los cambios que hagas aquí se aplicarán automáticamente a todo el sitio.
                </p>
            </div>
        </div>
    );
}
