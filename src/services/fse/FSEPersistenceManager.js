import { acideService } from '../../acide/acideService';

/**
 * FSEPersistenceManager - El "Manejador Robusto" entre FSE y ACIDE.
 * 
 * Se encarga de:
 * 1. Orquestar el guardado de cualquier tipo de contenido (páginas, theme-parts, etc.)
 * 2. Detectar automáticamente el tema activo para evitar errores de hardcoding.
 * 3. Asegurar que la "magia" ocurra disparando el Rebuild de ACIDE cuando sea necesario.
 * 4. Centralizar la lógica de transformación de datos para que el FSE sea agnóstico.
 */
export const FSEPersistenceManager = {

    /**
     * Guarda un documento completo (página, post, etc.)
     */
    async savePage(collection, id, document, pageData, contentSection) {
        console.log(`🚀 [FSEManager] Iniciando guardado de página: ${collection}/${id}`);

        try {
            // 1. Preparar las secciones actualizadas
            const updatedSections = pageData.sections.map(s => {
                const isMatch = (s.id && s.id === contentSection.id) ||
                    (s.section && s.section === contentSection.section);
                return isMatch ? contentSection : s;
            });

            const updatedPageData = {
                ...pageData,
                sections: updatedSections
            };

            // 2. Construir el payload final
            const dataToSave = {
                ...document,
                page: updatedPageData,
                updated_at: new Date().toISOString()
            };

            // 3. Enviar a ACIDE
            const result = await acideService.update(collection, id, dataToSave);
            console.log('✅ [FSEManager] Datos guardados en ACIDE');

            // 4. Forzar Rebuild para asegurar que el HTML/CSS estático se genere
            // Nota: ACIDE.php ya lo hace para 'pages', pero lo forzamos para mayor robustez
            await this.triggerMagic();

            return { success: true, data: dataToSave, updatedPageData };
        } catch (error) {
            console.error('❌ [FSEManager] Error en savePage:', error);
            throw error;
        }
    },

    /**
     * Guarda una parte del tema (header, footer)
     */
    async saveThemePart(partId, content) {
        console.log(`🚀 [FSEManager] Iniciando guardado de theme-part: ${partId}`);

        try {
            // 1. Obtener el tema activo dinámicamente
            const themeId = await acideService.getActiveThemeId();

            const partData = {
                blocks: content
            };

            // 2. Guardar la parte
            await acideService.saveThemePart(themeId, partId, partData);
            console.log(`✅ [FSEManager] Part '${partId}' guardada en tema '${themeId}'`);

            // 3. Forzar Rebuild (CRÍTICO: ACIDE.php no lo hace automáticamente para parts)
            await this.triggerMagic();

            return { success: true };
        } catch (error) {
            console.error('❌ [FSEManager] Error en saveThemePart:', error);
            throw error;
        }
    },

    /**
     * Dispara la "magia" (Regeneración del sitio estático)
     */
    async triggerMagic() {
        console.log('✨ [FSEManager] Disparando magia (Build Site)...');
        try {
            await acideService.buildSite();
            console.log('🪄 [FSEManager] Magia completada con éxito');
        } catch (error) {
            console.warn('⚠️ [FSEManager] Error en la magia (Build), pero los datos se guardaron:', error);
        }
    }
};
