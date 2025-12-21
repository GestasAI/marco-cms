import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, X, Save, ArrowLeft } from 'lucide-react';
import { acideService } from '../acide/acideService';

// Sub-components
import AcademySettings from '../components/academy/admin/AcademySettings';
import CourseModal from '../components/academy/admin/CourseModal';
import LessonModal from '../components/academy/admin/LessonModal';
import CourseCard from '../components/academy/admin/CourseCard';
import LessonTable from '../components/academy/admin/LessonTable';
import MediaPicker from '../components/ui/MediaPicker';

const AcademyAdmin = () => {
    // --- STATE ---
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminTab, setAdminTab] = useState('courses'); // courses, settings

    // Course Management
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseFormData, setCourseFormData] = useState({
        title: '', slug: '', description: '', featured_image: '', status: 'draft', modules: []
    });

    // Lesson Management
    const [viewingLessonsFor, setViewingLessonsFor] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [lessonModalTab, setLessonModalTab] = useState('basic');
    const [lessonFormData, setLessonFormData] = useState({
        title: '', slug: '', content: '', videos: [], summary: '', pdf_url: '',
        video_description: '', mind_map_image: '', flashcards: [], quiz: [],
        knowledge_chunks: [], ai_config: { system_prompt: '', knowledge_base: '' },
        module_id: ''
    });

    // Settings
    const [academySettings, setAcademySettings] = useState({
        gemini_api_key: '', gemini_model: 'gemini-1.5-flash', default_system_prompt: 'Eres un tutor experto de GestasAI.'
    });

    // UI Helpers
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
    const [mediaPickerType, setMediaPickerType] = useState('all');

    // --- EFFECTS ---
    useEffect(() => {
        loadCourses();
        loadSettings();
    }, []);

    // --- DATA LOADING ---
    const loadSettings = async () => {
        try {
            const settings = await acideService.get('academy_settings', 'current');
            if (settings) setAcademySettings(settings);
        } catch (error) {
            console.warn("Academy settings not found, using defaults.");
        }
    };

    const loadCourses = async () => {
        setLoading(true);
        try {
            const result = await acideService.query('academy_courses');
            setCourses(result || []);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadLessons = async (courseId) => {
        try {
            const result = await acideService.query('academy_lessons', {
                where: [['course_id', '==', courseId]]
            });
            setLessons(result || []);
        } catch (error) {
            console.error("Error loading lessons:", error);
        }
    };

    // --- COURSE ACTIONS ---
    const handleOpenCourseModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setCourseFormData({ ...course, modules: course.modules || [] });
        } else {
            setEditingCourse(null);
            setCourseFormData({
                title: '', slug: '', description: '', featured_image: '', status: 'draft',
                modules: [{ id: `mod-${Date.now()}`, title: 'Módulo 1', lessons: [] }]
            });
        }
        setIsCourseModalOpen(true);
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        try {
            const id = editingCourse ? editingCourse.id : `course-${Date.now()}`;
            const data = { ...courseFormData, id };
            if (editingCourse) {
                await acideService.update('academy_courses', id, data);
            } else {
                await acideService.create('academy_courses', data);
            }
            setIsCourseModalOpen(false);
            loadCourses();
        } catch (error) {
            console.error("Error saving course:", error);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este curso y todas sus lecciones?')) {
            await acideService.delete('academy_courses', id);
            // Optionally delete associated lessons here
            loadCourses();
        }
    };

    const handleManageLessons = (course) => {
        setViewingLessonsFor(course);
        loadLessons(course.id);
    };

    // --- LESSON ACTIONS ---
    const handleOpenLessonModal = (lesson = null) => {
        setLessonModalTab('basic');
        if (lesson) {
            setEditingLesson(lesson);
            setLessonFormData({
                ...lesson,
                videos: lesson.videos || [],
                flashcards: lesson.flashcards || [],
                quiz: lesson.quiz || [],
                knowledge_chunks: lesson.knowledge_chunks || [],
                ai_config: lesson.ai_config || { system_prompt: '', knowledge_base: '' },
                module_id: lesson.module_id || (viewingLessonsFor.modules?.[0]?.id || '')
            });
        } else {
            setEditingLesson(null);
            setLessonFormData({
                title: '', slug: '', content: '', videos: [], summary: '', pdf_url: '',
                video_description: '', mind_map_image: '', flashcards: [], quiz: [],
                knowledge_chunks: [], ai_config: { system_prompt: '', knowledge_base: '' },
                module_id: viewingLessonsFor.modules?.[0]?.id || ''
            });
        }
        setIsLessonModalOpen(true);
    };

    const handleSaveLesson = async (e) => {
        e.preventDefault();
        try {
            const id = editingLesson ? editingLesson.id : `lesson-${Date.now()}`;
            const data = { ...lessonFormData, id, course_id: viewingLessonsFor.id };

            // 1. Save the lesson itself
            if (editingLesson) {
                await acideService.update('academy_lessons', id, data);
            } else {
                await acideService.create('academy_lessons', data);
            }

            // 2. Update the course's module structure to include this lesson ID if not already there
            const updatedCourse = { ...viewingLessonsFor };
            updatedCourse.modules = updatedCourse.modules.map(mod => {
                // Remove lesson from other modules if it moved
                const filteredLessons = (mod.lessons || []).filter(lId => lId !== id);

                if (mod.id === data.module_id) {
                    // Add to target module if not present
                    if (!filteredLessons.includes(id)) {
                        return { ...mod, lessons: [...filteredLessons, id] };
                    }
                }
                return { ...mod, lessons: filteredLessons };
            });

            await acideService.update('academy_courses', viewingLessonsFor.id, updatedCourse);
            setViewingLessonsFor(updatedCourse);

            setIsLessonModalOpen(false);
            loadLessons(viewingLessonsFor.id);
        } catch (error) {
            console.error("Error saving lesson:", error);
        }
    };

    const handleDeleteLesson = async (id) => {
        if (window.confirm('¿Eliminar lección?')) {
            await acideService.delete('academy_lessons', id);

            // Also remove from course modules
            const updatedCourse = { ...viewingLessonsFor };
            updatedCourse.modules = updatedCourse.modules.map(mod => ({
                ...mod,
                lessons: (mod.lessons || []).filter(lId => lId !== id)
            }));
            await acideService.update('academy_courses', viewingLessonsFor.id, updatedCourse);
            setViewingLessonsFor(updatedCourse);

            loadLessons(viewingLessonsFor.id);
        }
    };

    // --- SETTINGS ACTIONS ---
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await acideService.update('academy_settings', 'current', academySettings);
            alert("Ajustes guardados correctamente");
        } catch (error) {
            alert("Error al guardar los ajustes");
        }
    };

    // --- MEDIA PICKER ---
    const handleOpenMediaPicker = (target, type = 'all') => {
        setMediaPickerTarget(target);
        setMediaPickerType(type);
        setIsMediaPickerOpen(true);
    };

    const handleMediaSelect = (item) => {
        const url = item.url;
        if (mediaPickerTarget === 'featured_image') setCourseFormData({ ...courseFormData, featured_image: url });
        if (mediaPickerTarget === 'pdf_url') setLessonFormData({ ...lessonFormData, pdf_url: url });
        if (mediaPickerTarget === 'mind_map') setLessonFormData({ ...lessonFormData, mind_map_image: url });
        setIsMediaPickerOpen(false);
    };

    // --- RENDER ---
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <GraduationCap size={36} className="text-blue-600" />
                        ACADEMIA <span className="text-blue-600">AI</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Gestión inteligente de cursos y tutoría RAG</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => { setAdminTab('courses'); setViewingLessonsFor(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${adminTab === 'courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Cursos
                    </button>
                    <button
                        onClick={() => setAdminTab('settings')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${adminTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Configuración IA
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            {adminTab === 'settings' ? (
                <AcademySettings
                    settings={academySettings}
                    setSettings={setAcademySettings}
                    onSave={handleSaveSettings}
                />
            ) : viewingLessonsFor ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewingLessonsFor(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold">{viewingLessonsFor.title}</h2>
                                <p className="text-sm text-gray-500">Gestionando {lessons.length} lecciones</p>
                            </div>
                        </div>
                        <button onClick={() => handleOpenLessonModal()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                            <Plus size={20} /> Nueva Lección
                        </button>
                    </div>

                    <LessonTable
                        lessons={lessons}
                        course={viewingLessonsFor}
                        onEdit={handleOpenLessonModal}
                        onDelete={handleDeleteLesson}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <button
                        onClick={() => handleOpenCourseModal()}
                        className="h-full min-h-[280px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-all">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold">Crear Nuevo Curso</span>
                    </button>

                    {loading ? (
                        <div className="col-span-full text-center py-12">Cargando cursos...</div>
                    ) : courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={handleOpenCourseModal}
                            onManageLessons={handleManageLessons}
                            onDelete={handleDeleteCourse}
                        />
                    ))}
                </div>
            )}

            {/* MODALS */}
            <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                onSave={handleSaveCourse}
                formData={courseFormData}
                setFormData={setCourseFormData}
                editingCourse={editingCourse}
                onOpenMediaPicker={handleOpenMediaPicker}
            />

            <LessonModal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                onSave={handleSaveLesson}
                formData={lessonFormData}
                setFormData={setLessonFormData}
                editingLesson={editingLesson}
                activeTab={lessonModalTab}
                setActiveTab={setLessonModalTab}
                viewingLessonsFor={viewingLessonsFor}
                onOpenMediaPicker={handleOpenMediaPicker}
            />

            {isMediaPickerOpen && (
                <MediaPicker
                    onClose={() => setIsMediaPickerOpen(false)}
                    onSelect={handleMediaSelect}
                    type={mediaPickerType}
                />
            )}
        </div>
    );
};

export default AcademyAdmin;
