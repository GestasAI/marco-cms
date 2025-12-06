import { useStructuredData, SchemaGenerators } from '../../hooks/useStructuredData';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './FAQSnippet.css';

/**
 * FAQSnippet - Componente optimizado para FAQ Rich Snippets
 * Genera Schema.org FAQPage automáticamente
 * 
 * @param {Array} questions - Array de {question, answer}
 */
export default function FAQSnippet({ questions, title }) {
    // Generar Schema.org para FAQ
    useStructuredData(
        SchemaGenerators.faq(questions),
        'faq-schema'
    );

    return (
        <div className="faq-snippet">
            {title && <h2 className="faq-title">{title}</h2>}
            <div className="faq-list">
                {questions.map((item, index) => (
                    <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        defaultOpen={index === 0}
                    />
                ))}
            </div>
        </div>
    );
}

function FAQItem({ question, answer, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button
                className="faq-question"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span itemProp="name">{question}</span>
                <ChevronDown className={`faq-icon ${isOpen ? 'rotate' : ''}`} />
            </button>

            {isOpen && (
                <div className="faq-answer" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <div itemProp="text">{answer}</div>
                </div>
            )}
        </div>
    );
}
