import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Listar visitas con datos de cliente y propiedad
export async function GET() {
  const { data, error } = await supabase
    .from('visitas')
    .select(`
      *,
      clientes (nombre, telefono),
      propiedades (titulo, zona)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT: Actualizar estado de una visita
export async function PUT(req: NextRequest) {
  const { id, estado } = await req.json();

  const { data, error } = await supabase
    .from('visitas')
    .update({ estado })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
