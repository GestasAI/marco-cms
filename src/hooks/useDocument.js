import { useState, useEffect } from 'react';
import { acideService } from '../acide/acideService';

/**
 * Hook para cargar y gestionar documentos (pages, posts, theme-parts)
 */
export function useDocument(collection, id) {
    const [document, setDocument] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [contentSection, setContentSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDocument();
    }, [collection, id]);

    const loadDocument = async () => {
        try {
            setLoading(true);
            setError(null);

            // THEME PARTS (header, footer)
            if (collection === 'theme-parts') {
                const response = await fetch(`/themes/gestasai-default/parts/${id}.json`);
                if (response.ok) {
                    const partData = await response.json();
                    setDocument({ id, title: `Editando: ${id}`, type: 'theme-part' });
                    setPageData({ sections: partData.blocks || [] });
                    setContentSection({
                        section: id,
                        id: `${id}-section`,
                        class: id,
                        content: partData.blocks || []
                    });
                } else {
                    setError(`No se pudo cargar: ${id}`);
                }
                setLoading(false);
                return;
            }

            // PAGES / POSTS / PRODUCTS etc.
            const docData = await acideService.get(collection, id);
            setDocument(docData);

            if (docData.page) {
                setPageData(docData.page);
                const sections = docData.page.sections || [];

                // Standard: Look for section: "content"
                let content = sections.find(s => s.section === 'content');

                // Fallback 1: Look for id: "content"
                if (!content) {
                    content = sections.find(s => s.id === 'content');
                }

                // Fallback 2: Find first section that isn't header or footer
                if (!content && sections.length > 0) {
                    content = sections.find(s =>
                        s.section !== 'header' && s.id !== 'header' &&
                        s.section !== 'footer' && s.id !== 'footer'
                    );
                }

                // Fallback 3: Just take the first section
                if (!content && sections.length > 0) {
                    content = sections[0];
                }

                setContentSection(content || null);

                console.log('📄 Documento cargado:', {
                    id: docData.id,
                    hasPage: !!docData.page,
                    sectionsCount: sections.length,
                    foundContent: !!content,
                    contentId: content?.id
                });
            } else {
                setPageData({ id: `page-${id}-0001`, class: 'body', sections: [] });
                setContentSection(null);
            }
        } catch (err) {
            console.error('Error cargando documento:', err);
            setError('Error al cargar el documento: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        document,
        setDocument,
        pageData,
        setPageData,
        contentSection,
        setContentSection,
        loading,
        error,
        reload: loadDocument
    };
}
