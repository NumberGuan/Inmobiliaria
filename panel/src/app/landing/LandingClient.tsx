'use client';

import { useState } from 'react';

interface Propiedad {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: string;
  categoria: string;
  precio: number;
  moneda: string;
  precio_ars?: number;
  zona: string;
  direccion?: string;
  ambientes?: number;
  banos?: number;
  superficie_m2?: number;
  imagen_url?: string;
  imagenes?: string[];
}

function formatPrecio(p: Propiedad) {
  const principal = p.moneda === 'USD'
    ? `USD ${Number(p.precio).toLocaleString('es-AR')}`
    : `$ ${Number(p.precio).toLocaleString('es-AR')}`;
  const secundario = p.precio_ars
    ? p.moneda === 'USD'
      ? `≈ $ ${Number(p.precio_ars).toLocaleString('es-AR')} ARS`
      : `≈ USD ${Number(p.precio_ars).toLocaleString('es-AR')}`
    : null;
  return { principal, secundario };
}

function Modal({ prop, onClose }: { prop: Propiedad; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs: string[] = prop.imagenes?.length
    ? prop.imagenes
    : prop.imagen_url
    ? [prop.imagen_url]
    : [];
  const { principal, secundario } = formatPrecio(prop);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', backdropFilter: 'blur(6px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111827', borderRadius: '20px', width: '100%', maxWidth: '720px',
        maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)'
      }}>
        {/* Gallery */}
        {imgs.length > 0 && (
          <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0b0f19', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
            <img src={imgs[imgIdx]} alt={prop.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: '20px', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>‹</button>
                <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: '20px', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>›</button>
                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                  {imgs.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{ width: i === imgIdx ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === imgIdx ? '#3b82f6' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} />
                  ))}
                </div>
              </>
            )}
            <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '18px', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ background: prop.tipo === 'venta' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)', color: prop.tipo === 'venta' ? '#60a5fa' : '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: `1px solid ${prop.tipo === 'venta' ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
              {prop.tipo === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', textTransform: 'capitalize' }}>
              {prop.categoria}
            </span>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{prop.titulo}</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>📍 {prop.zona}, Trenque Lauquen{prop.direccion ? ` — ${prop.direccion}` : ''}</p>

          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>{principal}</div>
            {secundario && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{secundario}</div>}
          </div>

          {(prop.ambientes || prop.banos || prop.superficie_m2) && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {prop.ambientes && <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>🛏</div>
                <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{prop.ambientes}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Ambientes</div>
              </div>}
              {prop.banos && <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>🚿</div>
                <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{prop.banos}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Baños</div>
              </div>}
              {prop.superficie_m2 && <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>📐</div>
                <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{prop.superficie_m2} m²</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Superficie</div>
              </div>}
            </div>
          )}

          {prop.descripcion && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 600, fontSize: '14px', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Descripción</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7 }}>{prop.descripcion}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="tel:+542392412345" style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 20px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              📞 Llamar
            </a>
            <a href="https://wa.me/5492392412345?text=Hola!%20Me%20interesa%20la%20propiedad%20" target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 20px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingClient({ propiedades }: { propiedades: Propiedad[] }) {
  const [filtro, setFiltro] = useState<'todos' | 'venta' | 'alquiler'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [selected, setSelected] = useState<Propiedad | null>(null);

  const filtradas = propiedades.filter(p => {
    const matchTipo = filtro === 'todos' || p.tipo === filtro;
    const q = busqueda.toLowerCase();
    const matchSearch = !q || p.titulo.toLowerCase().includes(q) || p.zona.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
    return matchTipo && matchSearch;
  });

  return (
    <>
      {selected && <Modal prop={selected} onClose={() => setSelected(null)} />}

      {/* NAVBAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(11,15,25,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🏠</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>InmoVisión</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="tel:+542392412345" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              📞 <span style={{ display: 'none' }} className="nav-phone">(2392) 41-2345</span>
            </a>
            <a href="https://wa.me/5492392412345" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', padding: '9px 18px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
              Contactar
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: '#60a5fa', marginBottom: '24px', letterSpacing: '0.06em' }}>
            📍 TRENQUE LAUQUEN, BUENOS AIRES
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Encontrá tu{' '}
            <span style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              próxima propiedad
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '40px' }}>
            Las mejores propiedades en venta y alquiler de Trenque Lauquen y la zona, con atención personalizada.
          </p>
          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { n: propiedades.filter(p => p.tipo === 'venta').length, label: 'En venta' },
              { n: propiedades.filter(p => p.tipo === 'alquiler').length, label: 'En alquiler' },
              { n: propiedades.length, label: 'Disponibles' },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section style={{ padding: '0 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar por título, zona o tipo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '11px 16px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['todos', 'venta', 'alquiler'] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f)} style={{ padding: '10px 18px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', border: filtro === f ? 'none' : '1.5px solid rgba(255,255,255,0.12)', background: filtro === f ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'transparent', color: filtro === f ? '#fff' : '#94a3b8', fontFamily: 'inherit' }}>
                  {f === 'todos' ? 'Todos' : f === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filtradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏡</div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>No se encontraron propiedades</p>
              <p style={{ fontSize: '14px' }}>Probá cambiando el filtro o la búsqueda</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filtradas.map(p => {
                const { principal, secundario } = formatPrecio(p);
                const imgs: string[] = p.imagenes?.length ? p.imagenes : p.imagen_url ? [p.imagen_url] : [];
                return (
                  <div key={p.id} onClick={() => setSelected(p)} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s', position: 'relative' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(59,130,246,0.15)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59,130,246,0.35)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>

                    {/* Image */}
                    <div style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
                      {imgs[0]
                        ? <img src={imgs[0]} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.3 }}>🏡</div>
                      }
                      {imgs.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                          📷 {imgs.length}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '18px 20px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ background: p.tipo === 'venta' ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)', color: p.tipo === 'venta' ? '#60a5fa' : '#34d399', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, border: `1px solid ${p.tipo === 'venta' ? 'rgba(59,130,246,0.25)' : 'rgba(16,185,129,0.25)'}` }}>
                          {p.tipo === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize', fontWeight: 500 }}>{p.categoria}</span>
                      </div>

                      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.3 }}>{p.titulo}</h3>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>📍 {p.zona}, Trenque Lauquen</p>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#60a5fa', marginBottom: '2px' }}>{principal}</div>
                        {secundario && <div style={{ fontSize: '11px', color: '#64748b' }}>{secundario}</div>}
                      </div>

                      {(p.ambientes || p.superficie_m2 || p.banos) && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                          {p.ambientes && <span>🛏 {p.ambientes} amb.</span>}
                          {p.banos && <span>🚿 {p.banos} baños</span>}
                          {p.superficie_m2 && <span>📐 {p.superficie_m2} m²</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#080c14', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>🏠</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>InmoVisión</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>Tu inmobiliaria de confianza en Trenque Lauquen. Más de 10 años conectando familias con su hogar ideal.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase' }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '📞', text: '(2392) 41-2345' },
                { icon: '📧', text: 'info@inmovision.com.ar' },
                { icon: '📍', text: 'Av. San Martín 1240, Trenque Lauquen' },
                { icon: '🕐', text: 'Lun–Vie 9:00 – 18:00' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase' }}>Escribinos</h4>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>¿Tenés alguna consulta? Contactanos y te respondemos a la brevedad.</p>
            <a href="https://wa.me/5492392412345?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n." target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
              💬 Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '32px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#374151', fontSize: '12px' }}>
          © {new Date().getFullYear()} InmoVisión — Trenque Lauquen, Buenos Aires
        </div>
      </footer>
    </>
  );
}
