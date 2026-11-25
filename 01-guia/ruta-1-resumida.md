# Desarrollo de software con IA · Ruta resumida

> Solo los grandes temas de desarrollo. Duración orientativa para explicarla: 100 min. Las referencias (D1·34) remiten a las diapositivas originales en `00-material-original/diapositivas/`.

# La tesis: pedir no es delegar

> **En una frase.** Pedirle código a un agente no es delegarle trabajo. El curso enseña a delegar cada vez más implementación, con garantías. (D1·1) (D1·4–5)

## Pedir frente a delegar

| | El qué | El cómo | Escribe | Verifica |
|---|---|---|---|---|
| **Escribes** | Tú | Tú | Tú (la IA autocompleta o responde dudas) | Tú |
| **Pides** | Tú | Tú: dónde va, qué toca, qué patrón sigue | El agente | Tú, leyéndolo todo |
| **Delegas** | Tú | El agente | El agente | Tú, sin leerlo entero, con garantías |

**Si tienes que leerlo entero, no has delegado. Has pedido.** De pedir a delegar hay menos distancia de la que parece, y más incomodidad. Nadie está mal donde está: la pregunta «¿dónde estáis?» se hace con una encuesta rápida o una reacción en la videollamada.

## Por qué con personas sí funciona

| Con un compañero | Con un agente |
|---|---|
| Confianza acumulada | Cero historial |
| Sabes cómo trabaja | No sabes qué hará con lo que no le dijiste |
| Un plan a medias vale: rellena con criterio | Rellena con lo plausible, no con lo correcto |
| La revisión es por muestreo | El muestreo no vale |

Lo que era implícito tiene que ser explícito: **un contrato antes y una verificación mecánica después.** Todo el curso desarrolla esas dos mitades: el contrato (contexto, plan, especificación) y la verificación (garantías, guardarraíles, carriles).

> **Analogía.** Delegar en un agente es como subcontratar una obra a una cuadrilla excelente que no conoce tu casa y que nunca pregunta. Si le das el plano (contrato) y pasas la inspección técnica al final (verificación mecánica), puedes no estar en la obra. Si no, tienes que estar mirando cada ladrillo, y entonces no has subcontratado nada.

## La IA replica y amplifica lo que encuentra

Si encuentra tests, arquitectura y convenciones, produce código que encaja. Si encuentra desorden, produce desorden más rápido. **El techo no lo pone el modelo. Lo pone vuestro repositorio.**

## La escalera de fallos

Del primer vibecoding a cómo se hace software con agentes. **Cada peldaño resuelve un problema y crea el siguiente.** Es el índice real del curso.

| Peldaño | Qué resuelve | Qué problema deja |
|---|---|---|
| **Vibecoding** | Pido a ciegas y acepto lo que sale, que parece plausible. | No conoce mi código. |
| **Contexto** | Ya conoce mi código. | El qué y el cómo los sigue decidiendo él. |
| **RPI** | El plan es mío. | Para saber si el código está bien lo leo entero. |
| **Garantías** | Ya no leo, verifico: que funciona y que se podrá mantener. | Son once comprobaciones y las aplico a mano. |
| **Guardarraíles** | Rules y hooks: el criterio deja de depender de mi memoria. Fijado y repetible. | Lo conduzco yo, sesión a sesión. |
| **El sistema** | Skills, subagentes y el harness que lo ata todo. Desatendido y barato. | El cuello de botella se ha movido de sitio. |
| **Especificación** | Construye casi cualquier cosa; la pregunta cara es qué le pido y cómo sabrá que ha terminado. | Sigo teniendo encima todo lo que produce. |
| **Verificación** | Quince PRs que no he visto escribir: decido cuáles merecen mis ojos y el resto entra solo. | Todo eso vive en mi máquina y en mi cabeza. |
| **El equipo** | El último ya no es técnico: nada de esto aguanta si es de una sola persona. | — |

# Contexto

> **En una frase.** El contexto es un presupuesto de atención, no un almacén: no se escribe, se acumula, y la disciplina consiste en decidir qué acumulas. (D1·27) (D1·49)

## Qué es el contexto

