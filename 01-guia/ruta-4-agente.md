# Desarrollo de software con IA · Ruta agente

> Solo cómo se usa el agente: contexto, reglas, skills, hooks, workflow y harness, con ejemplos en vivo. Duración orientativa para explicarla: unas 2 horas. Las referencias (D1·34) remiten a las diapositivas originales en `00-material-original/diapositivas/`.

# Contexto

> **En una frase.** El contexto es un presupuesto de atención, no un almacén: no se escribe, se acumula, y la disciplina consiste en decidir qué acumulas. (D1·27) (D1·49)

## Qué es el contexto

**El contexto es todo el estado disponible para el modelo en el momento de la inferencia.** No es tu mensaje: tu mensaje es una fracción pequeña, y a menudo la más pequeña de todas.

**No es prompt engineering, y la diferencia es temporal.** El prompt es algo que escribes una vez y reutilizas: una frase. El contexto se decide cada vez que se llama al modelo; en una sesión de agente eso son decenas o cientos de veces, y tú solo escribiste la primera.

**Es un presupuesto de atención, no un almacén.** Cada token compite por la atención del modelo: no se acumula, se reparte. Meter algo irrelevante no es neutro.

> **Analogía.** El contexto es la mesa de trabajo, no el archivo. En una mesa cabe poco, y cada papel que dejas encima tapa a los demás. Un compañero con la mesa llena de papeles de otros asuntos no trabaja peor por tonto, sino porque no encuentra el que importa.

## Anatomía de la ventana

Cinco partidas con comportamientos distintos. Lo que importa es la tercera columna.

| Componente | Qué es | Comportamiento |
|---|---|---|
| System prompt | Instrucciones permanentes del agente | Fijo, presente en todas las llamadas |
| Definiciones de herramientas | Qué puede hacer el agente y cómo | Fijo, y mucho más grande de lo que nadie estima |
| Documentos recuperados | Ficheros leídos, búsquedas, documentación | Crece por acumulación, rara vez se limpia |
| Historial de mensajes | Toda la conversación previa | Crece dos veces por cada acción |
| Salidas de herramientas | Resultados de cada ejecución | Suele ser lo que más ocupa |

**La mayor parte de tu ventana no la escribiste tú. Se acumuló sola.** La ventana del turno treinta es un artefacto que nadie diseñó: en el turno 1 es system prompt, herramientas y tu mensaje; en el 30, casi todo son salidas de herramientas y respuestas del agente, y ha cruzado el 60 %. (Redibujado de HumanLayer, *Context forking to save time, trouble and tokens*.)

## Ventana nominal y capacidad efectiva

- **Ventana nominal.** El número que anuncia el proveedor: 200K, 1M. Es un límite duro, y superarlo es un error, no una degradación.
- **Capacidad efectiva.** Materialmente menor que la nominal, y depende de la tarea. *Context Rot* (Chroma, 2025): el rendimiento cae al crecer el input incluso en tareas triviales, en los 18 modelos medidos.

**La curva en U** (*Lost in the Middle*, Liu et al., 2023): el modelo recuerda bien el principio y el final, y pierde de 20 a 30 puntos de *recall* cuando el documento relevante cae en el centro.

**Nunca pongas una restricción crítica en medio de un prompt largo.** El fallo parecerá desobediencia cuando es geometría.

## Las cuatro formas de fallar

Qué le pasa a la ventana y cómo lo ves desde fuera. Convierte «el agente se está portando raro» en un diagnóstico con nombre.

| Fallo | Qué pasa | Cómo se ve |
|---|---|---|
| **Poisoning** | Un error entra en la ventana y se sigue usando como si fuera verdad. | Se inventa `usePokemonTypes()`. Se lo corriges, pero cada fichero nuevo lo vuelve a importar: el nombre falso sigue ahí, repetido, y pesa más que tu corrección. |
| **Distraction** | La ventana crece tanto que el modelo copia del historial en vez de pensar. | Tras dos horas con el mismo bug, repite pasos que ya probasteis y no funcionaron. |
| **Confusion** | Hay información que sobra, y el modelo la usa porque está ahí. | Tienes cargado el MCP de la base de datos y le pides cambiar un texto de la interfaz. Acaba lanzando una consulta que nadie le pidió. |
| **Clash** | Dos partes de la ventana se contradicen y el modelo elige la que no es. | Arregláis juntos el daño contra Pokémon de dos tipos. Una hora después lo reescribe como estaba: la versión vieja sigue más arriba en el hilo, y la toma por buena. |

