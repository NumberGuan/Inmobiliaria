'use client';

import { useState, useEffect } from 'react';

type Visita = {
  id: string;
  estado: string;
  fecha_propuesta: string | null;
  hora_propuesta: string | null;
  notes?: string | null; // wait, let's keep exact keys
  notas: string | null;
  created_at: string;
  clientes: { nombre: string | null; telefono: string } | null;
  propiedades: { titulo: string; zona: string } | null;
};

// SVG Icons
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4m-4 4h4M8 11h.01M8 15h.01" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function CalendarIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', display: 'inline-block', color: 'var(--primary-teal, #14b8a6)' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px', opacity: 0.8 }}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px', opacity: 0.8 }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px', opacity: 0.7 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const FILTROS = [
  { key: 'todas', label: 'Todas', Icon: ListIcon },
  { key: 'pendiente', label: 'Pendientes', Icon: ClockIcon },
  { key: 'confirmada', label: 'Confirmadas', Icon: CheckCircleIcon },
  { key: 'cancelada', label: 'Canceladas', Icon: XCircleIcon },
];

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [procesando, setProcesando] = useState<string | null>(null);

  const cargarVisitas = async () => {
    const res = await fetch('/api/visitas');
    const data = await res.json();
    setVisitas(data || []);
    setLoading(false);
  };

  useEffect(() => { cargarVisitas(); }, []);

  const cambiarEstado = async (id: string, estado: string) => {
    setProcesando(id);
    await fetch('/api/visitas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado })
    });
    await cargarVisitas();
    setProcesando(null);
  };

  const visitasFiltradas = filtro === 'todas'
    ? visitas
    : visitas.filter(v => v.estado === filtro);

  const estadoBadge = (estado: string) => {
    const map: Record<string, string> = {
      pendiente: 'badge-yellow',
      confirmada: 'badge-green',
      cancelada: 'badge-red'
    };
    
    return (
      <span className={`badge ${map[estado] || 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
        {estado === 'pendiente' && <ClockIcon />}
        {estado === 'confirmada' && <CheckCircleIcon />}
        {estado === 'cancelada' && <XCircleIcon />}
        <span style={{ textTransform: 'capitalize' }}>{estado}</span>
      </span>
    );
  };

  const pendientes = visitas.filter(v => v.estado === 'pendiente').length;

  if (loading) return (
    <div className="loading-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="spinner-ring" />
      Cargando visitas...
    </div>
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>Visitas agendadas</h1>
        <p className="page-subtitle">
          {pendientes > 0
            ? `${pendientes} visita${pendientes !== 1 ? 's' : ''} pendiente${pendientes !== 1 ? 's' : ''} de confirmar`
            : 'Todas las visitas están al día'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
        {FILTROS.map(f => {
          const Icon = f.Icon;
          return (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`filter-tab ${filtro === f.key ? 'filter-tab-active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon />
              <span>{f.label}</span>
              {f.key === 'pendiente' && pendientes > 0 && (
                <span style={{
                  marginLeft: '4px',
                  background: filtro === 'pendiente' ? 'rgba(255,255,255,0.3)' : 'var(--gold-gradient)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {pendientes}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visitasFiltradas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'inline-flex', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '50%', marginBottom: '16px' }}>
              <CalendarIcon size={44} />
            </div>
            <p className="empty-state-title">
              No hay visitas {filtro !== 'todas' ? `${filtro}s` : ''}
            </p>
            <p className="empty-state-text">Cuando el bot agende visitas, aparecerán aquí</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visitasFiltradas.map((v) => (
            <div key={v.id} className="visita-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px', transition: 'all 0.2s ease-in-out' }}>
              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div className="visita-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)', flexShrink: 0 }}>
                    <UserIcon />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                      {v.clientes?.nombre || 'Sin nombre'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneIcon /> {v.clientes?.telefono || '—'}
                    </div>
                  </div>
                </div>

                <div className="visita-info-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <HomeIcon />
                  <span>
                    <strong>{v.propiedades?.titulo || 'Sin especificar'}</strong>
                    {v.propiedades?.zona && <span style={{ color: 'var(--text-muted)' }}> — {v.propiedades.zona}</span>}
                  </span>
                </div>

                <div className="visita-info-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <CalendarIcon />
                  <span>
                    {v.fecha_propuesta 
                      ? <strong>{v.fecha_propuesta} {v.hora_propuesta && <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}><ClockIcon /> {v.hora_propuesta}</span>}</strong>
                      : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Fecha / hora en notas ↓</span>
                    }
                  </span>
                </div>

                {v.notas && (
                  <div className="visita-info-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '10px', background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: '8px' }}>
                    <NotesIcon />
                    <span style={{ fontStyle: 'italic', flex: 1 }}>{v.notas}</span>
                  </div>
                )}

                <div style={{ marginTop: '12px' }}>
                  {estadoBadge(v.estado)}
                </div>
              </div>

              {/* Acciones */}
              {v.estado === 'pendiente' && (
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => cambiarEstado(v.id, 'confirmada')}
                    className="btn btn-primary"
                    disabled={procesando === v.id}
                    style={{ padding: '10px 18px', fontSize: '14px', minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {procesando === v.id ? <span className="spinner-mini" /> : <><CheckCircleIcon /> Confirmar</>}
                  </button>
                  <button
                    onClick={() => cambiarEstado(v.id, 'cancelada')}
                    className="btn btn-danger"
                    disabled={procesando === v.id}
                    style={{ padding: '10px 18px', fontSize: '14px', minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {procesando === v.id ? <span className="spinner-mini" /> : <><XCircleIcon /> Cancelar</>}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .visita-card:hover {
          border-color: var(--gold) !important;
          box-shadow: 0 4px 14px var(--gold-glow);
          transform: translateY(-2px);
        }
        
        .spinner-mini {
          width: 14.5px;
          height: 14.5px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        .spinner-ring {
          width: 28px;
          height: 28px;
          border: 3px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--primary-teal);
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

