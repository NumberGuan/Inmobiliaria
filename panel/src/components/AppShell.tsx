'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: '◈', mobileLabel: 'Inicio' },
  { href: '/propiedades', label: 'Propiedades', icon: '⌂', mobileLabel: 'Propiedades' },
  { href: '/consultas', label: 'Consultas', icon: '◎', mobileLabel: 'Consultas' },
  { href: '/visitas', label: 'Visitas', icon: '◷', mobileLabel: 'Visitas' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('inmovision_darkmode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('inmovision_darkmode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="app-shell">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <nav className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-name">InmoVisión</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-section-label">NAVEGACIÓN</div>
        <ul className="nav-list">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {isActive(item.href) && <span className="nav-item-dot" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <button onClick={toggleDarkMode} className="sidebar-action-btn">
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <button onClick={handleLogout} className="sidebar-action-btn sidebar-logout-btn" disabled={loggingOut}>
            <span>{'↩'}</span>
            <span>{loggingOut ? 'Saliendo...' : 'Cerrar sesión'}</span>
          </button>

        </div>
      </nav>

      {/* MAIN */}
      <div className="main-wrapper">
        {/* Top bar (mobile) */}
        <header className="topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <div className="topbar-brand">
            <span>🏠</span>
            <span>InmoVisión</span>
          </div>
          <button className="topbar-dark-btn" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* BOTTOM NAV (mobile only) */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive(item.href) ? 'bottom-nav-item-active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.mobileLabel}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