## El primer prompt es una decisión de arquitectura

La interpretación que el modelo hace de tu primer prompt fija una trayectoria de la que ya no se sale: todo lo que viene después se construye encima, incluidos los errores.

## Cómo medir el contexto

Tres niveles: **ocupación** (¿cuánto llevo gastado?), **composición** (¿en qué me lo he gastado?) y **degradación** (¿se está estropeando?).

### Nivel 1 · Ocupación

| Herramienta | Cómo verlo |
|---|---|
| Claude Code | `/context`: desglose por componente, más el porcentaje en la barra |
| Codex | `/status`: porcentaje libre y tokens usados. `/statusline` lo fija en el pie. Sin desglose |
| Cursor | Anillo junto al prompt. Al pulsarlo, desglose por categoría: tools, rules, skills, MCP, conversación |
| Copilot (VS Code) | Anillo en la entrada del chat. Al pasar el ratón, tokens usados sobre el máximo y desglose |

**La regla: al 60 % de la ventana compactas o abres sesión nueva.** Si la ventana es de un millón, antes de unos 150.000 tokens. No esperas al límite: al llegar al 100 % la herramienta compacta de urgencia y decide ella qué tira.

### Nivel 2 · Composición

**Mismo mensaje, mismo trabajo:** con cuatro MCP cargados (GitHub, Linear, base de datos, navegador), la tarea empieza al otro lado del umbral del 60 % antes de que escribas nada, porque sus definiciones ocupan sitio en todas las llamadas. (Redibujado de HumanLayer, *Skill issue: harness engineering for coding agents*.)

En la demo en vivo, un `/context` real de una sesión larga: 175k de 1M tokens (18 %), de los que 142,7k son **mensajes**; system prompt 2,2k, herramientas del sistema 14,9k, agentes propios 4,2k, ficheros de memoria 1,9k, skills 9,9k, y 157 herramientas MCP con 0 tokens porque se cargan bajo demanda. Antes de mirar los números, la pregunta es: ¿en qué creéis que se va?

### Nivel 3 · Degradación

No hay contador. Se detecta por síntomas.

| Lo que ves | Qué es | Qué haces |
|---|---|---|
| Insiste en una función o fichero que no existe | Poisoning | No lo corrijas en el hilo: el error ya está referenciado. Rebobina a antes de que entrara; si no sabes cuándo entró, sesión nueva |
| Empeora según avanza, se vuelve genérico | Distraction | Compactar |
| Te reintroduce un bug que ya arreglasteis | Clash | Sesión nueva, y la corrección en la spec, no en el chat |
| Ignora una restricción que diste al principio | Posición | Reponerla al final del prompt actual |

**Si tienes que repetirle algo por segunda vez, no es que no te haya entendido. Es que el contexto está saturado.** Repetirlo por tercera vez no lo arregla.

## Los cuatro principios

| Pregunta | Principio | En qué consiste |
|---|---|---|
| Qué entra | **Solo lo que cambia la respuesta** | Si lo quitas y el agente haría lo mismo, sobra. Lo demás, que lo busque cuando lo necesite. |
| Dónde va | **Colocación consciente de la posición** | Restricciones críticas, formato de salida y guardarraíles van al principio o al final. Nunca enterrados en medio. |
| Con cuánto detalle | **Divulgación progresiva** | Nombres y descripciones al arrancar; contenido completo solo cuando algo se activa. Y si se activa, cárgalo entero. |
| Cada turno | **Curación iterativa** | No escribas el CLAUDE.md pensando en todo lo que podría salir mal. Empieza con lo mínimo y añade una regla cada vez que veas fallar al agente. |

### Principio 1 · Reducir lo que entra

- **Pide el trozo, no el fichero.** La función que vas a tocar, no el fichero entero. El fichero, no el repositorio.
- **Menos herramientas.** Cada una ocupa sitio en todos los mensajes. Y con muchas, el agente duda cuál usar.
- **Nombres que se explican.** `tarifas_clientes.json` se encuentra sin abrirlo. `data/file1.json` hay que abrirlo para saber qué es.

