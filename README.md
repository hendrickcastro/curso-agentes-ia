# Desarrollo de software con IA · Transferencia de conocimiento

Material para transmitir al equipo el curso «Desarrollo de software con IA» (540, dos jornadas, 2026): la tesis es que **pedirle código a un agente no es delegarle trabajo**, y el curso enseña a delegar cada vez más implementación, con garantías.

## Empieza aquí

```bash
node servidor.mjs        # o: npm start
```

y abre <http://localhost:5400>. Hace falta Node 20 o superior y git; para la pestaña **En vivo**, además, [Claude Code](https://claude.com/claude-code) instalado y con tu sesión iniciada. No hay nada que instalar con npm.

**En vivo** lanza los ejemplos con un clic, con tu propia suscripción de Claude Code y el modelo Opus 5.5 (`MODELO=otro-modelo node servidor.mjs` para cambiarlo).

Todos los ejemplos usan **el mismo encargo**, el del curso: «Añade al proyecto web una tabla interactiva con las ventajas y desventajas entre todos los tipos de Pokémon». Se lanza dos veces sobre una Pokédex de Kanto ([`06-en-vivo/pokedex`](06-en-vivo/pokedex)), una sin la pieza y otra con ella:

| Ejemplo | Sin | Con | Qué se ve |
|---|---|---|---|
| Contexto | Solo el código | `CONTEXT.md` | El nombre que decidió producto, 15 tipos en vez de 18, «×½» |
| Reglas | Sin `AGENTS.md` | Con `AGENTS.md` | `NOVEDADES.md`, el criterio en `specs/`, el enlace en el menú |
| Skills | Sin la skill | Con `pantalla-nueva` | La tabla con el patrón del equipo: leyenda, resaltado, filtro en la dirección |
| Hooks | Sin red | Con hook | El hook detiene la edición y el agente corrige |
| Workflow | Encargo directo | `/implementar` | Un `plan.md` revisable con las decisiones que tomó |
| Harness | Solo el modelo | Todo junto | Pedir frente a delegar |

En cada columna ves **la web que dejó el agente**, funcionando dentro de la página y con su propio enlace (`http://localhost:5401/<versión>/`), todo lo que hizo paso a paso y unas comprobaciones que lanza el servidor.

**Cada ejecución queda guardada como una versión** (v1, v2…) en `06-en-vivo/ejecuciones/`, que no se sube a git. Puedes volver a cargar cualquiera con el selector de su columna, borrarla, y poner dos versiones cualesquiera lado a lado en el comparador del final de la página.

El agente trabaja sobre una copia propia del proyecto, no sobre tu repositorio. En macOS y Linux corre con el aislamiento de Claude Code: puede lanzar cualquier comando, pero solo escribe dentro de esa copia y no tiene red. El servidor solo escucha en tu equipo y solo ejecuta los ejemplos de [`06-en-vivo/ejemplos.mjs`](06-en-vivo/ejemplos.mjs); no acepta prompts ni comandos desde el navegador. Los resultados dependen del modelo: no saldrán idénticos en cada ejecución.

Sin servidor también funciona todo lo demás:

**Abre [`04-site/index.html`](04-site/index.html) con doble clic.** Es el site desde el que se imparte todo: taller, guía, laboratorio, vídeos y diapositivas. No necesita servidor ni conexión.

El curso es **práctico y en línea**: se da desde la vista Taller, cada persona hace los ejercicios en su equipo (sin parejas) y la teoría va después de cada ejercicio, en tres minutos. A cada participante hay que enviarle dos ficheros: `04-site/index.html` y `02-ejemplos-codigo/demo.zip`.

| En el site | Para qué |
|---|---|
| **Taller** | La pantalla inicial: 15 ejercicios paso a paso (haz esto → deberías ver esto → cuéntalo en el chat), con los comandos para copiar, el progreso de cada persona y la teoría en una frase. Fuente: `01-guia/taller.md`. |
| **En vivo** | Seis ejemplos que se ejecutan con un clic sobre Claude Code real (necesita `node servidor.mjs`). |
| **Guía** | El contenido del curso para consultar, con selector de ruta. Cada sección enlaza a sus diapositivas originales. |
| **▶ Presentar** (tecla `P`) | Un ejercicio (o una sección de la guía) por pantalla, en letra grande, con ← y →. Respeta la ruta elegida. |
| **✎ Editar** (tecla `E`) | Quita ejercicios, módulos, secciones, vídeos o diapositivas que no vayas a usar; lo que queda se renumera solo según la secuencia. Se guarda en el navegador, se puede restaurar, y «Exportar selección» genera un JSON para que otra persona cargue el mismo recorte. |
| **Laboratorio** | Ocho herramientas para hacer los ejemplos, **guardar** cada intento y **compararlos** lado a lado. Exporta e importa en JSON para juntar los de varias personas. |
| **Vídeos** | Trece vídeos narrados, uno por módulo (unos 14 minutos en total). |
| **Diapositivas** | Las 166 originales, cada una con el enlace a la sección que la explica. |

## Tres rutas

El contenido está escrito una sola vez y etiquetado por ruta. Se cambia con los botones del site (o las teclas `1`, `2`, `3`).

| Ruta | Para quién | Qué incluye | Duración orientativa |
|---|---|---|---|
| **Resumida** | Quien quiere ver cómo se usa el agente | **Solo lo que se hace en vivo**: contexto, reglas, skills, hooks, workflow y harness. Los seis ejemplos en vivo, los módulos de la guía que los explican y seis ejercicios del taller | Unas 2 horas |
| **Media** | El equipo que va a adoptarlo | Añade todos los grandes temas de desarrollo: la tesis, vibecoding, garantías y ratchet, especificación, verificación por carriles, worktrees y costes, y llevarlo al equipo. 14 ejercicios | Media jornada |
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
| [`06-en-vivo/`](06-en-vivo/) y `servidor.mjs` | `pokedex/`: el proyecto web de partida, con su red, hooks, reglas, contexto y skills. `ejemplos.mjs`: qué se quita en cada variante. `comprobar/`: lo que se comprueba al terminar. `servidor.mjs`: el servidor local que lo lanza todo. |
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
- **Añadido para la transferencia:** las analogías, el proyecto `demo/`, los simuladores del laboratorio (sus cifras son supuestos ilustrativos, no medidas), los ejemplos en vivo con su proyecto `pokedex` y sus skills (`pantalla-nueva`, `implementar`), el script de worktrees, el ADR y la plantilla de especificación de ejemplo, y la sección «Por dónde empezar el lunes».
- **Una diferencia a tener en cuenta:** las diapositivas usan una Pokédex como proyecto de prácticas; el repositorio público contiene hoy un comparador de coches con la misma progresión de ramas.
