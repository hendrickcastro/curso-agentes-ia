# Desarrollo de software con IA · Ruta media

> Todos los grandes temas de desarrollo, con el detalle y las prácticas. Duración orientativa para explicarla: media jornada. Las referencias (D1·34) remiten a las diapositivas originales en `00-material-original/diapositivas/`.

# La tesis: pedir no es delegar

> **En una frase.** Pedirle código a un agente no es delegarle trabajo. El curso enseña a delegar cada vez más implementación, con garantías. (D1·1) (D1·4–5)

## El punto de partida

Cuatro frases que se oyen en cualquier equipo, dos de confianza y dos de desconfianza, y una misma respuesta para las cuatro:

| Confianza | Desconfianza |
|---|---|
| «Yo ya uso Claude Code y voy mucho más rápido. Genero más código, así que más negocio.» | «Genero más código. No sé si eso es desarrollar mejor.» |
| «Si ya voy rápido y voy bien, ¿qué más pasos hay?» | «No me fío de dejarlo solo. No vaya a ser que me la líe.» |

La respuesta: **delegar cada vez más, con garantías.**

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

## Tres términos, un significado cada uno

- **Proveedor / modelo / herramienta.** Anthropic es el proveedor, Claude el modelo, Claude Code la herramienta. Tres capas y tres decisiones distintas, que se confunden.
- **Agente.** Modelo más bucle más herramientas. Lee, decide, ejecuta y vuelve a leer.
- **Contexto.** Todo lo que el agente sabe ahora mismo. Es finito: la mesa de trabajo.

## El ecosistema

| Pieza | Qué es |
|---|---|
| **Rules** | Instrucciones que el agente carga siempre, o al entrar en una ruta. |
| **Skills** | Conocimiento y pasos que carga solo cuando la tarea los pide. |
| **Hooks** | Código que se ejecuta en eventos del agente, le haga caso o no. |
| **Subagentes** | Un agente con contexto propio al que le pasas una parte del trabajo. |
| **MCPs** | Conectan el agente con sistemas externos: Jira, bases de datos, navegador. |
| **CLIs** (por debajo de todo) | Siempre han estado ahí. Lo nuevo es que ahora las usa la IA. |

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

## Dónde estaba el cuello de botella

El ciclo tiene siete fases: descubrimiento, especificación, diseño, implementación, verificación, entrega y operación. **Antes de la IA** el cuello de botella era la **implementación**: escribir el código era lo caro, y todo lo demás se dimensionaba alrededor de cuánto tardaba el equipo en construir. El día 1 entero consiste en delegar esa fase sin perder el control; el día 2 sigue al cuello de botella cuando se mueve (primero a la especificación, luego a la verificación).

# Vibecoding

> **En una frase.** Describir en lenguaje natural lo que quieres y aceptar el código sin leerlo sale barato mientras el código se puede tirar. (D1·19)

## Qué es exactamente

**Describir en lenguaje natural lo que quieres y aceptar el código sin leerlo**, iterando sobre el comportamiento observado en vez de sobre el código.

El bucle de cinco pasos: **describes → aceptas sin revisar → ejecutas → pegas el error → vuelves al tres.** El paso que falta, a propósito, es «leer el código».

Dos condiciones para que sea vibecoding de verdad:

- **No revisas el código.** Si lees los diffs y los apruebas uno a uno, eso es otra cosa y tiene otro nombre.
- **Software desechable.** Proyectos de fin de semana, prototipos, cosas que no van a producción y que nadie va a mantener.

## Cuándo deja de salir barato

El día que el prototipo se queda y hay que mantenerlo y evolucionarlo, la factura llega de golpe: nadie entiende lo que hay, nadie puede estimar un cambio, y el único que sabía algo del sistema era un modelo que ya no tiene esa conversación abierta.

Cuando lo vibecodeado se queda, **tanto tú como el agente necesitáis ayuda**: el agente necesita saber cosas que no están ni en tu prompt ni en su cabeza. A ese «lo que necesita saber» le llamamos **contexto**, y es lo que peor gestionamos todos.

