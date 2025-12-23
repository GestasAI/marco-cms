import { useState } from 'react';
import { roleService } from '../services/user/roleService';

export const useRolesManager = (roles, permissions, loadData) => {
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: []
    });

    const openAddRoleModal = () => {
        setEditingRole(null);
        setRoleForm({ name: '', description: '', permissions: [] });
        setIsRoleModalOpen(true);
    };

    const openEditRoleModal = (role) => {
        setEditingRole(role);
        // Asegurarnos de que los permisos sean un array de strings (nombres)
        const roleData = { ...role };
        if (roleData.permissions && roleData.permissions.length > 0 && typeof roleData.permissions[0] === 'object') {
            roleData.permissions = roleData.permissions.map(p => p.name || p.id);
        }
        setRoleForm(roleData);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingRole) {
                await roleService.updateRole(editingRole.id, roleForm);
            } else {
                await roleService.createRole(roleForm);
            }
            setIsRoleModalOpen(false);
            loadData();
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`Error al guardar el rol: ${msg}`);
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
        try {
            await roleService.deleteRole(id);
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    return {
        isRoleModalOpen, setIsRoleModalOpen,
        editingRole,
        roleForm, setRoleForm,
        openAddRoleModal, openEditRoleModal,
        handleSaveRole, handleDeleteRole
    };
};
