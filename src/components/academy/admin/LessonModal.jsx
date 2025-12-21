import React from 'react';
import { X, Book, Sparkles, FileText, HelpCircle, Film, Trash2, Plus, Save, Brain } from 'lucide-react';

const LessonModal = ({
    isOpen,
    onClose,
    onSave,
    formData,
    setFormData,
    editingLesson,
    activeTab,
    setActiveTab,
    viewingLessonsFor,
    onOpenMediaPicker
}) => {
    if (!isOpen) return null;

    const addFlashcard = () => setFormData({ ...formData, flashcards: [...formData.flashcards, { question: '', answer: '' }] });
    const addQuizQuestion = () => setFormData({ ...formData, quiz: [...formData.quiz, { question: '', options: ['', '', ''], correct: 0, explanation: '' }] });
    const addKnowledgeChunk = () => setFormData({ ...formData, knowledge_chunks: [...formData.knowledge_chunks, { id: Date.now(), title: '', content: '', tags: '' }] });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black text-gray-900">{editingLesson ? 'Editar Lección' : 'Nueva Lección'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="flex border-b border-gray-100 bg-white px-6">
                    {[
                        { id: 'basic', label: 'Contenido', icon: Book },
                        { id: 'ai', label: 'IA & RAG', icon: Sparkles },
                        { id: 'resources', label: 'Recursos', icon: FileText },
                        { id: 'evaluation', label: 'Evaluación', icon: HelpCircle }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-4 px-6 border-b-2 transition-all font-bold text-sm ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar-light">
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Módulo / Unidad</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm" value={formData.module_id} onChange={e => setFormData({ ...formData, module_id: e.target.value })}>
                                        {viewingLessonsFor.modules?.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título</label>
                                    <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Slug</label>
                                    <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-mono text-sm bg-gray-50" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Videos</label>
                                <div className="space-y-3">
                                    {formData.videos.map((v, i) => (
                                        <div key={i} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Film size={20} className="text-red-500" />
                                            <input className="flex-1 bg-transparent border-none font-bold text-sm focus:ring-0" value={v.title} onChange={e => {
                                                const newV = [...formData.videos];
                                                newV[i].title = e.target.value;
                                                setFormData({ ...formData, videos: newV });
                                            }} />
                                            <button type="button" onClick={() => setFormData({ ...formData, videos: formData.videos.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <input id="new-v-url" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="URL de YouTube..." />
                                        <button type="button" onClick={() => { const input = document.getElementById('new-v-url'); if (input.value) { setFormData({ ...formData, videos: [...formData.videos, { url: input.value, title: 'Nuevo Video' }] }); input.value = ''; } }} className="px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">Añadir</button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Contenido (Markdown)</label>
                                <textarea rows="8" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-mono text-sm" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="space-y-8">
                            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
                                <h3 className="text-lg font-black flex items-center gap-2 mb-2"><Sparkles /> Cerebro de la Lección</h3>
                                <p className="text-blue-100 text-sm">Configura el comportamiento específico del tutor para este tema.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Instrucciones del Tutor (System Prompt)</label>
                                <textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.ai_config.system_prompt} onChange={e => setFormData({ ...formData, ai_config: { ...formData.ai_config, system_prompt: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base de Conocimiento (RAG Context)</label>
                                <textarea rows="6" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.ai_config.knowledge_base} onChange={e => setFormData({ ...formData, ai_config: { ...formData.ai_config, knowledge_base: e.target.value } })} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Fragmentos de Conocimiento</label>
                                    <button type="button" onClick={addKnowledgeChunk} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14} /> Añadir Fragmento</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {formData.knowledge_chunks.map((chunk, i) => (
                                        <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                            <div className="flex justify-between gap-4">
                                                <input className="flex-1 bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-sm" value={chunk.title} onChange={e => {
                                                    const n = [...formData.knowledge_chunks];
                                                    n[i] = { ...n[i], title: e.target.value };
                                                    setFormData({ ...formData, knowledge_chunks: n });
                                                }} placeholder="Título del fragmento..." />
                                                <button type="button" onClick={() => setFormData({ ...formData, knowledge_chunks: formData.knowledge_chunks.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                                            </div>
                                            <textarea rows="3" className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm" value={chunk.content} onChange={e => {
                                                const n = [...formData.knowledge_chunks];
                                                n[i] = { ...n[i], content: e.target.value };
                                                setFormData({ ...formData, knowledge_chunks: n });
                                            }} placeholder="Contenido técnico..." />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Resumen de la Lección</label>
                                <textarea rows="6" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descripción del Video (para IA)</label>
                                    <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.video_description} onChange={e => setFormData({ ...formData, video_description: e.target.value })} />
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL del Libro PDF</label>
                                        <div className="flex gap-2">
                                            <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none text-xs" value={formData.pdf_url} onChange={e => setFormData({ ...formData, pdf_url: e.target.value })} />
                                            <button type="button" onClick={() => onOpenMediaPicker('pdf_url', 'document')} className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"><FileText size={20} /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagen del Mapa Mental</label>
                                        <div className="flex gap-2">
                                            <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none text-xs" value={formData.mind_map_image} onChange={e => setFormData({ ...formData, mind_map_image: e.target.value })} />
                                            <button type="button" onClick={() => onOpenMediaPicker('mind_map', 'image')} className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"><Brain size={20} /></button>
                                        </div>
                                        {formData.mind_map_image && (
                                            <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-50 flex items-center justify-center relative group">
                                                <img
                                                    src={formData.mind_map_image}
                                                    alt="Mapa Mental"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/600x400?text=Error+al+cargar+imagen';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, mind_map_image: '' })}
                                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'evaluation' && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Sparkles className="text-blue-600" /> Tarjetas de Estudio</h3>
                                    <button type="button" onClick={addFlashcard} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14} /> Añadir Tarjeta</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {formData.flashcards.map((card, i) => (
                                        <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tarjeta {i + 1}</span>
                                                <button type="button" onClick={() => setFormData({ ...formData, flashcards: formData.flashcards.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                            <input className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-sm" value={card.question} onChange={e => {
                                                const n = [...formData.flashcards];
                                                n[i] = { ...n[i], question: e.target.value };
                                                setFormData({ ...formData, flashcards: n });
                                            }} placeholder="Pregunta..." />
                                            <textarea rows="2" className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm" value={card.answer} onChange={e => {
                                                const n = [...formData.flashcards];
                                                n[i] = { ...n[i], answer: e.target.value };
                                                setFormData({ ...formData, flashcards: n });
                                            }} placeholder="Respuesta..." />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><HelpCircle className="text-blue-600" /> Examen de la Lección</h3>
                                    <button type="button" onClick={addQuizQuestion} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14} /> Añadir Pregunta</button>
                                </div>
                                <div className="space-y-6">
                                    {formData.quiz.map((q, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                            <div className="flex justify-between gap-4">
                                                <input className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm" value={q.question} onChange={e => {
                                                    const n = [...formData.quiz];
                                                    n[i] = { ...n[i], question: e.target.value };
                                                    setFormData({ ...formData, quiz: n });
                                                }} placeholder="Pregunta del examen..." />
                                                <button type="button" onClick={() => setFormData({ ...formData, quiz: formData.quiz.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${q.correct === oIdx ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                                                        <input type="radio" checked={q.correct === oIdx} onChange={() => {
                                                            const n = [...formData.quiz];
                                                            n[i] = { ...n[i], correct: oIdx };
                                                            setFormData({ ...formData, quiz: n });
                                                        }} />
                                                        <input className="flex-1 bg-transparent border-none text-sm focus:ring-0" value={opt} onChange={e => {
                                                            const n = [...formData.quiz];
                                                            const newOptions = [...n[i].options];
                                                            newOptions[oIdx] = e.target.value;
                                                            n[i] = { ...n[i], options: newOptions };
                                                            setFormData({ ...formData, quiz: n });
                                                        }} />
                                                    </div>
                                                ))}
                                            </div>
                                            <textarea rows="2" className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-500" value={q.explanation} onChange={e => {
                                                const n = [...formData.quiz];
                                                n[i] = { ...n[i], explanation: e.target.value };
                                                setFormData({ ...formData, quiz: n });
                                            }} placeholder="Explicación de la respuesta..." />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-gray-300 font-bold text-gray-600 hover:bg-white transition-all">Cancelar</button>
                    <button onClick={onSave} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"><Save size={20} /> Guardar Lección</button>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;
