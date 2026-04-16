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
    <div className="loading-screen">
      <div className="spinner-ring" />
      Cargando propiedad...
    </div>
  );

  const isPrimaryUSD = form.moneda === 'USD';

  return (
    <>
      <Link href="/propiedades" className="back-link">← Volver a propiedades</Link>

      <div className="page-header">
        <h1 className="page-title">Editar propiedad</h1>
        <p className="page-subtitle">Trenque Lauquen — Modificá los datos de esta propiedad</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Título de la propiedad *</label>
            <input className="form-input" name="titulo" value={form.titulo} onChange={handleChange} required />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Operación *</label>
              <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="venta">💰 Venta</option>
                <option value="alquiler">🔑 Alquiler</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de propiedad *</label>
              <select className="form-select" name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="casa">🏡 Casa</option>
                <option value="departamento">🏢 Departamento</option>
                <option value="local">🏪 Local comercial</option>
                <option value="terreno">🌿 Terreno</option>
                <option value="oficina">💼 Oficina</option>
                <option value="campo">🌾 Campo</option>
              </select>
            </div>
          </div>

          {/* Precio dual */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px 18px', marginBottom: '18px', border: '1.5px solid var(--border)' }}>
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', letterSpacing: '0.03em' }}>
              💵 PRECIO
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

          <div style={{ marginBottom: '18px', padding: '10px 14px', background: 'var(--info-bg)', borderRadius: '10px', border: '1px solid var(--info-border)', fontSize: '13px', color: 'var(--info-text)' }}>
            📍 Ciudad: <strong>Trenque Lauquen</strong>, Buenos Aires
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
            <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
              📷 Imágenes ({totalImages}/20)
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
                        <span style={{ position: 'absolute', top: '3px', left: '3px', background: 'var(--gold)', color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 5px', borderRadius: '5px' }}>
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
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '20px', border: '2px dashed var(--border)', borderRadius: '10px', background: 'var(--bg-subtle)', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleImages} style={{ display: 'none' }} />
                <span style={{ fontSize: '24px' }}>➕</span>
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
                      <img src={src} alt={`Nueva ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '2px dashed var(--gold)', display: 'block' }} />
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
            <label htmlFor="disponible">✅ Propiedad disponible — se mostrará en la landing de InmoVisión</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                {uploading ? '⏳ Subiendo imágenes...' : saving ? '⏳ Guardando...' : '💾 Guardar cambios'}
              </button>
              <Link href="/propiedades" className="btn btn-secondary">Cancelar</Link>
            </div>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '⏳ Eliminando...' : '🗑️ Eliminar propiedad'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
