import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar todas las propiedades
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error in GET /api/propiedades:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Supabase fetch failed in GET /api/propiedades:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}

// POST: Crear nueva propiedad
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('propiedades')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Database query error in POST /api/propiedades:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('Supabase fetch failed in POST /api/propiedades:', e);
    return NextResponse.json({
      error: 'Error de conexión con la base de datos. Verificá las credenciales y el estado de tu red.',
      details: e.message
    }, { status: 503 });
  }
}
