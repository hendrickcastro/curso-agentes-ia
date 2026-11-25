# El sistema: skills y workflow {R}

> **En una frase.** Una skill es un proceso tuyo escrito para que lo haga el agente; cuando las encadenas con agentes dedicados y umbrales, dejas de estar dentro del bucle y pasas a estar encima. [D2:1] [D2:5] [D2:9]

## Resumen del día 1 {C} [D2:2-4]

Índice del día 2: resumen del día 1, skills, workflow, especificación, verificación, después de delegar, llevarlo al equipo, otros temas y cierre.

Ayer se trabajó **una sola fase**, la implementación: vibecoding, contexto, RPI, garantías y guardarraíles fueron delegar esa fase en un agente sin perder el control.

- **Sentando las bases.** Pedir no es delegar: si tienes que leerlo entero, has pedido. Y la IA amplifica lo que encuentra en tu repositorio.
- **Contexto.** Todo el estado que ve el modelo al inferir. Tu mensaje es la parte más pequeña.
- **Problemas.** La ventana nominal no es la capacidad efectiva: la curva en U y las cuatro formas de fallar.

## Qué es una skill {R} [D2:6]

**Una skill es un proceso tuyo escrito en lenguaje natural para que lo haga el agente.** Cómo revisas un PR, cómo preparas una release, cómo investigas una alerta. Lo que hoy vive en tu cabeza o en una wiki pasa a un fichero que el agente sigue paso a paso.

## Una técnica de contexto {R} [D2:7]

Es la **divulgación progresiva** (el principio 3 del día 1), empaquetada:

| Cuándo se carga | Qué |
|---|---|
| **Siempre** | El nombre y la descripción. Unas pocas líneas por skill: con eso el agente sabe cuándo le toca usarla. |
| **Al usarla** | El `SKILL.md` entero: los pasos del proceso, escritos como se los contarías a alguien del equipo. |
| **Si hace falta** | Scripts, plantillas y referencias que la skill nombra. Se leen o se ejecutan en el paso que los pide. |

## Un ejemplo: revisar un PR {R} [D2:8]

Una carpeta con un `SKILL.md` y lo que este necesita (está entera en `02-ejemplos-codigo/demo/.claude/skills/revisar-pr/`):

```text
.claude/skills/revisar-pr/
├── SKILL.md                    ← se carga AL USARLA
├── scripts/riesgo.sh           ← se ejecuta en el paso 2
└── referencias/criterios.md    ← se lee en el paso 4
```

```markdown
---
name: revisar-pr
description: Revisa un pull request como lo hace el equipo.
  Úsala cuando pidan revisar un PR, una rama o un diff.
---
# Revisar un PR

1. Lee la descripción del PR y el ticket enlazado.
2. Ejecuta `scripts/riesgo.sh` para ver qué ficheros tocan pagos o migraciones.
3. Revisa esos ficheros primero; después, el resto.
4. Agrupa los comentarios por gravedad, según `referencias/criterios.md`.
```

Lo determinista va en el script, no en la prosa:

```sh
#!/usr/bin/env sh
base="${1:-main}"
cambiados=$(git diff --name-status "$(git merge-base "$base" HEAD)" HEAD)
echo "== Zonas vetadas (se leen siempre) =="
echo "$cambiados" | grep -E '(src/pagos/|migrations/|\.github/)' || echo "ninguna"
echo "== Tests que ya existían, modificados o borrados (la red se encoge) =="
echo "$cambiados" | grep -E '^[MD].*\.test\.' || echo "ninguno"
```

> **Analogía.** Una skill es la ficha de un procedimiento colgada en la pared del taller: el título se ve desde lejos, la ficha se lee cuando toca hacer ese trabajo, y las herramientas que nombra se cogen del cajón en el paso que las pide.

## Cómo se adopta: invirtiendo la dependencia {M} [D2:10]

1. **Rules de consenso.** Lo que el equipo ya acordaba, escrito para la máquina: testing, estilos, navegación, traducciones.
2. **Skills.** Tareas concretas y repetibles: componer la PR, investigar un problema, parchear una vulnerabilidad.

**El problema:** por bien definidos que estén, siguen siendo comandos. El humano los lanza uno detrás de otro, todo el rato.

## El workflow /implement {R} [D2:11]

**La skill se convierte en orquestación:** agentes dedicados, revisión del plan, review puntuado y umbral de merge. Ocho fases, tres en paralelo. **Agentes dedicados y nada espera al humano.**

