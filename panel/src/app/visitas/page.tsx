'use client';

import { useState, useEffect } from 'react';

type Visita = {
  id: string;
  estado: string;
  fecha_propuesta: string | null;
  hora_propuesta: string | null;
  notas: string | null;
  created_at: string;
  clientes: { nombre: string | null; telefono: string } | null;
  propiedades: { titulo: string; zona: string } | null;
};

const FILTROS = [
  { key: 'todas', label: '📋 Todas' },
  { key: 'pendiente', label: '⏳ Pendientes' },
  { key: 'confirmada', label: '✅ Confirmadas' },
  { key: 'cancelada', label: '❌ Canceladas' },
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
    const labels: Record<string, string> = {
      pendiente: '⏳ Pendiente',
      confirmada: '✅ Confirmada',
      cancelada: '❌ Cancelada'
    };
    return <span className={`badge ${map[estado] || 'badge-gray'}`}>{labels[estado] || estado}</span>;
  };

  const pendientes = visitas.filter(v => v.estado === 'pendiente').length;

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner-ring" />
      Cargando visitas...
    </div>
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Visitas agendadas</h1>
        <p className="page-subtitle">
          {pendientes > 0
            ? `${pendientes} visita${pendientes !== 1 ? 's' : ''} pendiente${pendientes !== 1 ? 's' : ''} de confirmar`
            : 'Todas las visitas están al día'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="filter-tabs">
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`filter-tab ${filtro === f.key ? 'filter-tab-active' : ''}`}
          >
            {f.label}
            {f.key === 'pendiente' && pendientes > 0 && (
              <span style={{
                marginLeft: '6px',
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
        ))}
      </div>

      {visitasFiltradas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state-icon">📅</span>
            <p className="empty-state-title">
              No hay visitas {filtro !== 'todas' ? `${filtro}s` : ''}
            </p>
            <p className="empty-state-text">Cuando el bot agende visitas, aparecerán aquí</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visitasFiltradas.map((v) => (
            <div key={v.id} className="visita-card">
              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div className="visita-avatar">👤</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                      {v.clientes?.nombre || 'Sin nombre'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      📱 {v.clientes?.telefono || '—'}
                    </div>
                  </div>
                </div>

                <div className="visita-info-row">
                  <span>🏡</span>
                  <span>
                    <strong>{v.propiedades?.titulo || 'Sin especificar'}</strong>
                    {v.propiedades?.zona && <span style={{ color: 'var(--text-muted)' }}> — {v.propiedades.zona}</span>}
                  </span>
                </div>

                <div className="visita-info-row">
                  <span>📅</span>
                  <span>
                    {/* La fecha y hora están guardadas dentro de notas ya que el campo DB es tipo DATE */}
                    {v.fecha_propuesta 
                      ? <strong>{v.fecha_propuesta} {v.hora_propuesta && `· ⏰ ${v.hora_propuesta}`}</strong>
                      : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Fecha / hora en notas ↓</span>
                    }
                  </span>
                </div>

                {v.notas && (
                  <div className="visita-info-row">
                    <span>📝</span>
                    <span style={{ fontStyle: 'italic' }}>{v.notas}</span>
                  </div>
                )}

                <div style={{ marginTop: '10px' }}>
                  {estadoBadge(v.estado)}
                </div>
              </div>

              {/* Acciones */}
              {v.estado === 'pendiente' && (
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', flexShrink: 0 }}>
                  <button
                    onClick={() => cambiarEstado(v.id, 'confirmada')}
                    className="btn btn-primary"
                    disabled={procesando === v.id}
                    style={{ padding: '10px 18px', fontSize: '14px', minWidth: '120px' }}
                  >
                    {procesando === v.id ? '⏳' : '✅ Confirmar'}
                  </button>
                  <button
                    onClick={() => cambiarEstado(v.id, 'cancelada')}
                    className="btn btn-danger"
                    disabled={procesando === v.id}
                    style={{ padding: '10px 18px', fontSize: '14px', minWidth: '120px' }}
                  >
                    {procesando === v.id ? '⏳' : '❌ Cancelar'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
