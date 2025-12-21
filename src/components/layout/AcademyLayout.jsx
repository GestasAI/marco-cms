import React, { useState, useEffect, useRef } from 'react';
import {
    BookOpen,
    MessageSquare,
    ChevronRight,
    PlayCircle,
    FileText,
    Download,
    CheckCircle,
    Layout,
    Settings,
    User,
    Search,
    Send,
    Paperclip,
    Mic,
    Sparkles,
    Menu,
    X,
    Info,
    Video,
    Film,
    Brain,
    HelpCircle,
    ExternalLink
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import academyService from '../../services/academyService';
import { acideService } from '../../acide/acideService';

const AcademyLayout = () => {
    const { courseSlug, lessonId } = useParams();
    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('video'); // chat, video, resources
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [quizState, setQuizState] = useState({
        currentQuestionIndex: 0,
        answers: [],
        isFinished: false,
        score: 0,
        wrongQuestions: []
    });
    const [progress, setProgress] = useState({
        percentage: 0,
        completedCount: 0,
        totalCount: 0,
        completedLessons: []
    });
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        document.body.classList.add('academy-view');
        loadData();
        return () => document.body.classList.remove('academy-view');
    }, [courseSlug, lessonId]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        const chatArea = document.querySelector('.flex-1.overflow-y-auto');
        if (chatArea) chatArea.scrollTop = 0;
    }, [lessonId]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputMessage]);

    const loadData = async () => {
        try {
            const courseData = await academyService.getCourseBySlug(courseSlug);
            if (!courseData) {
                console.error("Course not found");
                return;
            }
            setCourse(courseData);

            const currentLessonId = lessonId || courseData.modules?.[0]?.lessons?.[0];
            if (!currentLessonId) {
                console.warn("No lessons found for this course.");
                return;
            }

            const lessonData = await academyService.getLesson(currentLessonId);
            if (!lessonData) {
                console.error("Lesson not found:", currentLessonId);
                return;
            }
            console.log("DEBUG: Lesson Data Loaded:", lessonData);
            setLesson(lessonData);
            setQuizState({
                currentQuestionIndex: 0,
                answers: [],
                isFinished: false,
                score: 0,
                wrongQuestions: []
            });

            // Cargar todas las lecciones del curso para el sidebar
            const result = await acideService.query('academy_lessons', {
                where: [['course_id', '==', courseData.id]]
            });
            courseData.lessonsData = result || [];
            setCourse(courseData);

            // Marcar lección como completada (Progreso)
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id) {
                const studentProgress = await academyService.getStudentProgress(user.id, courseData.id);
                let updatedLessons = studentProgress.completedLessons;

                if (!studentProgress.completedLessons.includes(currentLessonId)) {
                    updatedLessons = [...studentProgress.completedLessons, currentLessonId];
                    await academyService.updateProgress(user.id, courseData.id, {
                        completedLessons: updatedLessons
                    });
                }

                // Calcular porcentaje real
                const totalLessons = courseData.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 1;
                const percentage = Math.round((updatedLessons.length / totalLessons) * 100);

                setProgress({
                    percentage,
                    completedCount: updatedLessons.length,
                    totalCount: totalLessons,
                    completedLessons: updatedLessons
                });
            }

            // Mensaje inicial del Tutor (Paradigma Gemini: El contenido es parte de la conversación)
            setChatMessages([
                {
                    role: 'assistant',
                    type: 'lesson_intro',
                    content: `¡Hola! Soy tu tutor de IA. Hoy vamos a explorar **${lessonData.title}**. He preparado el material para ti abajo. ¿Por dónde te gustaría empezar?`,
                    lessonData: lessonData
                }
            ]);
            setActiveVideoIndex(0);
            setActiveTab('video');
        } catch (error) {
            console.error("Error loading academy data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: 'user', content: inputMessage };
        setChatMessages(prev => [...prev, userMsg]);
        setInputMessage('');

        try {
            const response = await academyService.askTutor(lesson.id, inputMessage, chatMessages);
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: response.text,
                type: response.type,
                source: response.source
            }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, he tenido un problema conectando con mi cerebro de IA. ¿Puedes repetir la pregunta?" }]);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white text-blue-600 font-bold">Iniciando Experiencia de Aprendizaje...</div>;

    if (!course || !lesson) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
            <Sparkles size={48} className="text-gray-200" />
            <p className="font-bold">No hemos podido encontrar esta lección.</p>
            <Link to="/academy" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Volver a la Academia</Link>
        </div>
    );

    return (
        <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden academy-view">

            {/* 1. SIDEBAR IZQUIERDO (Perplexity Style - Collapsible) */}
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
                        <Menu size={18} />
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

                <div className="p-2 border-t border-gray-200">
                    <button className="w-full flex items-center gap-4 p-3 text-gray-500 hover:text-gray-900 transition-colors">
                        <Settings size={20} />
                        {isLeftSidebarExpanded && <span className="font-medium">Ajustes</span>}
                    </button>
                </div>
            </aside>

            {/* 2. CONTENIDO PRINCIPAL (Chat-Centric) */}
            <main className="flex-1 flex flex-col relative bg-white">

                {/* Header Superior (Clean) */}
                <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-gray-900">{lesson.title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar-light px-4 md:px-0">
                    <div className="max-w-3xl mx-auto py-10 space-y-10">

                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-6 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                                        <Sparkles size={16} className="text-white" />
                                    </div>
                                )}

                                <div className={`flex flex-col gap-4 max-w-[90%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={msg.role === 'user' ? 'msg-user' : 'msg-assistant'}>
                                        <div className="prose-academy-light" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />

                                        {(msg.type === 'local_match' || msg.type === 'vault_match') && (
                                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                                                <CheckCircle size={12} /> RESPUESTA VERIFICADA
                                            </div>
                                        )}
                                    </div>

                                    {/* Renderizado de Componentes Especiales (Paradigma Gemini) */}
                                    {msg.type === 'lesson_intro' && (
                                        <div className="w-full space-y-6 mt-4">
                                            {/* Video Card(s) / Playlist */}
                                            {activeTab === 'video' && (
                                                <div className="space-y-6">
                                                    {(() => {
                                                        const videos = msg.lessonData.videos || (msg.lessonData.video_url ? [{ url: msg.lessonData.video_url, title: msg.lessonData.title }] : []);

                                                        if (videos.length === 0) return null;

                                                        if (videos.length === 1) {
                                                            const video = videos[0];
                                                            return (
                                                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-black aspect-video group relative">
                                                                    {video.url.includes('youtube.com') || video.url.includes('youtu.be') ? (
                                                                        <iframe
                                                                            className="w-full h-full"
                                                                            src={video.url.includes('watch?v=') ? video.url.replace('watch?v=', 'embed/') : video.url}
                                                                            title={video.title}
                                                                            frameBorder="0"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                        ></iframe>
                                                                    ) : (
                                                                        <video className="w-full h-full" controls src={video.url}>
                                                                            Tu navegador no soporta el elemento de video.
                                                                        </video>
                                                                    )}
                                                                </div>
                                                            );
                                                        }

                                                        // Playlist View
                                                        const currentVideo = videos[activeVideoIndex] || videos[0];

                                                        return (
                                                            <div className="playlist-container">
                                                                <div className="playlist-main">
                                                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-black aspect-video group relative">
                                                                        {currentVideo.url.includes('youtube.com') || currentVideo.url.includes('youtu.be') ? (
                                                                            <iframe
                                                                                key={currentVideo.url}
                                                                                className="w-full h-full"
                                                                                src={currentVideo.url.includes('watch?v=') ? currentVideo.url.replace('watch?v=', 'embed/') : currentVideo.url}
                                                                                title={currentVideo.title}
                                                                                frameBorder="0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            ></iframe>
                                                                        ) : (
                                                                            <video key={currentVideo.url} className="w-full h-full" controls src={currentVideo.url} autoPlay>
                                                                                Tu navegador no soporta el elemento de video.
                                                                            </video>
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-4 px-2">
                                                                        <h3 className="text-xl font-bold text-gray-900">{currentVideo.title}</h3>
                                                                        <p className="text-sm text-gray-500 mt-1">Video {activeVideoIndex + 1} de {videos.length}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="playlist-sidebar">
                                                                    <div className="playlist-header flex items-center justify-between">
                                                                        <h4 className="font-bold text-sm flex items-center gap-2">
                                                                            <Video size={16} className="text-blue-600" /> Lista de Reproducción
                                                                        </h4>
                                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                                            {videos.length} VIDEOS
                                                                        </span>
                                                                    </div>
                                                                    <div className="playlist-items custom-scrollbar-light">
                                                                        {videos.map((video, vIdx) => {
                                                                            const isYoutube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
                                                                            const videoId = isYoutube ? (video.url.includes('watch?v=') ? video.url.split('v=')[1]?.split('&')[0] : video.url.split('/').pop()) : null;
                                                                            const thumb = isYoutube ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                                                                            return (
                                                                                <button
                                                                                    key={vIdx}
                                                                                    onClick={() => setActiveVideoIndex(vIdx)}
                                                                                    className={`playlist-item ${activeVideoIndex === vIdx ? 'active' : ''}`}
                                                                                >
                                                                                    <div className="playlist-thumbnail">
                                                                                        {thumb ? (
                                                                                            <img src={thumb} alt={video.title} />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                                                                                                <Film size={24} />
                                                                                            </div>
                                                                                        )}
                                                                                        <div className="play-overlay">
                                                                                            <PlayCircle size={24} className="text-white" />
                                                                                        </div>
                                                                                        {activeVideoIndex === vIdx && (
                                                                                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                                                                <Sparkles size={20} className="text-white animate-pulse" />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="playlist-info">
                                                                                        <h5 className="playlist-title">{video.title}</h5>
                                                                                        <div className="playlist-meta">
                                                                                            {isYoutube ? 'YouTube' : 'Media Library'}
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            {/* Summary Tab */}
                                            {activeTab === 'summary' && (
                                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 animate-fade-in">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Info size={20} className="text-blue-600" /> Resumen de la Clase
                                                    </h3>
                                                    <div className="prose-academy-light" dangerouslySetInnerHTML={{ __html: (lesson.summary || lesson.content || 'No hay resumen disponible para esta lección.').replace(/\n/g, '<br/>') }} />
                                                </div>
                                            )}

                                            {/* Flashcards Tab */}
                                            {activeTab === 'flashcards' && (
                                                <div className="space-y-4 animate-fade-in">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 px-2">
                                                        <Sparkles size={20} className="text-yellow-500" /> Tarjetas Rápidas
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {lesson.flashcards && lesson.flashcards.length > 0 ? (
                                                            lesson.flashcards.map((card, cIdx) => (
                                                                <div key={cIdx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Pregunta</p>
                                                                    <p className="font-bold text-gray-800 mb-4">{card.question}</p>
                                                                    <div className="pt-4 border-t border-gray-50 hidden group-hover:block animate-fade-in">
                                                                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Respuesta</p>
                                                                        <p className="text-gray-600 text-sm">{card.answer}</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 mt-4 group-hover:hidden">Pasa el ratón para ver la respuesta</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                                <Sparkles size={48} className="mx-auto text-gray-200 mb-4" />
                                                                <p className="text-gray-500">No hay tarjetas rápidas para esta lección.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* PDF Tab */}
                                            {activeTab === 'pdf' && (
                                                <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center animate-fade-in">
                                                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                                        <FileText size={40} />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900">Libro PDF de la Lección</h3>
                                                    <p className="text-gray-500 mt-3 max-w-md">
                                                        Descarga el material complementario en PDF para profundizar en los conceptos de esta clase.
                                                    </p>
                                                    {lesson.pdf_url ? (
                                                        <div className="mt-8 flex gap-4">
                                                            <a
                                                                href={lesson.pdf_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
                                                            >
                                                                <ExternalLink size={18} /> Ver Online
                                                            </a>
                                                            <a
                                                                href={lesson.pdf_url}
                                                                download
                                                                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                                                            >
                                                                <Download size={18} /> Descargar
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-8 p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 text-sm font-medium">
                                                            El PDF aún no ha sido subido para esta lección.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Mindmap Tab */}
                                            {activeTab === 'mindmap' && (
                                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 animate-fade-in">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                            <Brain size={20} className="text-purple-600" /> Mapa Mental
                                                        </h3>
                                                        {lesson.mind_map_image && (
                                                            <a
                                                                href={lesson.mind_map_image}
                                                                download
                                                                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                                            >
                                                                <Download size={14} /> Descargar Imagen
                                                            </a>
                                                        )}
                                                    </div>
                                                    {lesson.mind_map_image ? (
                                                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                                            <img src={lesson.mind_map_image} alt="Mapa Mental" className="w-full h-auto" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                                                            <Brain size={48} className="mx-auto text-gray-200 mb-4" />
                                                            <p className="text-gray-500">El mapa mental visual estará disponible pronto.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Quiz Tab */}
                                            {activeTab === 'quiz' && (
                                                <div className="space-y-6 animate-fade-in">
                                                    <div className="flex justify-between items-center px-2">
                                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                            <HelpCircle size={20} className="text-green-600" /> Cuestionario de Evaluación
                                                        </h3>
                                                        {!quizState.isFinished && lesson.quiz && lesson.quiz.length > 0 && (
                                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                                Pregunta {quizState.currentQuestionIndex + 1} de {lesson.quiz.length}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {lesson.quiz && lesson.quiz.length > 0 ? (
                                                        !quizState.isFinished ? (
                                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 animate-slide-up">
                                                                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-8 overflow-hidden">
                                                                    <div
                                                                        className="bg-green-500 h-full transition-all duration-500"
                                                                        style={{ width: `${((quizState.currentQuestionIndex) / lesson.quiz.length) * 100}%` }}
                                                                    />
                                                                </div>

                                                                <p className="text-lg font-bold text-gray-800 mb-8 leading-relaxed">
                                                                    {lesson.quiz[quizState.currentQuestionIndex].question}
                                                                </p>

                                                                <div className="grid grid-cols-1 gap-4">
                                                                    {lesson.quiz[quizState.currentQuestionIndex].options.map((opt, oIdx) => (
                                                                        <button
                                                                            key={oIdx}
                                                                            onClick={() => {
                                                                                const q = lesson.quiz[quizState.currentQuestionIndex];
                                                                                const isCorrect = q.correct === oIdx;
                                                                                const newAnswers = [...quizState.answers, { questionIndex: quizState.currentQuestionIndex, selectedOption: oIdx, isCorrect }];
                                                                                const newWrongQuestions = isCorrect ? quizState.wrongQuestions : [...quizState.wrongQuestions, quizState.currentQuestionIndex];

                                                                                if (quizState.currentQuestionIndex + 1 < lesson.quiz.length) {
                                                                                    setQuizState({
                                                                                        ...quizState,
                                                                                        currentQuestionIndex: quizState.currentQuestionIndex + 1,
                                                                                        answers: newAnswers,
                                                                                        wrongQuestions: newWrongQuestions
                                                                                    });
                                                                                } else {
                                                                                    const correctCount = newAnswers.filter(a => a.isCorrect).length;
                                                                                    const finalScore = (correctCount / lesson.quiz.length) * 10;
                                                                                    setQuizState({
                                                                                        ...quizState,
                                                                                        isFinished: true,
                                                                                        answers: newAnswers,
                                                                                        score: finalScore,
                                                                                        wrongQuestions: newWrongQuestions
                                                                                    });
                                                                                }
                                                                            }}
                                                                            className="w-full text-left p-5 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-4 group"
                                                                        >
                                                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                                                                {String.fromCharCode(65 + oIdx)}
                                                                            </div>
                                                                            <span className="text-gray-700 font-bold">{opt}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/50 text-center animate-bounce-in">
                                                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${quizState.score >= 5 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                    {quizState.score >= 5 ? <CheckCircle size={48} /> : <HelpCircle size={48} />}
                                                                </div>

                                                                <h4 className="text-3xl font-black text-gray-900 mb-2">¡Prueba Finalizada!</h4>
                                                                <p className="text-gray-500 font-medium mb-8">Has completado la evaluación de esta lección.</p>

                                                                <div className="grid grid-cols-3 gap-4 mb-10">
                                                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aciertos</p>
                                                                        <p className="text-2xl font-black text-green-600">{quizState.answers.filter(a => a.isCorrect).length}</p>
                                                                    </div>
                                                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fallos</p>
                                                                        <p className="text-2xl font-black text-red-600">{quizState.wrongQuestions.length}</p>
                                                                    </div>
                                                                    <div className="p-4 bg-blue-600 rounded-2xl text-white">
                                                                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Nota</p>
                                                                        <p className="text-2xl font-black">{quizState.score.toFixed(1)}</p>
                                                                    </div>
                                                                </div>

                                                                {quizState.wrongQuestions.length > 0 && (
                                                                    <div className="mb-10 text-left space-y-4">
                                                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Repaso de fallos:</p>
                                                                        {quizState.wrongQuestions.map(idx => (
                                                                            <div key={idx} className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                                                                <p className="text-sm font-bold text-gray-800 mb-2">{lesson.quiz[idx].question}</p>
                                                                                <p className="text-xs text-red-600 font-medium bg-white/50 p-2 rounded-lg">{lesson.quiz[idx].explanation}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-4">
                                                                    <button
                                                                        onClick={() => setQuizState({
                                                                            currentQuestionIndex: 0,
                                                                            answers: [],
                                                                            isFinished: false,
                                                                            score: 0,
                                                                            wrongQuestions: []
                                                                        })}
                                                                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-lg"
                                                                    >
                                                                        Repetir Test
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setActiveTab('chat')}
                                                                        className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-50 transition-all"
                                                                    >
                                                                        Volver al Chat
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                            <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                                                            <p className="text-gray-500">No hay preguntas de evaluación para esta lección.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Floating Chat Input (Gemini/Perplexity Style) */}
                <div className="p-6 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-3xl mx-auto">

                        {/* Contextual Options Area */}
                        <div className="chat-context-options">
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`btn-context-option flex items-center gap-2 ${activeTab === 'quiz' ? 'active' : ''}`}
                            >
                                <HelpCircle size={14} /> Cuestionario
                            </button>
                            <button
                                onClick={() => setActiveTab('mindmap')}
                                className={`btn-context-option flex items-center gap-2 ${activeTab === 'mindmap' ? 'active' : ''}`}
                            >
                                <Brain size={14} /> Mapa Mental
                            </button>
                            <button
                                onClick={() => setActiveTab('flashcards')}
                                className={`btn-context-option flex items-center gap-2 ${activeTab === 'flashcards' ? 'active' : ''}`}
                            >
                                <Sparkles size={14} /> Tarjetas
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input-wrapper flex items-end p-2 gap-2">
                            <textarea
                                ref={textareaRef}
                                rows="1"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Pregunta a tu tutor sobre esta clase..."
                                className="chat-input-textarea flex-1 px-4 custom-scrollbar-light"
                            />
                            <div className="flex items-center gap-1 p-1">
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Mic size={20} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim()}
                                    className={`p-2 rounded-xl transition-all ${inputMessage.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-300'}`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                            Gestas AI puede cometer errores. Considera verificar la información importante.
                        </p>
                    </div>
                </div>
            </main>

            {/* 3. SIDEBAR DERECHO (Contenido del Curso + Navigation) */}
            <aside className="w-80 bg-[#f9f9f9] border-l border-gray-200 flex flex-col hidden lg:flex">
                <div className="p-8 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900">Contenido del Curso</h3>
                    <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <span>Tu Progreso</span>
                            <span className="text-blue-600">{progress.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-light">
                    {course.modules?.map((mod, mIdx) => {
                        // Find lessons that belong to this module based on the IDs in mod.lessons
                        const moduleLessons = mod.lessons?.map(lId =>
                            course.lessonsData?.find(ld => ld.id === lId)
                        ).filter(Boolean) || [];

                        if (moduleLessons.length === 0) return null;

                        return (
                            <div key={mod.id} className="border-b border-gray-200/50">
                                <div className="px-8 py-4 bg-gray-100/30">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidad {mIdx + 1}</span>
                                    <h4 className="font-bold text-sm text-gray-800 mt-1">{mod.title}</h4>
                                </div>
                                <div className="p-2 space-y-1">
                                    {moduleLessons.map((lData, lIdx) => {
                                        const isActive = lData.id === lesson.id;
                                        return (
                                            <Link
                                                key={lData.id}
                                                to={`/academy/${courseSlug}/${lData.id}`}
                                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm transition-all ${isActive ? 'bg-white shadow-sm border border-gray-100 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900'}`}
                                            >
                                                <div className="shrink-0">
                                                    {isActive ? (
                                                        <PlayCircle size={18} />
                                                    ) : progress.completedLessons.includes(lData.id) ? (
                                                        <CheckCircle size={18} className="text-green-500" />
                                                    ) : (
                                                        <CheckCircle size={18} className="text-gray-200" />
                                                    )}
                                                </div>
                                                <span className="truncate">
                                                    {lIdx + 1}. {lData.title}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Action Buttons (Bottom) */}
                <div className="sidebar-actions">
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`btn-sidebar-action ${activeTab === 'video' ? 'active' : ''}`}
                    >
                        <Video size={18} /> Video Clase
                    </button>
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`btn-sidebar-action ${activeTab === 'summary' ? 'active' : ''}`}
                    >
                        <Info size={18} /> Resumen
                    </button>
                    <button
                        onClick={() => setActiveTab('pdf')}
                        className={`btn-sidebar-action ${activeTab === 'pdf' ? 'active' : ''}`}
                    >
                        <FileText size={18} /> Libro PDF
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default AcademyLayout;
