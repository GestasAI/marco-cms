import React from 'react';
import { X as XCircleIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const RoleModal = ({ isOpen, onClose, onSave, editingItem, roleForm, setRoleForm, permissions }) => {
    if (!isOpen) return null;

    const handleToggleAll = () => {
        const allSelected = roleForm.permissions?.length === permissions.length;
        setRoleForm({ ...roleForm, permissions: allSelected ? [] : [...permissions] });
    };

    const handleTogglePermission = (perm) => {
        const newPerms = roleForm.permissions?.includes(perm)
            ? (roleForm.permissions || []).filter(p => p !== perm)
            : [...(roleForm.permissions || []), perm];
        setRoleForm({ ...roleForm, permissions: newPerms });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center z-[100] p-lg">
            <Card className="w-full max-w-2xl p-xl animate-scale-up">
                <div className="flex-between mb-lg">
                    <h3 className="heading-3">{editingItem ? 'Editar Rol' : 'Nuevo Rol'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircleIcon size={24} /></button>
                </div>
                <form onSubmit={onSave} className="space-y-md">
                    <div className="grid grid-2 gap-lg">
                        <div className="space-y-md">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nombre del Rol</label>
                                <Input
                                    required
                                    value={roleForm.name}
                                    onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                                <textarea
                                    className="dashboard-input w-full h-24"
                                    value={roleForm.description}
                                    onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex-between mb-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Permisos / Características</label>
                                <button
                                    type="button"
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                                    onClick={handleToggleAll}
                                >
                                    {roleForm.permissions?.length === permissions.length ? 'Desmarcar todos' : 'Marcar todos'}
                                </button>
                            </div>
                            <div className="h-48 overflow-y-auto border border-gray-100 rounded-xl p-md space-y-2 custom-scrollbar-light bg-gray-50/30">
                                {permissions.length === 0 ? (
                                    <div className="text-center py-xl text-gray-400 text-xs italic">
                                        No se han detectado características disponibles.<br />
                                        Verifica la conexión con el Bridge.
                                    </div>
                                ) : (
                                    permissions.map(perm => (
                                        <label key={perm} className="flex items-center gap-md p-sm hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-100">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                checked={roleForm.permissions?.includes(perm)}
                                                onChange={() => handleTogglePermission(perm)}
                                            />
                                            <span className="text-sm font-medium text-gray-700">{perm}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-md">
                        <Button variant="primary" className="w-full py-lg" type="submit">
                            {editingItem ? 'Actualizar Rol' : 'Crear Rol'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
