import { useState, useEffect, useCallback } from 'react';
import { acideService } from '../acide/acideService'; // Correcto

/**
 * 🪝 Hook para gestionar los posts del blog.
 *
 * Encapsula la lógica para:
 * - Cargar la lista de posts desde ACIDE.
 * - Crear un nuevo post.
 * - Eliminar un post existente.
 */

// Helper para generar un slug a partir de un título
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Reemplaza espacios con -
        .replace(/[^\w\-]+/g, '')       // Elimina caracteres no alfanuméricos
        .replace(/\-\-+/g, '-');        // Reemplaza múltiples - con uno solo
};

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const postList = await acideService.list('posts');
            console.log('[usePosts] Posts cargados:', postList);
            setPosts(postList);
        } catch (err) {
            console.error('[usePosts] Error al cargar posts:', err);
            setError('No se pudieron cargar los posts.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createPost = async (postData) => {
        const id = slugify(postData.title);
        const content = {
            id,
            ...postData,
            createdAt: new Date().toISOString(),
        };

        try {
            await acideService.create('posts', id, content);
            await loadPosts(); // Recargar la lista de posts
            return true;
        } catch (err) {
            console.error('[usePosts] Error al crear post:', err);
            setError('No se pudo crear el post.');
            return false;
        }
    };

    const deletePost = async (postId) => {
        // Lógica para eliminar...
    };

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    return { posts, isLoading, error, createPost, deletePost, loadPosts };
};