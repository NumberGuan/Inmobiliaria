import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const [
    { count: totalPropiedades },
    { count: totalConsultas },
    { count: totalVisitas },
    { count: visitasPendientes }
  ] = await Promise.all([
    supabase.from('propiedades').select('*', { count: 'exact', head: true }).eq('disponible', true),
    supabase.from('consultas').select('*', { count: 'exact', head: true }),
    supabase.from('visitas').select('*', { count: 'exact', head: true }),
    supabase.from('visitas').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')
  ]);

  const { data: ultimasVisitas } = await supabase
    .from('visitas')
    .select('*, clientes (nombre, telefono), propiedades (titulo, zona)')
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: ultimasConsultas } = await supabase
    .from('consultas')
    .select('*, clientes (nombre, telefono)')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Panel principal</h1>
        <p className="page-subtitle">Resumen de toda la actividad de tu inmobiliaria</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">🏡</div>
          <div className="stat-number">{totalPropiedades ?? 0}</div>
          <div className="stat-label">Propiedades disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">💬</div>
          <div className="stat-number">{totalConsultas ?? 0}</div>
          <div className="stat-label">Consultas recibidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">📅</div>
          <div className="stat-number">{totalVisitas ?? 0}</div>
          <div className="stat-label">Visitas agendadas</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid var(--gold)' }}>
          <div className="stat-icon-wrap">⏳</div>
          <div className="stat-number" style={{ color: 'var(--gold)' }}>{visitasPendientes ?? 0}</div>
          <div className="stat-label">Por confirmar</div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 className="card-title">⚡ Acciones rápidas</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/propiedades/nueva" className="btn btn-primary">+ Agregar propiedad</Link>
          <Link href="/propiedades" className="btn btn-secondary">🏡 Mis propiedades</Link>
          <Link href="/visitas" className="btn btn-secondary">📅 Ver visitas</Link>
          <Link href="/consultas" className="btn btn-secondary">💬 Consultas</Link>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Visitas pendientes */}
        <div className="card">
          <h2 className="card-title">⏳ Visitas por confirmar</h2>
          {!ultimasVisitas || ultimasVisitas.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <span className="empty-state-icon" style={{ fontSize: '36px' }}>✅</span>
              <p className="empty-state-title" style={{ fontSize: '15px' }}>Todo al día</p>
              <p className="empty-state-text">No hay visitas pendientes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ultimasVisitas.map((v: any) => (
                <div key={v.id} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--warning-border)'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px', color: 'var(--text-primary)' }}>
                    {v.clientes?.nombre || v.clientes?.telefono || 'Cliente'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {v.propiedades?.titulo || 'Propiedad'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📅 {v.fecha_propuesta || 'Fecha a confirmar'} {v.hora_propuesta && `— ${v.hora_propuesta}`}
                  </div>
                </div>
              ))}
              <Link href="/visitas" style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '600', textDecoration: 'none', padding: '4px 0' }}>
                Ver todas las visitas →
              </Link>
            </div>
          )}
        </div>

        {/* Últimas consultas */}
        <div className="card">
          <h2 className="card-title">💬 Últimas consultas</h2>
          {!ultimasConsultas || ultimasConsultas.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <span className="empty-state-icon" style={{ fontSize: '36px' }}>📭</span>
              <p className="empty-state-title" style={{ fontSize: '15px' }}>Sin consultas aún</p>
              <p className="empty-state-text">Las consultas de clientes aparecerán aquí</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ultimasConsultas.map((c: any) => (
                <div key={c.id} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--success-bg)',
                  border: '1px solid var(--success-border)'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px', color: 'var(--text-primary)' }}>
                    {c.clientes?.nombre || c.clientes?.telefono || 'Cliente'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.mensaje || 'Sin mensaje'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    {new Date(c.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <Link href="/consultas" style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '600', textDecoration: 'none', padding: '4px 0' }}>
                Ver todas las consultas →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
