# Guardarraíles {R}

> **En una frase.** Lo que depende de acordarse, un día se olvida: las rules fijan el criterio de forma probabilística y los hooks lo imponen de forma determinista. [D1:76]

## El criterio es el de tu equipo {M} [D1:77]

El ejemplo del curso: **las vistas no llaman a la API; los datos llegan por `pokemonService`.** Si tu equipo pone esa frontera en otro sitio, el mecanismo es idéntico. **Lo que se codifica es el acuerdo.**

## Tres escalones {R} [D1:78]

| Escalón | Cómo funciona | Su límite |
|---|---|---|
| **El prompt** | Se lo pides y obedece. | A la tercera petición vuelve a llamar a la API desde una vista. Hay que decirlo siempre, y cada persona lo dice a su manera. |
| **Las rules** | Lo escribes una vez en el fichero de reglas. Es sistemático, y es un avance real. | Sigue siendo una instrucción que el modelo pondera junto a las demás. |
| **El hook** | Un programa revisa cada fichero en cuanto el agente lo escribe y, si incumple el criterio, lo obliga a corregirlo. | No pondera, no interpreta, no tiene días buenos y días malos. |

En Claude Code, Codex y Copilot el contrato del hook es el mismo: **código de salida 2 y el motivo en stderr.**

## Las rules son probabilísticas {R} [D1:79]

El problema no es que fallen a veces. **No puedes demostrar que no fallan**, y un guardarraíl cuya efectividad no puedes demostrar no es un guardarraíl.

## Dos ficheros de rules para cuatro herramientas {M} [D1:80]

Los hooks han convergido en los eventos, no en el sitio. Los de Copilot están en Preview.

| Herramienta | Rules | Hook |
|---|---|---|
| Claude Code | `CLAUDE.md` | `.claude/settings.json` · `PostToolUse` y `Stop` |
| Codex | `AGENTS.md` | `.codex/hooks.json` · `PostToolUse` y `Stop` |
| Cursor | `AGENTS.md` | `.cursor/hooks.json` · `postToolUse` y `stop` |
| Copilot (VS Code) | `AGENTS.md` | `.github/hooks/*.json` · `PostToolUse` y `Stop` (Preview) |

Para mantener un solo fichero, `CLAUDE.md` contiene una única línea que importa el otro:

```markdown
@AGENTS.md
```

## El hook, de punta a punta {R}

La configuración para Claude Code, tal como está en el repositorio del curso:

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command",
                    "command": "node \"$CLAUDE_PROJECT_DIR/tools/agentGuardrails.mjs\" edit claude" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command",
                    "command": "node \"$CLAUDE_PROJECT_DIR/tools/agentGuardrails.mjs\" stop claude" }] }
    ]
  }
}
```

Y el programa: recibe por la entrada estándar un JSON con lo que el agente acaba de hacer, ejecuta la comprobación y, si falla, sale con 2 y cuenta el motivo. Versión reducida (`02-ejemplos-codigo/demo/tools/guardarrailAgente.mjs`):

```js
const evento = JSON.parse(readFileSync(0, 'utf8'))

const bloquear = (mensaje) => {
  console.error(mensaje)   // el motivo, en stderr: es lo que lee el agente
  process.exit(2)          // código 2 = «detén y corrige»
}

if (modo === 'edit') {                       // PostToolUse: tras cada edición
  const ruta = evento.tool_input?.file_path
  if (!ruta) process.exit(0)                 // sin ruta reconocible, deja pasar
  if (!/^src\/.*\.mjs$/.test(enProyecto(ruta))) process.exit(0)   // solo mira lo que conoce
  const { ok, salida } = ejecutar(['tools/ratchet.mjs'])
  if (!ok) bloquear(`${ruta} incumple los guardarraíles del proyecto. Corrígelo:\n${salida}`)
}

if (modo === 'stop') {                       // Stop: cuando el agente va a terminar
  if (evento.stop_hook_active === true) process.exit(0)          // se rinde para no entrar en bucle
  const { ok, salida } = ejecutar(['--test', ...tests])
  if (!ok) bloquear(`Los tests fallan. Arréglalos antes de terminar:\n${salida}`)
}
```

Para verlo sin agente:

```text
$ echo '{"tool_input":{"file_path":"src/ui/buscadorView.mjs"}}' | node tools/guardarrailAgente.mjs edit; echo "código: $?"
src/ui/buscadorView.mjs incumple los guardarraíles del proyecto. Corrígelo:
  src/ui/buscadorView.mjs:12  Las vistas no llaman a la API: pide el dato a pokemonService.
