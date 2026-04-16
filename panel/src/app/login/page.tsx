'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresá tu contraseña.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setAttempts(a => a + 1);
        setError(data.error || 'Contraseña incorrecta.');
        setPassword('');
      }
    } catch {
      setError('Error de conexión. Verificá tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🏠</div>
          <h1 className="login-logo-text">InmoBot</h1>
          <p className="login-logo-sub">Panel de Administración</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Contraseña de acceso
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className={`login-input ${error ? 'login-input-error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                className="login-show-btn"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {attempts >= 3 && !error && (
            <div className="login-hint">
              💡 ¿Olvidaste la contraseña? La encontrás en el archivo <code>.env.local</code> del panel.
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !password}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner" /> Verificando...
              </span>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>

        <p className="login-footer">
          Solo el administrador puede acceder
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a14;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .login-bg-orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #3b82f6, transparent);
          top: -100px;
          right: -100px;
        }

        .login-bg-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #1a3a6e, transparent);
          bottom: -100px;
          left: -100px;
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 20px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 40px 36px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }

        .login-logo {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo-icon {
          font-size: 48px;
          margin-bottom: 8px;
          display: block;
        }

        .login-logo-text {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #60a5fa, #93c5fd, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .login-logo-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.02em;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          font-size: 16px;
          pointer-events: none;
          z-index: 1;
        }

        .login-input {
          width: 100%;
          padding: 14px 48px 14px 44px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          font-size: 16px;
          color: white;
          font-family: inherit;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.25);
          letter-spacing: 4px;
        }

        .login-input:focus {
          outline: none;
          border-color: #60a5fa;
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        .login-input.login-input-error {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
        }

        .login-show-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .login-show-btn:hover { opacity: 1; }

        .login-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          background: rgba(248, 113, 113, 0.15);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 10px;
          font-size: 13px;
          color: #fca5a5;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .login-hint {
          padding: 10px 14px;
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.25);
          border-radius: 10px;
          font-size: 12px;
          color: rgba(96, 165, 250, 0.8);
        }

        .login-hint code {
          background: rgba(96, 165, 250, 0.2);
          padding: 1px 5px;
          border-radius: 4px;
        }

        .login-btn {
          padding: 16px;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          color: #1a1a2e;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 4px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .login-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(26, 26, 46, 0.3);
          border-top-color: #1a1a2e;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a14' }} />}>
      <LoginForm />
    </Suspense>
  );
}
