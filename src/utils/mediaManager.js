/**
 * Media Manager - Sistema de gestión de medios
 * Maneja uploads, biblioteca y referencias de archivos
 */

export class MediaManager {
    constructor() {
        this.mediaBasePath = '/media';
        this.imagesPath = `${this.mediaBasePath}/images`;
        this.videosPath = `${this.mediaBasePath}/videos`;
    }

    /**
     * Subir imagen
     */
    async uploadImage(file) {
        try {
            // Generar nombre único
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}-${safeName}`;
            const filePath = `${this.imagesPath}/${fileName}`;

            // Convertir a Base64 temporalmente (en producción usar FormData)
            const base64 = await this.fileToBase64(file);

            // En producción, aquí harías:
            // const formData = new FormData();
            // formData.append('file', file);
            // const response = await fetch('/api/media/upload', {
            //     method: 'POST',
            //     body: formData
            // });

            // Crear entrada en la biblioteca de medios
            const mediaEntry = {
                id: `media-${timestamp}`,
                type: 'image',
                fileName: fileName,
                originalName: file.name,
                url: filePath,
                base64: base64, // Temporal, en producción no se guarda
                size: file.size,
                mimeType: file.type,
                uploadedAt: new Date().toISOString()
            };

            // Guardar en localStorage temporalmente
            await this.saveToMediaLibrary(mediaEntry);

            return {
                success: true,
                media: mediaEntry
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Subir video
     */
    async uploadVideo(file) {
        try {
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}-${safeName}`;
            const filePath = `${this.videosPath}/${fileName}`;

            const base64 = await this.fileToBase64(file);

            const mediaEntry = {
                id: `media-${timestamp}`,
                type: 'video',
                fileName: fileName,
                originalName: file.name,
                url: filePath,
                base64: base64,
                size: file.size,
                mimeType: file.type,
                uploadedAt: new Date().toISOString()
            };

            await this.saveToMediaLibrary(mediaEntry);

            return {
                success: true,
                media: mediaEntry
            };
        } catch (error) {
            console.error('Error uploading video:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtener biblioteca de medios
     */
    async getMediaLibrary() {
        try {
            const library = localStorage.getItem('marco-cms-media-library');
            return library ? JSON.parse(library) : [];
        } catch (error) {
            console.error('Error getting media library:', error);
            return [];
        }
    }

    /**
     * Guardar en biblioteca
     */
    async saveToMediaLibrary(mediaEntry) {
        try {
            const library = await this.getMediaLibrary();
            library.push(mediaEntry);
            localStorage.setItem('marco-cms-media-library', JSON.stringify(library));
            return true;
        } catch (error) {
            console.error('Error saving to media library:', error);
            return false;
        }
    }

    /**
     * Obtener medio por ID
     */
    async getMediaById(id) {
        const library = await this.getMediaLibrary();
        return library.find(m => m.id === id);
    }

    /**
     * Eliminar medio
     */
    async deleteMedia(id) {
        try {
            const library = await this.getMediaLibrary();
            const filtered = library.filter(m => m.id !== id);
            localStorage.setItem('marco-cms-media-library', JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting media:', error);
            return false;
        }
    }

    /**
     * Convertir archivo a Base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Obtener URL del medio
     * Si tiene base64, lo devuelve, si no, devuelve la URL del archivo
     */
    getMediaUrl(media) {
        if (media.base64) {
            return media.base64;
        }
        return media.url;
    }
}

// Instancia singleton
export const mediaManager = new MediaManager();
