import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatPrecio(precio: number, moneda: string, precioArs: number | null) {
  const principal = moneda === 'USD'
    ? `USD ${Number(precio).toLocaleString('es-AR')}`
    : `$ ${Number(precio).toLocaleString('es-AR')}`;

  const secundario = precioArs
    ? moneda === 'USD'
      ? `≈ $ ${Number(precioArs).toLocaleString('es-AR')} ARS`
      : `≈ USD ${Number(precioArs).toLocaleString('es-AR')}`
    : null;

  return { principal, secundario };
}

export default async function PropiedadesPage() {
  const { data: propiedades } = await supabase
    .from('propiedades')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Propiedades</h1>
          <p className="page-subtitle">
            📍 Trenque Lauquen · {propiedades?.length ?? 0} propiedad{(propiedades?.length ?? 0) !== 1 ? 'es' : ''} en total
          </p>
        </div>
        <Link href="/propiedades/nueva" className="btn btn-primary">
          + Nueva propiedad
        </Link>
      </div>

      {!propiedades || propiedades.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state-icon">🏡</span>
            <p className="empty-state-title">No hay propiedades todavía</p>
            <p className="empty-state-text">Agregá tu primera propiedad para publicarla en el sitio de InmoVisión</p>
            <br />
            <Link href="/propiedades/nueva" className="btn btn-primary" style={{ marginTop: '8px' }}>
              + Agregar primera propiedad
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: cards grid */}
          <div className="props-mobile-grid">
            {propiedades.map((p) => {
              const { principal, secundario } = formatPrecio(p.precio, p.moneda, p.precio_ars);
              const fotos = p.imagenes?.length || (p.imagen_url ? 1 : 0);
              return (
                <Link key={p.id} href={`/propiedades/${p.id}`} className="prop-mobile-card">
                  {/* Imagen portada */}
                  {p.imagen_url && (
                    <div style={{ marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9', background: 'var(--bg-subtle)' }}>
                      <img src={p.imagen_url} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className={`badge ${p.tipo === 'venta' ? 'badge-blue' : 'badge-green'}`}>
                      {p.tipo === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                    </span>
                    <span className={`badge ${p.disponible ? 'badge-gold' : 'badge-gray'}`}>
                      {p.disponible ? '● Disponible' : '○ Inactiva'}
                    </span>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                    {p.titulo}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    📍 {p.zona}, Trenque Lauquen{p.direccion ? ` — ${p.direccion}` : ''}
                  </div>
                  {/* Precio dual */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--gold)' }}>
                      {principal}
                    </div>
                    {secundario && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {secundario}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {p.ambientes && <span>🛏 {p.ambientes} amb.</span>}
                    {p.superficie_m2 && <span>📐 {p.superficie_m2} m²</span>}
                    {fotos > 0 && <span>📷 {fotos} foto{fotos !== 1 ? 's' : ''}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="props-desktop-table card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Propiedad</th>
                    <th>Operación</th>
                    <th>Tipo</th>
                    <th>Zona</th>
                    <th>Precio (USD)</th>
                    <th>Precio (ARS)</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {propiedades.map((p) => {
                    const usd = p.moneda === 'USD' ? p.precio : p.precio_ars;
                    const ars = p.moneda === 'ARS' ? p.precio : p.precio_ars;
                    const fotos = p.imagenes?.length || (p.imagen_url ? 1 : 0);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.imagen_url && (
                              <img src={p.imagen_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                            )}
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '14px' }}>{p.titulo}</div>
                              {(p.ambientes || p.superficie_m2 || fotos > 0) && (
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  {p.ambientes && `${p.ambientes} amb.`} {p.superficie_m2 && `· ${p.superficie_m2} m²`} {fotos > 0 && `· 📷 ${fotos}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${p.tipo === 'venta' ? 'badge-blue' : 'badge-green'}`}>
                            {p.tipo === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                          </span>
                        </td>
                        <td style={{ textTransform: 'capitalize', fontSize: '13px' }}>{p.categoria}</td>
                        <td style={{ fontSize: '13px' }}>{p.zona}</td>
                        <td>
                          {usd ? (
                            <div style={{ fontWeight: '700', color: '#16a34a', fontSize: '14px' }}>
                              USD {Number(usd).toLocaleString('es-AR')}
                            </div>
                          ) : <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>}
                        </td>
                        <td>
                          {ars ? (
                            <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '14px' }}>
                              $ {Number(ars).toLocaleString('es-AR')}
                            </div>
                          ) : <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>}
                        </td>
                        <td>
                          <span className={`badge ${p.disponible ? 'badge-gold' : 'badge-gray'}`}>
                            {p.disponible ? '● Disponible' : '○ Inactiva'}
                          </span>
                        </td>
                        <td>
                          <Link href={`/propiedades/${p.id}`} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '13px' }}>
                            Editar →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style>{`
        .props-mobile-grid {
          display: none;
          flex-direction: column;
          gap: 12px;
        }
        .prop-mobile-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          text-decoration: none;
          display: block;
          transition: all 0.2s ease;
        }
        .prop-mobile-card:hover {
          border-color: var(--gold);
          box-shadow: 0 4px 14px var(--gold-glow);
        }
        .props-desktop-table { display: block; }

        @media (max-width: 768px) {
          .props-mobile-grid { display: flex; }
          .props-desktop-table { display: none; }
        }
      `}</style>
    </>
  );
}
