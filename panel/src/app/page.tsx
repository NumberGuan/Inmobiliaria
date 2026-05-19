import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  let totalPropiedades = 0;
  let totalConsultas = 0;
  let totalVisitas = 0;
  let visitasPendientes = 0;
  let ultimasVisitas: any[] = [];
  let ultimasConsultas: any[] = [];
  let dbError: string | null = null;

  try {
    const [
      resPropiedades,
      resConsultas,
      resVisitas,
      resVisitasPendientes,
      resUltimasVisitas,
      resUltimasConsultas
    ] = await Promise.all([
      supabase.from('propiedades').select('*', { count: 'exact', head: true }).eq('disponible', true),
      supabase.from('consultas').select('*', { count: 'exact', head: true }),
      supabase.from('visitas').select('*', { count: 'exact', head: true }),
      supabase.from('visitas').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
      supabase.from('visitas')
        .select('*, clientes (nombre, telefono), propiedades (titulo, zona)')
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(4),
      supabase.from('consultas')
        .select('*, clientes (nombre, telefono)')
        .order('created_at', { ascending: false })
        .limit(4)
    ]);

    if (resPropiedades.error) throw resPropiedades.error;
    if (resConsultas.error) throw resConsultas.error;
    if (resVisitas.error) throw resVisitas.error;
    if (resVisitasPendientes.error) throw resVisitasPendientes.error;
    if (resUltimasVisitas.error) throw resUltimasVisitas.error;
    if (resUltimasConsultas.error) throw resUltimasConsultas.error;

    totalPropiedades = resPropiedades.count ?? 0;
    totalConsultas = resConsultas.count ?? 0;
    totalVisitas = resVisitas.count ?? 0;
    visitasPendientes = resVisitasPendientes.count ?? 0;
    ultimasVisitas = resUltimasVisitas.data ?? [];
    ultimasConsultas = resUltimasConsultas.data ?? [];
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    dbError = error.message || 'Error al conectar con el servidor de Supabase.';
  }

  return (
    <>
      {dbError && (
        <div className="alert alert-error" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', flexShrink: 0 }}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" x2="12" y1="9" y2="13"/>
            <line x1="12" x2="12.01" y1="17" y2="17"/>
          </svg>
          <div>
            <strong>Error de conexión con la base de datos:</strong>
            <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
              No se pudo establecer conexión con Supabase. Por favor, verificá las credenciales en tu archivo <code>.env.local</code> y tu conexión de red. Detalles: {dbError}
            </p>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Panel principal</h1>
        <p className="page-subtitle">Resumen de toda la actividad de tu inmobiliaria</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M19 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4" />
              <path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
              <path d="M4 15V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7" />
            </svg>
          </div>
          <div className="stat-number">{totalPropiedades ?? 0}</div>
          <div className="stat-label">Propiedades disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="stat-number">{totalConsultas ?? 0}</div>
          <div className="stat-label">Consultas recibidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 2v4" />
              <path d="M16 2v4" />
            </svg>
          </div>
          <div className="stat-number">{totalVisitas ?? 0}</div>
          <div className="stat-label">Visitas agendadas</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid var(--gold)' }}>
          <div className="stat-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-number" style={{ color: 'var(--gold)' }}>{visitasPendientes ?? 0}</div>
          <div className="stat-label">Por confirmar</div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Acciones rápidas
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/propiedades/nueva" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Agregar propiedad
          </Link>
          <Link href="/propiedades" className="btn btn-secondary">Mis propiedades</Link>
          <Link href="/visitas" className="btn btn-secondary">Ver visitas</Link>
          <Link href="/consultas" className="btn btn-secondary">Consultas</Link>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Visitas pendientes */}
        <div className="card">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Visitas por confirmar
          </h2>
          {!ultimasVisitas || ultimasVisitas.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <span className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
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
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                    {v.fecha_propuesta || 'Fecha a confirmar'} {v.hora_propuesta && `— ${v.hora_propuesta}`}
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
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Últimas consultas
          </h2>
          {!ultimasConsultas || ultimasConsultas.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <span className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
              </span>
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