### Principio 2 · Colocar bien lo que entra

- **Lo que pides, al final.** Pega arriba el log o el fichero. Debajo, la petición y lo que no se puede saltar.
- **CLAUDE.md corto y por secciones.** Encabezados y viñetas. Si ignora una regla que está escrita, sobra texto alrededor.
- **Cada regla con su porqué.** «Sin `any`: rompe el tipado de la API» guía mejor que «NUNCA uses `any`».

```text
<log de 200 líneas pegado ARRIBA>

Con ese log delante:
1. Dime qué petición falla y por qué.
2. No toques nada todavía.
Restricción que no se puede saltar: las vistas no llaman a la API.
```

Un fichero de rules bien colocado (el del proyecto de ejemplo, `02-ejemplos-codigo/demo/AGENTS.md`):

```markdown
## Reglas del proyecto

- Las vistas no llaman a la API: así hay un solo sitio donde cambiar el origen
  de los datos y se pueden probar sin red. Los datos se piden a `pokemonService`.
- No se modifica ni se borra un test existente salvo que haya cambiado su
  criterio en `specs/`: un test que cambia sin que cambie la especificación
  esconde una regresión.
- Antes de dar una tarea por terminada, `npm run check` tiene que pasar.
```

### Principio 3 · Diferir la carga

- **Notas estructuradas.** El agente escribe fuera de la ventana y relee cuando lo necesita.
- **Subagentes.** Ventana limpia que devuelve 1.000 a 2.000 tokens destilados en vez de toda la exploración.
- **Ficheros como memoria.** El sistema de ficheros es contexto que no paga tokens hasta que se lee.

**Los subagentes no son gratis:** un sistema multiagente consume casi cuatro veces los tokens de un hilo único. Compran aislamiento, no ahorro.

**Un subagente es un cortafuegos de contexto.** Tu sesión solo ve lo que pidió («¿dónde se define el esquema?») y lo que le devuelven (`src/pedidos/esquema.ts:42`). Los Glob, Grep y Read de la búsqueda se quedan al otro lado. **Lo que vuelve lo decides tú:** pide el formato exacto, con rutas y líneas. Si no, te devuelve su exploración entera.

```markdown
---
name: localizador
description: Encuentra dónde está definido o dónde se usa algo en el repositorio
  y devuelve solo rutas y líneas. Úsalo antes de editar cuando no sepas dónde vive una pieza.
tools: Read, Grep, Glob
model: haiku
---
Eres un cortafuegos de contexto. Devuelve SOLO esto, sin explicar cómo lo has encontrado:

<fichero>:<línea>  <qué hay ahí, en una frase>

Como máximo diez líneas, ordenadas de más a menos relevante.
```

### Principio 4 · Podar lo acumulado

De lo que menos tira a lo que más:

| Técnica | Qué hace | Cuándo |
|---|---|---|
| **Observation masking** | Sustituye salidas de herramientas ya procesadas por un resumen o una referencia. | La opción de menor riesgo para empezar. |
| **Compactación** | Resume la conversación y sigue en una ventana limpia. | El arte está en qué se descarta: hazlo tú antes de que lo haga la herramienta. |
| **Rebobinar** | Vuelve a un mensaje anterior y lo reescribe con lo que ya sabes. | Conservas el contexto bueno y tiras solo lo que vino después. |
| **Sesión nueva** | La opción nuclear. | La correcta ante clash, o ante poisoning cuando no sabes en qué turno entró el error. |

**Rebobinar es la corrección que no ensucia:** en lugar de decir «no, así no» en el hilo, reescribes el mensaje que lo provocó. Las cuatro herramientas lo tienen.

**Compactar tú, en vez de corregir en el hilo.** Corregir en el hilo («No, así no. Usa la cola», «Tampoco. Vuelve a probar», «Sigue fallando el test») llena la ventana de intentos fallidos hasta pasar del 60 %. La alternativa (HumanLayer, *Advanced Context Engineering for Coding Agents*):

```text
Escribe en progress.md el objetivo, el enfoque, los pasos hechos y el fallo actual.
```

Y en una sesión nueva: `Lee progress.md y sigue`.

