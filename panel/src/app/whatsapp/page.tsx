'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

interface ActivityLog {
  id: string;
  timestamp: string;
  telefono: string;
  mensaje: string;
  respuesta: string;
  accion: string;
}

interface BotConfig {
  geminiApiKey: string;
  openWaUrl: string;
  openWaApiKey: string;
  botActive: boolean;
  sessionName: string;
  activityLogs: ActivityLog[];
}

interface SessionStatus {
  gatewayReached: boolean;
  sessionActive: boolean;
  status: string;
  qrCodeString: string | null;
  sessionName: string;
  message: string;
}

// Minimalist vector SVG icons
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: '-3px', marginRight: '8px' }}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PowerIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px', color: active ? 'var(--success)' : 'var(--slate-400)' }}>
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

function RefreshIcon({ loading }: { loading: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={loading ? 'spin-animation' : ''}
      style={{ width: '14px', height: '14px', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }}
    >
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--primary-teal)' }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function WhatsAppPage() {
  const [config, setConfig] = useState<BotConfig>({
    geminiApiKey: '',
    openWaUrl: 'http://localhost:2785',
    openWaApiKey: '',
    botActive: true,
    sessionName: 'inmobot',
    activityLogs: []
  });

  const [status, setStatus] = useState<SessionStatus>({
    gatewayReached: false,
    sessionActive: false,
    status: 'OFFLINE',
    qrCodeString: null,
    sessionName: 'inmobot',
    message: 'Consultando pasarela WhatsApp...'
  });

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch Config
  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const res = await fetch('/api/whatsapp/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.error('Failed to load config:', e);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Fetch Status
  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await fetch('/api/whatsapp/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error('Failed to load status:', e);
      setStatus(prev => ({
        ...prev,
        gatewayReached: false,
        sessionActive: false,
        status: 'OFFLINE',
        message: 'No se pudo contactar con el proxy del servidor.'
      }));
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStatus();

    // Auto-poll status every 10 seconds to detect QR scan or status changes
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Refresh status dynamically if credentials changed
        fetchStatus();
      } else {
        const err = await res.json();
        setSaveError(err.error || 'Error al guardar la configuración.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error de red.');
    } finally {
      setSaving(false);
    }
  };

  // Status LED Colors & Pulse CSS Classes
  const getStatusColorClass = () => {
    if (status.sessionActive) return 'status-led-green';
    if (status.status === 'SCAN_QR') return 'status-led-yellow';
    if (status.status === 'STARTING') return 'status-led-blue';
    return 'status-led-red';
  };

  return (
    <AppShell>
      <div className="admin-container">
        {/* Style injection inside component to adhere strictly to Vanilla CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          .whatsapp-status-card {
            background: var(--card-bg, #ffffff);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
          }
          .dark .whatsapp-status-card {
            background: var(--slate-800, #1e293b);
            border-color: var(--slate-700, #334155);
          }
          .whatsapp-status-info {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .status-led-container {
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.03);
          }
          .dark .status-led-container {
            background: rgba(255,255,255,0.03);
          }
          .status-led {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            position: relative;
          }
          .status-led-green {
            background-color: var(--success, #10b981);
            box-shadow: 0 0 12px #10b981;
            animation: pulse-led 2s infinite;
          }
          .status-led-yellow {
            background-color: var(--warning, #f59e0b);
            box-shadow: 0 0 12px #f59e0b;
            animation: pulse-led 2s infinite;
          }
          .status-led-blue {
            background-color: var(--info, #3b82f6);
            box-shadow: 0 0 12px #3b82f6;
            animation: pulse-led 2s infinite;
          }
          .status-led-red {
            background-color: var(--danger, #ef4444);
            box-shadow: 0 0 12px #ef4444;
            animation: pulse-led 2s infinite;
          }
          @keyframes pulse-led {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
          }
          .whatsapp-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          @media (max-width: 1024px) {
            .whatsapp-grid {
              grid-template-columns: 1fr;
            }
          }
          .panel-card {
            background: var(--card-bg, #ffffff);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .dark .panel-card {
            background: var(--slate-800, #1e293b);
            border-color: var(--slate-700, #334155);
          }
          .panel-card-title {
            font-family: var(--font-header, 'Cinzel', serif);
            font-size: 1.15rem;
            color: var(--text-color, #0f172a);
            margin-bottom: 20px;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .dark .panel-card-title {
            color: #f1f5f9;
          }
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            border: 2px dashed var(--border-color, #e2e8f0);
            border-radius: 12px;
            text-align: center;
            min-height: 280px;
          }
          .dark .qr-container {
            border-color: var(--slate-700, #334155);
          }
          .qr-img {
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin-bottom: 16px;
          }
          .spin-animation {
            animation: spin 1.5s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .activity-table-wrapper {
            overflow-x: auto;
            margin-top: 10px;
          }
          .activity-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
          }
          .activity-table th {
            text-align: left;
            padding: 12px 16px;
            background: rgba(0,0,0,0.02);
            color: var(--slate-500, #64748b);
            font-weight: 600;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
          }
          .dark .activity-table th {
            background: rgba(255,255,255,0.02);
            color: var(--slate-400, #94a3b8);
            border-bottom-color: var(--slate-700, #334155);
          }
          .activity-table td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            vertical-align: top;
            color: var(--text-color, #334155);
          }
          .dark .activity-table td {
            border-bottom-color: var(--slate-700, #334155);
            color: #cbd5e1;
          }
          .activity-table tr:hover {
            background: rgba(13, 148, 136, 0.02);
          }
          .badge-action {
            display: inline-block;
            padding: 2px 8px;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 4px;
            background: rgba(13, 148, 136, 0.1);
            color: var(--primary-teal, #0d9488);
          }
          .badge-action-none {
            background: rgba(100, 116, 139, 0.1);
            color: #64748b;
          }
        ` }} />

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Integración WhatsApp</h1>
            <p className="admin-subtitle">Conecta tu cuenta de WhatsApp utilizando la pasarela OpenWA y automatiza la atención con Inteligencia Artificial gratuita.</p>
          </div>
          <div>
            <button 
              onClick={() => { fetchStatus(); fetchConfig(); }}
              disabled={loadingStatus}
              className="btn btn-secondary"
            >
              <RefreshIcon loading={loadingStatus} />
              Sincronizar
            </button>
          </div>
        </div>

        {/* Session Status Header Card */}
        <div className="whatsapp-status-card">
          <div className="whatsapp-status-info">
            <div className="status-led-container">
              <span className={`status-led ${getStatusColorClass()}`} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                  Estado: {status.sessionActive ? 'CONECTADO' : status.status === 'SCAN_QR' ? 'ESCANEAR QR' : status.status === 'STARTING' ? 'INICIANDO' : 'DESCONECTADO'}
                </h3>
                <span className={`badge-action ${config.botActive ? '' : 'badge-action-none'}`} style={{ fontSize: '0.7rem' }}>
                  {config.botActive ? '🤖 IA Activa' : '🤖 IA Apagada'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                {status.message}
              </p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Sesión: <strong>{status.sessionName}</strong>
            </span>
          </div>
        </div>

        {/* Two Column Grid: Settings & QR Scan */}
        <div className="whatsapp-grid">
          {/* Column 1: Config Form */}
          <div className="panel-card">
            <h2 className="panel-card-title">
              <span><SettingsIcon /> Parámetros del Asistente</span>
            </h2>

            {loadingConfig ? (
              <div style={{ padding: '20px 0', textShadow: 'none', color: '#64748b', textAlign: 'center' }}>
                Cargando configuración persistente...
              </div>
            ) : (
              <form onSubmit={handleSaveConfig}>
                {saveSuccess && (
                  <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                    Configuración guardada exitosamente. El bot está operativo con los nuevos parámetros.
                  </div>
                )}
                {saveError && (
                  <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    {saveError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="geminiApiKey">Clave API de Google Gemini (Gratis)</label>
                  <input
                    type="password"
                    id="geminiApiKey"
                    placeholder="AIzaSy..."
                    value={config.geminiApiKey}
                    onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                    className="form-input"
                  />
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Clave de autenticación para Gemini 2.5 Flash. Puedes crear una clave gratuita en <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-teal)', textDecoration: 'underline' }}>Google AI Studio</a>.
                  </p>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="openWaUrl">URL de la Pasarela OpenWA</label>
                  <input
                    type="text"
                    id="openWaUrl"
                    placeholder="http://localhost:2785"
                    required
                    value={config.openWaUrl}
                    onChange={(e) => setConfig({ ...config, openWaUrl: e.target.value })}
                    className="form-input"
                  />
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Dirección donde corre tu contenedor Docker o CLI local de <code>rmyndharis/OpenWA</code>.
                  </p>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="openWaApiKey">API Key de OpenWA (Opcional)</label>
                  <input
                    type="password"
                    id="openWaApiKey"
                    placeholder="Dejar vacío si no configuraste API Key en OpenWA"
                    value={config.openWaApiKey || ''}
                    onChange={(e) => setConfig({ ...config, openWaApiKey: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sessionName">Nombre de Sesión</label>
                    <input
                      type="text"
                      id="sessionName"
                      required
                      value={config.sessionName}
                      onChange={(e) => setConfig({ ...config, sessionName: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label className="form-label" style={{ marginBottom: '10px' }}>Estado del Bot</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={config.botActive}
                        onChange={(e) => setConfig({ ...config, botActive: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)' }}
                      />
                      <PowerIcon active={config.botActive} />
                      {config.botActive ? 'Automatización ON' : 'Automatización OFF'}
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ width: '100%', maxWidth: '200px' }}
                  >
                    {saving ? 'Guardando...' : 'Guardar Parámetros'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Column 2: QR Scanner / Status */}
          <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="panel-card-title">Código QR de Escaneo</h2>

            {loadingStatus ? (
              <div className="qr-container">
                <div className="spin-animation" style={{ width: '24px', height: '24px', border: '3px solid var(--primary-teal)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '16px' }} />
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Verificando sesión en OpenWA...</p>
              </div>
            ) : status.sessionActive ? (
              <div className="qr-container" style={{ borderColor: 'var(--success)', background: 'rgba(16, 185, 129, 0.01)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '64px', height: '64px', color: 'var(--success)', marginBottom: '16px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--success)' }}>¡WhatsApp Conectado!</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', maxWidth: '220px' }}>
                  Tu celular se encuentra enlazado a la pasarela. No es necesario escanear ningún QR.
                </p>
              </div>
            ) : status.qrCodeString ? (
              <div className="qr-container">
                <div className="qr-img">
                  <img
                    src={status.qrCodeString.startsWith('data:') 
                      ? status.qrCodeString 
                      : `https://api.qrserver.com/v1/create-qr-code/?size=200&data=${encodeURIComponent(status.qrCodeString)}`}
                    alt="WhatsApp QR Code"
                    width={200}
                    height={200}
                    style={{ display: 'block' }}
                  />
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontWeight: 700 }}>Escanear Código QR</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '240px', margin: 0 }}>
                  Abre WhatsApp en tu celular, ve a Dispositivos Vinculados &gt; Vincular un Dispositivo y escanea esta pantalla.
                </p>
              </div>
            ) : (
              <div className="qr-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', color: '#94a3b8', marginBottom: '16px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="3" height="3" />
                  <rect x="14" y="7" width="3" height="3" />
                  <rect x="7" y="14" width="3" height="3" />
                  <path d="M14 14h3v3h-3z" />
                </svg>
                <h4 style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Pasarela Desconectada</h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', maxWidth: '230px' }}>
                  {status.gatewayReached 
                    ? 'Inicia la sesión desde el formulario o aguarda a que OpenWA genere el código QR.' 
                    : 'Asegúrate de que la pasarela OpenWA esté en ejecución local en el puerto indicado.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Logs Section */}
        <div className="panel-card">
          <h2 className="panel-card-title">
            <span><MessageIcon /> Historial de Actividad Reciente</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
              Últimos 10 mensajes procesados por la IA
            </span>
          </h2>

          <div className="activity-table-wrapper">
            {config.activityLogs && config.activityLogs.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Teléfono</th>
                    <th style={{ width: '30%' }}>Mensaje Recibido</th>
                    <th style={{ width: '35%' }}>Respuesta del Bot</th>
                    <th style={{ width: '20%' }}>Acción Automatizada</th>
                  </tr>
                </thead>
                <tbody>
                  {config.activityLogs.slice(0, 10).map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--primary-teal)' }}>+{log.telefono}</span>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontWeight: 'normal' }}>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap', maxHeight: '80px', overflowY: 'auto' }}>
                          {log.mensaje}
                        </p>
                      </td>
                      <td>
                        <p style={{ margin: 0, color: 'var(--slate-600)', whiteSpace: 'pre-wrap', maxHeight: '80px', overflowY: 'auto' }}>
                          {log.respuesta}
                        </p>
                      </td>
                      <td>
                        <span className={`badge-action ${log.accion.includes('Ninguna') ? 'badge-action-none' : ''}`}>
                          {log.accion}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px 0', textShadow: 'none', color: '#94a3b8', textAlign: 'center' }}>
                No se registran actividades de chat recientes. El bot está a la espera de mensajes de WhatsApp.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
