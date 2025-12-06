import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { API_URL } from '../config';
import { authService } from '../services/auth';

/**
 * 🔐 Componente Login
 * 
 * Corregido para usar SOLO variables CSS del theme.css
 * NO define colores, fuentes ni espaciados propios
 */

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Login sin tenant específico (Super Usuario / Global)
      const { user } = await authService.login(formData.email, formData.password);
      onLoginSuccess(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🚀</span>
              <h1 className="heading-2">Marco CMS</h1>
            </div>
            <p className="text-secondary text-center">
              Sistema de Gestión de Contenidos potenciado por GestasAI
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="link-primary">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p className="text-sm text-secondary text-center">
              Powered by <strong>GestasAI</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;