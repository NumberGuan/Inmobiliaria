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
          <div className="empty-state">
            <span className="empty-state-icon">💬</span>
            <p className="empty-state-title">No hay consultas todavía</p>
            <p className="empty-state-text">Cuando el bot reciba mensajes de WhatsApp, aparecerán aquí automáticamente</p>
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
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      📱 {c.clientes?.telefono || '—'}
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
                    <span className="badge badge-blue">🏡 {c.propiedades.titulo || c.propiedades.zona}</span>
                  )}
                  {c.respuesta && (
                    <span className={`badge ${c.respuesta.includes('Sin resultados') ? 'badge-gray' : 'badge-green'}`}>
                      {c.respuesta.includes('Sin resultados') ? '❌ Sin resultados' : `✅ ${c.respuesta}`}
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
                          <span className={`badge ${c.respuesta.includes('Sin resultados') ? 'badge-gray' : 'badge-green'}`} style={{whiteSpace:'nowrap'}}>
                            {c.respuesta.includes('Sin resultados') ? '❌ Sin resultados' : `✅ ${c.respuesta}`}
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