**El contexto es todo el estado disponible para el modelo en el momento de la inferencia.** No es tu mensaje: tu mensaje es una fracción pequeña, y a menudo la más pequeña de todas.

**No es prompt engineering, y la diferencia es temporal.** El prompt es algo que escribes una vez y reutilizas: una frase. El contexto se decide cada vez que se llama al modelo; en una sesión de agente eso son decenas o cientos de veces, y tú solo escribiste la primera.

**Es un presupuesto de atención, no un almacén.** Cada token compite por la atención del modelo: no se acumula, se reparte. Meter algo irrelevante no es neutro.

> **Analogía.** El contexto es la mesa de trabajo, no el archivo. En una mesa cabe poco, y cada papel que dejas encima tapa a los demás. Un compañero con la mesa llena de papeles de otros asuntos no trabaja peor por tonto, sino porque no encuentra el que importa.

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

## El límite de RPI

El plan era bueno y el código parece correcto. **¿Cómo sé que lo está? Si lo leo entero, no he delegado nada.**

# Garantías

> **En una frase.** Parecer correcto no basta, y leerlo entero no escala: hace falta una red de comprobaciones que detenga el trabajo, no que avise. (D1·62)

## La pregunta

**¿Qué tendría que existir para que lo aceptaras sin leerlo, hoy y dentro de un año?** Si para aceptarlo tienes que leerlo entero, has cambiado el trabajo de escribir por el de leer.

## No es una herramienta: es una red

**Once comprobaciones** que miran cosas distintas; ninguna sustituye a las demás. Van de la más asentada a la más abierta.

### Terreno firme: lo que ya no discute nadie

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 1 | **Formateo** | Quita el ruido del diff para que se vea el cambio de verdad. La más barata de las once. | Prettier, Biome |
| 2 | **Linting** | Los criterios que se comprueban leyendo el código sin ejecutarlo. | ESLint, Oxlint |
| 3 | **Cobertura con umbral** | Mide qué código no ejercita ningún test; si baja del listón, el build falla. | `coverageThreshold` de Jest, `check-coverage` de c8 |
| 4 | **Duplicación estructural** | Lo mismo escrito en cuatro sitios se va a corregir en tres. | jscpd, SonarQube |
| 5 | **Arquitectura y dependencias** | Fronteras entre capas y ausencia de ciclos verificadas por una herramienta. | dependency-cruiser, `madge --circular` |
| 6 | **Mutation testing** | ¿Detectan mis tests un cambio en el código? La única de las once que dice si la suite protege algo. | StrykerJS, umbral en `thresholds.break` |

## Cuándo se ejecuta cada garantía

El momento bueno no es el más temprano posible: es **el más temprano en el que la comprobación compensa lo que cuesta.**

| Momento | Qué cabe ahí | Por qué ahí |
|---|---|---|
| Antes de escribir el código | Que la especificación existe, con criterios de aceptación que se puedan comprobar | Es lo único que tiene sentido mirar cuando todavía no hay código |
| Al guardar un fichero | Formateo y linting | Milisegundos, y solo mira lo que acabas de tocar |
| Cuando el agente termina de escribir | Lo mismo, pero el aviso le llega a él | Es el único momento en que se corrige solo, sin gastar tu tiempo |
| Antes de confirmar el cambio | Tests del área tocada, umbrales sobre lo nuevo | Segundos, y todavía no lo ha visto nadie más |
| Antes de publicarlo | Suite rápida completa, fronteras y ciclos | Minutos, y es el último momento en que sigue siendo privado |
| En la integración | Cobertura, mutación, duplicación | Tarda, y aquí ya no hay nadie esperando delante |
| Al cerrar la sesión del agente | La red entera, como criterio de aceptación | Es donde decides si esto se acepta o se lee entero |

## Dos reglas que separan una garantía de un adorno

**Si avisa pero no detiene, no es una garantía. Es un informe.** Ejecutarla tolerando el fallo cuesta lo mismo y no protege igual. Lo único que compra es la tranquilidad de creerse cubierto.

**Una garantía que solo existe dentro de tu IDE no es una garantía.** Si no se puede invocar desde la línea de comandos, el agente no puede ejecutarla ni saber si la ha pasado. Y tú no puedes colgarla de ninguno de esos momentos, ni meterla en el sistema.

