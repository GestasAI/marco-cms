import { Menu, Bell, User } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Header({ onMenuClick, onLogout }) {
    const user = authService.getUser();

    return (
        <header style={{
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border, #e5e7eb)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={onMenuClick}
                    className="btn btn-ghost"
                    style={{ padding: '0.5rem', display: 'none' }} // Mostrar en mobile con media query si necesario
                    aria-label="Menu"
                >
                    <Menu size={24} />
                </button>
                <h2 className="heading-3" style={{ margin: 0 }}>
                    Dashboard
                </h2>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-ghost" style={{ position: 'relative', padding: '0.5rem' }}>
                    <Bell size={20} style={{ color: 'var(--color-text-light)' }} />
                    <span style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 8,
                        height: 8,
                        background: '#ef4444',
                        borderRadius: '50%'
                    }}></span>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingLeft: '1rem',
                    borderLeft: '1px solid var(--color-border, #e5e7eb)'
                }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
                            {user?.name || 'Usuario'}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
                            {user?.email || 'admin@gestasai.com'}
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        style={{
                            width: 40,
                            height: 40,
                            background: 'var(--color-primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