> **Analogía.** Vibecodear es cocinar sin receta para ti solo un domingo: si sale mal, pides pizza. El problema empieza cuando ese plato entra en la carta del restaurante y otro cocinero tiene que repetirlo cada día sin saber qué llevaba.

## Práctica 1 · Vibecodear (10 min, individual)

Cada persona en su equipo: clona `github.com/540/ai-development-training` y trabaja sobre la rama `base`. Lanza el prompt tal cual y acepta lo que salga:

```text
Añade al proyecto web una tabla interactiva con las ventajas y
desventajas entre todos los tipos de Pokémon.
```

Este mismo prompt se repite en todas las prácticas del curso: lo que cambia es lo que rodea al agente. Guarda el resultado en el *Cuaderno de prácticas* del laboratorio, con tu nombre, para compararlo después. Al terminar, escribe en el chat una línea: qué salió y cuánto tuviste que leer.

> **Nota sobre el repositorio.** Las diapositivas hablan de una Pokédex en React sobre PokéAPI. El repositorio público contiene hoy un comparador de coches sobre la API de fueleconomy.gov con la misma progresión de ramas (`base`, `rpi`, `guardarrailes`, `especificacion`, `harness`) y otro prompt («Añade al comparador cuál de los coches sale más barato en España»). La mecánica de cada práctica es idéntica.

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

### Maduro, pero hay que elegir

El concepto está claro; la herramienta la elige cada equipo.

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 7 | **Métricas de calidad del código** | Complejidad, tamaño, acoplamiento. La más rentable para empezar: el **riesgo CRAP**, que cruza complejidad con cobertura. Cada equipo elige dos o tres y las pone en un umbral. | `complexity` de ESLint, SonarQube |
| 8 | **Calidad del código de test** | El test también es código y también se pudre. Las herramientas escasean: casi todo recae en el acuerdo de equipo y en la revisión. | eslint-plugin-jest, eslint-plugin-vitest |

**El acuerdo que no está en ninguna herramienta es folklore.** Funcionaba mientras quien escribía el código se sentaba en la misma reunión en la que se acordó. El agente no estuvo en esa reunión.

La fórmula del CRAP, tal como la calcula el script del curso (`tools/crap/crap.ts`), con cobertura entre 0 y 1:

```ts
export function crapOf(complexity: number, coverage: number): number {
  return complexity ** 2 * (1 - coverage) ** 3 + complexity
}
// complejidad 10 sin tests  → 110   (muy por encima del umbral, 8)
// complejidad 10 al 100 %   → 10    (sigue por encima: hay que partirla)
// complejidad 5 al 100 %    → 5     (pasa)
```

### El frente abierto: la especificación

Lo que se está inventando ahora mismo.

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 9 | **Comportamiento funcional** | El comportamiento especificado fuera del código y verificado contra la aplicación real. | Cucumber.js, Playwright |
| 10 | **Mutación de la especificación** | Si cambio un dato del criterio de aceptación, ¿falla algún test? Detecta criterios decorativos. | No hay herramienta estándar: script propio |
| 11 | **Proceso spec-first** | Comprueba si la especificación existió antes que el código o se escribió después para justificarlo. | Sin herramienta |

Cuando el código sale en minutos y lo escribe el agente, **lo que revisas deja de ser el código y pasa a ser lo que pediste.** La especificación asciende a artefacto principal, y llega sin nada del instrumental que el código sí tiene.

**De la prosa al invariante.** Una máquina puede verificar una precondición; un párrafo, no. Ahí se está trabajando ahora, y casi todo sigue en beta o en papers. Lo que se puede hacer hoy es más modesto: escribir el criterio antes que el código, y comprobar de vez en cuando que el test se cae si el criterio cambia.

Eso último es lo que hace `tools/mutacionSpec.mjs` en el proyecto de ejemplo:

```text
$ npm run spec:mutacion
protegido   AC1  (resultados)  «PIKA» encuentra a Pikachu.
protegido   AC2  (resultados)  «chu» también encuentra a Pikachu.
protegido   AC3  (haBuscado)   Con menos de dos letras no busca.
protegido   AC4  (mensaje)     Sin resultados, dice «Ningún Pokémon se llama así».
DECORATIVO  AC5  (tiempoMaximoMs)  Responde en menos de 200 ms.
```