| # | Fase | Quién | Qué hace |
|---|---|---|---|
| 1 | Análisis | subagente `researcher` | Plan con criterios de aceptación verificables |
| 2 | Plan review | agente del workflow (en paralelo) | Quita ficheros sin consumidor y añade la opción más simple a cada supuesto |
| 3 | Rama | agente del workflow (en paralelo) | `feature/<slug>` desde la base |
| 4 | Preflight | script determinista (en paralelo) | git y gh accesibles, navegador instalado y `pnpm check` en verde antes de tocar nada |
| 5 | Implementación | subagente `task-implementer` | Código y tests hasta `pnpm check` en verde, y commit de checkpoint |
| 6 | Review | gates deterministas ‖ `reviewer` → triaje | Nota de *Merge Safety* ponderada; bucle de hasta 3 rondas de vuelta a la implementación |
| 7 | Verificación | subagente `browser-verifier` | Un test de Playwright desechable por criterio, con captura |
| 8 | PR | subagente `pr-creator` | Push y PR en borrador, con salvedades y capturas |

El esqueleto de la orquestación (ilustrativo; el script real tiene más de 700 líneas y está en `.claude/workflows/implement.mjs`, rama `harness`):

```js
export const meta = {
  name: 'implement',
  description: 'Lleva una tarea hasta una PR en borrador',
  phases: [{ title: 'Analyze' }, { title: 'Plan review' }, { title: 'Branch' }, { title: 'Preflight' },
           { title: 'Implement' }, { title: 'Review' }, { title: 'Verify' }, { title: 'PR' }],
}

phase('Analyze')
const analysis = await agent(analyzePrompt, { agentType: 'researcher', schema: ANALYSIS_SCHEMA })
if (analysis.blockingQuestions.length) throw new Error('Bloqueo: solo lo puede decidir una persona')

// Tres fases en paralelo: nada espera al humano
const [planReview, branch, preflight] = await parallel([
  () => agent(planReviewPrompt, { phase: 'Plan review', schema: PLAN_REVIEW_SCHEMA }),
  () => agent(branchPrompt,     { phase: 'Branch',      schema: BRANCH_SCHEMA }),
  () => runScript('node .claude/scripts/preflight.mjs', 'Preflight'),
])

phase('Implement')
let impl = await agent(implementPrompt, { agentType: 'task-implementer', schema: IMPL_SCHEMA })

for (let round = 1; round <= MAX_ROUNDS; round++) {
  phase('Review')
  const [gates, review] = await parallel([
    () => runScript('node .claude/skills/review-pr/scripts/gates.mjs', 'Review'),   // determinista
    () => agent(reviewPrompt(round), { agentType: 'reviewer', schema: REVIEW_SCHEMA }), // puntuado
  ])
  const score = gates.allGreen ? review.mergeSafety : Math.min(review.mergeSafety, RED_GATE_CAP)
  if (score >= MIN_SCORE && gates.allGreen) break          // umbral de merge: 8,5 sobre 10
  impl = await agent(fixPrompt(review.findings), { agentType: 'task-implementer', schema: IMPL_SCHEMA })
}

phase('Verify')
const verify = await agent(verifyPrompt, { agentType: 'browser-verifier', schema: VERIFY_SCHEMA })

phase('PR')
await agent(prPrompt, { agentType: 'pr-creator', schema: PR_SCHEMA })
```

Tres ideas que se ven en el script real y que conviene copiar:

- **Un gate en rojo pone tope a la nota** (5 sobre 10): la opinión de un modelo nunca compensa una comprobación determinista fallida.
- **Niveles de modelo por tipo de trabajo:** el barato para ejecutar un script y devolver su salida, el caro para analizar y revisar.
- **Prohibiciones compartidas por todos los agentes:** nunca reescribir la historia, nunca silenciar un guardarraíl (`--no-verify`, `eslint-disable`, tests desactivados, umbrales rebajados).

Un subagente dedicado es un fichero con su propio contexto, herramientas y skills precargadas:

```markdown
---
name: reviewer
description: Revisa un cambio con la skill review-pr y devuelve la Merge Safety por
  dimensiones y hallazgos con severidad. No edita código ni publica nada.
tools: Read, Grep, Glob, Bash
model: opus
skills:
  - review-pr
  - car-domain
---
```

## Práctica 6 · El mismo prompt, llevado por el workflow (20 min, individual) {M} [D2:12]

Repositorio de las prácticas, rama `harness`. Antes de abrir el agente: `git switch harness` y `pnpm install`.

```text
lanza el workflow @.claude/workflows/implement.mjs para la siguiente
funcionalidad: Añade al proyecto web una tabla interactiva con las
ventajas y desventajas entre todos los tipos de Pokémon.
```

## El límite del sistema {R} [D2:13-15]

**Montar un flujo que te funcione a ti es fácil. Montar un flujo que le funcione a todo tu equipo es lo difícil.**

Y el cuello de botella se ha movido: **después de la IA está en la especificación** (fase 02). Lo que le pides no llega bajado a tierra.
