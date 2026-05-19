import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SVG Icon Helpers
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '4px', opacity: 0.8 }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HomeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block', color: 'var(--primary-teal)' }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-2px', marginRight: '5px' }}>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '5px' }}>
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-2px', marginRight: '4px', opacity: 0.7 }}>
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 14h20M6 8v6" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-2px', marginRight: '4px', opacity: 0.7 }}>
      <path d="M21.3 8.11 15.89 2.7a1 1 0 0 0-1.41 0L2.7 14.48a1 1 0 0 0 0 1.41l5.41 5.41a1 1 0 0 0 1.42 0L21.3 9.53a1 1 0 0 0 0-1.42Z" />
      <path d="m16 6-3 3M12 10 9 13M8 14l-3 3" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-2px', marginRight: '4px', opacity: 0.7 }}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

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
          <h1 className="page-title" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>Propiedades</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PinIcon /> Trenque Lauquen · {propiedades?.length ?? 0} propiedad{(propiedades?.length ?? 0) !== 1 ? 'es' : ''} en total
          </p>
        </div>
        <Link href="/propiedades/nueva" className="btn btn-primary">
          + Nueva propiedad
        </Link>
      </div>

      {!propiedades || propiedades.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'inline-flex', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '50%', marginBottom: '16px' }}>
              <HomeIcon size={44} />
            </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className={`badge ${p.tipo === 'venta' ? 'badge-blue' : 'badge-green'}`}>
                      {p.tipo === 'venta' ? <TagIcon /> : <KeyIcon />}
                      {p.tipo === 'venta' ? 'Venta' : 'Alquiler'}
                    </span>
                    <span className={`badge ${p.disponible ? 'badge-gold' : 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <span className={`status-dot-mini ${p.disponible ? 'active' : 'inactive'}`} />
                      {p.disponible ? 'Disponible' : 'Inactiva'}
                    </span>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                    {p.titulo}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <PinIcon /> {p.zona}, Trenque Lauquen{p.direccion ? ` — ${p.direccion}` : ''}
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
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {p.ambientes && <span style={{ display: 'inline-flex', alignItems: 'center' }}><BedIcon /> {p.ambientes} amb.</span>}
                    {p.superficie_m2 && <span style={{ display: 'inline-flex', alignItems: 'center' }}><RulerIcon /> {p.superficie_m2} m²</span>}
                    {fotos > 0 && <span style={{ display: 'inline-flex', alignItems: 'center' }}><CameraIcon /> {fotos} foto{fotos !== 1 ? 's' : ''}</span>}
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
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  {p.ambientes && <span style={{ display: 'inline-flex', alignItems: 'center' }}><BedIcon /> {p.ambientes} amb.</span>}
                                  {p.superficie_m2 && <span style={{ display: 'inline-flex', alignItems: 'center' }}><RulerIcon /> {p.superficie_m2} m²</span>}
                                  {fotos > 0 && <span style={{ display: 'inline-flex', alignItems: 'center' }}><CameraIcon /> {fotos}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${p.tipo === 'venta' ? 'badge-blue' : 'badge-green'}`}>
                            {p.tipo === 'venta' ? <TagIcon /> : <KeyIcon />}
                            {p.tipo === 'venta' ? 'Venta' : 'Alquiler'}
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
                          <span className={`badge ${p.disponible ? 'badge-gold' : 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span className={`status-dot-mini ${p.disponible ? 'active' : 'inactive'}`} />
                            {p.disponible ? 'Disponible' : 'Inactiva'}
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
          transition: all 0.2s ease-in-out;
        }
        .prop-mobile-card:hover {
          border-color: var(--gold);
          box-shadow: 0 4px 14px var(--gold-glow);
          transform: translateY(-2px);
        }
        .props-desktop-table { display: block; }
        
        .status-dot-mini {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot-mini.active {
          background-color: var(--success, #10b981);
          box-shadow: 0 0 6px var(--success, #10b981);
        }
        .status-dot-mini.inactive {
          background-color: var(--text-muted, #94a3b8);
        }

        @media (max-width: 768px) {
          .props-mobile-grid { display: flex; }
          .props-desktop-table { display: none; }
        }
      `}</style>
    </>
  );
}

