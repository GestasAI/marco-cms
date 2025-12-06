import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Settings, Palette } from 'lucide-react';
import '../components/Sidebar.css';

export default function Sidebar() {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Páginas', path: '/pages' },
        { icon: BarChart3, label: 'Posts', path: '/posts' },
        { icon: Palette, label: 'Tema', path: '/site-settings' }, // Apuntando a site-settings que es la ruta en App.jsx
        { icon: Settings, label: 'Configuración', path: '/settings' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Marco CMS</h2>
                <p>Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}