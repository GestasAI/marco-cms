import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contentService } from '../services/content';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../services/auth';
import { ArrowLeft, Save, Eye } from 'lucide-react';

export default function ContentForm() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            // TODO: Load content by ID when implementing getById
            console.log('Edit mode for ID:', id);
        }
    }, [id]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('El título es requerido');
            return;
        }

        try {
            setLoading(true);
            await contentService.create({ title, content, status });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving:', err);
            setError('Error al guardar el contenido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} onLogout={handleLogout} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {id ? 'Editar' : 'Nuevo'} Contenido
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Crea o edita tu publicación
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            {error && (
                                <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                        placeholder="Escribe un título atractivo..."
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contenido
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={16}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                                        placeholder="Escribe tu contenido aquí..."
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        disabled={loading}
                                    >
                                        <option value="draft">Borrador</option>
                                        <option value="published">Publicado</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        <Save size={20} />
                                        {loading ? 'Guardando...' : 'Guardar Contenido'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
