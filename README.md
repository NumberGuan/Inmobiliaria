# InmoVisión - Plataforma de Gestión Inmobiliaria y Asistente de IA (InmoBot)

InmoVisión es un ecosistema digital integral para la administración, publicación de propiedades inmobiliarias y atención automatizada a clientes mediante inteligencia artificial. Combina un panel administrativo web moderno y optimizado con un bot conversacional de WhatsApp autohospedado, gratuito y tolerante a fallos.

Este proyecto ha sido desarrollado por Tomás Ortellado.

---

## Estado del Proyecto

Este software se encuentra actualmente en fase activa de desarrollo y testing. No es una versión final o de producción, por lo que puede contener errores, inconsistencias o comportamientos inesperados. Se recomienda su uso principalmente con fines de demostración, pruebas y desarrollo local.

---

## Arquitectura y Componentes del Sistema

El ecosistema está compuesto por tres pilares fundamentales que interactúan de forma fluida:

### 1. Panel de Administración y Catálogo Público (Next.js)
* **Página Pública (Landing Page)**: Permite a los visitantes explorar de forma interactiva el catálogo de propiedades disponibles en InmoVisión, con filtros avanzados de búsqueda por tipo de operación (Venta o Alquiler) y coincidencias de texto en tiempo real.
* **Consola de Administración Privada**: Panel seguro protegido mediante Next.js Middleware para la gestión integral del catálogo. Permite crear, editar, dar de baja y visualizar propiedades con formularios optimizados.
* **Módulo de Carga Multimedia**: Integra carga directa de imágenes a buckets de almacenamiento remoto (Storage), con previsualización en tiempo real, validación de formatos y control de tamaños antes de persistir los datos.
* **Diseño e Interfaz Premium**: Desarrollado con una estética minimalista elegante (Slate/Teal), indicadores LED animados por CSS, transiciones suaves y layouts 100% responsivos adaptables a cualquier dispositivo.

### 2. Base de Datos Relacional y Backend (Supabase)
* **Gestión de Datos Estructurada**: Cuatro tablas en PostgreSQL que garantizan la integridad de la información:
  * `propiedades`: Registra los detalles del inmueble (dirección, precio, ambientes, baños, superficie, tipo de operación, estado y enlaces a imágenes).
  * `clientes`: Guarda la información de los usuarios (teléfono estándar, nombre resuelto de WhatsApp, perfil de preferencias de búsqueda y el historial conversacional reciente).
  * `visitas`: Registra las citas y visitas propuestas que son agendadas de manera automática.
  * `consultas`: Almacena la bandeja de entrada de consultas específicas vinculadas a inmuebles concretos para seguimiento humano.
* **Seguridad y Almacenamiento**: Autenticación nativa y buckets de almacenamiento privado para las imágenes de la plataforma.

### 3. Asistente Conversacional Inteligente (InmoBot para WhatsApp)
* **Atención Empática y Altamente Humanizada**: Desarrollado utilizando la API gratuita de Google Gemini 2.5 Flash. Posee directrices sistémicas para interactuar con los clientes con calidez, paciencia y lenguaje natural, evitando textos robóticos, estructurados en exceso o aburridos.
* **Compatibilidad Absoluta con LIDs (Linked Identifiers)**: Con las recientes actualizaciones de privacidad de WhatsApp, el bot gestiona de forma inteligente los identificadores de tipo LID (por ejemplo, `xxxx@lid`) mapeándolos de forma automática mediante consultas REST a OpenWA para registrar al cliente en la base de datos con su número de teléfono real (`@c.us`) y su nombre público de perfil de WhatsApp (`pushName`).
* **Ruteo Bidireccional Seguro**: Las respuestas del bot se dirigen al JID exacto que inició la conversación, garantizando la compatibilidad total y el envío de mensajes sin fallas tanto para identificadores clásicos como para cuentas protegidas con LID.
* **Integración Activa con el Catálogo**: El bot accede dinámicamente a las propiedades disponibles en la base de datos para recomendar únicamente inmuebles existentes que coincidan con el presupuesto y la zona de interés del cliente.
* **Automatización de Acciones (Intention Extraction)**:
  * *Actualización de Perfil*: Detecta y guarda preferencias de búsqueda (presupuesto mínimo/máximo, zona de preferencia, tipo de operación).
  * *Agendamiento de Visitas*: Inserta citas de forma directa en la tabla `visitas` en estado "pendiente" cuando el cliente acuerda un día y horario en el chat.
  * *Registro de Consultas*: Registra consultas sobre inmuebles para el seguimiento manual del administrador.
