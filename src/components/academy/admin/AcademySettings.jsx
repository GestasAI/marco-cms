import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { aiService } from '../../../services/aiService';

const AcademySettings = ({ settings, setSettings, onSave }) => {
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null); // 'success', 'error'
    const [availableModels, setAvailableModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);

    useEffect(() => {
        if (settings.gemini_api_key) {
            fetchModels();
        }
    }, []);

    const fetchModels = async () => {
        if (!settings.gemini_api_key) return;
        setLoadingModels(true);
        try {
            const models = await aiService.listModels(settings.gemini_api_key);
            setAvailableModels(models);

            // If current model is not in the list and list is not empty, select the first one
            if (models.length > 0 && !models.find(m => m.id === settings.gemini_model)) {
                setSettings(prev => ({ ...prev, gemini_model: models[0].id }));
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleTestConnection = async () => {
        if (!settings.gemini_api_key) {
            alert("Por favor, introduce una API Key primero.");
            return;
        }
        setTesting(true);
        setTestResult(null);
        try {
            // Test with the CURRENTLY SELECTED model
            const success = await aiService.testConnection(settings.gemini_api_key, settings.gemini_model);
            setTestResult(success ? 'success' : 'error');
            if (success) fetchModels();
        } catch (error) {
            setTestResult('error');
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="text-blue-600" /> Configuración de Gemini
                </h2>
                <p className="text-sm text-gray-500 mt-1">Conecta tu academia con el cerebro de Google Gemini.</p>
            </div>
            <form onSubmit={onSave} className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Gemini API Key</label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            value={settings.gemini_api_key}
                            onChange={e => setSettings({ ...settings, gemini_api_key: e.target.value })}
                            placeholder="AIza..."
                        />
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={testing}
                            className={`px-4 rounded-xl font-bold flex items-center gap-2 transition-all ${testResult === 'success' ? 'bg-green-50 text-green-600 border border-green-200' :
                                    testResult === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
                                        'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {testing ? <RefreshCw size={18} className="animate-spin" /> :
                                testResult === 'success' ? <CheckCircle size={18} /> :
                                    testResult === 'error' ? <XCircle size={18} /> :
                                        'Probar'}
                        </button>
                    </div>
                    <p className="text-[11px] text-gray-400">Obtén tu clave gratuita en <a href="https://aistudio.google.com/" target="_blank" className="text-blue-500 underline">Google AI Studio</a>.</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Modelo</label>
                        <button type="button" onClick={fetchModels} className="text-blue-500 hover:text-blue-700">
                            <RefreshCw size={14} className={loadingModels ? "animate-spin" : ""} />
                        </button>
                    </div>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={settings.gemini_model}
                        onChange={e => setSettings({ ...settings, gemini_model: e.target.value })}
                    >
                        {availableModels.length > 0 ? (
                            availableModels.map(m => (
                                <option key={m.id} value={m.id}>{m.name || m.id}</option>
                            ))
                        ) : (
                            <>
                                <option value="gemini-1.5-flash">Gemini-1.5-Flash (Por defecto)</option>
                                <option value="gemini-1.5-pro">Gemini-1.5-Pro</option>
                            </>
                        )}
                    </select>
                    {availableModels.length > 0 && (
                        <p className="text-[10px] text-gray-400 mt-1">Modelos detectados automáticamente de tu cuenta.</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">System Prompt Global</label>
                    <textarea
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={settings.default_system_prompt}
                        onChange={e => setSettings({ ...settings, default_system_prompt: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                    <Save size={20} /> Guardar Configuración
                </button>
            </form>
        </div>
    );
};

export default AcademySettings;
