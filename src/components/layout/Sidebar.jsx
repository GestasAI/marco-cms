import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Settings, Palette } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Páginas', path: '/pages' },
        { icon: BarChart3, label: 'Posts', path: '/posts' },
        { icon: Palette, label: 'Tema', path: '/theme-settings' },
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
                    <Link
                        key={index}
                        to={item.path}
                        className="nav-item"
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
