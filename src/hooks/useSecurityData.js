import { useState, useEffect } from 'react';
import { userService } from '../services/user/userService';
import { roleService } from '../services/user/roleService';
import { permissionService } from '../services/user/permissionService';
import { authService } from '../services/auth/authService';

export const useSecurityData = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            console.log("📡 [SecurityData] Cargando datos...");

            const [usersData, rolesData, permsData] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles(),
                permissionService.getAllPermissions()
            ]);

            let filteredRoles = rolesData || [];

            // Deduplicar roles por nombre para evitar duplicados en el select
            const seenNames = new Set();
            filteredRoles = filteredRoles.filter(role => {
                const name = (role.name || '').toLowerCase().trim();
                if (!name || seenNames.has(name)) return false;
                seenNames.add(name);
                return true;
            });

            if (!authService.isSuperAdmin()) {
                filteredRoles = filteredRoles.filter(r => {
                    const name = (r.name || '').toLowerCase().replace(' ', '');
                    const id = (r.id || '').toLowerCase();
                    return name !== 'superadmin' && id !== 'super_admin';
                });
            }

            setUsers(usersData || []);
            setRoles(filteredRoles);
            setPermissions(permsData || []);

            console.log(`✅ [SecurityData] Datos cargados: ${usersData?.length} usuarios, ${rolesData?.length} roles.`);
        } catch (error) {
            console.error("❌ [SecurityData] Error cargando datos:", error);
            const serverMsg = error.response?.data?.message || error.response?.data?.error;
            alert(`Error de conexión: ${serverMsg || 'Error al obtener datos del servicio.'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { users, roles, permissions, loading, loadData };
};
