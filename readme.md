# Agenda Barbería

Aplicación frontend desarrollada para el taller 1 de Desarrollo Web y Móvil.

## Problemática

Una barbería pequeña necesita organizar reservas básicas y visualizar rápidamente qué atenciones están pendientes o confirmadas.

## Solución propuesta

Agenda Barbería es una interfaz web de una sola página que permite consultar servicios, registrar reservas simuladas, validarlas y administrar su estado. Los datos se mantienen en arrays de JavaScript durante la sesión; no utiliza backend, base de datos ni APIs externas.

## Tecnologías utilizadas

- HTML5 semántico.
- CSS3 con estilos propios y diseño responsive.
- Bootstrap 5 mediante CDN para grilla, componentes y utilidades.
- JavaScript vanilla para datos, validaciones, eventos y manipulación del DOM.

## Funcionalidades

- Servicios renderizados dinámicamente desde un array.
- Formulario con campos obligatorios y mensajes de error visibles.
- Validación de fecha no anterior al día actual.
- Prevención de reservas duplicadas para el mismo barbero, fecha y hora.
- Creación, confirmación, eliminación y filtrado de reservas.
- Contadores dinámicos de reservas totales, pendientes y confirmadas.

## Cómo ejecutar

1. Abrir el archivo `index.html` en un navegador web con conexión a internet para cargar Bootstrap desde CDN.
2. Completar el formulario de reserva y revisar la sección de gestión.

## Integrantes

- Martín Cerpa — Desarrollo frontend.
