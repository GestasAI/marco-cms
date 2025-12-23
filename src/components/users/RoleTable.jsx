import React from 'react';
import { Shield, Edit2, Trash2 } from 'lucide-react';
import { authService } from '../../services/auth/authService';

export const RoleTable = ({ roles, onEdit, onDelete }) => {
    if (roles.length === 0) {
        return (
            <div className="p-xl text-center">
                <div className="text-secondary mb-md">No se encontraron roles.</div>
                <p className="text-xs text-gray-400">Verifica que el Bridge de GestasAI esté activo y que el plugin tenga permisos.</p>
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-gray-400">
                    <th className="px-lg py-md">Rol</th>
                    <th className="px-lg py-md">Descripción</th>
                    <th className="px-lg py-md">Permisos</th>
                    <th className="px-lg py-md text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {roles.map(role => {
                    const isSuperAdminRole = role.name.toLowerCase().replace(' ', '') === 'superadmin';
                    const isCurrentUserSuperAdmin = authService.isSuperAdmin();
                    const isCurrentUserAdmin = authService.isAdmin();

                    // Solo el SuperAdmin puede editar el rol SuperAdmin.
                    // Los Admins pueden editar otros roles (Editor, Visor, etc.) incluso si son de sistema.
                    const canEdit = isCurrentUserSuperAdmin || (isCurrentUserAdmin && !isSuperAdminRole);
                    const canDelete = canEdit && !isSuperAdminRole; // No permitimos borrar el rol SuperAdmin por seguridad

                    return (
                        <tr key={role.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-lg py-lg">
                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                    <Shield size={16} className="text-blue-500" /> {role.name}
                                </div>
                            </td>
                            <td className="px-lg py-lg text-sm text-secondary">
                                {role.description}
                            </td>
                            <td className="px-lg py-lg">
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions?.slice(0, 3).map(p => {
                                        const name = typeof p === 'string' ? p : (p.name || p.id);
                                        return (
                                            <span key={name} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold">
                                                {name}
                                            </span>
                                        );
                                    })}
                                    {role.permissions?.length > 3 && (
                                        <span className="text-[9px] text-gray-400 font-bold">+{role.permissions.length - 3}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-lg py-lg text-right">
                                <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(role)}
                                        className={`p-2 rounded-lg transition-colors ${!canEdit
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'hover:bg-blue-50 text-blue-600'
                                            }`}
                                        disabled={!canEdit}
                                        title={!canEdit ? "No tienes permisos para editar este rol" : "Editar"}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(role.id)}
                                        className={`p-2 rounded-lg transition-colors ${!canDelete
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'hover:bg-red-50 text-red-500'
                                            }`}
                                        disabled={!canDelete}
                                        title={!canDelete ? "Este rol no puede ser eliminado" : "Eliminar"}
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