```bash
# Informe: el fallo se tolera
eslint . || true

# Garantía: sale con código distinto de cero y detiene el commit, el push o el build
eslint .
```

## El ratchet

«Esto no va conmigo. Mi repositorio lleva ocho años y no cumple nada.» Justo para eso existe el ratchet: una carraca, que deja girar en un sentido y bloquea el otro.

1. **Mides hoy.** Tomas el número que salga como línea de partida y lo declaras aceptable. No es aprobar la deuda, es dejar de discutirla.
2. **Lo viejo pasa, lo nuevo detiene.** Las violaciones que ya estaban pasan; una nueva detiene el trabajo. Todo lo que salta es de hoy.
3. **La línea solo baja.** La reescribe la propia comprobación cuando alguien deja un fichero viejo mejor de lo que estaba. Un ratchet que lleva un año sin moverse es la misma deuda con un certificado.

**Para un agente, el ratchet es la frontera que le dice qué parte del repositorio puede tocar sin preguntar.** Con el listón completo sobre un proyecto viejo le estás pidiendo que reforme el proyecto entero, y lo va a intentar.

El núcleo de `02-ejemplos-codigo/demo/tools/ratchet.mjs`:

```js
const base = JSON.parse(readFileSync(RUTA_BASE, 'utf8'))   // { "src/ui/legacy/viejaVista.mjs": 2 }
const actual = contarPorFichero(buscarViolaciones())

// Lo nuevo detiene: cualquier fichero con MÁS violaciones de las que tenía.
const empeorados = Object.entries(actual).filter(([fichero, n]) => n > (base[fichero] ?? 0))
if (empeorados.length > 0) process.exit(1)

// La línea solo baja: se queda con el mínimo entre lo que había y lo que hay.
const nuevaBase = Object.fromEntries(
  Object.entries(base).map(([fichero, n]) => [fichero, Math.min(n, actual[fichero] ?? 0)])
                      .filter(([, n]) => n > 0))
if (total(nuevaBase) < total(base)) guardar(nuevaBase)
```

```text
$ npm run ratchet
Ratchet: en verde. Deuda conocida: 2 violación(es); nuevas: 0.

$ # alguien añade un fetch en una vista
Ratchet: hay violaciones nuevas. Todo lo que salta es de hoy.
src/ui/buscadorView.mjs: tenía 0, ahora 1
  src/ui/buscadorView.mjs:12  Las vistas no llaman a la API: pide el dato a pokemonService.
```

> **Analogía.** El ratchet es la báscula de una dieta que no te pide pesar 70 kilos mañana: solo te impide pesar más que ayer.

## El límite de las garantías

Sé qué garantizar y cuándo. **Pero soy yo quien se acuerda de lanzarlas.** Son once comprobaciones, hay que aplicarlas en cada cambio, y eso a mano no se sostiene. El bloque siguiente automatiza una de ellas de punta a punta, el linting, para montar el mecanismo completo con las manos.

# Guardarraíles

> **En una frase.** Lo que depende de acordarse, un día se olvida: las rules fijan el criterio de forma probabilística y los hooks lo imponen de forma determinista. (D1·76)

## Tres escalones

| Escalón | Cómo funciona | Su límite |
|---|---|---|
| **El prompt** | Se lo pides y obedece. | A la tercera petición vuelve a llamar a la API desde una vista. Hay que decirlo siempre, y cada persona lo dice a su manera. |
| **Las rules** | Lo escribes una vez en el fichero de reglas. Es sistemático, y es un avance real. | Sigue siendo una instrucción que el modelo pondera junto a las demás. |
| **El hook** | Un programa revisa cada fichero en cuanto el agente lo escribe y, si incumple el criterio, lo obliga a corregirlo. | No pondera, no interpreta, no tiene días buenos y días malos. |

En Claude Code, Codex y Copilot el contrato del hook es el mismo: **código de salida 2 y el motivo en stderr.**

## Las rules son probabilísticas

El problema no es que fallen a veces. **No puedes demostrar que no fallan**, y un guardarraíl cuya efectividad no puedes demostrar no es un guardarraíl.

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

