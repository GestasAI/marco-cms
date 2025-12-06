import { useState, useEffect } from 'react';
import acideService from '../services/acideService';

/**
 * Hook para gestionar páginas
 * USA ACIDE LOCAL
 */
export function usePages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            setLoading(true);
            const results = await acideService.query('pages', {}, {
                sort: { title: 'asc' }
            });
            setPages(results);
        } catch (error) {
            console.error('Error loading pages:', error);
            setPages([]);
        } finally {
            setLoading(false);
        }
    };

    const createPage = async (pageData) => {
        try {
            const created = await acideService.create('pages', pageData);
            await loadPages();
            return created;
        } catch (error) {
            console.error('Error creating page:', error);
            throw error;
        }
    };

    const updatePage = async (id, updates) => {
        try {
            const updated = await acideService.update('pages', id, updates);
            await loadPages();
            return updated;
        } catch (error) {
            console.error('Error updating page:', error);
            throw error;
        }
    };

    const deletePage = async (id) => {
        try {
            await acideService.delete('pages', id);
            await loadPages();
            return true;
        } catch (error) {
            console.error('Error deleting page:', error);
            throw error;
        }
    };

    return {
        pages,
        loading,
        createPage,
        updatePage,
        deletePage,
        reload: loadPages
    };
}
