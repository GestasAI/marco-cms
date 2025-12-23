import React from 'react';
import { Search, UserPlus, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const UsersToolbar = ({ activeTab, searchTerm, setSearchTerm, onAddClick }) => {
    return (
        <div className="p-lg border-b border-gray-100 flex-between bg-gray-50/50">
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                    className="pl-10"
                    placeholder={activeTab === 'users' ? "Buscar usuarios..." : "Buscar roles..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="primary" onClick={onAddClick}>
                {activeTab === 'users' ? <UserPlus size={18} className="mr-2" /> : <Shield size={18} className="mr-2" />}
                {activeTab === 'users' ? 'Añadir Usuario' : 'Crear Rol'}
            </Button>
        </div>
    );
};
