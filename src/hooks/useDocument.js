import { useState, useEffect } from 'react';
import { acideService } from '../acide/acideService';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook para cargar y gestionar documentos (pages, posts, theme-parts)
 */
export function useDocument(collection, id) {
    const { settings } = useTheme();
    const activeTheme = settings?.active_theme || 'gestasai-default';

    const [document, setDocument] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [contentSection, setContentSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDocument();
    }, [collection, id, activeTheme]);

    const loadDocument = async () => {
        try {
            setLoading(true);
            setError(null);

            // THEME PARTS (header, footer)
            if (collection === 'theme-parts') {
                const response = await fetch(`/themes/${activeTheme}/parts/${id}.json`);
                if (response.ok) {
                    const partData = await response.json();
                    const sectionObj = {
                        section: id,
                        id: `${id}-section`,
                        class: id,
                        content: partData.blocks || []
                    };
                    setDocument({ id, title: `Editando: ${id}`, type: 'theme-part' });
                    setPageData({ sections: [sectionObj] });
                    setContentSection(sectionObj);
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

                // Asegurar que todos los elementos tengan ID único y migrar estilos
                const ensureIds = (elements) => {
                    if (!elements || !Array.isArray(elements)) return elements;
                    return elements.map(el => {
                        const updated = { ...el };
                        if (!updated.id) {
                            updated.id = `${updated.element || 'el'}-${Math.random().toString(36).substr(2, 9)}`;
                        }

                        // Asegurar que customStyles sea un objeto y migrar kebab-case a camelCase
                        if (!updated.customStyles || Array.isArray(updated.customStyles)) {
                            updated.customStyles = {};
                        } else {
                            // Migrar propiedades kebab-case a camelCase
                            const migratedStyles = {};
                            Object.keys(updated.customStyles).forEach(key => {
                                // Si la key tiene guiones, convertir a camelCase
                                const camelKey = key.includes('-')
                                    ? key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                                    : key;
                                migratedStyles[camelKey] = updated.customStyles[key];
                            });
                            updated.customStyles = migratedStyles;
                        }

                        if (updated.content) {
                            updated.content = ensureIds(updated.content);
                        }
                        return updated;
                    });
                };

                const sectionsWithIds = sections.map(s => ({
                    ...s,
                    content: ensureIds(s.content)
                }));

                setPageData({ ...docData.page, sections: sectionsWithIds });

                // Standard: Look for section: "content"
                let content = sectionsWithIds.find(s => s.section === 'content');

                // Fallback 1: Look for id: "content"
                if (!content) {
                    content = sectionsWithIds.find(s => s.id === 'content');
                }

                // Fallback 2: Find first section that isn't header or footer
                if (!content && sectionsWithIds.length > 0) {
                    content = sectionsWithIds.find(s =>
                        s.section !== 'header' && s.id !== 'header' &&
                        s.section !== 'footer' && s.id !== 'footer'
                    );
                }

                // Fallback 3: Just take the first section
                if (!content && sectionsWithIds.length > 0) {
                    content = sectionsWithIds[0];
                }

                setContentSection(content || null);

                console.log('📄 Documento cargado (con IDs asegurados):', {
                    id: docData.id,
                    hasPage: !!docData.page,
                    sectionsCount: sectionsWithIds.length,
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
