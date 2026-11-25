# Contexto {R}

> **En una frase.** El contexto es un presupuesto de atención, no un almacén: no se escribe, se acumula, y la disciplina consiste en decidir qué acumulas. [D1:27] [D1:49]

## Qué es el contexto {R} [D1:28-30]

**El contexto es todo el estado disponible para el modelo en el momento de la inferencia.** No es tu mensaje: tu mensaje es una fracción pequeña, y a menudo la más pequeña de todas.

**No es prompt engineering, y la diferencia es temporal.** El prompt es algo que escribes una vez y reutilizas: una frase. El contexto se decide cada vez que se llama al modelo; en una sesión de agente eso son decenas o cientos de veces, y tú solo escribiste la primera.

**Es un presupuesto de atención, no un almacén.** Cada token compite por la atención del modelo: no se acumula, se reparte. Meter algo irrelevante no es neutro.

> **Analogía.** El contexto es la mesa de trabajo, no el archivo. En una mesa cabe poco, y cada papel que dejas encima tapa a los demás. Un compañero con la mesa llena de papeles de otros asuntos no trabaja peor por tonto, sino porque no encuentra el que importa.

## Anatomía de la ventana {M} [D1:31-32]

Cinco partidas con comportamientos distintos. Lo que importa es la tercera columna.

| Componente | Qué es | Comportamiento |
|---|---|---|
| System prompt | Instrucciones permanentes del agente | Fijo, presente en todas las llamadas |
| Definiciones de herramientas | Qué puede hacer el agente y cómo | Fijo, y mucho más grande de lo que nadie estima |
| Documentos recuperados | Ficheros leídos, búsquedas, documentación | Crece por acumulación, rara vez se limpia |
| Historial de mensajes | Toda la conversación previa | Crece dos veces por cada acción |
| Salidas de herramientas | Resultados de cada ejecución | Suele ser lo que más ocupa |

**La mayor parte de tu ventana no la escribiste tú. Se acumuló sola.** La ventana del turno treinta es un artefacto que nadie diseñó: en el turno 1 es system prompt, herramientas y tu mensaje; en el 30, casi todo son salidas de herramientas y respuestas del agente, y ha cruzado el 60 %. (Redibujado de HumanLayer, *Context forking to save time, trouble and tokens*.)

## Ventana nominal y capacidad efectiva {R} [D1:33-34]

- **Ventana nominal.** El número que anuncia el proveedor: 200K, 1M. Es un límite duro, y superarlo es un error, no una degradación.
- **Capacidad efectiva.** Materialmente menor que la nominal, y depende de la tarea. *Context Rot* (Chroma, 2025): el rendimiento cae al crecer el input incluso en tareas triviales, en los 18 modelos medidos.

**La curva en U** (*Lost in the Middle*, Liu et al., 2023): el modelo recuerda bien el principio y el final, y pierde de 20 a 30 puntos de *recall* cuando el documento relevante cae en el centro.

**Nunca pongas una restricción crítica en medio de un prompt largo.** El fallo parecerá desobediencia cuando es geometría.

## Las cuatro formas de fallar {R} [D1:35]

Qué le pasa a la ventana y cómo lo ves desde fuera. Convierte «el agente se está portando raro» en un diagnóstico con nombre.

| Fallo | Qué pasa | Cómo se ve |
|---|---|---|
| **Poisoning** | Un error entra en la ventana y se sigue usando como si fuera verdad. | Se inventa `usePokemonTypes()`. Se lo corriges, pero cada fichero nuevo lo vuelve a importar: el nombre falso sigue ahí, repetido, y pesa más que tu corrección. |
| **Distraction** | La ventana crece tanto que el modelo copia del historial en vez de pensar. | Tras dos horas con el mismo bug, repite pasos que ya probasteis y no funcionaron. |
| **Confusion** | Hay información que sobra, y el modelo la usa porque está ahí. | Tienes cargado el MCP de la base de datos y le pides cambiar un texto de la interfaz. Acaba lanzando una consulta que nadie le pidió. |
| **Clash** | Dos partes de la ventana se contradicen y el modelo elige la que no es. | Arregláis juntos el daño contra Pokémon de dos tipos. Una hora después lo reescribe como estaba: la versión vieja sigue más arriba en el hilo, y la toma por buena. |

## El primer prompt es una decisión de arquitectura {M} [D1:36]

La interpretación que el modelo hace de tu primer prompt fija una trayectoria de la que ya no se sale: todo lo que viene después se construye encima, incluidos los errores.

## Cómo medir el contexto {R} [D1:37]

Tres niveles: **ocupación** (¿cuánto llevo gastado?), **composición** (¿en qué me lo he gastado?) y **degradación** (¿se está estropeando?).

### Nivel 1 · Ocupación {R} [D1:38]

| Herramienta | Cómo verlo |
|---|---|
| Claude Code | `/context`: desglose por componente, más el porcentaje en la barra |
| Codex | `/status`: porcentaje libre y tokens usados. `/statusline` lo fija en el pie. Sin desglose |
| Cursor | Anillo junto al prompt. Al pulsarlo, desglose por categoría: tools, rules, skills, MCP, conversación |
| Copilot (VS Code) | Anillo en la entrada del chat. Al pasar el ratón, tokens usados sobre el máximo y desglose |

