import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAX_IMAGES = 20;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const propiedadId = formData.get('propiedad_id') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No hay archivos para subir.' }, { status: 400 });
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Máximo ${MAX_IMAGES} imágenes por propiedad.` }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      // Validar tipo
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido: ${file.type}. Usá JPG, PNG o WebP.` },
          { status: 400 }
        );
      }

      // Validar tamaño
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > MAX_SIZE_MB) {
        return NextResponse.json(
          { error: `El archivo "${file.name}" es muy grande (${sizeMB.toFixed(1)}MB). Máximo ${MAX_SIZE_MB}MB por imagen.` },
          { status: 400 }
        );
      }

      // Generar nombre único
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const fileName = `${propiedadId || 'prop'}_${timestamp}_${random}.${ext}`;
      const filePath = `propiedades/${fileName}`;

      // Convertir a Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        // Si el bucket no existe, devolver URL directa (fallback)
        console.error('Storage error:', error.message);
        return NextResponse.json(
          { error: `Error al subir imagen: ${error.message}. Asegurate de crear el bucket "imagenes" en Supabase Storage.` },
          { status: 500 }
        );
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath);

      urls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error interno al procesar las imágenes.' }, { status: 500 });
  }
}
