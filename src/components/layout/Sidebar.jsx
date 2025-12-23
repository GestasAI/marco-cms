import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    Palette,
    ShoppingBag,
    Megaphone,
    FolderTree,
    Tags,
    Search,
    Image,
    GraduationCap,
    Users,
    Download,
    Book
} from 'lucide-react';

import { authService } from '../../services/auth/authService';

export default function Sidebar({ isOpen, onClose, user: propUser }) {
    const location = useLocation();

    // Usar el usuario de props si existe, si no el del servicio
    const user = propUser || authService.getUser();

    const isSuperAdmin = authService.isSuperAdmin(user);
    const isAdmin = authService.isAdmin(user);
    const isEditor = authService.isEditor(user);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart3, label: 'Posts', path: '/dashboard/posts', show: isEditor },
        { icon: FileText, label: 'Páginas', path: '/dashboard/pages', show: isEditor },
        { icon: ShoppingBag, label: 'Productos', path: '/dashboard/products', show: isEditor },
        { icon: Megaphone, label: 'Anuncios', path: '/dashboard/ads', show: isEditor },
        { icon: FolderTree, label: 'Categorías', path: '/dashboard/categories', show: isEditor },
        { icon: Tags, label: 'Etiquetas', path: '/dashboard/tags', show: isEditor },
        { icon: Image, label: 'Medios', path: '/dashboard/media', show: isEditor },
        { icon: GraduationCap, label: 'Academia', path: '/dashboard/academy' },
        { icon: Users, label: 'Usuarios', path: '/dashboard/users', show: isAdmin },
        { divider: true, show: isEditor },
        { icon: Palette, label: 'Temas', path: '/dashboard/themes', show: isEditor },
        { icon: Palette, label: 'Partes de Tema', path: '/dashboard/theme-parts', show: isEditor },
        { icon: Search, label: 'SEO', path: '/dashboard/seo', show: isEditor },
        { icon: Download, label: 'Generar Sitio', path: '/dashboard/build', show: isAdmin },
        { icon: Settings, label: 'Sistema', path: '/dashboard/settings', show: isAdmin },
        { icon: Book, label: 'Documentación', path: '/dashboard/documentation', show: isAdmin }
    ].filter(item => item.show !== false);

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Header del Sidebar */}
            <div className="sidebar-header p-lg" style={{ borderBottom: '1px solid var(--dashboard-color-border)' }}>
                <h2 className="heading-3 mb-xs">Marco CMS</h2>
                <p className="text-secondary text-xs">GestasAI Admin</p>
            </div>

            {/* Navegación */}
            <nav className="p-md flex-column gap-xs overflow-y-auto flex-1">
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return <div key={index} className="my-sm border-t border-gray-100" />;
                    }

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`dashboard-btn dashboard-btn-ghost justify-start ${isActive(item.path) ? 'active' : ''}`}
                            style={{
                                backgroundColor: isActive(item.path) ? 'var(--dashboard-color-bg)' : 'transparent',
                                color: isActive(item.path) ? 'var(--dashboard-color-primary)' : 'inherit',
                                fontWeight: isActive(item.path) ? '600' : '500'
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-md border-t border-gray-100">
                <p className="text-secondary text-xs text-center">v1.0.0 Alpha</p>
            </div>
        </aside>
    );
}


