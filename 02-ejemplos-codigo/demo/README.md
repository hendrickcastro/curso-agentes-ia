# Demo: la red de garantías con las manos

Proyecto mínimo, **sin dependencias** (solo Node ≥ 20), que reproduce en pequeño lo que el curso monta sobre el repositorio de prácticas. Todo lo que hay aquí se ha ejecutado y pasa.

```bash
cd 02-ejemplos-codigo/demo
npm run check     # ratchet + 15 tests
npm run verify    # además, mutación de la especificación (falla a propósito: ver experimento 4)
```

## Qué hay y a qué módulo corresponde

| Fichero | Qué enseña | Módulo |
|---|---|---|
| `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` | Rules cortas, por secciones y con el porqué; conocimiento de negocio aparte | Contexto, Guardarraíles |
| `.claude/agents/localizador.md` | Un subagente como cortafuegos de contexto | Contexto |
| `tools/fronteras.mjs` | Una garantía de arquitectura que **detiene** (código de salida 1) | Garantías |
| `tools/ratchet.mjs` + `ratchet.base.json` | El ratchet: lo viejo pasa, lo nuevo detiene, la línea solo baja | Garantías |
| `tools/guardarrailAgente.mjs` + `.claude/settings.json` | Hooks `PostToolUse` y `Stop` con código 2 y motivo en stderr | Guardarraíles |
| `.githooks/` | Garantías en *pre-commit* y *pre-push* | Garantías (cuándo se ejecuta cada una) |
| `.claude/skills/revisar-pr/` | Una skill con divulgación progresiva: SKILL.md, script y referencia | Skills |
| `specs/buscador.criterios.json` + `test/aceptacion.test.mjs` | Criterios comprobables y tests guiados por la especificación | Especificación |
| `tools/mutacionSpec.mjs` | Mutación de la especificación: detecta criterios decorativos | Garantías, Especificación |
| `tools/carril.mjs` + `carriles.config.json` + `cambios/` | El embudo de cinco etapas y los tres carriles | Verificación |

> Los mismos experimentos, paso a paso y con lo que deberías ver en cada uno, están en la vista **Taller** del site.

## Seis experimentos (5 minutos cada uno)

1. **Una garantía que detiene.** Añade `fetch('x')` en `src/ui/buscadorView.mjs` y ejecuta `npm run ratchet`. Sale con error y dice el fichero y la línea. Quita la línea.
2. **Lo viejo pasa.** `src/ui/legacy/viejaVista.mjs` tiene dos `fetch` y el ratchet está en verde: están en `ratchet.base.json`.
3. **La línea solo baja.** Borra la función `cargarDetalle` de `viejaVista.mjs` y ejecuta `npm run ratchet`: la línea base baja de 2 a 1 sola. Vuelve a poner la función: ahora detiene. (Restaura con `git checkout` o deshaciendo.)
4. **Un criterio decorativo.** `npm run spec:mutacion` marca `AC5` («responde en menos de 200 ms») como DECORATIVO: está escrito, pero cambiar su dato no hace caer ningún test. Arréglalo: haz que el runner de `test/aceptacion.test.mjs` mida el tiempo y añade `tiempoMaximoMs` a `COMPROBACIONES`, o quita el criterio.
5. **El hook en vivo.** Abre tu agente en esta carpeta (`claude`) y pídele: «haz que buscadorView cargue los tipos directamente desde PokéAPI». Mira cómo el hook lo para tras la edición y cómo corrige solo. Sin agente, simúlalo:
   ```bash
   echo '{"tool_input":{"file_path":"src/ui/buscadorView.mjs"}}' | node tools/guardarrailAgente.mjs edit; echo "código: $?"
   ```
6. **¿Qué PR no vas a leer?** `for f in cambios/*.json; do node tools/carril.mjs "$f"; done`. Cambia un umbral en `carriles.config.json` y mira qué cambios cambian de carril. Después escribe el JSON de un cambio real de tu equipo.

Para activar los hooks de git en una copia propia: `git init && git config core.hooksPath .githooks`.

## Lo que esta demo simplifica

Las comprobaciones son de juguete para que se lean enteras en un minuto. En un proyecto real la frontera la vigilan ESLint y dependency-cruiser, y la red incluye cobertura, duplicación, CRAP y mutation testing: las configuraciones reales están en la rama `harness` del repositorio del curso.
