import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { useSecurityData } from '../hooks/useSecurityData';
import { useUsersManager } from '../hooks/useUsersManager';
import { useRolesManager } from '../hooks/useRolesManager';

// Granular Components
import { UsersHeader } from '../components/users/UsersHeader';
import { UsersToolbar } from '../components/users/UsersToolbar';
import { UserTable } from '../components/users/UserTable';
import { RoleTable } from '../components/users/RoleTable';
import { UserModal } from '../components/users/UserModal';
import { RoleModal } from '../components/users/RoleModal';

export default function Users() {
    const [activeTab, setActiveTab] = useState('users');
    const { users, roles, permissions, loading, loadData } = useSecurityData();

    const {
        isUserModalOpen, setIsUserModalOpen,
        editingUser,
        searchTerm, setSearchTerm,
        userForm, setUserForm,
        filteredUsers,
        openAddUserModal, openEditUserModal,
        handleSaveUser, handleDeleteUser
    } = useUsersManager(users, roles, loadData);

    const {
        isRoleModalOpen, setIsRoleModalOpen,
        editingRole,
        roleForm, setRoleForm,
        openAddRoleModal, openEditRoleModal,
        handleSaveRole, handleDeleteRole
    } = useRolesManager(roles, permissions, loadData);

    return (
        <div className="max-w-6xl mx-auto">
            <UsersHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <Card className="overflow-hidden">
                <UsersToolbar
                    activeTab={activeTab}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onAddClick={activeTab === 'users' ? openAddUserModal : openAddRoleModal}
                />

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-xl text-center text-secondary">Cargando datos desde la API Universal...</div>
                    ) : activeTab === 'users' ? (
                        <UserTable
                            users={filteredUsers}
                            onEdit={openEditUserModal}
                            onDelete={handleDeleteUser}
                        />
                    ) : (
                        <RoleTable
                            roles={roles}
                            onEdit={openEditRoleModal}
                            onDelete={handleDeleteRole}
                        />
                    )}
                </div>
            </Card>

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                editingItem={editingUser}
                userForm={userForm}
                setUserForm={setUserForm}
                roles={roles}
            />

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSave={handleSaveRole}
                editingItem={editingRole}
                roleForm={roleForm}
                setRoleForm={setRoleForm}
                permissions={permissions}
            />
        </div>
    );
}
