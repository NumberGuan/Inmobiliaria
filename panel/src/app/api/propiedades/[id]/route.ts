import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Obtener una propiedad por ID
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Database query error in GET /api/propiedades/[id]:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Supabase fetch failed in GET /api/propiedades/[id]:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}

// PUT: Actualizar una propiedad
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('propiedades')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Database query error in PUT /api/propiedades/[id]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Supabase fetch failed in PUT /api/propiedades/[id]:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}

// DELETE: Eliminar una propiedad
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Database query error in DELETE /api/propiedades/[id]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Supabase fetch failed in DELETE /api/propiedades/[id]:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}
