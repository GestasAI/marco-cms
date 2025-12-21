import React, { useState } from 'react';
import { acideService } from '../acide/acideService';
import { Download, Globe, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function BuildSite() {
    const [building, setBuilding] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleBuild = async () => {
        setBuilding(true);
        setError(null);
        setResults(null);

        try {
            const buildResults = await acideService.buildSite();
            setResults(buildResults);
        } catch (err) {
            setError(err.message);
        } finally {
            setBuilding(false);
        }
    };

    const handleGenerateSitemap = async () => {
        try {
            const result = await acideService.generateSitemap('https://gestasai.com');
            alert('Sitemap generado correctamente');
        } catch (err) {
            alert('Error al generar sitemap: ' + err.message);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <header className="mb-8">
                <h1 className="heading-2 mb-2">Generar Sitio Estático</h1>
                <p className="text-secondary">
                    Convierte tu sitio en HTML estático optimizado para producción
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="text-blue-600" size={32} />
                        <div>
                            <h3 className="font-bold text-lg">Sitio Estático</h3>
                            <p className="text-sm text-gray-500">HTML + CSS optimizado</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Genera archivos HTML estáticos con el tema activo, listos para desplegar en cualquier servidor web.
                    </p>
                    <button
                        onClick={handleBuild}
                        disabled={building}
                        className="btn btn-primary w-full"
                    >
                        {building ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                Generar Sitio
                            </>
                        )}
                    </button>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-green-600" size={32} />
                        <div>
                            <h3 className="font-bold text-lg">Sitemap XML</h3>
                            <p className="text-sm text-gray-500">SEO optimizado</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Genera sitemap.xml para mejorar el SEO y la indexación en buscadores.
                    </p>
                    <button
                        onClick={handleGenerateSitemap}
                        className="btn btn-secondary w-full"
                    >
                        <FileText size={18} />
                        Generar Sitemap
                    </button>
                </div>
            </div>

            {error && (
                <div className="card p-6 bg-red-50 border-red-200 mb-6">
                    <div className="flex items-center gap-3 text-red-700">
                        <AlertCircle size={24} />
                        <div>
                            <h4 className="font-bold">Error</h4>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {results && (
                <div className="card p-6 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 text-green-700 mb-4">
                        <CheckCircle size={24} />
                        <h4 className="font-bold">Sitio generado correctamente</h4>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h5 className="font-semibold mb-2 text-gray-700">Archivos generados:</h5>
                        <ul className="space-y-1">
                            {results.map((result, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <CheckCircle size={14} className="text-green-500" />
                                    {result}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-700">
                                <strong>📁 Ubicación:</strong> <code className="bg-blue-100 px-2 py-1 rounded">/public/dist/</code>
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                                Los archivos están listos para desplegar en producción
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 card p-6 bg-gray-50">
                <h3 className="font-bold mb-3">ℹ️ Información</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>✅ Se genera HTML estático del tema activo</li>
                    <li>✅ CSS inline para máxima velocidad</li>
                    <li>✅ Meta tags SEO optimizados</li>
                    <li>✅ Compatible con cualquier hosting</li>
                    <li>✅ Sin dependencias de JavaScript</li>
                </ul>
            </div>
        </div>
    );
}
