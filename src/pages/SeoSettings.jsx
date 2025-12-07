import React, { useState, useEffect } from 'react';
import { acideService } from '../acide/acideService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Globe, Search, Link as LinkIcon, Save } from 'lucide-react';

export default function SeoSettings() {
    const [config, setConfig] = useState({
        site_title: '',
        site_description: '',
        permalink_structure: 'post_name', // plain, post_name, category_name
        seo_separator: '|',
        social_twitter: '',
        social_facebook: '',
        index_site: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSeoConfig();
    }, []);

    const loadSeoConfig = async () => {
        try {
            setLoading(true);
            // We use a specific ID 'seo_config' in 'settings' collection
            const data = await acideService.get('settings', 'seo_config');
            if (data) {
                setConfig(prev => ({ ...prev, ...data }));
            } else {
                // Try moving from global_config if seo_config doesn't exist yet (Migration support)
                const global = await acideService.get('settings', 'global_config');
                if (global) {
                    setConfig(prev => ({
                        ...prev,
                        site_title: global.site_title || prev.site_title,
                        site_description: global.site_description || prev.site_description
                    }));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await acideService.update('settings', 'seo_config', config);

            // Also update global_config for compatibility if needed, or we decide SEO config is the source of truth for Title
            // For now, let's keep them synced or migrate towards seo_config.
            // Let's just save seo_config.

            alert('Ajustes SEO guardados correctamente.');
        } catch (error) {
            console.error(error);
            alert('Error al guardar ajustes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-xl text-center">Cargando configuración SEO...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex-between mb-xl">
                <div>
                    <h1 className="heading-2 flex items-center gap-sm">
                        <Search className="text-blue-600" /> SEO y Enlaces
                    </h1>
                    <p className="text-secondary">Optimización para buscadores y estructura de URLs.</p>
                </div>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="animate-spin mr-2">⏳</span> : <Save size={18} className="mr-2" />}
                    Guardar
                </Button>
            </div>

            <div className="grid gap-lg">
                {/* 1. Identidad en Buscadores */}
                <Card className="p-lg">
                    <h2 className="heading-3 mb-md flex items-center gap-sm">
                        <Globe size={20} /> Identidad del Sitio
                    </h2>
                    <div className="grid gap-md">
                        <div>
                            <label className="block text-sm font-medium mb-xs">Título del Sitio</label>
                            <Input
                                value={config.site_title}
                                onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
                                placeholder="Ej: Mi Empresa Increíble"
                            />
                            <p className="text-xs text-secondary mt-xs">Aparece en la pestaña del navegador y en Google.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-xs">Descripción Meta (Tagline)</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                value={config.site_description}
                                onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
                                placeholder="Una breve descripción de tu sitio..."
                            />
                            <p className="text-xs text-secondary mt-xs">Recomendado: 150-160 caracteres.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-xs">Separador de Título</label>
                            <div className="flex gap-md">
                                {['|', '-', '•', '»'].map(sep => (
                                    <label key={sep} className="flex items-center gap-xs cursor-pointer">
                                        <input
                                            type="radio"
                                            name="separator"
                                            value={sep}
                                            checked={config.seo_separator === sep}
                                            onChange={(e) => setConfig({ ...config, seo_separator: e.target.value })}
                                        />
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{sep}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 2. Permalinks (URLs Amigables) */}
                <Card className="p-lg">
                    <h2 className="heading-3 mb-md flex items-center gap-sm">
                        <LinkIcon size={20} /> Enlaces Permanentes (Permalinks)
                    </h2>
                    <p className="text-secondary text-sm mb-lg">Elige la estructura de URLs para tus posts. Esto afecta al SEO.</p>

                    <div className="space-y-4">
                        <label className="flex items-center gap-md p-md border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="permalink"
                                value="plain"
                                checked={config.permalink_structure === 'plain'}
                                onChange={(e) => setConfig({ ...config, permalink_structure: e.target.value })}
                            />
                            <div>
                                <span className="font-bold block">Simple</span>
                                <code className="text-xs text-secondary">midominio.com/?p=123</code>
                            </div>
                        </label>

                        <label className="flex items-center gap-md p-md border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="permalink"
                                value="post_name"
                                checked={config.permalink_structure === 'post_name'}
                                onChange={(e) => setConfig({ ...config, permalink_structure: e.target.value })}
                            />
                            <div>
                                <span className="font-bold block">Nombre de la entrada (Recomendado)</span>
                                <code className="text-xs text-secondary">midominio.com/pagina-ejemplo</code>
                            </div>
                        </label>

                        <label className="flex items-center gap-md p-md border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="permalink"
                                value="category_name"
                                checked={config.permalink_structure === 'category_name'}
                                onChange={(e) => setConfig({ ...config, permalink_structure: e.target.value })}
                            />
                            <div>
                                <span className="font-bold block">Categoría y Nombre</span>
                                <code className="text-xs text-secondary">midominio.com/categoria/pagina-ejemplo</code>
                            </div>
                        </label>
                    </div>
                </Card>
            </div>
        </div>
    );
}
