import React from 'react';
import { ShieldAlert, User as UserIcon, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

export const UsersHeader = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex-between mb-xl">
            <div>
                <h1 className="heading-2 flex items-center gap-sm">
                    <ShieldAlert className="text-blue-600" /> Seguridad y Usuarios
                </h1>
                <p className="text-secondary">Gestiona quién tiene acceso y qué puede hacer.</p>
            </div>
            <div className="flex gap-md">
                <Button
                    variant={activeTab === 'users' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('users')}
                >
                    <UserIcon size={18} className="mr-2" /> Usuarios
                </Button>
                <Button
                    variant={activeTab === 'roles' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('roles')}
                >
                    <Shield size={18} className="mr-2" /> Roles y Permisos
                </Button>
            </div>
        </div>
    );
};
