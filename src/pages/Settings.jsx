import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, Globe, Shield } from 'lucide-react';
import acideService from '../services/acideService';

export default function Settings() {
    const [config, setConfig] = useState({
        siteTitle: '',
        siteDescription: '',
        adminEmail: '',
        language: 'es',
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            // Buscamos la configuración global. ID fijo 'global_config' en colección 'settings'
            const data = await acideService.findById('settings', 'global_config');
            if (data) {
                setConfig(data);
            } else {
                // Valores por defecto si no existe
                setConfig({
                    siteTitle: 'Marco CMS Site',
                    siteDescription: 'Sitio construido con GestasAI',
                    adminEmail: 'admin@gestasai.com',
                    language: 'es',
                    maintenanceMode: false
                });
            }
        } catch (error) {
            console.error('Error loading config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Creamos o actualizamos el documento 'global_config'
            // Nota: ACIDService.update requiere ID. Si no existe, usamos create con ID manual si el backend lo permite, 
            // o asumimos que update maneja upsert, o hacemos check previo.
            // Para simplificar, intentaremos update, si falla, create.

            // Simulación lógica upsert
            const exists = await acideService.findById('settings', 'global_config');
            if (exists) {
                await acideService.update('settings', 'global_config', config);
            } else {
                // Aseguramos que el objeto tenga id
                await acideService.create('settings', { ...config, id: 'global_config' });
            }

            alert('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Cargando configuración...</div>;

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="mb-lg">
                <h1 className="heading-2">Configuración General</h1>
                <p className="text-secondary">Ajustes globales del sitio y SEO básico</p>
            </div>

            <Card className="mb-xl">
                <CardHeader
                    title="Identidad del Sitio"
                    subtitle="Cómo aparece tu sitio en buscadores y barra de título"
                />
                <CardBody>
                    <div className="grid gap-md">
                        <Input
                            id="siteTitle"
                            label="Título del Sitio"
                            icon={Globe}
                            value={config.siteTitle}
                            onChange={handleChange}
                            placeholder="Ej: Mi Pizzería Increíble"
                        />

                        <div className="form-group">
                            <label className="label" htmlFor="siteDescription">Descripción Corta</label>
                            <textarea
                                id="siteDescription"
                                className="form-input"
                                value={config.siteDescription}
                                onChange={handleChange}
                                rows={3}
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                            <p className="text-xs text-secondary mt-xs">Recomendado: 150-160 caracteres para SEO.</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="mb-xl">
                <CardHeader
                    title="Administración"
                    subtitle="Opciones de contacto y seguridad"
                />
                <CardBody>
                    <Input
                        id="adminEmail"
                        label="Email de Administrador"
                        type="email"
                        icon={Shield}
                        value={config.adminEmail}
                        onChange={handleChange}
                    />

                    <div className="form-group mt-md flex items-center gap-sm">
                        <input
                            type="checkbox"
                            id="maintenanceMode"
                            checked={config.maintenanceMode}
                            onChange={handleChange}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="maintenanceMode" className="cursor-pointer">
                            Activar Modo Mantenimiento
                        </label>
                    </div>
                </CardBody>
                <CardFooter className="flex justify-end bg-gray-50">
                    <Button
                        icon={Save}
                        onClick={handleSave}
                        loading={saving}
                    >
                        Guardar Cambios
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
