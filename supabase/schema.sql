-- ================================================================
-- INMOBOT - Esquema de Base de Datos Supabase
-- Ejecutar este script en: Supabase > SQL Editor > New Query
-- ================================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- TABLA: propiedades
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS propiedades (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  tipo            TEXT NOT NULL CHECK (tipo IN ('venta', 'alquiler')),
  categoria       TEXT NOT NULL CHECK (categoria IN ('casa', 'departamento', 'local', 'terreno', 'oficina', 'campo')),
  precio          NUMERIC NOT NULL,
  moneda          TEXT NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD', 'ARS')),
  zona            TEXT NOT NULL,
  direccion       TEXT,
  ambientes       INT,
  banos           INT,
  superficie_m2   NUMERIC,
  imagen_url      TEXT,
  disponible      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLA: clientes
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono              TEXT UNIQUE NOT NULL,
  nombre                TEXT,
  presupuesto_min       NUMERIC,
  presupuesto_max       NUMERIC,
  zona_preferida        TEXT,
  tipo_busqueda         TEXT CHECK (tipo_busqueda IN ('venta', 'alquiler')),
  categoria_preferida   TEXT,
  estado_conversacion   TEXT DEFAULT 'inicio',
  datos_conversacion    JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLA: consultas
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id    UUID REFERENCES clientes(id) ON DELETE CASCADE,
  propiedad_id  UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  mensaje       TEXT,
  respuesta     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLA: visitas
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visitas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id      UUID REFERENCES clientes(id) ON DELETE CASCADE,
  propiedad_id    UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  fecha_propuesta DATE,
  hora_propuesta  TIME,
  estado          TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TRIGGER: actualizar updated_at automáticamente
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_propiedades_updated_at
  BEFORE UPDATE ON propiedades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------
-- DATOS DE EJEMPLO (propiedades demo)
-- ----------------------------------------------------------------
INSERT INTO propiedades (titulo, descripcion, tipo, categoria, precio, moneda, zona, direccion, ambientes, banos, superficie_m2, disponible)
VALUES
  ('Casa familiar en el centro', 'Casa amplia con jardín, garage y quincho. Ideal para familia grande.', 'venta', 'casa', 95000, 'USD', 'centro', 'Av. San Martín 450', 4, 2, 180, true),
  ('Departamento moderno 2 amb', 'Departamento luminoso con balcón al frente, cocina equipada.', 'alquiler', 'departamento', 85000, 'ARS', 'norte', 'Belgrano 1230 2°B', 2, 1, 60, true),
  ('Local comercial céntrico', 'Local a la calle, vidriera, baño. Ideal negocio o estudio.', 'alquiler', 'local', 120000, 'ARS', 'centro', 'Rivadavia 890', NULL, 1, 45, true),
  ('Casa 3 ambientes barrio residencial', 'Casa con patio, lavadero y garage. Barrio tranquilo.', 'venta', 'casa', 72000, 'USD', 'sur', 'Los Aromos 234', 3, 1, 120, true),
  ('Departamento 1 ambiente para estudiante', 'Monoambiente luminoso cerca del centro. Todo incluido.', 'alquiler', 'departamento', 65000, 'ARS', 'centro', 'Moreno 567 3°A', 1, 1, 35, true);

-- ----------------------------------------------------------------
-- RLS (Row Level Security) - Deshabilitar para simplicidad en MVP
-- Si querés seguridad, habilitá RLS y usá service_role key en el bot
-- ----------------------------------------------------------------
ALTER TABLE propiedades DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultas DISABLE ROW LEVEL SECURITY;
ALTER TABLE visitas DISABLE ROW LEVEL SECURITY;