```markdown
# progress.md — Reembolso parcial de pedidos

## Objetivo
Permitir reembolsar una parte de un pedido ya cobrado.

## Enfoque
El reembolso se encola (cola `pagos`); no se llama a la pasarela desde la petición web.

## Pasos hechos
- [x] Endpoint POST /pedidos/:id/reembolsos con validación de importe
- [x] Job `ReembolsoJob` y su test unitario

## Fallo actual
`reembolso.test.ts › importe mayor que lo cobrado` espera 422 y recibe 500.
Ya probado y descartado: validar en el controlador (duplica la regla del dominio).
```

## Cinco mensajes clave

1. El contexto es un presupuesto de atención, no un almacén. Cada token compite con los demás.
2. La ventana nominal no es la capacidad efectiva. Caber no es suficiente.
3. Lo que está en medio se pierde. Lo crítico va arriba o abajo.
4. Si tienes que repetir algo por segunda vez, el contexto está saturado. Mide antes de insistir.
5. Restar suele ganar a sumar. Veinte veces más contexto puede rendir peor.

## Práctica 2 · El mismo prompt con contexto (10 min, individual)

Mismo repositorio, rama `contexto`: la misma aplicación, ahora con capas, un `AGENTS.md` y un `CONTEXT.md` con el conocimiento del negocio.

1. **Arrancad (2 min).** `git switch contexto`, `pnpm install` y `pnpm dev`. Echad un vistazo al `AGENTS.md`.
2. **El mismo prompt (5 min).** Lanzadlo y fijaos en **qué ficheros lee antes de escribir**.
3. **El cotejo (3 min).** Compara con lo que te salió en la práctica 1 y pega en el chat la diferencia que más te llame la atención.

Guarda el intento en el cuaderno del laboratorio para compararlo con el anterior. Una o dos personas comparten pantalla y enseñan su comparación.

## El límite del contexto

Ya sabes qué meter en la ventana, cuánto, en qué orden y cuándo podar. Pones todo eso bien. **Y el agente, con el contexto perfecto, sigue decidiendo por su cuenta el qué y el cómo.** De ahí sale el siguiente peldaño.

# RPI: Research, Plan, Implement

> **En una frase.** El plan es lo único que puedes revisar antes de que exista el código: es el último momento en que decir que no sale barato. (D1·53)

## Por qué RPI, y por qué no

Lo que el agente **ya hace solo**: lee el código antes de tocarlo (y cada versión lo hace mejor), planifica por dentro (no hace falta obligarlo a pensar antes) y se le ocurren los casos límite (y te avisa de lo que ya ha decidido).

**Si tu motivo para usar RPI es que el modelo piensa mejor así, la próxima versión te quitará la razón.**

El motivo que sí aguanta: **el plan es lo único que puedes revisar antes de que exista el código.** Revisar un plan cuesta minutos; revisar el diff que sale de él, una tarde.

## Tres fases, definidas por lo que tienen prohibido

Lo que hacen es obvio. Lo que se saltan es lo que tienen prohibido.

| Fase | Prohibido | Deja |
|---|---|---|
| **Research** | No propone soluciones. No escribe código. | Un mapa de hechos con su fuente y preguntas abiertas (`research.md`) |
| **Plan** | No escribe código. No deja decisiones abiertas. | Ficheros, piezas, fases y verificación (`plan.md`) |
| **Implement** | No toma decisiones. Si se topa con una, para y pregunta. | El código, fase a fase, verificado |

Cada fase empieza en una **conversación nueva** con el fichero de la anterior como única entrada: así cada una arranca con el contexto limpio.

```text
# Sesión 1
/rpi-research Añade una tabla interactiva con las ventajas entre tipos
# Sesión 2 (nueva)
/rpi-plan @research.md
# Sesión 3 (nueva)
/rpi-implement @plan.md
```

Las tres skills reales están en la rama `rpi` del repositorio del curso (`.agents/skills/rpi-*`). Su esqueleto:

