# InmoVisión - Plataforma de Gestión Inmobiliaria

InmoVisión es un sistema integral para la administración y publicación de propiedades inmobiliarias. Este proyecto se encuentra actualmente en fase de desarrollo.

## Arquitectura del Proyecto

El sistema está compuesto por dos partes principales:

1. **Panel Administrativo (Frontend):** 
   - Desarrollado en React y Next.js.
   - Permite la gestión completa del catálogo de propiedades (creación, lectura, actualización y eliminación).
   - Incluye carga y administración de imágenes.
   - Cuenta con una página pública (Landing Page) para que los clientes puedan visualizar el catálogo de propiedades disponibles, realizar búsquedas y aplicar filtros.
   - Autenticación y protección de rutas privadas.

2. **Base de Datos (Backend):**
   - Implementado utilizando Supabase (PostgreSQL).
   - Almacena información detallada de propiedades y usuarios.
   - Provee servicios de autenticación y almacenamiento (Storage) para los recursos multimedia.

*(Nota: Históricamente el proyecto incluía un servicio de integración con WhatsApp, el cual ha sido removido de la arquitectura actual para enfocar el producto en una plataforma web).*

## Tecnologías Utilizadas

- **Frontend:** Next.js, React, TypeScript, CSS.
- **Backend / DB:** Supabase, PostgreSQL.
- **Despliegue:** Vercel.

## Estado del Proyecto

El proyecto es un MVP en activo desarrollo. Las funcionalidades implementadas incluyen:
- Visualización pública del catálogo de propiedades.
- Filtrado por tipo de operación (Venta / Alquiler) y búsqueda por coincidencia de texto.
- Panel privado para administración de publicaciones.
- Carga de imágenes con validación y previsualización.

## Requisitos de Instalación Local

Para ejecutar este proyecto en un entorno local, se requiere:

1. Clonar el repositorio.
2. Contar con un proyecto en Supabase y obtener las credenciales de la API (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Ejecutar el script SQL provisto en la carpeta `supabase/` para inicializar las tablas de la base de datos.
4. Crear un archivo `.env.local` en la carpeta `panel/` utilizando como base el archivo `.env.local.example`.
5. Ejecutar los siguientes comandos dentro del directorio `panel/`:

\`\`\`bash
npm install
npm run dev
\`\`\`

La aplicación estará disponible en \`http://localhost:3000\`.
