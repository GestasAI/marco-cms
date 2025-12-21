import React from 'react';
import { Edit2, Book, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onEdit, onManageLessons, onDelete }) => {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                {course.featured_image ? (
                    <img src={course.featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'published' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {course.status}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-1">
                        <button onClick={() => onEdit(course)} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-all" title="Editar"><Edit2 size={20} /></button>
                        <button onClick={() => onManageLessons(course)} className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all" title="Lecciones"><Book size={20} /></button>
                        <button onClick={() => onDelete(course.id)} className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all" title="Eliminar"><Trash2 size={20} /></button>
                    </div>
                    <Link to={`/academy/${course.slug}`} target="_blank" className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg">
                        <ExternalLink size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