```markdown
---
name: rpi-research
description: Fase 1 de RPI. Investiga una petición en el código, los datos y
  el negocio, y la deja documentada en research.md.
disable-model-invocation: true
argument-hint: <petición>
---
Eres un cartógrafo: describes el terreno tal como está para que otra persona
decida el camino. Aquí solo lees, y el único fichero que escribes es research.md.

1. Desmonta la petición: subraya cada palabra que admite más de una lectura.
2. Recorre el código: cada afirmación cita fichero:línea.
3. Mira los datos reales: cada campo que menciones lo has visto en una respuesta real.
4. Reúne el contexto de negocio: cada regla o cifra, con su fuente y su fecha.
5. Lista las preguntas abiertas: opciones y qué cambia según la que se elija.
6. Entrega: resume y pregunta si lo guardas en research.md.
```

## El techo del research es el repositorio

El agente puede investigar tu código perfectamente y seguir sin saber que una consulta se ejecuta en cada carga de la home, que hay clientes con diez mil pedidos, o que los datos de hace dos años están en otro sistema y cuestan dinero.

**Eso no está en ningún fichero. Está en la cabeza de alguien de tu empresa, y el único sitio por donde puede entrar es el plan.**

## El reparto de tiempo es contraintuitivo

| Research | Plan | Implement |
|---|---|---|
| Aquí se va tu tiempo | Y aquí también | Poco tiempo tuyo: se delega entera |

**Si pasas la mayor parte del tiempo implementando, no has delegado. Has pedido.**

> **Analogía.** Un arquitecto pasa semanas con el plano y casi no pisa la obra. Si está cada día en la obra corrigiendo tabiques, el plano era malo, o no había plano.

## Práctica 3 · El mismo prompt por fases (10 min, individual)

Mismo repositorio, rama `rpi`. Antes de empezar, **fijad el modelo y el nivel de esfuerzo, y apuntadlos.**

1. **Research (3 min).** Pedidle que investigue lo necesario para la tarea, sin proponer soluciones y sin escribir código.
2. **Plan (4 min).** Con lo investigado, que escriba el plan, todavía sin código. **Parad en el plan**, revisadlo y corregid lo que haga falta.
3. **Implement (3 min).** Que implemente el plan corregido. No hace falta que acabe.

Al terminar, pega en el chat el modelo, el nivel de esfuerzo y **una** corrección que hiciste al plan.

## El límite de RPI

El plan era bueno y el código parece correcto. **¿Cómo sé que lo está? Si lo leo entero, no he delegado nada.**

# Guardarraíles

> **En una frase.** Lo que depende de acordarse, un día se olvida: las rules fijan el criterio de forma probabilística y los hooks lo imponen de forma determinista. (D1·76)

## El criterio es el de tu equipo

El ejemplo del curso: **las vistas no llaman a la API; los datos llegan por `pokemonService`.** Si tu equipo pone esa frontera en otro sitio, el mecanismo es idéntico. **Lo que se codifica es el acuerdo.**

## Tres escalones

| Escalón | Cómo funciona | Su límite |
|---|---|---|
| **El prompt** | Se lo pides y obedece. | A la tercera petición vuelve a llamar a la API desde una vista. Hay que decirlo siempre, y cada persona lo dice a su manera. |
| **Las rules** | Lo escribes una vez en el fichero de reglas. Es sistemático, y es un avance real. | Sigue siendo una instrucción que el modelo pondera junto a las demás. |
| **El hook** | Un programa revisa cada fichero en cuanto el agente lo escribe y, si incumple el criterio, lo obliga a corregirlo. | No pondera, no interpreta, no tiene días buenos y días malos. |

En Claude Code, Codex y Copilot el contrato del hook es el mismo: **código de salida 2 y el motivo en stderr.**

## Las rules son probabilísticas

El problema no es que fallen a veces. **No puedes demostrar que no fallan**, y un guardarraíl cuya efectividad no puedes demostrar no es un guardarraíl.

## Dos ficheros de rules para cuatro herramientas

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

## El hook, de punta a punta

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

## Práctica 5 · El mismo prompt con guardarraíles (15 min, individual)

Mismo repositorio, rama `guardarrailes`: la misma aplicación con linters, tests y hooks. Los de git se ejecutan al hacer commit y al hacer push; los del agente, cada vez que edita un fichero.

