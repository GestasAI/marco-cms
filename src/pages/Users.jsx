import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Shield,
    ShieldAlert,
    Plus,
    Edit2,
    Trash2,
    Search,
    CheckCircle,
    XCircle,
    Mail,
    UserPlus,
    X as XCircleIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { userService } from '../services/userService';
import api from '../services/api';

export default function Users() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals state
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [userForm, setUserForm] = useState({
        full_name: '',
        email: '',
        password: '',
        role_id: 'viewer',
        status: 'active',
        is_active: true
    });

    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // 1. Verificar identidad (Debug)
            console.log("📡 [Users] Verificando identidad...");
            try {
                const me = await userService.getMe();
                console.log("✅ [Users] Identidad confirmada:", me);
            } catch (meError) {
                console.error("❌ [Users] Error en /api/me:", meError);
            }

            // 2. Cargar datos administrativos
            const [usersData, rolesData, permsData] = await Promise.all([
                userService.getAllUsers(),
                userService.getAllRoles(),
                userService.getAllPermissions()
            ]);
            setUsers(usersData || []);
            setRoles(rolesData || []);
            setPermissions(permsData || []);
            console.log(`✅ [Users] Datos cargados: ${usersData?.length} usuarios, ${rolesData?.length} roles, ${permsData?.length} permisos.`);
        } catch (error) {
            console.error("❌ [Users] Error cargando datos administrativos:", error);
            const serverMsg = error.response?.data?.message || error.response?.data?.error;

            if (error.response?.status === 401) {
                alert(`No autorizado: ${serverMsg || 'Tu usuario no tiene rango de administrador o la sesión ha expirado.'}`);
            } else if (error.response?.status === 403) {
                alert(`Acceso denegado: ${serverMsg || 'No tienes permisos suficientes para gestionar la seguridad.'}`);
            } else {
                alert(`Error de conexión: ${serverMsg || 'No se pudo contactar con el servicio de autenticación.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            const data = { ...userForm };
            if (editingItem && !data.password) delete data.password;

            if (editingItem) {
                await userService.updateUser(editingItem.id, data);
            } else {
                await userService.createUser(data);
            }
            setIsUserModalOpen(false);
            loadData();
        } catch (error) {
            console.error("❌ Error guardando usuario:", error);
            const msg = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Error al guardar el usuario: ${msg}`);
        }
    };

    const handleSaveRole = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await userService.updateRole(editingItem.id, roleForm);
            } else {
                await userService.createRole(roleForm);
            }
            setIsRoleModalOpen(false);
            loadData();
        } catch (error) {
            console.error("❌ Error guardando rol:", error);
            const msg = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Error al guardar el rol: ${msg}`);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            await userService.deleteUser(id);
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
        try {
            await userService.deleteRole(id);
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
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

            {/* Content */}
            <Card className="overflow-hidden">
                {/* Toolbar */}
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
                    <Button variant="primary" onClick={() => {
                        setEditingItem(null);
                        if (activeTab === 'users') {
                            setUserForm({ full_name: '', email: '', password: '', role_id: roles[0]?.id || '', is_active: true });
                            setIsUserModalOpen(true);
                        } else {
                            setRoleForm({ name: '', description: '', permissions: [] });
                            setIsRoleModalOpen(true);
                        }
                    }}>
                        {activeTab === 'users' ? <UserPlus size={18} className="mr-2" /> : <Shield size={18} className="mr-2" />}
                        {activeTab === 'users' ? 'Añadir Usuario' : 'Crear Rol'}
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-xl text-center text-secondary">Cargando datos desde la API Universal...</div>
                    ) : (activeTab === 'users' ? filteredUsers : roles).length === 0 ? (
                        <div className="p-xl text-center">
                            <div className="text-secondary mb-md">No se encontraron {activeTab === 'users' ? 'usuarios' : 'roles'}.</div>
                            <p className="text-xs text-gray-400">Verifica que el Bridge de GestasAI esté activo y que el plugin tenga permisos.</p>
                        </div>
                    ) : activeTab === 'users' ? (
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
                                {filteredUsers.map(user => (
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
                                                    onClick={() => {
                                                        setEditingItem(user);
                                                        setUserForm({
                                                            full_name: user.name || '',
                                                            email: user.email || '',
                                                            password: '',
                                                            role_id: user.roles && user.roles[0] ? user.roles[0] : 'viewer',
                                                            status: user.status || 'active',
                                                            is_active: user.status === 'active'
                                                        });
                                                        setIsUserModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
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
                                {roles.map(role => (
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
                                                {role.permissions?.slice(0, 3).map(p => (
                                                    <span key={p} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold">
                                                        {p}
                                                    </span>
                                                ))}
                                                {role.permissions?.length > 3 && (
                                                    <span className="text-[9px] text-gray-400 font-bold">+{role.permissions.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-lg py-lg text-right">
                                            <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(role);
                                                        setRoleForm(role);
                                                        setIsRoleModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* User Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center z-[100] p-lg">
                    <Card className="w-full max-md p-xl animate-scale-up">
                        <div className="flex-between mb-lg">
                            <h3 className="heading-3">{editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircleIcon size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveUser} className="space-y-md">
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
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
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
            )}

            {/* Role Modal */}
            {isRoleModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center z-[100] p-lg">
                    <Card className="w-full max-w-2xl p-xl animate-scale-up">
                        <div className="flex-between mb-lg">
                            <h3 className="heading-3">{editingItem ? 'Editar Rol' : 'Nuevo Rol'}</h3>
                            <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircleIcon size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveRole} className="space-y-md">
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
                                            onClick={() => {
                                                const allSelected = roleForm.permissions?.length === permissions.length;
                                                setRoleForm({ ...roleForm, permissions: allSelected ? [] : [...permissions] });
                                            }}
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
                                                        onChange={e => {
                                                            const newPerms = e.target.checked
                                                                ? [...(roleForm.permissions || []), perm]
                                                                : (roleForm.permissions || []).filter(p => p !== perm);
                                                            setRoleForm({ ...roleForm, permissions: newPerms });
                                                        }}
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
            )}
        </div>
    );
}
