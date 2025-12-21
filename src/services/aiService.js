/**
 * MARCO CMS - AI Service
 * Universal Compatibility Layer for Google Gemini / Gemma API
 * Includes Local Search, Vault (Cache) and RAG.
 */

import axios from 'axios';
import { acideService } from '../acide/acideService';

export const aiService = {

    /**
     * Local Semantic Search (Speed & Cost Optimization)
     */
    async localSearch(query, lessonData) {
        if (!lessonData) return null;
        const normalizedQuery = query.toLowerCase().trim();
        const { flashcards = [], quiz = [], knowledge_chunks = [] } = lessonData;

        console.log(`DEBUG: localSearch - Query: "${normalizedQuery}" | Cards: ${flashcards.length} | Quiz: ${quiz.length}`);

        // 1. Check Flashcards
        for (const card of flashcards) {
            const similarity = this._calculateSimilarity(normalizedQuery, card.question.toLowerCase());
            console.log(`DEBUG: Comparing with Card: "${card.question}" | Similarity: ${similarity.toFixed(2)}`);
            if (similarity >= 0.7) {
                return {
                    text: `**Respuesta rápida:** ${card.answer}\n\n*(Esta respuesta proviene de las tarjetas de estudio de la lección)*`,
                    type: 'local_match',
                    source: 'flashcard'
                };
            }
        }

        // 2. Check Quiz
        for (const q of quiz) {
            const similarity = this._calculateSimilarity(normalizedQuery, q.question.toLowerCase());
            console.log(`DEBUG: Comparing with Quiz: "${q.question}" | Similarity: ${similarity.toFixed(2)}`);
            if (similarity >= 0.7) {
                const correctOption = q.options[q.correct];
                return {
                    text: `**Respuesta de evaluación:** ${correctOption}\n\n${q.explanation}\n\n*(Esta respuesta proviene del cuestionario de la lección)*`,
                    type: 'local_match',
                    source: 'quiz'
                };
            }
        }

        // 3. Check Knowledge Chunks
        let bestChunk = null;
        let maxOverlap = 0;
        for (const chunk of knowledge_chunks) {
            const overlap = this._calculateOverlap(normalizedQuery, chunk.content.toLowerCase());
            if (overlap > maxOverlap) {
                maxOverlap = overlap;
                bestChunk = chunk;
            }
        }

        if (maxOverlap > 0.7) {
            return {
                text: `${bestChunk.content}\n\n*(Información extraída de: ${bestChunk.title})*`,
                type: 'local_match',
                source: 'knowledge_chunk'
            };
        }
        return null;
    },

    /**
     * Vault Search (Historical Gemini Responses)
     */
    async searchVault(query, lessonId) {
        if (!lessonId) return null;
        try {
            const normalizedQuery = query.toLowerCase().trim();
            const results = await acideService.query('academy_vault', {
                where: [['lesson_id', '==', lessonId]]
            });

            if (!results || results.length === 0) return null;

            for (const entry of results) {
                const similarity = this._calculateSimilarity(normalizedQuery, entry.query.toLowerCase());
                if (similarity > 0.92) { // High threshold for vault to ensure accuracy
                    return {
                        text: entry.response,
                        type: 'vault_match'
                    };
                }
            }
        } catch (e) {
            console.warn("Vault search failed", e);
        }
        return null;
    },

    /**
     * Save successful Gemini response to Vault
     */
    async saveToVault(query, response, lessonId) {
        if (!lessonId || !query || !response) return;

        // DO NOT SAVE negative or "I don't know" responses
        const negativePatterns = ['lo siento', 'no dispongo', 'no se encuentra', 'no puedo', 'no hay información', 'no indica'];
        if (negativePatterns.some(p => response.toLowerCase().includes(p))) {
            console.log("DEBUG: Skipping vault save for negative response.");
            return;
        }

        try {
            await acideService.create('academy_vault', {
                id: `v-${Date.now()}`,
                lesson_id: lessonId,
                query: query.trim(),
                response: response,
                created_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Failed to save to vault", e);
        }
    },

    /**
     * Gemini API Integration with Universal Compatibility
     */
    async askGemini(query, lessonData, chatHistory = [], retryCount = 0) {
        const { id: lessonId, ai_config = {}, knowledge_chunks = [], video_description = "" } = lessonData;

        // 1. Load Settings
        let apiKey = '';
        let modelId = 'gemini-1.5-flash'; // Default
        try {
            const settings = await acideService.get('academy_settings', 'current');
            if (settings) {
                apiKey = settings.gemini_api_key;
                if (settings.gemini_model) modelId = settings.gemini_model;
            }
        } catch (e) {
            console.warn("Could not load settings.");
        }

        if (!apiKey) throw new Error("API Key missing");

        // Build Context
        const contextFromChunks = knowledge_chunks.map(c => `[${c.title}]: ${c.content}`).join('\n\n');

        // STRENGTHENED SYSTEM PROMPT (Restrictive Tutor Mode)
        const systemPrompt = `
            ${ai_config.system_prompt || 'Eres un tutor experto y motivador.'}
            
            REGLAS CRÍTICAS DE COMPORTAMIENTO:
            1. Eres un tutor especializado EXCLUSIVAMENTE en el contenido de esta lección.
            2. Si el usuario pregunta algo fuera del tema, responde educadamente que tu conocimiento en esta sesión se limita al temario.
            3. Tu fuente de verdad es el CONTEXTO y los FRAGMENTOS RAG proporcionados abajo.
            4. Si la información no está en el contexto, no inventes.
            5. Mantén un tono profesional, amable y enfocado al aprendizaje.
            
            CONTEXTO DE LA LECCIÓN:
            ${ai_config.knowledge_base || ''}
            
            FRAGMENTOS DE CONOCIMIENTO (RAG):
            ${contextFromChunks}
            
            RESUMEN/DESCRIPCIÓN:
            ${lessonData.summary || ''}
            ${video_description}
        `;

        // 2. Prepare Payload
        const contents = this._formatHistory(chatHistory, query);

        const payload = {
            contents,
            system_instruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
        };

        try {
            const result = await this._executeCall(modelId, apiKey, payload);

            // SAVE TO VAULT if successful and positive
            if (result && result.text) {
                await this.saveToVault(query, result.text, lessonId);
            }

            return result;
        } catch (error) {
            const status = error.response?.status;
            const errorMsg = error.response?.data?.error?.message || "";

            if (status === 400 && errorMsg.includes("Developer instruction")) {
                const fallbackPayload = {
                    contents: this._formatHistory(chatHistory, `INSTRUCCIONES DE SISTEMA:\n${systemPrompt}\n\nPREGUNTA DEL USUARIO:\n${query}`),
                    generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
                };
                const result = await this._executeCall(modelId, apiKey, fallbackPayload);
                if (result && result.text) await this.saveToVault(query, result.text, lessonId);
                return result;
            }

            if (status === 404 && retryCount === 0) {
                const availableModels = await this.listModels(apiKey);
                if (availableModels.length > 0) {
                    const newModel = availableModels.find(m => m.id.includes('flash')) || availableModels[0];
                    return await this.askGemini(query, lessonData, chatHistory, 1);
                }
            }

            if (status === 429 && retryCount === 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                return await this.askGemini(query, lessonData, chatHistory, 1);
            }

            if (status === 429) throw new Error("Límite de cuota excedido. Por favor, espera un minuto.");
            throw error;
        }
    },

    async _executeCall(modelId, apiKey, payload) {
        const fullModelId = modelId.startsWith('models/') ? modelId : `models/${modelId}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/${fullModelId}:generateContent?key=${apiKey}`;
        const response = await axios.post(url, payload);
        if (response.data.candidates && response.data.candidates[0].content) {
            return {
                text: response.data.candidates[0].content.parts[0].text,
                type: 'gemini_response'
            };
        }
        throw new Error("Empty response from AI");
    },

    async listModels(apiKey) {
        if (!apiKey) return [];
        try {
            const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            return response.data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .map(m => ({
                    id: m.name.replace('models/', ''),
                    name: m.displayName,
                    description: m.description
                }));
        } catch (error) {
            return [];
        }
    },

    async testConnection(apiKey, modelId) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
            const response = await axios.post(url, {
                contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
            });
            return !!response.data.candidates;
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 400) {
                const models = await this.listModels(apiKey);
                if (models.length > 0) return this.testConnection(apiKey, models[0].id);
            }
            return false;
        }
    },

    /**
     * Orchestrator (Smart Routing)
     */
    async getResponse(query, lessonData, chatHistory = []) {
        // 1. Local Search (Flashcards, Quiz, Chunks)
        const localResult = await this.localSearch(query, lessonData);
        if (localResult) return localResult;

        // 2. Vault Search (Previous Gemini Answers)
        const vaultResult = await this.searchVault(query, lessonData.id);
        if (vaultResult) {
            return {
                ...vaultResult,
                text: `${vaultResult.text}\n\n*(Respuesta recuperada del repositorio de la lección)*`
            };
        }

        // 3. Gemini API
        try {
            return await this.askGemini(query, lessonData, chatHistory);
        } catch (error) {
            return {
                text: error.message || "Lo siento, he tenido un problema conectando con mi cerebro de IA.",
                type: 'error'
            };
        }
    },

    // PRIVATE HELPERS
    _formatHistory(history, currentQuery) {
        const contents = [];
        history.forEach(msg => {
            const role = msg.role === 'assistant' ? 'model' : 'user';
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
                contents[contents.length - 1].parts[0].text += "\n" + msg.content;
            } else {
                contents.push({ role, parts: [{ text: msg.content }] });
            }
        });
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
            contents[contents.length - 1].parts[0].text += "\n" + currentQuery;
        } else {
            contents.push({ role: 'user', parts: [{ text: currentQuery }] });
        }
        return contents;
    },

    _calculateSimilarity(s1, s2) {
        // Normalize strings: remove accents and special characters
        const normalize = (str) => str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9\s]/g, ' ') // Keep only alphanumeric and spaces
            .trim();

        const n1 = normalize(s1);
        const n2 = normalize(s2);

        // Synonyms mapping for better matching
        const synonyms = {
            'principito': ['nino', 'pequeno', 'muchachito', 'hombrecito'],
            'deduce': ['sabe', 'supo', 'cuenta', 'entiende', 'descubre'],
            'planeta': ['mundo', 'tierra', 'asteroide', 'lugar'],
            'aviador': ['piloto', 'narrador', 'hombre']
        };

        let processedN1 = n1;
        let processedN2 = n2;

        // Replace synonyms to unify terms
        Object.entries(synonyms).forEach(([key, values]) => {
            values.forEach(v => {
                processedN1 = processedN1.replace(new RegExp(`\\b${v}\\b`, 'g'), key);
                processedN2 = processedN2.replace(new RegExp(`\\b${v}\\b`, 'g'), key);
            });
        });

        const words1 = processedN1.split(/\s+/).filter(w => w.length > 2);
        const words2 = processedN2.split(/\s+/).filter(w => w.length > 2);

        if (words1.length === 0 || words2.length === 0) return 0;

        // Jaccard Similarity
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));

        let score = intersection.size / Math.max(set1.size, set2.size);

        // Keyword match fallback: if key words match, boost significantly
        const keyWords = ["aviador", "principito", "planeta", "cordero", "dibujo", "boa", "elefante", "caja", "deduce"];
        const matchedKeyWords = keyWords.filter(kw => processedN1.includes(kw) && processedN2.includes(kw));

        if (matchedKeyWords.length >= 2) score += 0.25;
        if (matchedKeyWords.length >= 3) score += 0.15;

        return Math.min(score, 1.0);
    },

    _calculateOverlap(query, content) {
        const queryWords = query.split(/\W+/).filter(w => w.length > 3);
        if (queryWords.length === 0) return 0;
        let matches = 0;
        for (const word of queryWords) {
            if (content.includes(word)) matches++;
        }
        return matches / queryWords.length;
    }
};
