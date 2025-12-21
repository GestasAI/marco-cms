import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, MessageSquare, User, Sparkles, ArrowRight } from 'lucide-react';
import { acideService } from '../acide/acideService';

const AcademyHome = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const result = await acideService.list('academy_courses');
            setCourses(result || []);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
            {/* Sidebar Izquierdo (Mismo estilo que AcademyLayout) */}
            <aside className={`flex flex-col bg-[#f9f9f9] border-r border-gray-200 transition-all duration-300 z-50 ${isLeftSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        {isLeftSidebarExpanded && <span className="font-bold text-lg tracking-tight truncate">Academy</span>}
                    </div>
                    <button
                        onClick={() => setIsLeftSidebarExpanded(!isLeftSidebarExpanded)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
                    >
                        <Search size={18} />
                    </button>
                </div>

                <nav className="flex-1 px-2 mt-4 space-y-1">
                    {[
                        { icon: BookOpen, label: 'Mis Cursos', path: '/academy', active: true },
                        { icon: Search, label: 'Descubrir', path: '/academy/discover' },
                        { icon: MessageSquare, label: 'Tutorías', path: '/academy/tutor' },
                        { icon: User, label: 'Mi Perfil', path: '/academy/profile' }
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900'}`}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {isLeftSidebarExpanded && <span className="font-medium truncate">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Mis Cursos</h1>
                        <p className="text-gray-500 text-lg">Continúa donde lo dejaste o explora nuevas lecciones.</p>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <Link
                                    key={course.id}
                                    to={`/academy/${course.slug}`}
                                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                                >
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {course.featured_image ? (
                                            <img src={course.featured_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <BookOpen size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Continuar</span>
                                            <ArrowRight size={18} className="text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AcademyHome;
