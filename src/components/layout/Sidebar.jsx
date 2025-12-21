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
    Download
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart3, label: 'Posts', path: '/dashboard/posts' },
        { icon: FileText, label: 'Páginas', path: '/dashboard/pages' },
        { icon: ShoppingBag, label: 'Productos', path: '/dashboard/products' },
        { icon: Megaphone, label: 'Anuncios', path: '/dashboard/ads' },
        { icon: FolderTree, label: 'Categorías', path: '/dashboard/categories' },
        { icon: Tags, label: 'Etiquetas', path: '/dashboard/tags' },
        { icon: Image, label: 'Medios', path: '/dashboard/media' },
        { icon: GraduationCap, label: 'Academia', path: '/dashboard/academy' },
        { icon: Users, label: 'Usuarios', path: '/dashboard/users' },
        { divider: true },
        { icon: Palette, label: 'Temas', path: '/dashboard/themes' },
        { icon: Palette, label: 'Partes de Tema', path: '/dashboard/theme-parts' },
        { icon: Search, label: 'SEO', path: '/dashboard/seo' },
        { icon: Download, label: 'Generar Sitio', path: '/dashboard/build' },
        { icon: Settings, label: 'Sistema', path: '/dashboard/settings' }
    ];

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