## El límite del sistema

**Montar un flujo que te funcione a ti es fácil. Montar un flujo que le funcione a todo tu equipo es lo difícil.**

Y el cuello de botella se ha movido: **después de la IA está en la especificación** (fase 02). Lo que le pides no llega bajado a tierra.

# Especificación

> **En una frase.** El sistema ya construye casi cualquier cosa; la pregunta es qué le pides, y un sistema que trabaja sin ti necesita saber cuándo ha terminado. (D2·16)

## La condición de parada

**Un sistema que trabaja sin ti necesita saber cuándo ha terminado. Y eso no lo decide él.**

Mientras el código era caro, la fricción de escribirlo sacaba a la luz los huecos uno a uno, y había alguien en medio decidiendo. Ahora nadie lo escribe a mano, y los huecos ya no afloran solos. El criterio de aceptación deja de ser una formalidad del ticket y pasa a ser **la condición de parada**: el «contrato antes» del día 1.

## Describir no es especificar

**Si para saber si ha terminado tiene que mirarlo una persona, no has especificado. Has descrito.**

| Descrito | Especificado |
|---|---|
| Añade un buscador de Pokémon. | Busca por nombre sin distinguir mayúsculas. |
| | «PIKA» encuentra a Pikachu. |
| | «chu» también encuentra a Pikachu. |
| | Con menos de dos letras no busca. |
| | Sin resultados, dice «Ningún Pokémon se llama así». |

Cada línea de la segunda columna la puede comprobar alguien que no estuvo en la conversación. **Y por tanto, un agente.**

La misma especificación, en una forma que una máquina ejecuta (`02-ejemplos-codigo/demo/specs/buscador.criterios.json`):

```json
{ "id": "AC1", "texto": "Busca por nombre sin distinguir mayúsculas: «PIKA» encuentra a Pikachu.",
  "dado": { "consulta": "PIKA" }, "entonces": { "resultados": ["Pikachu"] } },
{ "id": "AC3", "texto": "Con menos de dos letras no busca.",
  "dado": { "consulta": "p" }, "entonces": { "haBuscado": false } }
```

```js
// test/aceptacion.test.mjs — los datos NO están en el test: se leen del criterio
for (const criterio of spec.criterios) {
  test(`${criterio.id} — ${criterio.texto}`, () => {
    const real = buscarPokemon(criterio.dado.consulta)
    for (const [clave, esperado] of Object.entries(criterio.entonces)) COMPROBACIONES[clave]?.(real, esperado)
  })
}
```

O en Gherkin, si el equipo usa Cucumber:

```gherkin
Escenario: La búsqueda no distingue mayúsculas
  Dado que existe el Pokémon "Pikachu"
  Cuando busco "PIKA"
  Entonces veo "Pikachu" en los resultados

Escenario: Con menos de dos letras no se busca
  Cuando busco "p"
  Entonces no se lanza ninguna búsqueda
```

## Las cuatro piezas de una definición que sirve

| Pieza | Qué es |
|---|---|
| **El conocimiento de negocio** | El que no está en el repositorio. |
| **La intención** | Para qué se hace, qué problema resuelve. |
| **Las restricciones** | Lo que no se puede tocar ni romper. |
| **Los criterios de aceptación** | En una forma que alguien pueda comprobar sin opinar. |

**Spec-first, parte de la red de garantías, no es un ritual:** es que exista condición de parada antes de que exista código.

```markdown
# Tabla de ventajas entre tipos

## Conocimiento de negocio
- Manda la tabla de la generación VI en adelante (18 tipos, incluido Hada).
- «Ventaja» es el multiplicador de daño del tipo atacante sobre el defensor: ×2, ×1, ×½ o ×0.

## Intención
Que quien arma un equipo vea de un vistazo contra qué es fuerte y débil cada tipo.

## Restricciones
- Las vistas no llaman a la API: los datos llegan por `pokemonService`.
- No se toca la ficha de detalle.

## Criterios de aceptación
1. AC1 — La tabla tiene 18 filas (atacante) y 18 columnas (defensor).
2. AC2 — Agua contra Fuego muestra ×2; Fuego contra Agua, ×½.
3. AC3 — Normal contra Fantasma muestra ×0.
4. AC4 — Al pulsar una cabecera de fila se resaltan solo sus ×2.
```

