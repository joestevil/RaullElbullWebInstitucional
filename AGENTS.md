# Contexto del Proyecto: Plataforma Institucional BULLS - AIESEC en Chiclayo (CLCH)

## Descripción General
El proyecto es una aplicación web institucional para la gestión interna del comité local de AIESEC en Chiclayo (BULLS). El objetivo es centralizar la información, eventos, métricas y recursos para los miembros del comité mediante una interfaz limpia, profesional y sin fricciones.

## Stack Tecnológico
* **Framework Frontend:** Next.js (App Router).
* **Estilos:** Tailwind CSS (tema principal basado en el color rojo corporativo de AIESEC/BULLS, fondo gris claro para el contenido).
* **Backend & Base de Datos:** Supabase (Autenticación, PostgreSQL para datos, Storage para recursos).
* **Iconografía:** Sistema de íconos coherente (ej. Lucide React o Heroicons).

## Estructura de Navegación (Sidebar)
La aplicación cuenta con un Sidebar principal (colapsable) con las siguientes secciones:
1.  **Inicio** (Home)
2.  **Eventos** (Gestión e inscripción a eventos)
3.  **Metas / KPIs** (Seguimiento de indicadores)
4.  **Oportunidades** (Visualización de oportunidades/intercambios)
5.  **Directorio** (Contactos del comité)
6.  **Recursos** (Materiales y documentos)
7.  **Mi Progreso** (Seguimiento personal del miembro)
8.  **Cultura Bull** (Información cultural del comité)

## Componentes Clave de la Interfaz
* **Sidebar:** Debe tener un estado expandido y colapsado. En la parte superior lleva el logo del toro (BULLS - CLCH) y un botón para colapsar. En la parte inferior, muestra el perfil del usuario autenticado (Foto, Nombre, Rol ej: "Team leader C&V") y un ícono de configuración.
* **Dashboard Principal (Ejemplo: Próximos Eventos):** Tarjetas limpias con bordes redondeados. Cada tarjeta de evento debe mostrar:
    * Fecha (Día y Mes, destacada en un recuadro rojo).
    * Título del Evento (ej. "LEC", "ITM").
    * Modalidad y Hora (ej. "Virtual - 5:00 p.m.").
    * Estado de Inscripción: Botones dinámicos (Verde para "Inscrito", Rojo claro para "Regístrate").

## Integración con Supabase (Esquema Inicial)
* `users`: Perfiles de usuarios con su rol (ej. Team Leader, VP, Miembro).
* `events`: Información de los eventos (título, fecha, tipo, modalidad).
* `event_registrations`: Tabla pivote para gestionar qué usuario está inscrito en qué evento.