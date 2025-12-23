import React from 'react';
import { X as XCircleIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authService } from '../../services/auth/authService';

export const UserModal = ({ isOpen, onClose, onSave, editingItem, userForm, setUserForm, roles }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center z-[100] p-lg">
            <Card className="w-full max-w-md p-xl animate-scale-up">
                <div className="flex-between mb-lg">
                    <h3 className="heading-3">{editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircleIcon size={24} /></button>
                </div>
                <form onSubmit={onSave} className="space-y-md">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nombre Completo</label>
                        <Input
                            required
                            value={userForm.full_name}
                            onChange={e => setUserForm({ ...userForm, full_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                        <Input
                            type="email"
                            required
                            value={userForm.email}
                            onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Contraseña {editingItem && '(dejar en blanco para no cambiar)'}</label>
                        <Input
                            type="password"
                            required={!editingItem}
                            value={userForm.password}
                            onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Rol</label>
                        <select
                            className="dashboard-input w-full"
                            value={userForm.role_id}
                            onChange={e => setUserForm({ ...userForm, role_id: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Estado</label>
                        <select
                            className="dashboard-input w-full"
                            value={userForm.status || 'active'}
                            onChange={e => setUserForm({ ...userForm, status: e.target.value })}
                        >
                            <option value="active">Activo - Acceso completo</option>
                            <option value="inactive">Inactivo - Sin acceso</option>
                            <option value="suspended">Suspendido - Acceso limitado</option>
                            <option value="pending">Pendiente - En verificación</option>
                        </select>
                    </div>
                    <div className="pt-md">
                        <Button variant="primary" className="w-full py-lg" type="submit">
                            {editingItem ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
