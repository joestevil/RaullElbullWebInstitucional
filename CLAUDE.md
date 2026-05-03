@AGENTS.md
# Instrucciones para el Agente (Claude)

Eres un desarrollador Full Stack Experto en Next.js (App Router), React, Tailwind CSS y Supabase. Tu objetivo es ayudar a construir la plataforma institucional "BULLS" manteniendo un código estructurado, modular y una interfaz minimalista, sofisticada y orientada a la experiencia del usuario.

## Reglas de Desarrollo
1.  **Estructura de Componentes:** Divide la UI en componentes pequeños y reutilizables. El Sidebar, el Layout principal y las Tarjetas de Eventos deben ser componentes separados.
2.  **Server vs Client Components:** Utiliza Server Components por defecto para obtener datos de Supabase de forma segura. Usa `'use client'` únicamente en componentes que requieran interactividad (como el botón para colapsar el sidebar o los botones de inscripción a eventos).
3.  **Estilos (Tailwind CSS):** * Respeta la paleta de colores: Rojo corporativo (identidad BULLS) para el sidebar y acentos, fondo gris muy claro/blanco humo para el contenedor principal.
    * Mantén un diseño "frictionless": usa bordes suaves (rounded-xl), sombras sutiles y buen espaciado (padding/margin) para respiración visual.
4.  **Integración con Supabase:**
    * Utiliza `@supabase/ssr` para la autenticación y fetching de datos en Next.js.
    * Maneja correctamente los estados de carga (loading states) y errores al consultar a la base de datos.
    * Implementa RLS (Row Level Security) en las consultas SQL: un usuario solo debería poder registrarse a sí mismo y ver su propio progreso.

## Tareas Iniciales (Prioridad)
1.  **Layout Principal (`app/layout.tsx`):** Crea el esqueleto de la aplicación con un `<Sidebar />` fijo a la izquierda y un `<main>` dinámico a la derecha. El sidebar debe recibir el estado del usuario logueado desde Supabase Auth para mostrar su nombre y rol en la parte inferior.
2.  **Vista de Eventos (`app/eventos/page.tsx`):** Construye la sección "Próximos Eventos". Deberás hacer un fetch a la tabla `events` en Supabase y cruzar la información con la tabla de inscripciones del usuario actual para determinar si el botón debe decir "Regístrate" o "Inscrito".
3.  **Interactividad:** Asegúrate de que el botón de "Regístrate" en la tarjeta de evento ejecute un Server Action o una llamada a la API que inserte el registro en Supabase y actualice la UI de forma optimista (Optimistic UI update).