import React, { useState, useEffect } from 'react';
import { acideService } from '../acide/acideService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Server, Shield, Mail, Save, Activity } from 'lucide-react';

export default function Settings() {
    const [config, setConfig] = useState({
        admin_email: '',
        maintenance_mode: false,
        debug_mode: false
    });
    const [serverInfo, setServerInfo] = useState({
        php_version: '8.2.0',
        server_software: 'ACIDE/1.0 (Apache)',
        upload_max_filesize: '64M',
        post_max_size: '64M',
        max_execution_time: '30s'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await acideService.get('settings', 'global_config');
            if (data) {
                setConfig(prev => ({ ...prev, ...data }));
            }
            // In a real app, we would fetch serverInfo here from an ACIDE endpoint
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await acideService.update('settings', 'global_config', config);
            alert('Configuración del sistema guardada.');
        } catch (error) {
            console.error(error);
            alert('Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-xl text-center">Cargando sistema...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex-between mb-xl">
                <div>
                    <h1 className="heading-2 flex items-center gap-sm">
                        <Server className="text-gray-700" /> Configuración del Sistema
                    </h1>
                    <p className="text-secondary">Estado del servidor y parámetros globales de la aplicación.</p>
                </div>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="animate-spin mr-2">⏳</span> : <Save size={18} className="mr-2" />}
                    Guardar
                </Button>
            </div>

            <div className="flex-column gap-lg">
                {/* 1. Admin Settings */}
                <Card className="p-lg">
                    <h2 className="heading-3 mb-md flex items-center gap-sm">
                        <Shield size={20} /> Administración
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-xs">Email del Administrador</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    className="pl-10"
                                    value={config.admin_email}
                                    onChange={(e) => setConfig({ ...config, admin_email: e.target.value })}
                                    placeholder="admin@ejemplo.com"
                                />
                            </div>
                            <p className="text-xs text-secondary mt-xs">Utilizado para notificaciones críticas.</p>
                        </div>

                        <div className="flex items-center gap-md pt-sm border-t border-gray-100">
                            <input
                                type="checkbox"
                                id="maint"
                                className="w-5 h-5 text-blue-600 rounded"
                                checked={config.maintenance_mode}
                                onChange={(e) => setConfig({ ...config, maintenance_mode: e.target.checked })}
                            />
                            <label htmlFor="maint" className="cursor-pointer">
                                <span className="block font-medium">Modo Mantenimiento</span>
                                <span className="text-xs text-secondary">El sitio mostrará una página de "En Construcción" a los visitantes.</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-md">
                            <input
                                type="checkbox"
                                id="debug"
                                className="w-5 h-5 text-blue-600 rounded"
                                checked={config.debug_mode}
                                onChange={(e) => setConfig({ ...config, debug_mode: e.target.checked })}
                            />
                            <label htmlFor="debug" className="cursor-pointer">
                                <span className="block font-medium">Modo Depuración (Debug)</span>
                                <span className="text-xs text-secondary">Muestra errores detallados. No usar en producción.</span>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* 2. Server Status (Read Only) */}
                <Card className="p-lg bg-gray-50 border-gray-200 shadow-none">
                    <h2 className="heading-3 mb-md flex items-center gap-sm">
                        <Activity size={20} /> Estado del Servidor
                    </h2>
                    <div className="grid grid-2 gap-md text-sm"> {/* Mini grid for status items */}
                        <div className="flex-column p-xs border-b border-gray-200">
                            <span className="text-secondary text-xs uppercase tracking-wider mb-1">Versión PHP</span>
                            <span className="font-mono font-bold text-lg">{serverInfo.php_version}</span>
                        </div>
                        <div className="flex-column p-xs border-b border-gray-200">
                            <span className="text-secondary text-xs uppercase tracking-wider mb-1">Servidor Web</span>
                            <span className="font-mono font-bold">{serverInfo.server_software}</span>
                        </div>
                        <div className="flex-column p-xs border-b border-gray-200">
                            <span className="text-secondary text-xs uppercase tracking-wider mb-1">Límite de Subida</span>
                            <span className="font-mono font-bold">{serverInfo.upload_max_filesize}</span>
                        </div>
                        <div className="flex-column p-xs border-b border-gray-200">
                            <span className="text-secondary text-xs uppercase tracking-wider mb-1">Tiempo Máx.</span>
                            <span className="font-mono font-bold">{serverInfo.max_execution_time}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-md p-md bg-green-50 text-green-700 rounded border border-green-200">
                        <span className="font-bold">Estado ACIDE:</span>
                        <span className="flex items-center gap-1 font-medium">Activo ✅</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
