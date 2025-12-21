import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const LessonTable = ({ lessons, course, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Lección</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Módulo / Unidad</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {lessons.map(lesson => (
                        <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-700">{lesson.title}</td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                    {course.modules?.find(m => m.id === lesson.module_id)?.title || 'Sin Módulo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(lesson)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => onDelete(lesson.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {lessons.length === 0 && (
                        <tr>
                            <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                No hay lecciones en este curso.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LessonTable;
