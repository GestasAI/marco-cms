import { useSEO } from '../../hooks/useSEO';
import { useStructuredData, SchemaGenerators } from '../../hooks/useStructuredData';
import './FeaturedSnippet.css';

/**
 * FeaturedSnippet - Componente optimizado para Featured Snippets
 * Diseñado para capturar la "posición cero" en Google
 * 
 * Tipos soportados:
 * - paragraph: Respuesta directa
 * - list: Lista ordenada/desordenada
 * - table: Tabla de datos
 * - definition: Definición de término
 */
export default function FeaturedSnippet({ type = 'paragraph', data, seoData }) {
    // SEO automático
    useSEO(seoData);

    // Datos estructurados
    useStructuredData(
        generateSchemaForSnippet(type, data),
        `featured-snippet-${type}`
    );

    return (
        <div className="featured-snippet" data-snippet-type={type}>
            {type === 'paragraph' && <ParagraphSnippet data={data} />}
            {type === 'list' && <ListSnippet data={data} />}
            {type === 'table' && <TableSnippet data={data} />}
            {type === 'definition' && <DefinitionSnippet data={data} />}
        </div>
    );
}

/**
 * Snippet tipo párrafo - Respuesta directa
 */
function ParagraphSnippet({ data }) {
    return (
        <div className="snippet-paragraph">
            <h2 className="snippet-question">{data.question}</h2>
            <p className="snippet-answer">{data.answer}</p>
            {data.details && (
                <div className="snippet-details">
                    {data.details}
                </div>
            )}
        </div>
    );
}

/**
 * Snippet tipo lista
 */
function ListSnippet({ data }) {
    const ListTag = data.ordered ? 'ol' : 'ul';

    return (
        <div className="snippet-list">
            <h2 className="snippet-question">{data.question}</h2>
            <ListTag className="snippet-items">
                {data.items.map((item, index) => (
                    <li key={index} className="snippet-item">
                        {typeof item === 'string' ? item : (
                            <>
                                <strong>{item.title}</strong>
                                {item.description && <p>{item.description}</p>}
                            </>
                        )}
                    </li>
                ))}
            </ListTag>
        </div>
    );
}

/**
 * Snippet tipo tabla
 */
function TableSnippet({ data }) {
    return (
        <div className="snippet-table">
            <h2 className="snippet-question">{data.question}</h2>
            <div className="table-wrapper">
                <table className="snippet-data-table">
                    {data.headers && (
                        <thead>
                            <tr>
                                {data.headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {data.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/**
 * Snippet tipo definición
 */
function DefinitionSnippet({ data }) {
    return (
        <div className="snippet-definition">
            <h2 className="snippet-term">{data.term}</h2>
            <p className="snippet-definition-text">{data.definition}</p>
            {data.examples && (
                <div className="snippet-examples">
                    <h3>Ejemplos:</h3>
                    <ul>
                        {data.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * Genera Schema.org apropiado según el tipo de snippet
 */
function generateSchemaForSnippet(type, data) {
    switch (type) {
        case 'paragraph':
        case 'definition':
            return {
                '@context': 'https://schema.org',
                '@type': 'Question',
                name: data.question || data.term,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: data.answer || data.definition
                }
            };

        case 'list':
            return {
                '@context': 'https://schema.org',
                '@type': 'HowTo',
                name: data.question,
                step: data.items.map((item, index) => ({
                    '@type': 'HowToStep',
                    position: index + 1,
                    name: typeof item === 'string' ? item : item.title,
                    text: typeof item === 'string' ? item : item.description
                }))
            };

        case 'table':
            return {
                '@context': 'https://schema.org',
                '@type': 'Table',
                about: data.question
            };

        default:
            return null;
    }
}
