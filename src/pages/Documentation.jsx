import React from 'react';
import { Book, Code, Layout, Palette, ShieldCheck, Zap, Box, Type } from 'lucide-react';
import './Dashboard.css';

export default function Documentation() {
    const elements = ['heading', 'text', 'image', 'video', 'button', 'link', 'container', 'section', 'grid', 'card', 'nav', 'logo', 'search'];

    const cssClasses = [
        { name: 'container', desc: 'Contenedor centrado con ancho máximo.' },
        { name: 'grid, grid-2, grid-3, grid-4', desc: 'Sistemas de columnas automáticos.' },
        { name: 'card', desc: 'Contenedor con sombra y bordes redondeados.' },
        { name: 'btn, btn-primary, btn-outline', desc: 'Estilos para botones y enlaces.' },
        { name: 'heading-1...6', desc: 'Jerarquía tipográfica predefinida.' },
        { name: 'text-lead', desc: 'Texto destacado para introducciones.' },
        { name: 'section-free, section-premium', desc: 'Variantes de fondo para secciones.' }
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Documentación Técnica</h1>
                    <p className="dashboard-subtitle">Estándares de desarrollo para Marco CMS y Gestas AI</p>
                </div>
            </header>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-lg">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="heading-3">Estándar de Temas (v1.0)</h2>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-secondary mb-xl">
                            Este estándar garantiza que cualquier tema creado para Marco CMS sea 100% editable mediante el
                            <strong> Full Site Editor (FSE)</strong> y compatible con el motor de generación estática.
                        </p>

                        <div className="grid grid-1 md:grid-3 gap-xl mb-2xl">
                            <div className="p-xl bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-md text-primary">
                                    <Layout size={18} />
                                    <h4 className="font-bold">Estructura</h4>
                                </div>
                                <ul className="space-y-2 text-sm text-secondary">
                                    <li><strong>header</strong>: Bloque global superior.</li>
                                    <li><strong>content</strong>: Cuerpo dinámico.</li>
                                    <li><strong>footer</strong>: Bloque global inferior.</li>
                                </ul>
                            </div>

                            <div className="p-xl bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-md text-primary">
                                    <Code size={18} />
                                    <h4 className="font-bold">Diccionario</h4>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {elements.map(el => (
                                        <span key={el} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">
                                            {el}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-xl bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-md text-primary">
                                    <Zap size={18} />
                                    <h4 className="font-bold">FSE Ready</h4>
                                </div>
                                <p className="text-xs text-secondary">
                                    El motor mapea el JSON directamente a componentes React.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-1 md:grid-2 gap-xl mb-2xl">
                            <div>
                                <h3 className="heading-4 mb-md flex items-center gap-2">
                                    <Box size={20} className="text-primary" />
                                    Clases CSS Estándar
                                </h3>
                                <div className="space-y-3">
                                    {cssClasses.map(cls => (
                                        <div key={cls.name} className="p-md bg-white border border-gray-100 rounded-lg shadow-sm">
                                            <code className="text-primary font-bold block mb-1">{cls.name}</code>
                                            <p className="text-xs text-secondary">{cls.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="heading-4 mb-md flex items-center gap-2">
                                    <Type size={20} className="text-primary" />
                                    Ejemplo de Bloque
                                </h3>
                                <div className="bg-slate-900 text-slate-300 p-xl rounded-xl font-mono text-xs overflow-x-auto h-full">
                                    <div className="text-slate-500 mb-md">// Estructura JSON compatible</div>
                                    <pre>{JSON.stringify({
                                        element: "card",
                                        class: "card p-lg",
                                        content: [
                                            {
                                                element: "heading",
                                                tag: "h3",
                                                text: "Título de Tarjeta"
                                            },
                                            {
                                                element: "button",
                                                text: "Click aquí",
                                                class: "btn btn-primary"
                                            }
                                        ]
                                    }, null, 2)}</pre>
                                </div>
                            </div>
                        </div>

                        <div className="p-xl bg-blue-50 border border-blue-100 rounded-xl">
                            <div className="flex items-center gap-2 mb-sm text-blue-700">
                                <Palette size={18} />
                                <h4 className="font-bold">Sistema de Estilos Dinámicos</h4>
                            </div>
                            <p className="text-sm text-blue-800">
                                Marco CMS inyecta los cambios del usuario mediante el objeto <code>customStyles</code>.
                                Para una integración perfecta, utiliza variables CSS en tu <code>theme.css</code> que
                                puedan ser sobreescritas desde el panel de Ajustes del Tema.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
