import React from 'react';
import { Mail, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import { authService } from '../../services/auth/authService';

export const UserTable = ({ users, onEdit, onDelete }) => {
    const isCurrentUserSuperAdmin = authService.isSuperAdmin();

    if (users.length === 0) {
        return (
            <div className="p-xl text-center">
                <div className="text-secondary mb-md">No se encontraron usuarios.</div>
                <p className="text-xs text-gray-400">Verifica que el Bridge de GestasAI esté activo y que el plugin tenga permisos.</p>
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-gray-400">
                    <th className="px-lg py-md">Usuario</th>
                    <th className="px-lg py-md">Rol</th>
                    <th className="px-lg py-md">Estado</th>
                    <th className="px-lg py-md text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {users.map(user => {
                    const isUserSuperAdmin = user.roles && (user.roles.includes('super_admin') || user.roles.includes('super admin'));
                    const canEdit = isCurrentUserSuperAdmin || !isUserSuperAdmin;

                    return (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-lg py-lg">
                                <div className="flex items-center gap-md">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex-center font-bold">
                                        {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{user.name || 'Sin nombre'}</div>
                                        <div className="text-xs text-secondary flex items-center gap-1">
                                            <Mail size={12} /> {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-lg py-lg">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                                    {user.roles && user.roles[0] ? user.roles[0].replace('_', ' ') : 'Sin Rol'}
                                </span>
                            </td>
                            <td className="px-lg py-lg">
                                {user.status === 'active' ? (
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <CheckCircle size={14} /> Activo
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                        <XCircle size={14} /> {user.status || 'Inactivo'}
                                    </span>
                                )}
                            </td>
                            <td className="px-lg py-lg text-right">
                                <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className={`p-2 rounded-lg transition-colors ${canEdit ? 'hover:bg-blue-50 text-blue-600' : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        disabled={!canEdit}
                                        title={!canEdit ? "No tienes permisos para editar un Super Admin" : "Editar"}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className={`p-2 rounded-lg transition-colors ${canEdit ? 'hover:bg-red-50 text-red-500' : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        disabled={!canEdit}
                                        title={!canEdit ? "No tienes permisos para eliminar un Super Admin" : "Eliminar"}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
