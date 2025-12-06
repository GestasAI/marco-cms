import { Type, AlignLeft, Image, Square, Minus, Grid, Layout } from 'lucide-react';
import './BlockLibrary.css';

/**
 * BlockLibrary - Biblioteca de bloques disponibles
 * Muestra todos los bloques que se pueden agregar
 */
export default function BlockLibrary({ onAddBlock }) {
    const blockCategories = [
        {
            name: 'Contenido',
            blocks: [
                {
                    type: 'heading',
                    name: 'Título',
                    icon: Type,
                    description: 'Encabezado H1-H6'
                },
                {
                    type: 'paragraph',
                    name: 'Párrafo',
                    icon: AlignLeft,
                    description: 'Texto normal'
                },
                {
                    type: 'image',
                    name: 'Imagen',
                    icon: Image,
                    description: 'Imagen responsive'
                },
                {
                    type: 'button',
                    name: 'Botón',
                    icon: Square,
                    description: 'Botón de acción'
                }
            ]
        },
        {
            name: 'Layout',
            blocks: [
                {
                    type: 'spacer',
                    name: 'Espaciador',
                    icon: Minus,
                    description: 'Espacio vertical'
                },
                {
                    type: 'columns',
                    name: 'Columnas',
                    icon: Grid,
                    description: 'Layout de columnas'
                },
                {
                    type: 'container',
                    name: 'Contenedor',
                    icon: Layout,
                    description: 'Contenedor de bloques'
                }
            ]
        }
    ];

    return (
        <div className="block-library">
            <div className="library-header">
                <h3>Bloques</h3>
            </div>

            <div className="library-content">
                {blockCategories.map((category, index) => (
                    <div key={index} className="block-category">
                        <h4 className="category-title">{category.name}</h4>
                        <div className="category-blocks">
                            {category.blocks.map((block) => (
                                <button
                                    key={block.type}
                                    className="block-item"
                                    onClick={() => onAddBlock(block.type)}
                                    title={block.description}
                                >
                                    <block.icon size={20} className="block-icon" />
                                    <span className="block-name">{block.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