## Cómo se ve la red en un repositorio real

La red de la rama `harness` del repositorio del curso, con sus umbrales:

| Gate | Herramienta | Umbral |
|---|---|---|
| tipos | TypeScript | el proyecto compila |
| lint | ESLint | sin `any`, sin colores en crudo, las vistas no llaman a la API, tests sin enfocar, desactivar ni quedarse sin aserción |
| estilos | Stylelint | clases en camelCase y sin colores en crudo |
| idioma | cspell | el código, en inglés; los textos de pantalla, en castellano |
| arquitectura | dependency-cruiser | la dependencia apunta hacia dentro, sin ciclos ni huérfanos |
| duplicación | jscpd | cero duplicación por encima de 50 tokens |
| cobertura | Vitest e istanbul | 100 % en dominio y servicios; 90 % en infraestructura; 60 % en la interfaz |
| riesgo CRAP | script propio | ninguna función por encima de CRAP 8 |
| mutación | StrykerJS | 100 % de mutantes muertos en dominio y servicios |

Todo colgado de dos comandos, que es lo que hace que un agente pueda ejecutarla:

```json
{
  "scripts": {
    "check": "pnpm typecheck && pnpm lint && pnpm lint:css && pnpm spell && pnpm arch && pnpm test",
    "verify": "pnpm typecheck && pnpm lint && pnpm lint:css && pnpm spell && pnpm arch && pnpm duplication && pnpm coverage && pnpm crap"
  }
}
```

La frontera «las vistas no llaman a la API», convertida en dos garantías que detienen:

```js
// eslint.config.js — solo para src/ui
{
  files: ['src/ui/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-globals': ['error',
      { name: 'fetch', message: 'Views do not call the API: data comes from vehicleService.' }],
    'no-restricted-imports': ['error',
      { patterns: [{ group: ['**/infrastructure', '**/infrastructure/**'],
                     message: 'Views do not call the API: data comes from vehicleService.' }] }],
  },
}
```

```js
// .dependency-cruiser.cjs
{ name: 'ui-does-not-import-infrastructure', severity: 'error',
  from: { path: '^src/ui/' }, to: { path: '^src/core/[^/]+/infrastructure/' } },
{ name: 'no-cycles', severity: 'error', from: {}, to: { circular: true } },
```

```json
// stryker.config.json — el umbral que rompe el build
{ "mutate": ["src/core/**/domain/**/*.ts", "src/core/**/services/**/*.ts"],
  "thresholds": { "high": 100, "low": 100, "break": 100 } }
```

**Lo que la red no garantiza:** los gates verifican el código, no lo que el negocio pidió. Un agente puede dejarlos todos en verde implementando mal una regla. Si se inventa el precio de la gasolina, los tests que él mismo escribe lo darán por bueno. Eso lo cubre el módulo de especificación.

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

## Autodiagnóstico (8 min, individual)

Cada persona sobre su propio repositorio, **de memoria y sin abrir nada**:

| Comprobación | ¿Existe? | ¿En qué momento se ejecuta? | ¿Detiene el trabajo o solo avisa? |
|---|---|---|---|
| Cobertura con umbral | | | |
| Arquitectura y dependencias | | | |
| Mutation testing | | | |
| Comportamiento funcional | | | |

Si tenéis que ir a mirarlo, ya tenéis la respuesta. Una comprobación que detiene el trabajo se nota, porque alguien se queja de ella. El laboratorio del site tiene la versión con las once comprobaciones, para guardarla y compararla entre repositorios: rellénala, expórtala y envíala por el chat; quien facilita importa las de todos y las compara con la pantalla compartida.

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

## De revisar el plan a definir la tarea

**En RPI revisabas el plan. El sistema ya no espera a nadie.** La decisión no desaparece: lo que ayer entraba por el plan, hoy entra al definir la tarea. Una buena definición deja el plan acotado, y un plan acotado se puede automatizar sin que nadie lo revise antes.

## La especificación mínima solo parece barata