* **Tolerancia a Fallas y Auto-Healing**:
  * Cuenta con un controlador automático que monitoriza el estado de la pasarela local de WhatsApp (Docker o CLI de `rmyndharis/OpenWA`).
  * Si la sesión se corrompe, se desconecta o expira, el sistema elimina automáticamente la sesión corrupta, inicializa un handshake limpio y regenera el código QR para escanear en el dashboard administrativo sin intervención técnica ni reinicios de servidor.
  * Captura el estado en etapas tempranas de inicialización para acelerar la visualización del QR en la interfaz.

---

## Tecnologías Utilizadas

* **Frontend**: Next.js, React, TypeScript, Tailwind CSS, CSS modular personalizado.
* **Backend y Almacenamiento**: Supabase, PostgreSQL.
* **Pasarela de WhatsApp**: Container Docker local de `rmyndharis/OpenWA` (puppeteer headless browser API).
* **Motor de Inteligencia Artificial**: API de Google Gemini (modelo gratuito Gemini 2.5 Flash).

---

## Variables de Entorno y Configuración Local

Por seguridad del sistema, no se incluye ninguna credencial de bases de datos, claves de APIs o llaves criptográficas en el repositorio. Para ejecutar el proyecto de forma local, debe crear un archivo `.env.local` en la raíz del directorio `/panel` (puede guiarse del archivo `.env.local.example` que contiene los nombres de las variables sin sus valores):

```env
# Conexión con Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Seguridad del Administrador
ADMIN_PASSWORD=tu_contrasena_de_acceso_al_panel
SESSION_SECRET=un_secreto_seguro_para_firmar_sesiones
```

La clave API de Google Gemini, la URL de la pasarela local de WhatsApp y el token de autorización opcional de OpenWA se configuran de forma segura y persistente directamente desde la interfaz administrativa web en la pestaña "WhatsApp", guardándose localmente en un archivo de configuración seguro del servidor sin exponerse al cliente web.

---

## Instrucciones para Despliegue e Instalación Local

### Paso 1: Base de Datos (Supabase)
1. Cree un proyecto nuevo en Supabase.
2. Acceda a la consola SQL y ejecute los scripts de inicialización de esquemas ubicados en el directorio `/supabase` para crear las tablas (`propiedades`, `clientes`, `visitas`, `consultas`) con sus respectivas relaciones e índices de rendimiento.
3. Configure un Bucket de almacenamiento público llamado `propiedades` en Supabase Storage para alojar las imágenes de los inmuebles.

### Paso 2: Pasarela de WhatsApp (OpenWA)
1. Instale y levante la pasarela en su máquina local utilizando Docker:
   ```bash
   docker run -d -p 2785:2785 --name openwa-api rmyndharis/openwa
   ```
2. La pasarela estará disponible en `http://localhost:2785`.

### Paso 3: Frontend y Backend Web (Next.js)
1. Acceda al directorio `/panel` desde su terminal.
2. Instale las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configure el archivo `.env.local` con las credenciales de Supabase del Paso 1.
4. Inicie el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
5. Acceda a `http://localhost:3000` en su navegador web.
6. Inicie sesión en el administrador utilizando la contraseña configurada y diríjase a la sección "WhatsApp".
7. Ingrese la URL de su pasarela local (`http://localhost:2785`), su clave API gratuita de Google Gemini (generada en Google AI Studio) y presione "Guardar".
8. Escanee el código QR que se renderizará automáticamente en pantalla con la aplicación de WhatsApp de su celular.

Una vez escaneado el código QR, el bot se conectará de forma autónoma, registrará el webhook local apuntando a la API del proyecto y comenzará a atender clientes de forma inteligente y automatizada las 24 horas del día.
