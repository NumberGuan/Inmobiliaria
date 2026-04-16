import type { Metadata } from 'next';
import ConditionalShell from '@/components/ConditionalShell';

export const metadata: Metadata = {
  title: 'InmoVisión — Panel de Administración',
  description: 'Gestioná tus propiedades, consultas y visitas de manera sencilla.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0e0e1a" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('inmovision_darkmode') === 'true') {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}

const CRITICAL_CSS = `
  /* ================================================================
     INMOBOT — Design System: Professional Real Estate Admin Panel
     Light mode + Dark mode
  ================================================================ */

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Light palette */
    --bg: #f8fafc;
    --bg-card: #ffffff;
    --bg-card-hover: #f1f5f9;
    --bg-subtle: #f1f5f9;
    --sidebar-bg: #0f172a;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --border: #e2e8f0;
    --border-strong: #cbd5e1;
    
    /* New Primary Palette: Blue */
    --gold: #3b82f6; /* kept var name for compatibility where used inline, but it's blue */
    --gold-light: #60a5fa;
    --gold-gradient: linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa);
    --gold-glow: rgba(59, 130, 246, 0.25);
    
    --danger: #ef4444;
    --danger-bg: #fef2f2;
    --danger-border: #fca5a5;
    --success: #10b981;
    --success-bg: #ecfdf5;
    --success-border: #6ee7b7;
    --warning-bg: #fffbeb;
    --warning-border: #fcd34d;
    --warning-text: #b45309;
    --info-bg: #eff6ff;
    --info-border: #93c5fd;
    --info-text: #1d4ed8;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.12);
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --topbar-height: 60px;
    --bottomnav-height: 68px;
    --sidebar-width: 248px;
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    --bg: #0b0f19;
    --bg-card: #151e2f;
    --bg-card-hover: #1e293b;
    --bg-subtle: #0f172a;
    --sidebar-bg: #0b0f19;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border: #1e293b;
    --border-strong: #334155;
    --danger-bg: rgba(239, 68, 68, 0.1);
    --danger-border: rgba(239, 68, 68, 0.25);
    --success-bg: rgba(16, 185, 129, 0.1);
    --success-border: rgba(16, 185, 129, 0.25);
    --warning-bg: rgba(245, 158, 11, 0.1);
    --warning-border: rgba(245, 158, 11, 0.25);
    --warning-text: #fcd34d;
    --info-bg: rgba(59, 130, 246, 0.1);
    --info-border: rgba(59, 130, 246, 0.25);
    --info-text: #93c5fd;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.6);
  }

  html, body { 
    scroll-behavior: smooth; 
    overflow-x: hidden;
    max-width: 100vw;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    background: #0b0f19; /* base dark bg to avoid flashes */
  }

  /* ================================================================
     APP SHELL
  ================================================================ */
  .app-shell {
    display: flex;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    max-width: 100vw;
    background: var(--bg);
    color: var(--text-primary);
    transition: background var(--transition), color var(--transition);
  }

  /* ================================================================
     SIDEBAR
  ================================================================ */
  .sidebar {
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    color: white;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 200;
    transition: transform var(--transition);
    overflow: hidden;
    border-right: 1px solid var(--border);
  }

  .sidebar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 150;
    backdrop-filter: blur(2px);
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-icon { font-size: 26px; }

  .brand-name {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }

  .sidebar-close {
    display: none;
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 14px;
    transition: background 0.2s;
  }
  .sidebar-close:hover { background: rgba(255,255,255,0.2); }

  .sidebar-section-label {
    padding: 20px 24px 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #94a3b8;
  }

  .nav-list {
    list-style: none;
    padding: 0 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-radius: 12px;
    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all var(--transition);
    position: relative;
    letter-spacing: 0.01em;
  }

  .nav-item:hover {
    background: rgba(255,255,255,0.08);
    color: #ffffff;
  }

  .nav-item-active {
    background: rgba(59, 130, 246, 0.15) !important;
    color: #60a5fa !important;
    font-weight: 600;
  }

  .nav-item-icon {
    font-size: 18px;
    width: 22px;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-item-dot {
    position: absolute;
    right: 14px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold-light);
  }

  .sidebar-bottom {
    padding: 16px 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin-bottom: 12px;
  }

  .sidebar-action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    border-radius: 10px;
    background: none;
    border: none;
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: all var(--transition);
    font-family: inherit;
  }

  .sidebar-action-btn:hover {
    background: rgba(255,255,255,0.07);
    color: #ffffff;
  }

  .sidebar-logout-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
  }



  /* ================================================================
     MAIN WRAPPER + TOPBAR
  ================================================================ */
  .main-wrapper {
    margin-left: var(--sidebar-width);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin var(--transition);
    width: calc(100% - var(--sidebar-width));
  }

  .topbar {
    display: none;
    height: var(--topbar-height);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-sm);
  }

  .topbar-menu-btn {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .topbar-menu-btn:hover { background: var(--bg-subtle); }

  .topbar-menu-btn span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.2s;
  }

  .topbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .topbar-dark-btn {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1;
  }

  .topbar-dark-btn:hover { transform: scale(1.1); }

  .main-content {
    flex: 1;
    padding: 36px 32px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    overflow-x: hidden;
  }

  /* ================================================================
     BOTTOM NAV (mobile only)
  ================================================================ */
  .bottom-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottomnav-height);
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    z-index: 100;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .bottom-nav {
    display: none;
    grid-template-columns: repeat(4, 1fr);
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-decoration: none;
    color: var(--text-muted);
    transition: color var(--transition);
    padding: 8px 4px;
    position: relative;
  }

  .bottom-nav-item-active {
    color: var(--gold);
  }

  .bottom-nav-item-active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 2px;
    background: var(--gold-gradient);
    border-radius: 0 0 4px 4px;
  }

  .bottom-nav-icon { font-size: 22px; line-height: 1; }
  .bottom-nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.02em; }

  /* ================================================================
     TYPOGRAPHY
  ================================================================ */
  .page-header {
    margin-bottom: 28px;
  }

  .page-title {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 400;
  }

  /* ================================================================
     CARDS
  ================================================================ */
  .card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    transition: box-shadow var(--transition), border-color var(--transition), background var(--transition);
  }

  .card:hover {
    box-shadow: var(--shadow-md);
  }

  .card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    letter-spacing: -0.01em;
  }

  /* ================================================================
     STATS GRID
  ================================================================ */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 20px 22px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    transition: all var(--transition);
  }

  .stat-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--gold-gradient);
    opacity: 0.06;
    transform: translate(20px, -20px);
  }

  .stat-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--bg-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 14px;
  }

  .stat-number {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  /* ================================================================
     BUTTONS
  ================================================================ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition);
    font-family: inherit;
    white-space: nowrap;
    letter-spacing: 0.01em;
    line-height: 1;
  }

  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  .btn-primary {
    background: var(--gold-gradient);
    color: #ffffff;
    box-shadow: 0 4px 14px var(--gold-glow);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-secondary {
    background: var(--bg-subtle);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-card);
    color: var(--text-primary);
    border-color: var(--border-strong);
  }

  .btn-danger {
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid var(--danger-border);
  }

  .btn-danger:hover:not(:disabled) {
    background: #fecaca;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--bg-subtle);
    color: var(--text-primary);
  }

  /* ================================================================
     BADGES
  ================================================================ */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .badge-green { background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border); }
  .badge-blue { background: var(--info-bg); color: var(--info-text); border: 1px solid var(--info-border); }
  .badge-yellow { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
  .badge-red { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); }
  .badge-gray { background: var(--bg-subtle); color: var(--text-secondary); border: 1px solid var(--border); }
  .badge-gold { background: rgba(59, 130, 246, 0.12); color: var(--gold); border: 1px solid rgba(59, 130, 246, 0.3); }

  /* ================================================================
     FORMS
  ================================================================ */
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .form-grid-21 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }

  .form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-family: inherit;
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all var(--transition);
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
  }

  .form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239aa0b2' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
    background: var(--bg-card);
  }

  .form-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

  .form-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: var(--bg-subtle);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition);
    margin-bottom: 18px;
  }

  .form-checkbox-row:hover { border-color: var(--gold); }

  .form-checkbox-row input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--gold);
    flex-shrink: 0;
  }

  .form-checkbox-row label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    flex: 1;
  }

  /* ================================================================
     TABLE
  ================================================================ */
  .table-container {
    overflow-x: auto;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-card);
  }

  table { width: 100%; border-collapse: collapse; }

  th {
    background: var(--bg-subtle);
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  td {
    padding: 14px 16px;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg-subtle); }

  /* ================================================================
     EMPTY STATE
  ================================================================ */
  .empty-state {
    text-align: center;
    padding: 56px 20px;
  }

  .empty-state-icon {
    font-size: 52px;
    margin-bottom: 14px;
    display: block;
    opacity: 0.5;
  }

  .empty-state-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .empty-state-text {
    font-size: 14px;
    color: var(--text-muted);
    max-width: 300px;
    margin: 0 auto;
  }

  /* ================================================================
     ALERTS
  ================================================================ */
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    margin-bottom: 20px;
    border-width: 1px;
    border-style: solid;
  }

  .alert-error {
    background: var(--danger-bg);
    border-color: var(--danger-border);
    color: var(--danger);
  }

  /* ================================================================
     BACK LINK
  ================================================================ */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 16px;
    font-weight: 500;
    transition: color var(--transition);
  }

  .back-link:hover { color: var(--gold); }

  /* ================================================================
     ACTION BAR (header with button)
  ================================================================ */
  .page-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  /* ================================================================
     FILTER TABS
  ================================================================ */
  .filter-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .filter-tab {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    background: var(--bg-subtle);
    color: var(--text-secondary);
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all var(--transition);
    font-family: inherit;
  }

  .filter-tab:hover { border-color: var(--gold); color: var(--gold); }

  .filter-tab-active {
    background: var(--gold-gradient);
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 2px 10px var(--gold-glow);
  }

  /* ================================================================
     VISITA CARD
  ================================================================ */
  .visita-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 20px 22px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    transition: all var(--transition);
    flex-wrap: wrap;
  }

  .visita-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border-strong);
  }

  .visita-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--gold-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .visita-info-row {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .visita-info-row strong {
    color: var(--text-primary);
    font-weight: 600;
  }

  /* ================================================================
     LOADING SPINNER
  ================================================================ */
  .loading-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 80px 20px;
    color: var(--text-muted);
    font-size: 15px;
  }

  .spinner-ring {
    width: 24px;
    height: 24px;
    border: 2px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin-ring 0.7s linear infinite;
  }

  @keyframes spin-ring {
    to { transform: rotate(360deg); }
  }

  /* ================================================================
     RESPONSIVE — MOBILE FIRST
  ================================================================ */
  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    /* Show topbar, hide sidebar by default */
    .topbar { display: flex; }
    .sidebar { transform: translateX(-100%); }
    .sidebar-open { transform: translateX(0); }
    .sidebar-close { display: flex; }
    .sidebar-overlay { display: block; }

    /* Main - no left margin */
    .main-wrapper { margin-left: 0; width: 100%; }
    .main-content { padding: 20px 16px calc(var(--bottomnav-height) + 16px); }

    /* Show bottom nav */
    .bottom-nav { display: grid; }

    /* Responsive grids */
    .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
    .form-grid-2, .form-grid-3, .form-grid-21 { grid-template-columns: 1fr; }

    .page-header-row { flex-direction: column; }
    .page-title { font-size: 24px; }

    /* Table scroll hint */
    .table-container { border-radius: var(--radius-sm); }

    /* Filter tabs scroll */
    .filter-tabs { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
    .filter-tab { white-space: nowrap; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .stat-card { padding: 16px; }
    .stat-number { font-size: 26px; }
    .main-content { padding: 16px 12px calc(var(--bottomnav-height) + 12px); }
    .card { padding: 16px; border-radius: var(--radius-md); }
    .btn { padding: 12px 18px; font-size: 14px; }
    .page-title { font-size: 22px; }
  }
`;