Hasta que cuentas el retrabajo. El coste total es la suma de dos curvas: **especificar** (crece con la completitud) y **retrabajo** (cae con ella). El óptimo no está ni en «a pelo» ni en «exhaustiva».

- **Con varios agentes, el óptimo se va a la derecha:** cada uno reinterpreta lo que recibe y el error se acumula en cada traspaso.
- **Si el agente redacta y tú revisas, especificar cuesta menos**, y el óptimo también se desplaza a la derecha.

## Cuánto merece cada tipo de trabajo

El conocimiento de negocio se escribe una vez por proyecto. El entendimiento común, por cambio. El diseño técnico, solo algunas cosas. Con varios agentes, todo por escrito: cada traspaso reinterpreta.

| Tipo de trabajo | Conocimiento de negocio | Entendimiento común | Diseño técnico |
|---|---|---|---|
| **Exploratorio** | El que ya exista | Una frase de intención y qué queda fuera. No va al sistema: lo trabajas tú delante | No: se descubre haciendo |
| **Tarea acotada** | El del proyecto, ya escrito | Criterios de aceptación comprobables | Solo si cruza una frontera |
| **Contrato entre servicios** | El del proyecto | Criterios de los dos lados | Sí: el contrato es el diseño |

## Práctica 7 · Especificar en vez de implementar (10 min, individual)

Mismo repositorio, rama `especificacion`. El prompt de siempre, pero esta vez **no se implementa: se especifica.** Antes de empezar:

```bash
npx skills@latest add mattpocock/skills --skill grill-me grilling
```

1. **A pelo (3 min).** Pedidle los criterios de aceptación. Sin implementar.
2. **Interrogatorio (4 min).** Lo mismo, en sesión nueva y con `/grill-me`. Contesta tú como negocio.
3. **Cotejo (3 min).** ¿Qué salió solo en la segunda vuelta? ¿Estaba escrito en algún sitio? Pega en el chat la pregunta del interrogatorio que más cambió lo que se construiría.

## SDD: la especificación por delante

*Spec-Driven Development.* Tres niveles, según cuánto vive la especificación (Birgitta Böckeler, «Understanding Spec-Driven-Development», octubre de 2025):

| Nivel | Qué es |
|---|---|
| **Spec-first** | Se escribe antes del código y sirve para esta tarea. Al terminarla, no se mantiene. |
| **Spec-anchored** | Se queda después de la tarea y se mantiene. Los cambios siguientes parten de ella. |
| **Spec-as-source** | Es el fichero principal. Solo se edita la especificación; el código no lo toca nadie. |

Lo del curso es **spec-first**, la comprobación de la red de garantías. Cuanto más a la derecha, menos probado está.

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

## Práctica 8 · Tres reglas (20 min, individual y por el chat)

Sobre vuestro repositorio y el diagnóstico de ayer: **si la comprobación de una zona solo avisa, esa zona no tiene carril verde.**

**Tres reglas (10 min), cada persona por su cuenta:**

- Una ruta o tipo de cambio que siempre se lee.
- Una que no haría falta leer nunca.
- Qué tendría que estar en verde y deteniendo para que la segunda sea cierta hoy.

**Abogado del diablo (10 min):** pega tu segunda regla en el chat. Cada persona ataca la regla del mensaje anterior al suyo (la primera ataca la última): busca el cambio que entraría por ella y no debería, y respóndelo en el hilo.

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

# Después de delegar

> **En una frase.** Si no tienes que estar encima, puedes lanzar varios agentes; entonces el cuello de botella eres tú, y lo que te preocupa es el coste y que lo construido dure. (D2·38–39)

## Worktrees: un agente, una copia

**Un worktree es otra copia de trabajo del mismo repositorio, en su propia rama.** Cada agente trabaja en su carpeta. Nadie pisa los ficheros ni el estado de git de otro. **Crear la copia es un comando. Lo difícil es que arranque.**

```bash
git worktree add ../miapp-tabla-tipos -b feature/tabla-tipos
git worktree list
git worktree remove ../miapp-tabla-tipos
```

## Qué necesita un worktree nuevo para arrancar

