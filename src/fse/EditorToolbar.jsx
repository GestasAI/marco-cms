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
                    <Button variant="ghost" size="sm" onClick={onPreview} title="Vista previa">
                        <Eye size={16} />
                    </Button>
                )}
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onSave}
                    disabled={saving || !hasChanges}
                    className="btn-save-minimal"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                </Button>
            </div>
        </div>
    );
}
