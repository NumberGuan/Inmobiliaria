-- ================================================================
-- MIGRACIÓN: Agregar soporte dual de precios e imágenes múltiples
-- Ejecutar en Supabase → SQL Editor
-- ================================================================

-- 1. Agregar columna de precio secundario
ALTER TABLE propiedades 
  ADD COLUMN IF NOT EXISTS precio_ars NUMERIC,
  ADD COLUMN IF NOT EXISTS ciudad TEXT DEFAULT 'Trenque Lauquen',
  ADD COLUMN IF NOT EXISTS imagenes TEXT[];

-- 2. Actualizar registros existentes con ciudad por defecto
UPDATE propiedades SET ciudad = 'Trenque Lauquen' WHERE ciudad IS NULL;

-- ================================================================
-- STORAGE: Crear bucket para imágenes de propiedades
-- Ejecutar en Supabase → Storage → New Bucket
-- Nombre: imagenes
-- Public: SÍ (para mostrar fotos sin auth)
-- ================================================================

-- O bien, ejecutar este SQL si tenés acceso al storage por SQL:
-- INSERT INTO storage.buckets (id, name, public) 
--   VALUES ('imagenes', 'imagenes', true)
--   ON CONFLICT (id) DO NOTHING;

-- Política de acceso público para lectura
-- En Storage → imagenes → Policies → Add Policy:
-- SELECT: allow public
-- INSERT: allow authenticated OR allow all (para el panel)

-- ================================================================
-- VERIFICAR que todo funciona:
-- ================================================================
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'propiedades' 
ORDER BY ordinal_position;