**La regla: al 60 % de la ventana compactas o abres sesión nueva.** Si la ventana es de un millón, antes de unos 150.000 tokens. No esperas al límite: al llegar al 100 % la herramienta compacta de urgencia y decide ella qué tira.

### Nivel 2 · Composición {M} [D1:39-40]

**Mismo mensaje, mismo trabajo:** con cuatro MCP cargados (GitHub, Linear, base de datos, navegador), la tarea empieza al otro lado del umbral del 60 % antes de que escribas nada, porque sus definiciones ocupan sitio en todas las llamadas. (Redibujado de HumanLayer, *Skill issue: harness engineering for coding agents*.)

En la demo en vivo, un `/context` real de una sesión larga: 175k de 1M tokens (18 %), de los que 142,7k son **mensajes**; system prompt 2,2k, herramientas del sistema 14,9k, agentes propios 4,2k, ficheros de memoria 1,9k, skills 9,9k, y 157 herramientas MCP con 0 tokens porque se cargan bajo demanda. Antes de mirar los números, la pregunta es: ¿en qué creéis que se va?

### Nivel 3 · Degradación {R} [D1:41]

No hay contador. Se detecta por síntomas.

| Lo que ves | Qué es | Qué haces |
|---|---|---|
| Insiste en una función o fichero que no existe | Poisoning | No lo corrijas en el hilo: el error ya está referenciado. Rebobina a antes de que entrara; si no sabes cuándo entró, sesión nueva |
| Empeora según avanza, se vuelve genérico | Distraction | Compactar |
| Te reintroduce un bug que ya arreglasteis | Clash | Sesión nueva, y la corrección en la spec, no en el chat |
| Ignora una restricción que diste al principio | Posición | Reponerla al final del prompt actual |

**Si tienes que repetirle algo por segunda vez, no es que no te haya entendido. Es que el contexto está saturado.** Repetirlo por tercera vez no lo arregla.

## Los cuatro principios {R} [D1:42]

| Pregunta | Principio | En qué consiste |
|---|---|---|
| Qué entra | **Solo lo que cambia la respuesta** | Si lo quitas y el agente haría lo mismo, sobra. Lo demás, que lo busque cuando lo necesite. |
| Dónde va | **Colocación consciente de la posición** | Restricciones críticas, formato de salida y guardarraíles van al principio o al final. Nunca enterrados en medio. |
| Con cuánto detalle | **Divulgación progresiva** | Nombres y descripciones al arrancar; contenido completo solo cuando algo se activa. Y si se activa, cárgalo entero. |
| Cada turno | **Curación iterativa** | No escribas el CLAUDE.md pensando en todo lo que podría salir mal. Empieza con lo mínimo y añade una regla cada vez que veas fallar al agente. |

### Principio 1 · Reducir lo que entra {M} [D1:43]

- **Pide el trozo, no el fichero.** La función que vas a tocar, no el fichero entero. El fichero, no el repositorio.
- **Menos herramientas.** Cada una ocupa sitio en todos los mensajes. Y con muchas, el agente duda cuál usar.
- **Nombres que se explican.** `tarifas_clientes.json` se encuentra sin abrirlo. `data/file1.json` hay que abrirlo para saber qué es.

### Principio 2 · Colocar bien lo que entra {M} [D1:44]

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

### Principio 3 · Diferir la carga {M} [D1:45-46]

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

### Principio 4 · Podar lo acumulado {R} [D1:47-48]

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

## Cinco mensajes clave {R} [D1:50]

1. El contexto es un presupuesto de atención, no un almacén. Cada token compite con los demás.
2. La ventana nominal no es la capacidad efectiva. Caber no es suficiente.
3. Lo que está en medio se pierde. Lo crítico va arriba o abajo.
4. Si tienes que repetir algo por segunda vez, el contexto está saturado. Mide antes de insistir.
5. Restar suele ganar a sumar. Veinte veces más contexto puede rendir peor.

## Práctica 2 · El mismo prompt con contexto (10 min, individual) {M} [D1:51]

Mismo repositorio, rama `contexto`: la misma aplicación, ahora con capas, un `AGENTS.md` y un `CONTEXT.md` con el conocimiento del negocio.

1. **Arrancad (2 min).** `git switch contexto`, `pnpm install` y `pnpm dev`. Echad un vistazo al `AGENTS.md`.
2. **El mismo prompt (5 min).** Lanzadlo y fijaos en **qué ficheros lee antes de escribir**.
3. **El cotejo (3 min).** Compara con lo que te salió en la práctica 1 y pega en el chat la diferencia que más te llame la atención.

Guarda el intento en el cuaderno del laboratorio para compararlo con el anterior. Una o dos personas comparten pantalla y enseñan su comparación.

## El límite del contexto {R} [D1:52]

Ya sabes qué meter en la ventana, cuánto, en qué orden y cuándo podar. Pones todo eso bien. **Y el agente, con el contexto perfecto, sigue decidiendo por su cuenta el qué y el cómo.** De ahí sale el siguiente peldaño.
