# Ejemplos de código

| Carpeta | Qué es | Estado |
|---|---|---|
| [`demo/`](demo/README.md) | Mini proyecto sin dependencias (Node ≥ 20): garantías, ratchet, hooks, skill, subagente, especificación ejecutable, mutación de la spec y embudo de carriles. Seis experimentos guiados. | Ejecutado: 15 tests en verde, hook y ratchet probados |
| [`referencia/worktrees/`](referencia/worktrees/) | `wt-nuevo.sh` y `wt-cerrar.sh`: un worktree que arranca (copia, `.env`, puerto por tarea, dependencias) y su limpieza. | Probado en un repositorio temporal |

## Las configuraciones reales del curso

Los fragmentos de ESLint, dependency-cruiser, Stryker, jscpd, los hooks para Claude Code, Codex, Cursor y Copilot, las skills de RPI, los subagentes y el workflow `/implement` que aparecen en la guía están tomados del repositorio de prácticas del curso. Para verlos completos y en funcionamiento:

```bash
git clone https://github.com/540/ai-development-training
cd ai-development-training
git switch rpi            # .agents/skills/rpi-research, rpi-plan, rpi-implement
git switch guardarrailes  # eslint.config.js, .dependency-cruiser.cjs, AGENTS.md
git switch especificacion # + CONTEXT.md
git switch harness        # la red entera, hooks de las 4 herramientas, subagentes y .claude/workflows/implement.mjs
```

El repositorio público contiene hoy un comparador de coches (API de fueleconomy.gov) en lugar de la Pokédex de las diapositivas; la progresión de ramas y la mecánica son las mismas.

Las herramientas compartidas de 540 (Gauntlet Audit, explain-pr, hooks) están en <https://github.com/540/agentic-toolbox>.