Lo que no está en git no viene con la copia.

| Necesita | Por qué |
|---|---|
| **Configuración y secretos** | Los `.env` y las claves no están en git. Hay que copiarlos o generarlos. |
| **Dependencias** | Instalar los paquetes y compilar lo que haga falta. |
| **Servicios y puertos** | Base de datos, caché, colas. Dos copias no pueden escuchar en el mismo puerto. |
| **Datos** | Una base de datos con datos de prueba, propia o compartida. |
| **Limpieza** | Al cerrar la tarea, parar los servicios y borrar la copia. |

**Si cada worktree nuevo te pide diez minutos de ajustes a mano, no vas a tener cinco.** Por eso se convierte en un script (`02-ejemplos-codigo/referencia/worktrees/wt-nuevo.sh`, probado):

```sh
#!/usr/bin/env sh
# Uso: wt-nuevo.sh <nombre-de-tarea>
set -e
tarea="$1"
raiz=$(git rev-parse --show-toplevel)
destino="$(dirname "$raiz")/$(basename "$raiz")-$tarea"

git worktree add "$destino" -b "feature/$tarea"                       # la copia: un comando

[ -f "$raiz/.env" ] && cp "$raiz/.env" "$destino/.env"                # configuración y secretos
puerto=$((3000 + $(printf '%s' "$tarea" | cksum | cut -d' ' -f1) % 1000))
echo "PORT=$puerto" >> "$destino/.env"                                # un puerto estable por tarea

[ -f "$destino/package.json" ] && (cd "$destino" && pnpm install --frozen-lockfile)   # dependencias
echo "Listo: $destino (puerto $puerto)"
```

## Aislar la ejecución no evita el choque al integrar

Dos tareas que tocan los mismos ficheros chocan igual, solo que más tarde. **Parte el trabajo por zonas que no se tocan. Si no se puede, hazlo en serie.**

## Con cinco agentes, el cuello de botella eres tú

Cada agente que para a preguntar es un salto de contexto. Cinco agentes a la vez son cinco colas de revisión. Y tu ordenador, que también se satura y también tiene un límite.

## Lo que cuesta estar en este punto

| Coste | En qué consiste |
|---|---|
| **Tokens y límites** | Más autonomía gasta más: cada fase delegada consume tokens. Y varios agentes a la vez llegan antes al límite del plan. |
| **Infraestructura** | Entornos en paralelo, contenedores y minutos de CI. |
| **Comprobaciones** | La red de verificación corre en cada cambio de cada agente. Algunas, como la mutación, son caras y lentas. |
| **Mantener el sistema** | Rules, skills y scripts son código que alguien mantiene. Si caducan, el agente sigue una rule que ya no es verdad. |

**La pregunta no es si cuesta. Es si cuesta menos que el tiempo que liberas.**

## Mantenibilidad a largo plazo

Dentro de seis meses, otro agente tendrá que entender y cambiar lo que hoy escriben cinco agentes. Y tú, cuando te toque.

### Lo que el código no explica

El código dice qué hace el sistema. No dice por qué.

- **Negocio y lenguaje ubicuo.** Un glosario vivo: qué significa cada término del dominio, para ti y para el agente. No es una especificación.
- **Decisiones técnicas.** Un ADR, **solo si** la decisión es difícil de revertir, sorprende sin contexto y es un *trade-off* real.

`grill-with-docs`: el interrogatorio de siempre, pero deja ficheros en el repositorio y no solo en tu cabeza.

```markdown
# ADR 007 · La mutación corre solo sobre dominio y servicios

**Estado:** aceptado · **Fecha:** 2026-04-12

## Contexto
Stryker sobre todo el repositorio tarda 40 minutos y bloquea la integración.

## Decisión
Se muta solo `src/core/**/domain` y `src/core/**/services`, con umbral del 100 %.

## Consecuencias
La interfaz queda protegida por cobertura (60 %) y por los tests de aceptación, no por mutación.
Si una regla de negocio acaba en un componente, nadie lo detecta: por eso la frontera
«las vistas no deciden» está en dependency-cruiser.
```

