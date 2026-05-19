import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar visitas con datos de cliente y propiedad
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('visitas')
      .select(`
        *,
        clientes (nombre, telefono),
        propiedades (titulo, zona)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Database query error in GET /api/visitas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Supabase fetch failed in GET /api/visitas:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}

// PUT: Actualizar estado de una visita
export async function PUT(req: NextRequest) {
  try {
    const { id, estado } = await req.json();

    const { data, error } = await supabase
      .from('visitas')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database query error in PUT /api/visitas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Supabase fetch failed in PUT /api/visitas:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}
