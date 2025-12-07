import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';

/**
 * Toolbar del editor con botones de acción
 */
export function EditorToolbar({ document, hasChanges, saving, onBack, onSave, onPreview }) {
    return (
        <div className="editor-toolbar">
            <div className="flex items-center gap-md">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft size={18} className="mr-2" />
                </Button>
                <span className="font-semibold">{document?.title || 'Sin título'}</span>
                {hasChanges && <span className="text-xs text-orange-600">● Sin guardar</span>}
            </div>
            <div className="flex items-center gap-sm">
                {document?.slug && (
                    <Button variant="ghost" onClick={onPreview}>
                        <Eye size={18} />
                    </Button>
                )}
                <Button variant="primary" onClick={onSave} disabled={saving || !hasChanges}>
                    {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </div>
    );
}
