'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageProps { params: { id: string } }

const BARRIOS_TL = [
  'Centro', 'Villa Anclao', 'Centenario', 'Norte', 'Sur',
  'Belgrano', 'Rivadavia', 'San Martín', 'Urquiza', 'Industrial',
  'Campo', 'Otro'
];

// SVG Components
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', verticalAlign: '-1.5px', marginRight: '6px' }}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: '-3px', marginRight: '8px' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px', color: 'var(--primary-teal)' }}>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px', color: 'var(--primary-teal)' }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function FolderUploadIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block', color: 'var(--primary-teal)', opacity: 0.85 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', display: 'inline-block', verticalAlign: '-2.5px', marginRight: '6px' }}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', display: 'inline-block', verticalAlign: '-3px', marginRight: '6px' }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', display: 'inline-block', color: 'var(--success)', verticalAlign: '-1.5px', marginRight: '6px' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function EditarPropiedadPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    titulo: '', descripcion: '', tipo: 'venta', categoria: 'casa',
    precio: '', moneda: 'USD', precio_ars: '', zona: '', direccion: '',
    ambientes: '', banos: '', superficie_m2: '', disponible: true
  });

  useEffect(() => {
    fetch(`/api/propiedades/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setForm({
            titulo: data.titulo || '',
            descripcion: data.descripcion || '',
            tipo: data.tipo || 'venta',
            categoria: data.categoria || 'casa',
            precio: String(data.precio || ''),
            moneda: data.moneda || 'USD',
            precio_ars: data.precio_ars ? String(data.precio_ars) : '',
            zona: data.zona || '',
            direccion: data.direccion || '',
            ambientes: data.ambientes ? String(data.ambientes) : '',
            banos: data.banos ? String(data.banos) : '',
            superficie_m2: data.superficie_m2 ? String(data.superficie_m2) : '',
            disponible: data.disponible !== false
          });
          // cargar imágenes existentes
          const imgs: string[] = [];
          if (data.imagenes && Array.isArray(data.imagenes)) {
            imgs.push(...data.imagenes);
          } else if (data.imagen_url) {
            imgs.push(data.imagen_url);
          }
          setExistingImages(imgs);
        } else {
          setError('No se pudo cargar la propiedad.');
        }
        setLoading(false);
      })
      .catch(() => { setError('Error de conexión.'); setLoading(false); });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalActual = existingImages.length + newImageFiles.length;
    const totalConNuevos = totalActual + files.length;

    if (totalConNuevos > 20) {
      setError(`Máximo 20 imágenes. Ya tenés ${totalActual}, intentás agregar ${files.length}.`);
      return;
    }

    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`${oversized.map(f => f.name).join(', ')} superan los 5MB.`);
      return;
    }

    setError('');
    setNewImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const totalImages = existingImages.length + newImageFiles.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) { setError('El título es requerido.'); return; }
    if (!form.precio || Number(form.precio) <= 0) { setError('El precio debe ser mayor a 0.'); return; }
    if (!form.zona) { setError('Seleccioná un barrio/zona.'); return; }

    setSaving(true);
    setError('');

    try {
      let allImageUrls = [...existingImages];

      // Subir nuevas imágenes si hay
      if (newImageFiles.length > 0) {
        setUploading(true);
        const fd = new FormData();
        newImageFiles.forEach(f => fd.append('images', f));
        fd.append('propiedad_id', params.id);

        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();

        if (!upRes.ok) throw new Error(upData.error || 'Error al subir imágenes');
        allImageUrls = [...allImageUrls, ...upData.urls];
        setUploading(false);
      }

      const res = await fetch(`/api/propiedades/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: form.titulo,
          descripcion: form.descripcion || null,
          tipo: form.tipo,
          categoria: form.categoria,
          precio: Number(form.precio),
          moneda: form.moneda,
          precio_ars: form.precio_ars ? Number(form.precio_ars) : null,
          zona: form.zona,
          ciudad: 'Trenque Lauquen',
          direccion: form.direccion || null,
          ambientes: form.ambientes ? Number(form.ambientes) : null,
          banos: form.banos ? Number(form.banos) : null,
          superficie_m2: form.superficie_m2 ? Number(form.superficie_m2) : null,
          imagen_url: allImageUrls[0] || null,
          imagenes: allImageUrls.length > 0 ? allImageUrls : null,
          disponible: form.disponible,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      router.push('/propiedades');
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Seguro que querés eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/propiedades/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      router.push('/propiedades');
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="loading-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="spinner-ring" />
      Cargando propiedad...
    </div>
  );

  const isPrimaryUSD = form.moneda === 'USD';

  return (
    <>
      <Link href="/propiedades" className="back-link" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <ArrowLeftIcon /> Volver a propiedades
      </Link>

      <div className="page-header">
        <h1 className="page-title" style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}>Editar propiedad</h1>
        <p className="page-subtitle">Trenque Lauquen — Modificá los datos de esta propiedad</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center' }}>
            <AlertIcon /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Título de la propiedad *</label>
            <input className="form-input" name="titulo" value={form.titulo} onChange={handleChange} required />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Operación *</label>
              <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de propiedad *</label>
              <select className="form-select" name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="local">Local comercial</option>
                <option value="terreno">Terreno</option>
                <option value="oficina">Oficina</option>
                <option value="campo">Campo</option>
              </select>
            </div>
          </div>

          {/* Precio dual */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px 18px', marginBottom: '18px', border: '1.5px solid var(--border)' }}>
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', letterSpacing: '0.03em', display: 'flex', alignItems: 'center' }}>
              <DollarIcon /> PRECIO
            </div>
            <div className="form-grid-21">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{isPrimaryUSD ? 'Precio en USD *' : 'Precio en ARS *'}</label>
                <input className="form-input" name="precio" type="number" value={form.precio}
                  onChange={handleChange} required min="1" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Moneda principal *</label>
                <select className="form-select" name="moneda" value={form.moneda} onChange={handleChange}>
                  <option value="USD">USD — Dólares</option>
                  <option value="ARS">ARS — Pesos</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                {isPrimaryUSD ? 'Equivalente en ARS (opcional)' : 'Equivalente en USD (opcional)'}
              </label>
              <input className="form-input" name="precio_ars" type="number" value={form.precio_ars}
                onChange={handleChange} placeholder={isPrimaryUSD ? 'Ej: 85000000' : 'Ej: 80000'} min="1" />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                Si cargás ambos, la publicación mostrará los dos precios claramente.
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '18px', padding: '10px 14px', background: 'var(--info-bg)', borderRadius: '10px', border: '1px solid var(--info-border)', fontSize: '13px', color: 'var(--info-text)', display: 'flex', alignItems: 'center' }}>
            <PinIcon /> Ciudad: <strong style={{ marginLeft: '4px' }}>Trenque Lauquen</strong>, Buenos Aires
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Barrio / Zona *</label>
              <select className="form-select" name="zona" value={form.zona} onChange={handleChange} required>
                <option value="">Seleccioná el barrio</option>
                {BARRIOS_TL.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" name="direccion" value={form.direccion} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Ambientes</label>
              <input className="form-input" name="ambientes" type="number" value={form.ambientes} onChange={handleChange} min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Baños</label>
              <input className="form-input" name="banos" type="number" value={form.banos} onChange={handleChange} min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Superficie (m²)</label>
              <input className="form-input" name="superficie_m2" type="number" value={form.superficie_m2} onChange={handleChange} min="1" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          {/* Imágenes */}
          <div style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <CameraIcon /> Imágenes ({totalImages}/20)
            </label>

            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Fotos actuales:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {existingImages.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--border)', display: 'block' }} />
                      {i === 0 && (
                        <span style={{ position: 'absolute', top: '3px', left: '3px', background: 'var(--primary-teal)', color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 5px', borderRadius: '5px' }}>
                          PORTADA
                        </span>
                      )}
                      <button type="button" onClick={() => removeExistingImage(i)}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Agregar nuevas */}
            {totalImages < 20 && (
              <label className="upload-dropzone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '20px', border: '2px dashed var(--border)', borderRadius: '10px', background: 'var(--bg-subtle)', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleImages} style={{ display: 'none' }} />
                <FolderUploadIcon size={28} />
                <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>Agregar más imágenes</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Podés agregar hasta {20 - totalImages} más</span>
              </label>
            )}

            {/* Previews nuevas */}
            {newImagePreviews.length > 0 && (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '10px 0 6px' }}>Nuevas fotos a agregar:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                  {newImagePreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt={`Nueva ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '2px dashed var(--primary-teal)', display: 'block' }} />
                      <button type="button" onClick={() => removeNewImage(i)}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="form-checkbox-row">
            <input type="checkbox" id="disponible" name="disponible" checked={form.disponible} onChange={handleChange} />
            <label htmlFor="disponible" style={{ display: 'flex', alignItems: 'center' }}>
              <CheckIcon /> Propiedad disponible — se mostrará en la landing de InmoVisión
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading} style={{ display: 'flex', alignItems: 'center' }}>
                {uploading ? (
                  <>
                    <span className="spinner-mini" /> Subiendo imágenes...
                  </>
                ) : saving ? (
                  <>
                    <span className="spinner-mini" /> Guardando...
                  </>
                ) : (
                  <>
                    <SaveIcon /> Guardar cambios
                  </>
                )}
              </button>
              <Link href="/propiedades" className="btn btn-secondary">Cancelar</Link>
            </div>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting} style={{ display: 'flex', alignItems: 'center' }}>
              {deleting ? (
                <>
                  <span className="spinner-mini" /> Eliminando...
                </>
              ) : (
                <>
                  <TrashIcon /> Eliminar propiedad
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .upload-dropzone:hover {
          border-color: var(--primary-teal) !important;
          background: var(--bg-card-hover) !important;
        }

        .spinner-mini {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          display: inline-block;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
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