### Cada cambio pasa; el conjunto empeora

La red comprueba que **cada cambio** es correcto, no que el código **siga siendo mantenible**. Con cinco agentes, la complejidad y la duplicación crecen más rápido de lo que nadie lo nota.

La respuesta es la de todo el curso: **métricas de calidad y garantías que te digan que el código sigue sano, hoy y dentro de seis meses.**

## El límite

Mi máquina ya aguanta varios agentes y lo que monto dura. **Ahora lo tiene que usar todo el equipo.**

# Llevarlo al equipo

> **En una frase.** El último problema no es técnico: nada de esto aguanta si es de una sola persona. Diagnosticar, compartir y mejorar. (D2·50–51)

## Diagnosticar · VSM: el mapa de cómo trabaja el equipo

*Value Stream Mapping*: cada paso, desde la necesidad hasta producción. El VSM clásico, de lean, mide dónde espera el trabajo. Aquí, **cada paso lleva una marca: IA activa, IA posible o no aplica.**

El ejemplo del curso: un equipo con **31 pasos en 5 etapas** (definir → planificar → implementar → entregar → operar), con un 48 % de IA activa, un 32 % de IA posible y un 20 % que no aplica. **Lo posible es por donde avanzar.**

Para hacerlo con tu equipo:

1. Listad en una pizarra o documento compartido cada paso real desde que llega una necesidad hasta que está en producción.
2. Marcad cada uno: IA activa, IA posible o no aplica.
3. Elegid un solo paso «posible» y convertidlo en «activa» antes de la siguiente reunión de mejora.

## Diagnosticar · Gauntlet: ¿podrías dejar de leer el código?

Un ejemplo de cómo medir tus garantías y guardarraíles. Nueve campos: **aceptación, mutation testing, mutación de la spec, CRAP, cobertura, DRY, arquitectura, calidad de tests y spec-first.** No es cerrado y es mejorable, pero te dice dónde mirar.

Cada campo se puntúa **de 0 a 4**, con una nota **sobre 36** y un roadmap. En el curso se compara la rama principal (antes de cualquier práctica, sin red) con la última rama del día 2 (con las comprobaciones de los módulos 4 a 6).

La skill se llama **Gauntlet Audit** y es solo diagnóstico: no instala ni modifica nada. Su criterio para ordenar el roadmap es el que conviene recordar:

1. **Convertir en gate lo ya instalado**: añadir un umbral que rompa el build a una herramienta que ya corre es casi gratis.
2. **Mutation testing**: el mayor salto de confianza en repositorios con una suite decente.
3. **Umbral de cobertura** si no existe: barato, y prerrequisito del CRAP.
4. **Gates de arquitectura**: ciclos y fronteras en CI.
5. **Mutación de la spec**, solo si ya existe capa de aceptación.

## Compartir · Qué es tuyo y qué es del equipo

| | Capa de usuario | Repositorio |
|---|---|---|
| De quién | Tuyo | Del equipo |
| ¿Se versiona? | No | Sí |
| Dónde | `~/.claude/`, `~/.codex/` | `AGENTS.md`, `.claude/skills/` |

Las instrucciones y las skills ya tienen formato común. Los hooks, los subagentes y los permisos, no.

## Mejorar · Probar cada uno, converger en común

**Pruebas en tu capa → lo usa más gente → sube al repositorio.**

## Mejorar · La reunión de mejora continua

Como la retrospectiva de siempre, sobre el flujo con IA:

1. ¿Qué está fallando?
2. ¿Cómo mejoramos el sistema y el flujo con IA?
3. ¿Qué podemos añadir?

## Si no leemos el código, ¿qué miramos?

Había un tablero de mejoras técnicas y preocupaciones. Se llenaba leyendo código; al delegar, se queda vacío. **Un panel de métricas ocupa el sitio del tablero. Sigue decidiendo el equipo.** (Demo: panel de salud del código.)

## La curva J

Cualquier mejora que adoptéis: **al principio cuesta** (el rendimiento baja por debajo del nivel de partida) **y después compensa.** Como el interés compuesto: cada mejora permite ir más rápido y seguir mejorando.

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