código: 2
```

Las equivalentes para las otras herramientas (del repositorio del curso):

```json
// .codex/hooks.json
{ "hooks": {
    "PostToolUse": [{ "matcher": "^apply_patch$", "hooks": [{ "type": "command",
      "command": "node \"$(git rev-parse --show-toplevel)/tools/agentGuardrails.mjs\" edit codex", "timeout": 60 }] }],
    "Stop": [{ "hooks": [{ "type": "command",
      "command": "node \"$(git rev-parse --show-toplevel)/tools/agentGuardrails.mjs\" stop codex", "timeout": 300 }] }] } }
```

```json
// .cursor/hooks.json
{ "version": 1, "hooks": {
    "postToolUse": [{ "matcher": "Write", "command": "node tools/agentGuardrails.mjs edit cursor" }],
    "stop": [{ "command": "node tools/agentGuardrails.mjs stop cursor", "loop_limit": 3 }] } }
```

```json
// .github/hooks/guardrails.json (Copilot, Preview)
{ "hooks": {
    "PostToolUse": [{ "type": "command", "command": "node tools/agentGuardrails.mjs edit copilot", "timeout": 60 }],
    "Stop": [{ "type": "command", "command": "node tools/agentGuardrails.mjs stop copilot", "timeout": 300 }] } }
```

Los hooks de git completan la red en los momentos de *confirmar* y *publicar*:

```sh
# .githooks/pre-commit  → tipos, lint y tests relacionados con lo modificado
# .githooks/pre-push    → pnpm verify
# package.json: "prepare": "git config core.hooksPath .githooks"
```

## Práctica 5 · El mismo prompt con guardarraíles (15 min, individual) {M} [D1:81]

Mismo repositorio, rama `guardarrailes`: la misma aplicación con linters, tests y hooks. Los de git se ejecutan al hacer commit y al hacer push; los del agente, cada vez que edita un fichero.

1. **Arrancad (3 min).** `git switch guardarrailes`, `pnpm install` y `pnpm verify`.
2. **El mismo prompt (8 min).** Lanzadlo y fijaos en **cuándo lo para un hook y qué hace después.**
3. **El cotejo (4 min).** Comparad con lo que salió en `contexto`: qué hooks saltaron, qué le obligaron a cambiar y por dónde acabó yendo el código. Pega en el chat cuántas veces lo paró un hook.

## Debate (10 min, en este orden) {C} [D1:82]

1. **¿Cuántas veces lo paró un hook y qué hizo con el error?** Nadie tuvo que leer el aviso: lo leyó el agente y lo corrigió.
2. **¿Qué regla del fichero de rules cumplió sin que hiciera falta el hook, y cuál solo porque el hook lo paró?** A unas personas les pasó una cosa y a otras otra: eso es lo que significa probabilístico.
3. **La sorpresa.** Todo en verde, ¿y la tabla está bien? Los linters no saben de Pokémon.

## Un guardarraíl determinista no es un guardarraíl completo {R} [D1:83]

Sus agujeros no avisan: por ahí el cambio pasa sin que nadie lo mire.

| Agujero | Qué pasa |
|---|---|
| **Solo mira lo que conoce** | Revisa `.ts`, `.tsx` y `.css` dentro de `src/`. Un script, un test fuera de `src/` o un fichero de configuración pasan sin mirar. |
| **Sin ruta, no decide** | Cada herramienta describe la edición a su manera. Si no encuentra una ruta reconocible, deja pasar. |
| **Se rinde para no entrar en bucle** | Si `pnpm verify` sigue fallando después de reintentar, deja terminar al agente. |
| **En Cursor, solo aconseja** | Tras editar, el error le llega como contexto, sin bloqueo. Es un informe, no una garantía. |

## Mapa final del día 1 {R} [D1:84]

Cuatro piezas, y qué problema resuelve cada una:

| | Pieza | Qué resuelve |
|---|---|---|
| Hoy, con las manos | **Rules** | Fijan criterio de forma probabilística. |
| | **Hooks** | Lo imponen de forma determinista. |
| Mañana, dentro del sistema | **Skills** | Empaquetan un procedimiento que se repite. |
| | **Subagentes** | Aíslan contexto para que una tarea larga no contamine la conversación principal. |

**Los MCPs conectan con fuera; no resuelven ninguno de estos problemas.**

## El límite de los guardarraíles {R} [D1:85-86]

Tengo el proceso, la red y los guardarraíles. **Pero lo sigo conduciendo yo, sesión a sesión.** El día 2: el sistema, la especificación y la verificación. Y el último problema ya no es técnico.