1. **Arrancad (3 min).** `git switch guardarrailes`, `pnpm install` y `pnpm verify`.
2. **El mismo prompt (8 min).** Lanzadlo y fijaos en **cuándo lo para un hook y qué hace después.**
3. **El cotejo (4 min).** Comparad con lo que salió en `contexto`: qué hooks saltaron, qué le obligaron a cambiar y por dónde acabó yendo el código. Pega en el chat cuántas veces lo paró un hook.

## Un guardarraíl determinista no es un guardarraíl completo

Sus agujeros no avisan: por ahí el cambio pasa sin que nadie lo mire.

| Agujero | Qué pasa |
|---|---|
| **Solo mira lo que conoce** | Revisa `.ts`, `.tsx` y `.css` dentro de `src/`. Un script, un test fuera de `src/` o un fichero de configuración pasan sin mirar. |
| **Sin ruta, no decide** | Cada herramienta describe la edición a su manera. Si no encuentra una ruta reconocible, deja pasar. |
| **Se rinde para no entrar en bucle** | Si `pnpm verify` sigue fallando después de reintentar, deja terminar al agente. |
| **En Cursor, solo aconseja** | Tras editar, el error le llega como contexto, sin bloqueo. Es un informe, no una garantía. |

## Mapa final del día 1

Cuatro piezas, y qué problema resuelve cada una:

| | Pieza | Qué resuelve |
|---|---|---|
| Hoy, con las manos | **Rules** | Fijan criterio de forma probabilística. |
| | **Hooks** | Lo imponen de forma determinista. |
| Mañana, dentro del sistema | **Skills** | Empaquetan un procedimiento que se repite. |
| | **Subagentes** | Aíslan contexto para que una tarea larga no contamine la conversación principal. |

**Los MCPs conectan con fuera; no resuelven ninguno de estos problemas.**

## El límite de los guardarraíles

Tengo el proceso, la red y los guardarraíles. **Pero lo sigo conduciendo yo, sesión a sesión.** El día 2: el sistema, la especificación y la verificación. Y el último problema ya no es técnico.

# El sistema: skills y workflow

> **En una frase.** Una skill es un proceso tuyo escrito para que lo haga el agente; cuando las encadenas con agentes dedicados y umbrales, dejas de estar dentro del bucle y pasas a estar encima. (D2·1) (D2·5) (D2·9)

## Qué es una skill

**Una skill es un proceso tuyo escrito en lenguaje natural para que lo haga el agente.** Cómo revisas un PR, cómo preparas una release, cómo investigas una alerta. Lo que hoy vive en tu cabeza o en una wiki pasa a un fichero que el agente sigue paso a paso.

## Una técnica de contexto

Es la **divulgación progresiva** (el principio 3 del día 1), empaquetada:

| Cuándo se carga | Qué |
|---|---|
| **Siempre** | El nombre y la descripción. Unas pocas líneas por skill: con eso el agente sabe cuándo le toca usarla. |
| **Al usarla** | El `SKILL.md` entero: los pasos del proceso, escritos como se los contarías a alguien del equipo. |
| **Si hace falta** | Scripts, plantillas y referencias que la skill nombra. Se leen o se ejecutan en el paso que los pide. |

## Un ejemplo: revisar un PR

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

## Cómo se adopta: invirtiendo la dependencia

1. **Rules de consenso.** Lo que el equipo ya acordaba, escrito para la máquina: testing, estilos, navegación, traducciones.
2. **Skills.** Tareas concretas y repetibles: componer la PR, investigar un problema, parchear una vulnerabilidad.

**El problema:** por bien definidos que estén, siguen siendo comandos. El humano los lanza uno detrás de otro, todo el rato.

## El workflow /implement

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

## Práctica 6 · El mismo prompt, llevado por el workflow (20 min, individual)

Repositorio de las prácticas, rama `harness`. Antes de abrir el agente: `git switch harness` y `pnpm install`.

```text
lanza el workflow @.claude/workflows/implement.mjs para la siguiente
funcionalidad: Añade al proyecto web una tabla interactiva con las
ventajas y desventajas entre todos los tipos de Pokémon.
```

## El límite del sistema

**Montar un flujo que te funcione a ti es fácil. Montar un flujo que le funcione a todo tu equipo es lo difícil.**

Y el cuello de botella se ha movido: **después de la IA está en la especificación** (fase 02). Lo que le pides no llega bajado a tierra.
