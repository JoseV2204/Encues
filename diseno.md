# Diseño UI — Encuesta para estudiantes (React, UI-only)

Resumen
- Propósito: Interfaz para encuestas estudiantiles (evaluación, opinión, satisfacción).
- Alcance: Solo UI (React) — componentes, estilos, accesibilidad y flujo UX. No incluye backend.
- Estilo: Inspirado en la Universidad de Panamá; paleta, tipografía y componentes pensados para claridad y confianza.

Paleta de colores (inspirada — ajustar si hay guía de marca oficial)
- Primario (azul profundo): --color-primary: #0A3D91 (uso: header, botones primarios, enlaces importantes)
- Secundario (dorado/amarillo suave): --color-accent: #F2C94C (uso: acentos, CTA secundarios, highlights)
- Suave (fondo claro): --color-bg: #F6F8FA
- Fondo de tarjetas / superficie: --color-surface: #FFFFFF
- Texto principal: --color-text: #0E1726
- Texto secundario / mutado: --color-muted: #6B7280
- Error: --color-error: #E63946
- Éxito: --color-success: #2D9C5C

Tokens de diseño
- Espaciado: 4, 8, 12, 16, 24, 32, 48 px
- Radio: 8px
- Sombra: ligera para tarjetas (0 1px 6px rgba(12, 24, 40, 0.06))
- Tipografía: Sans moderna para legibilidad (ej. Montserrat para títulos, Inter/Roboto para cuerpo)
  - Heading 1: 28–32px, semibold
  - Body: 16px, regular
  - Small: 14px

Páginas / Vistas
1. Pantalla de bienvenida
   - Logo + título (p. ej. "Encuesta estudiantil — Universidad de Panamá")
   - Descripción breve, duración aproximada (p. ej. "5–7 minutos")
   - Botón "Iniciar"
   - Opción para "Idioma / ayuda"

2. Listado de encuestas (si hay varias)
   - Tarjetas con título, breve descripción, estado (pendiente/contestada), botón "Responder"

3. Página de toma de encuesta (core)
   - Header con logo, progreso y botón de ayuda
   - Título de la encuesta y meta
   - ProgressBar (porcentaje o pasos)
   - Lista de preguntas (una por pantalla o varias en una página según longitud)
   - Tipos de preguntas soportadas: opción única, múltiples opciones, escala Likert (1–5), texto abierto, clasificación (drag & drop opcional), fecha, archivo (si se necesita)
   - Botones: Atrás / Siguiente / Guardar borrador / Enviar

4. Confirmación / Gracias
   - Mensaje de confirmación, opción para descargar/guardar PDF o ver resumen

5. Panel de accesibilidad / ayuda
   - Atajos, opciones de contraste, cambio de tamaño de texto

Componentes principales
- AppHeader: logo, título, progreso breve, accesos
- ProgressBar: visual y numérico
- QuestionCard: wrapper con pregunta, ayuda, validación
- Input types: RadioGroup, CheckboxGroup, TextArea, LikertScale, RatingStars
- NavButtons: Back / Next / Submit
- Toast / Feedback: errores y éxitos
- Modal: ayuda / política de privacidad

UX / Comportamiento
- Móvil primero: layout responsive con columnas únicas en móvil y 2 columnas en desktop (contenido + resumen lateral).
- Guardado automático (UI): guardar en localStorage periódicamente para evitar pérdida.
- Validaciones en tiempo real: indicar preguntas obligatorias antes de avanzar/submit.
- Progreso claro: porcentaje y pasos
- Confirmación antes de salir si hay respuestas no guardadas.

Accesibilidad (a11y)
- Contraste: asegurar mínimo WCAG AA en botones y textos principales
- Keyboard navigation: tab order lógico, focus visible, Enter para enviar respuestas en formularios
- Etiquetas ARIA en elementos complejos (p. ej. Likert)
- Tamaño de targets táctiles: mínimo 44x44px
- Soporte para lector de pantalla: use aria-labelledby, role="group" para preguntas

Esquema JSON de encuesta (ejemplo)
{
  "id": "enc-2025-01",
  "title": "Encuesta de Satisfacción Estudiantil 2025",
  "description": "Breve evaluación de servicios y clases",
  "questions": [
    { "id":"q1","type":"radio","label":"¿Cómo califica la calidad de la enseñanza?","options":["Excelente","Bueno","Regular","Malo"],"required":true},
    { "id":"q2","type":"likert","label":"Evalúe su satisfacción con las instalaciones","scale":5,"required":true},
    { "id":"q3","type":"textarea","label":"Comentarios adicionales","required":false}
  ]
}

Ideas de microinteracciones
- Animación sutil en ProgressBar
- Validaciones inline con iconos
- Transición suave entre preguntas
- State de botón "Enviando..." con spinner

Entrega (qué puedes usar)
- React + CSS modules / CSS variables o styled-components
- Librerías opcionales: react-hook-form (form state), framer-motion (animaciones), reach-ui / headlessui para accesibilidad, react-aria
- Exportar tokens en un archivo theme.js o CSS variables

Guía de siguiente pasos
1. Seleccionar si la encuesta será "una pregunta por página" o "página larga"
2. Adoptar tipografía oficial de la Universidad si disponible
3. Integrar logo oficial y assets institucionales
4. Implementar prototipo en Figma/Sketch para validar UX con usuarios