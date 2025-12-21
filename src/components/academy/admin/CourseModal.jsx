import React from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const CourseModal = ({ isOpen, onClose, onSave, formData, setFormData, editingCourse, onOpenMediaPicker }) => {
    if (!isOpen) return null;

    const addModule = () => setFormData({ ...formData, modules: [...formData.modules, { id: `mod-${Date.now()}`, title: `Nuevo Módulo ${formData.modules.length + 1}` }] });
    const removeModule = (id) => setFormData({ ...formData, modules: formData.modules.filter(m => m.id !== id) });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black text-gray-900">{editingCourse ? 'Configurar Curso' : 'Nuevo Curso'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <form onSubmit={onSave} className="p-8 space-y-6 overflow-y-auto custom-scrollbar-light">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título</label>
                            <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Slug (URL)</label>
                            <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descripción</label>
                        <textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Módulos / Unidades</label>
                            <button type="button" onClick={addModule} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14} /> Añadir Módulo</button>
                        </div>
                        <div className="space-y-2">
                            {formData.modules.map((mod, idx) => (
                                <div key={mod.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100">{idx + 1}</div>
                                    <input
                                        className="flex-1 bg-transparent border-none font-bold text-sm focus:ring-0"
                                        value={mod.title}
                                        onChange={e => {
                                            const newMods = [...formData.modules];
                                            newMods[idx].title = e.target.value;
                                            setFormData({ ...formData, modules: newMods });
                                        }}
                                    />
                                    <button type="button" onClick={() => removeModule(mod.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Estado</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-sm" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagen Destacada</label>
                            <div className="flex gap-2">
                                <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none text-xs" value={formData.featured_image} onChange={e => setFormData({ ...formData, featured_image: e.target.value })} />
                                <button type="button" onClick={() => onOpenMediaPicker('featured_image', 'image')} className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"><ImageIcon size={20} /></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-white transition-all">Cancelar</button>
                    <button onClick={onSave} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Guardar Curso</button>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;
