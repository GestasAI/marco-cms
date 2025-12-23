import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadPageData } from './PageResolver/pageLoader';
import { applySEOMetadata } from './PageResolver/seoManager';
import { renderPageSection } from './PageResolver/ElementDispatcher';

export default function PageResolver() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar datos de la página
    useEffect(() => {
        async function fetchPage() {
            setLoading(true);
            try {
                const data = await loadPageData(slug);
                if (data) {
                    setPage(data);
                } else {
                    setError('404: Página no encontrada');
                }
            } catch (err) {
                console.error('Error al resolver página:', err);
                setError('Error interno al cargar la página');
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [slug]);

    // Aplicar SEO cuando la página cambia
    useEffect(() => {
        if (page) {
            applySEOMetadata(page);
        }
    }, [page]);

    // Renderizado de estados de carga y error
    if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!page) return <div className="h-screen flex items-center justify-center">Sin contenido</div>;

    // Renderizado de fallback si no hay estructura 'page'
    if (!page.page) {
        return (
            <>
                <link rel="stylesheet" href="/themes/gestasai-default/theme.css" />
                <div className="container py-xl">
                    <h1 className="heading-1">{page.title || 'Sin título'}</h1>
                    <div className="text-body">{page.content || 'Sin contenido'}</div>
                </div>
            </>
        );
    }

    // Renderizado principal
    return (
        <>
            <link rel="stylesheet" href={`/themes/${page.theme || 'gestasai-default'}/theme.css`} />

            {/* Renderizar Secciones (Header, Content, Footer) */}
            {page.page && Array.isArray(page.page.sections) ? (
                page.page.sections.map((section, index) => renderPageSection(section, index, page))
            ) : (
                // Fallback por si la estructura es antigua (page como array directo)
                Array.isArray(page.page) ? (
                    page.page.map((section, index) => renderPageSection(section, index, page))
                ) : (
                    <div className="container py-xl text-center">
                        <p className="text-red-500">Error: Estructura de página no válida</p>
                    </div>
                )
            )}
        </>
    );
}
