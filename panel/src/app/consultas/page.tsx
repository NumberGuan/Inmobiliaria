import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ConsultasPage() {
  const { data: consultas } = await supabase
    .from('consultas')
    .select('*, clientes (nombre, telefono), propiedades (titulo, zona)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Consultas</h1>
        <p className="page-subtitle">
          {consultas?.length ?? 0} consulta{(consultas?.length ?? 0) !== 1 ? 's' : ''} recibida{(consultas?.length ?? 0) !== 1 ? 's' : ''} por el bot
        </p>
      </div>

      {!consultas || consultas.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <p className="empty-state-title" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No hay consultas todavía</p>
            <p className="empty-state-text" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Cuando el bot reciba mensajes de WhatsApp, aparecerán aquí automáticamente</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="consultas-mobile">
            {consultas.map((c: any) => (
              <div key={c.id} className="card" style={{ padding: '16px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                      {c.clientes?.nombre || 'Sin nombre'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '12px', height: '12px' }}>
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                      {c.clientes?.telefono || '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
                    {new Date(c.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {c.mensaje && (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <strong>Búsqueda:</strong> {c.mensaje}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {c.propiedades && (
                    <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      {c.propiedades.titulo || c.propiedades.zona}
                    </span>
                  )}
                  {c.respuesta && (
                    <span className={`badge ${c.respuesta.includes('Sin resultados') ? 'badge-gray' : 'badge-green'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {c.respuesta.includes('Sin resultados') ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          Sin resultados
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          {c.respuesta}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="consultas-desktop card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Búsqueda</th>
                    <th>Propiedad vinculada</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((c: any) => (
                    <tr key={c.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(c.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td style={{ fontWeight: '600' }}>{c.clientes?.nombre || '—'}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {c.clientes?.telefono || '—'}
                      </td>
                      <td style={{ maxWidth: '260px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {c.mensaje || '—'}
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {c.propiedades 
                          ? <><strong>{c.propiedades.titulo}</strong><br/><span style={{fontSize:'11px'}}>{c.propiedades.zona}</span></> 
                          : '—'}
                      </td>
                      <td>
                        {c.respuesta ? (
                          <span className={`badge ${c.respuesta.includes('Sin resultados') ? 'badge-gray' : 'badge-green'}`} style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {c.respuesta.includes('Sin resultados') ? (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}>
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                Sin resultados
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}>
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                  <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                {c.respuesta}
                              </>
                            )}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style>{`
        .consultas-mobile { display: none; }
        .consultas-desktop { display: block; }
        @media (max-width: 768px) {
          .consultas-mobile { display: block; }
          .consultas-desktop { display: none; }
        }
      `}</style>
    </>
  );
}
