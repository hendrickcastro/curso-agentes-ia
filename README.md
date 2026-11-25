# Desarrollo de software con IA · Transferencia de conocimiento

Material para transmitir al equipo el curso «Desarrollo de software con IA» (540, dos jornadas, 2026): la tesis es que **pedirle código a un agente no es delegarle trabajo**, y el curso enseña a delegar cada vez más implementación, con garantías.

## Empieza aquí

**Abre [`04-site/index.html`](04-site/index.html) con doble clic.** Es el site desde el que se imparte todo: taller, guía, laboratorio, vídeos y diapositivas. No necesita servidor ni conexión.

El curso es **práctico y en línea**: se da desde la vista Taller, cada persona hace los ejercicios en su equipo (sin parejas) y la teoría va después de cada ejercicio, en tres minutos. A cada participante hay que enviarle dos ficheros: `04-site/index.html` y `02-ejemplos-codigo/demo.zip`.

| En el site | Para qué |
|---|---|
| **Taller** | La pantalla inicial: 15 ejercicios paso a paso (haz esto → deberías ver esto → cuéntalo en el chat), con los comandos para copiar, el progreso de cada persona y la teoría en una frase. Fuente: `01-guia/taller.md`. |
| **Guía** | El contenido del curso para consultar, con selector de ruta. Cada sección enlaza a sus diapositivas originales. |
| **▶ Presentar** (tecla `P`) | Un ejercicio (o una sección de la guía) por pantalla, en letra grande, con ← y →. Respeta la ruta elegida. |
| **Laboratorio** | Ocho herramientas para hacer los ejemplos, **guardar** cada intento y **compararlos** lado a lado. Exporta e importa en JSON para juntar los de varias personas. |
| **Vídeos** | Trece vídeos narrados, uno por módulo (unos 14 minutos en total). |
| **Diapositivas** | Las 166 originales, cada una con el enlace a la sección que la explica. |

## Tres rutas

El contenido está escrito una sola vez y etiquetado por ruta. Se cambia con los botones del site (o las teclas `1`, `2`, `3`).

| Ruta | Para quién | Qué incluye | Duración orientativa |
|---|---|---|---|
| **Resumida** | Desarrolladores que necesitan lo esencial | Solo los grandes temas de desarrollo: la tesis, contexto, RPI, garantías y ratchet, guardarraíles y hooks, skills y workflow, especificación, verificación por carriles. 10 ejercicios | 100 min |
| **Media** | El equipo que va a adoptarlo | Añade vibecoding, el detalle de cada principio, las tablas de herramientas, las prácticas, worktrees y costes, mantenibilidad y llevarlo al equipo. 14 ejercicios | Media jornada |
| **Completa** | Quien vaya a impartirlo o quiera todo | Cada tema y cada diapositiva: debates, otros temas, riesgos, lo que viene y recursos. 15 ejercicios | Dos jornadas |

Las mismas rutas en Markdown: [`ruta-1-resumida.md`](01-guia/ruta-1-resumida.md), [`ruta-2-media.md`](01-guia/ruta-2-media.md) y [`ruta-3-completa.md`](01-guia/ruta-3-completa.md).

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| [`00-material-original/`](00-material-original/) | Los tres PDF del curso, las 166 diapositivas como imágenes y su transcripción buscable (los PDF son imágenes y no permiten buscar texto). |
| [`01-guia/`](01-guia/) | `modulos/` es la fuente (13 módulos). Las tres rutas y [`cobertura.md`](01-guia/cobertura.md) se generan de ahí. |
| [`02-ejemplos-codigo/`](02-ejemplos-codigo/README.md) | `demo/`: mini proyecto ejecutable sin dependencias (garantías, ratchet, hooks, skill, subagente, especificación, carriles) con seis experimentos. `referencia/`: scripts de worktrees. |
| [`03-videos/`](03-videos/) | Los vídeos, sus guiones ([`guiones.md`](03-videos/guiones.md)) y el generador. |
| [`04-site/`](04-site/) | El site (`index.html`) y su generador (`build.mjs`, `src/`). |
| [`05-como-impartirlo/`](05-como-impartirlo/) | Agendas para las tres rutas, guion del facilitador y cuestionario de repaso. |

## Cobertura

Las 166 diapositivas (86 del día 1 y 80 del día 2) están cubiertas en la ruta completa. [`01-guia/cobertura.md`](01-guia/cobertura.md) lista cada diapositiva y la sección donde se explica, y el generador del site **falla si alguna queda sin referenciar**.

## Cómo cambiar algo

```bash
# 1. Edita el módulo en 01-guia/modulos/ o los ejercicios en 01-guia/taller.md. Etiquetas en los títulos: {R} resumida, {M} media, {C} completa.
#    Referencias a diapositivas: [D1:34] o [D2:73-76].
# 2. Regenera el site, las tres rutas y la cobertura:
node 04-site/build.mjs

# Vídeos (solo macOS: usa Chrome, `say` y ffmpeg). Edita 03-videos/guiones.mjs y:
node 03-videos/generar.mjs 04      # un vídeo, o sin argumentos para todos
node 04-site/build.mjs
```

## Qué es del curso y qué se ha añadido

- **Del curso:** todo el contenido conceptual, las tablas, las prácticas y los debates; y los fragmentos de configuración (ESLint, dependency-cruiser, Stryker, hooks de las cuatro herramientas, skills de RPI, subagentes, workflow), tomados del repositorio público de prácticas `540/ai-development-training`.
- **Añadido para la transferencia:** las analogías, el proyecto `demo/`, los simuladores del laboratorio (sus cifras son supuestos ilustrativos, no medidas), el script de worktrees, el ADR y la plantilla de especificación de ejemplo, y la sección «Por dónde empezar el lunes».
- **Una diferencia a tener en cuenta:** las diapositivas usan una Pokédex como proyecto de prácticas; el repositorio público contiene hoy un comparador de coches con la misma progresión de ramas.
