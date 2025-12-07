import { Menu, Bell, User } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Header({ onMenuClick, onLogout }) {
    const user = authService.getUser();

    return (
        <header style={{
            background: 'var(--dashboard-color-surface)',
            borderBottom: '1px solid var(--dashboard-color-border)',
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
                    className="dashboard-btn"
                    style={{ padding: '0.5rem', display: 'none', background: 'transparent' }}
                    aria-label="Menu"
                >
                    <Menu size={24} color="var(--dashboard-color-text)" />
                </button>
                <h2 className="dashboard-heading" style={{ margin: 0, fontSize: '1.25rem' }}>
                    Dashboard
                </h2>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="dashboard-btn" style={{ position: 'relative', padding: '0.5rem', background: 'transparent' }}>
                    <Bell size={20} style={{ color: 'var(--dashboard-color-text-muted)' }} />
                    <span style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 8,
                        height: 8,
                        background: 'var(--dashboard-color-danger)',
                        borderRadius: '50%'
                    }}></span>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingLeft: '1rem',
                    borderLeft: '1px solid var(--dashboard-color-border)'
                }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--dashboard-color-text)' }}>
                            {user?.name || 'Usuario'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--dashboard-color-text-muted)' }}>
                            {user?.email || 'admin@gestasai.com'}
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="dashboard-btn dashboard-btn-primary"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0
                        }}
                    >
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
