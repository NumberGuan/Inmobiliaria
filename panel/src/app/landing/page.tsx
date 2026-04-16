import { createClient } from '@supabase/supabase-js';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function LandingPage() {
  const { data: propiedades } = await supabase
    .from('propiedades')
    .select('*')
    .eq('disponible', true)
    .order('created_at', { ascending: false });

  return <LandingClient propiedades={propiedades || []} />;
}