## El límite de la especificación

Sé qué tengo que dejar dicho para que el sistema sepa cuándo ha terminado. **Y ahora tengo quince PRs encima que no he visto escribir.**

# Verificación

> **En una frase.** Quince PRs que no has visto escribir: la pregunta no es si vas a dejar de leer, sino si lo decides tú o te pasa. (D2·27)

## El cuello de botella se mueve otra vez

Después de la IA, el segundo cuello de botella es la **verificación** (fase 05): más código del que nadie puede leer y una revisión humana que no escala.

**Quince PRs que no has visto escribir. ¿Cuáles no vas a leer?** No es si vas a dejar de leer. Es si lo decides tú o te pasa.

## Tres carriles

| Carril | Quién lo mira |
|---|---|
| **Se lee entero** | Una persona lo revisa línea a línea. |
| **Por muestreo** | Un revisor automático hace la primera pasada y una persona mira lo que señala. |
| **Se fusiona solo** | Nadie lo lee. |

## El carril se decide en un embudo

**Cada etapa solo puede mandar el cambio a un carril más lento.** Ninguna lo devuelve a uno más rápido.

| Etapa | Quién decide | Ejemplo |
|---|---|---|
| 01 **Zonas vetadas** | Una regla | Pagos, migraciones, la configuración de la propia red |
| 02 **Quién lo escribió** | Una regla | Un agente desatendido, alguien sin historial en esa zona |
| 03 **Señales del diff** | Una regla | Tamaño, tests existentes modificados, umbrales relajados |
| 04 **Nota de riesgo** | Un modelo: **cierra, nunca abre** | Una nota alta sube de carril; una baja no devuelve al verde |
| 05 **Red de garantías** | Las comprobaciones | Todo en verde y deteniendo, o no hay merge |

**Los umbrales los pone cada equipo: el apetito de riesgo es una decisión, no una constante.**

El embudo, ejecutable (`02-ejemplos-codigo/demo/tools/carril.mjs`):

```js
const ORDEN = ['verde', 'muestreo', 'lectura', 'bloqueado']
const masLento = (a, b) => (ORDEN.indexOf(b) > ORDEN.indexOf(a) ? b : a)

export function decidirCarril(cambio, config) {
  return ETAPAS.reduce((estado, etapa) => {
    const veredicto = etapa.decidir(cambio, config)
    // una etapa solo puede mandar el cambio a un carril MÁS LENTO
    const carril = veredicto ? masLento(estado.carril, veredicto.carril) : estado.carril
    return { carril, traza: [...estado.traza, { etapa: etapa.nombre, carril, motivo: veredicto?.motivo ?? 'pasa' }] }
  }, { carril: 'verde', traza: [] })
}
```

```text
$ node tools/carril.mjs cambios/03-toca-los-tests.json
Cambio: Arregla el buscador (y de paso 'ajusta' dos tests)
  01 Zonas vetadas (regla)                        → verde     pasa
  02 Quién lo escribió (regla)                    → muestreo  autor sin historial: agente-desatendido
  03 Señales del diff (regla)                     → lectura   encoge la red sin que haya cambiado la especificación
  04 Nota de riesgo (modelo: cierra, nunca abre)  → lectura   pasa
  05 Red de garantías (las comprobaciones)        → lectura   pasa
CARRIL: LECTURA
```

> **Analogía.** Es el triaje de urgencias: no se atiende a todo el mundo con el mismo detalle, pero quién espera y quién pasa lo decide un protocolo, no el cansancio del médico a las cuatro de la mañana. Y un triaje nunca baja la gravedad por una corazonada: solo la sube.

## Pedirle que no toque los tests no funciona

Cuando la especificación y los tests chocan, los modelos **modifican los tests aunque la instrucción diga que no**, o programan casos especiales para pasar sin cumplir la especificación. Un modelo que vigila a otro caza entre el 42 y el 65 % de esas trampas en proyectos de varios ficheros. (Zhong, Raghunathan y Carlini, «ImpossibleBench», octubre de 2025.)

