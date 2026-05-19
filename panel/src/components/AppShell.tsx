'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', iconName: 'home', mobileLabel: 'Inicio' },
  { href: '/propiedades', label: 'Propiedades', iconName: 'properties', mobileLabel: 'Propiedades' },
  { href: '/consultas', label: 'Consultas', iconName: 'consultas', mobileLabel: 'Consultas' },
  { href: '/visitas', label: 'Visitas', iconName: 'visitas', mobileLabel: 'Visitas' },
  { href: '/whatsapp', label: 'WhatsApp', iconName: 'whatsapp', mobileLabel: 'WhatsApp' },
];

function renderIcon(name: string, className = "nav-item-icon-svg") {
  const props = {
    className,
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      );
    case 'properties':
      return (
        <svg {...props}>
          <path d="M3 21h18" />
          <path d="M19 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4" />
          <path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
          <path d="M4 15V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7" />
        </svg>
      );
    case 'consultas':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'visitas':
      return (
        <svg {...props}>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...props}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...props}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'brand':
      return (
        <svg {...props} width="22" height="22" className="brand-icon-svg" style={{ color: 'var(--gold-light)' }}>
          <path d="m2 22 10-20 10 20Z" fill="rgba(59, 130, 246, 0.05)" />
          <path d="M6 12h12" />
          <path d="M12 2v20" />
        </svg>
      );
    default:
      return null;
  }
}

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
            {renderIcon('brand')}
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
                <span className="nav-item-icon">
                  {renderIcon(item.iconName)}
                </span>
                <span className="nav-item-label">{item.label}</span>
                {isActive(item.href) && <span className="nav-item-dot" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <button onClick={toggleDarkMode} className="sidebar-action-btn">
            {renderIcon(darkMode ? 'sun' : 'moon')}
            <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <button onClick={handleLogout} className="sidebar-action-btn sidebar-logout-btn" disabled={loggingOut}>
            {renderIcon('logout')}
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
            {renderIcon('brand')}
            <span>InmoVisión</span>
          </div>
          <button className="topbar-dark-btn" onClick={toggleDarkMode}>
            {renderIcon(darkMode ? 'sun' : 'moon')}
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
            <span className="bottom-nav-icon">
              {renderIcon(item.iconName)}
            </span>
            <span className="bottom-nav-label">{item.mobileLabel}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
