import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Botones para añadir bloques antes, después o dentro
 */
export function AddBlockTriggers({ onAddClick, showInside = false }) {
    return (
        <>
            <div className="add-block-trigger add-block-before">
                <button
                    className="add-block-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddClick('before');
                    }}
                    title="Añadir bloque antes"
                >
                    <Plus size={14} />
                </button>
            </div>

            <div className="add-block-trigger add-block-after">
                <button
                    className="add-block-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddClick('after');
                    }}
                    title="Añadir bloque después"
                >
                    <Plus size={14} />
                </button>
            </div>

            {showInside && (
                <div className="add-block-trigger add-block-inside">
                    <button
                        className="add-block-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddClick('inside');
                        }}
                        title="Añadir bloque dentro"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            )}
        </>
    );
}