## La red puede crecer sola; no puede encogerse sin que nadie lo vea

| Movimiento | Qué es | Qué pasa |
|---|---|---|
| **Ampliar** | Tests nuevos para el comportamiento nuevo. | Los escribe el agente, y la mutación dice si detectan algo. |
| **Encoger** | Modificar o borrar un test que ya existía, relajar un umbral, añadir una excepción. | **Sube de carril.** |

**¿Cuándo es legítimo tocar un test?** Cuando cambió la especificación. Si no cambió, es sospechoso.

En el embudo, es la etapa 03:

```js
const encoge = [
  cambio.testsModificadosOBorrados > 0 && 'modifica o borra tests que ya existían',
  cambio.relajaUmbrales && 'relaja un umbral',
  cambio.anadeExcepciones && 'añade una excepción (eslint-disable, skip, ignore…)',
].filter(Boolean)
if (encoge.length && !cambio.cambioLaEspecificacion) return { carril: 'lectura', motivo: '…' }
```

## El carril verde se abre con evidencia, no con fe

Un caso publicado empezó dejando pasar el 25 % de cambios más seguros, y lo subió al 50 % cuando vio que las incidencias no crecían.

1. **Empieza estrecho.** Solo lo obvio.
2. **Mide.** Cuánto de lo que entró sin leer se revierte o acaba en un incidente, comparado con lo revisado.
3. **Ajusta.** Si aguanta, se ensancha. Si falla, se estrecha.

Es el ratchet del día 1, aplicado a los carriles.

## El límite de la verificación

Sé qué no voy a leer, y cómo sé que sigue siendo verdad. **Ahora que corre solo, quiero lanzar varios.**

# Cierre: la escala de uso

> **En una frase.** En seis meses todos tendrán las mismas herramientas. El sistema, no: se construye ahora, mientras la mayoría improvisa. (D2·72) (D2·78)

## La escala de uso

Cada escalón por lo que ganas, y en dos ejes: **qué haces tú y cuánto lees.**

| Escalón | Qué ganas | Tú | Lees |
|---|---|---|---|
| **Prompting** | Sale algo plausible, y rápido. | Pides sin especificar | Lo que sale, sin criterio para juzgarlo |
| **Sesiones y rules** | El agente tiene directrices y la sesión no se degrada. | Cuidas el contexto | Todo el código |
| **RPI** | Feedback temprano sobre el plan, y cada fase empieza con el contexto limpio. | Revisas el plan | Todo el código |
| **Garantías y guardarraíles** | El resultado se comprueba solo, y el criterio no depende de la especificación ni de las reglas. | Fijas el criterio | Todo el código, pero te fías más |
| **Workflow de implementación** | Lo lanzas en local y hace la implementación entera sin pararse. Pasas de estar dentro del bucle a estar encima. | Defines la tarea, lo lanzas y estás pendiente | El resultado y lo que la red señala |
| **El sistema** | Si la tarea está bien definida, el sistema la recoge solo y ejecuta el proceso entero, hasta la verificación. | Preparas la tarea y supervisas | Solo lo que merece tus ojos |

## Por dónde empezar el lunes

Un orden razonable, derivado de la escalera (cada paso habilita el siguiente):

1. **Mide tu contexto** una semana: `/context` al terminar cada sesión larga, y la regla del 60 %.
2. **Escribe un `AGENTS.md` corto**, por secciones, con el porqué de cada regla. Añade una regla cada vez que veas fallar al agente.
3. **Convierte en garantía lo que ya tienes instalado:** que el linter y la cobertura salgan con error en vez de avisar, y cuélgalos de `pre-commit` y `pre-push`.
4. **Pon un ratchet** sobre la deuda que ya existe para que lo nuevo no la aumente.
5. **Monta un hook** `PostToolUse` + `Stop` que ejecute esas mismas comprobaciones para el agente.
6. **Escribe criterios de aceptación comprobables** antes de lanzar una tarea, y parte por RPI las que no estén claras.
7. **Define tus tres carriles** con una sola regla verde, estrecha, y mide qué pasa.
