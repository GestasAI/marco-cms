import { useState } from 'react';
import { FSEPersistenceManager } from '../services/fse/FSEPersistenceManager';

/**
 * Hook para guardar documentos en ACIDE o theme parts
 * Ahora utiliza el FSEPersistenceManager para mayor robustez y "magia" automática.
 */
export function useSaveDocument() {
    const [saving, setSaving] = useState(false);

    const saveDocument = async (collection, id, document, pageData, contentSection) => {
        setSaving(true);

        try {
            let result;

            // THEME PARTS (header, footer)
            if (collection === 'theme-parts') {
                result = await FSEPersistenceManager.saveThemePart(id, contentSection.content);
            } else {
                // PAGES / POSTS / PRODUCTS etc.
                result = await FSEPersistenceManager.savePage(collection, id, document, pageData, contentSection);
            }

            if (result.success) {
                // Opcional: Podríamos quitar el alert y usar una notificación más elegante
                // alert('✅ Cambios guardados y sitio regenerado');
                return result;
            }

            return { success: false, error: 'Error desconocido' };
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
