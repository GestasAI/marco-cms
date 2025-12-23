import { useState } from 'react';
import { userService } from '../services/user/userService';

export const useUsersManager = (users, roles, loadData) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userForm, setUserForm] = useState({
        full_name: '',
        email: '',
        password: '',
        role_id: 'viewer',
        status: 'active',
        is_active: true
    });

    const openAddUserModal = () => {
        setEditingUser(null);
        setUserForm({
            full_name: '',
            email: '',
            password: '',
            role_id: roles[0]?.id || 'viewer',
            status: 'active',
            is_active: true
        });
        setIsUserModalOpen(true);
    };

    const openEditUserModal = (user) => {
        setEditingUser(user);
        setUserForm({
            full_name: user.name || '',
            email: user.email || '',
            password: '',
            role_id: user.roles && user.roles[0] ? user.roles[0] : 'viewer',
            status: user.status || 'active',
            is_active: user.status === 'active'
        });
        setIsUserModalOpen(true);
    };

    const handleSaveUser = async (e) => {
        if (e) e.preventDefault();
        try {
            const data = { ...userForm };

            // Mapear el ID del rol al nombre técnico si es posible
            // Esto asegura que el backend reciba el nombre del rol (admin, editor, etc.)
            // que es lo que espera en el array 'roles'.
            const selectedRole = roles.find(r => r.id === data.role_id);
            if (selectedRole) {
                // El backend espera nombres como 'admin', 'editor', 'viewer'
                const roleNameMap = {
                    'SuperAdmin': 'super_admin',
                    'Administrador': 'admin',
                    'Editor': 'editor',
                    'Visor': 'viewer',
                    'Cliente': 'client'
                };
                const technicalName = roleNameMap[selectedRole.name] || selectedRole.name.toLowerCase();
                data.roles = [technicalName];
            }

            if (editingUser && !data.password) delete data.password;

            if (editingUser) {
                await userService.updateUser(editingUser.id, data);
            } else {
                await userService.createUser(data);
            }
            setIsUserModalOpen(false);
            loadData();
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Error al guardar el usuario: ${msg}`);
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

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        isUserModalOpen, setIsUserModalOpen,
        editingUser,
        searchTerm, setSearchTerm,
        userForm, setUserForm,
        filteredUsers,
        openAddUserModal, openEditUserModal,
        handleSaveUser, handleDeleteUser
    };
};
