import { userService as user } from './user/userService';
import { roleService as role } from './user/roleService';
import { permissionService as perm } from './user/permissionService';

// Unified export for legacy compatibility
export const userService = {
    ...user,
    ...role,
    ...perm
};
