import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use centralized AuthService (handles marco_token, api interceptors, etc)
      await authService.login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-root" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--dashboard-color-surface)'
    }}>
      <div className="dashboard-card" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem',
        border: '1px solid var(--dashboard-color-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="dashboard-heading" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Marco CMS</h1>
          <p style={{ color: 'var(--dashboard-color-text-muted)' }}>Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              className="dashboard-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin@gestasai.com"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--dashboard-color-border)', background: 'var(--dashboard-color-bg)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Contraseña</label>
            <input
              type="password"
              className="dashboard-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--dashboard-color-border)', background: 'var(--dashboard-color-bg)' }}
            />
          </div>
          {error && <div style={{ color: 'var(--dashboard-color-danger)', fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.375rem' }}>{error}</div>}
          <button
            type="submit"
            className="dashboard-btn dashboard-btn-primary"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}