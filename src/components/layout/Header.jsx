import { Menu, Bell, User } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Header({ onMenuClick, onLogout }) {
    const user = authService.getUser();

    return (
        <header className="dashboard-header">
            {/* Left side */}
            <div className="flex items-center gap-md">
                <button
                    onClick={onMenuClick}
                    className="dashboard-btn lg:hidden"
                    aria-label="Menu"
                >
                    <Menu size={20} />
                </button>
                <h2 className="heading-4" style={{ margin: 0 }}>
                    Dashboard
                </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-md">
                <button className="dashboard-btn" style={{ position: 'relative' }}>
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 6,
                        height: 6,
                        background: '#ef4444',
                        borderRadius: '50%'
                    }}></span>
                </button>

                <div className="header-user-info">
                    <div className="flex-column" style={{ textAlign: 'right' }}>
                        <span className="font-semibold" style={{ fontSize: '0.875rem' }}>
                            {user?.name || 'Usuario'}
                        </span>
                        <span className="text-xs text-secondary">
                            {user?.email || 'admin@gestasai.com'}
                        </span>
                    </div>
                    <div className="user-avatar" onClick={onLogout} title="Cerrar sesión">
                        {user?.name?.charAt(0) || <User size={18} />}
                    </div>
                </div>
            </div>
        </header>
    );
}
