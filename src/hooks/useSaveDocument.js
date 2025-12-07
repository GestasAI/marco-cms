import { useState } from 'react';
import { acideService } from '../acide/acideService';

/**
 * Hook para guardar documentos en ACIDE o theme parts
 */
export function useSaveDocument() {
    const [saving, setSaving] = useState(false);

    const saveDocument = async (collection, id, document, pageData, contentSection) => {
        setSaving(true);

        try {
            // THEME PARTS (header, footer)
            if (collection === 'theme-parts') {
                const partData = {
                    blocks: contentSection.content
                };

                console.log('💾 Guardando theme part:', id);
                await acideService.saveThemePart('gestasai-default', id, partData);

                alert('✅ Theme part guardado exitosamente');
                return { success: true };
            }

            // PAGES / POSTS / PRODUCTS etc.
            const updatedSections = pageData.sections.map(s =>
                s.section === 'content' ? contentSection : s
            );

            const updatedPageData = {
                ...pageData,
                sections: updatedSections
            };

            const dataToSave = {
                ...document,
                page: updatedPageData,
                updated_at: new Date().toISOString()
            };

            console.log('💾 Guardando en ACIDE:');
            console.log('  Collection:', collection);
            console.log('  ID:', id);
            console.log('  Data size:', JSON.stringify(dataToSave).length, 'bytes');

            const result = await acideService.update(collection, id, dataToSave);
            console.log('✅ Respuesta ACIDE:', result);

            alert('✅ Cambios guardados exitosamente');
            return { success: true, data: dataToSave, updatedPageData };
        } catch (err) {
            console.error('❌ Error guardando:', err);
            alert('❌ Error al guardar: ' + err.message);
            return { success: false, error: err };
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        saveDocument
    };
}
