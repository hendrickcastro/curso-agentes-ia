# Transcripción · Día 1

> Texto extraído por OCR de las diapositivas (los PDF originales son imágenes y no permiten buscar). Puede contener erratas de reconocimiento; la referencia es siempre la imagen enlazada.

## Diapositiva 1

[imagen](diapositivas/dia1/01.jpg)

```text
Desarrollo de software
con lA
Una formación de dos días para
equipos que ya usan agentes.
Día 1
Vibecoding, contexto, RPI, garantías y guardarrailes.
540 - Formación • Dia 1 de 2 • 2026
```

## Diapositiva 2

[imagen](diapositivas/dia1/02.jpg)

```text
Indice
01  |  Intro
02 Vibecoding  |  19
03 Contexto  |  27
04  |  RPI  |  53
Garantías  |  62
06  |  Guardarrailes  |  76
```

## Diapositiva 3

[imagen](diapositivas/dia1/03.jpg)

```text
Cuatro frases...
Confianza  |  Desconfianza
«Yo ya uso Claude Code y voy mucho más rápido.  |  «Genero más código. No sé si eso es desarrollar mejor.»
Genero más código, así que más negocio.»
«Si ya voy rápido y voy bien, ¿qué más pasos hay?»  |  «No me fío de dejarlo solo. No vaya a ser que me la líe.»
...una misma respuesta.
```

## Diapositiva 4

[imagen](diapositivas/dia1/04.jpg)

```text
Pedirle código a
un agente no es
delegarle trabajo.
La tesis del curso
```

## Diapositiva 5

[imagen](diapositivas/dia1/05.jpg)

```text
Delegar cada vez mas.
Con garantias.
```

## Diapositiva 6

[imagen](diapositivas/dia1/06.jpg)

```text
Tres términos, un
significado cada uno
Cada uno se usa de varias formas. Aquí, de esta.
Proveedor / modelo / herramienta  |  Agente  |  Contexto
Anthropic es el proveedor, Claude el  |  Modelo más bucle más herramientas. Lee,  |  Todo lo que el agente sabe ahora mismo.
modelo, Claude Code la herramienta. Tres  |  decide, ejecuta y vuelve a leer.  |  Es finito: la mesa de trabajo.
capas y tres decisiones distintas, que se
confunden.
```

## Diapositiva 7

[imagen](diapositivas/dia1/07.jpg)

```text
El ecosistema
Rules  |  Skills  |  Hooks  |  Subagentes  |  MCPs
Instrucciones  |  Conocimiento y  |  Código que se  |  Un agente con  |  Conectan el
que el agente  |  pasos que carga  |  ejecuta en  |  contexto propio  |  agente con
carga siempre, o  |  solo cuando la  |  eventos del  |  al que le pasas  |  sistemas
al entrar en una  |  tarea los pide.  |  agente, le haga  |  una parte del  |  externos: Jira,
ruta.  |  caso o no.  |  trabajo.  |  bases de datos,
navegador.
Por debajo de todo
CLIs
Siempre han estado ahí. Lo nuevo es que ahora las usa la IA.
```

## Diapositiva 8

[imagen](diapositivas/dia1/08.jpg)

```text
¿Dónde estáis?
A mano alzada. Nadie está mal donde está
Escribes  |  Pides  |  Delegas
Tú escribes. La IA autocompleta o  |  Tú defines el qué y el cómo. La IA escribe.  |  Tú defines el qué. La IA decide el cómo.
responde dudas.  |  Tú lees todo.  |  Las garantías verifican.
De pedir a delegar hay menos distancia de la que parece. Y
más incomodidad.
```

## Diapositiva 9

[imagen](diapositivas/dia1/09.jpg)

```text
Qué cambia al delegar
El cómo  |  Verifica
Tú
Pedir  |  Tú
Dónde va, qué toca,
qué patrón sigue  |  Leyéndolo todo
El qué  |  Escribe
Tú  |  El agente
El cómo  |  Tú
Delegar  |  El agente  |  Sin leerlo entero, con
garantías
Si tienes que leerlo entero, no has delegado. Has pedido.
```

## Diapositiva 10

[imagen](diapositivas/dia1/10.jpg)

```text
¿Por qué con
personas sí funciona?
Con un compañero  |  Con un agente
Confianza acumulada  |  Cero historial
Sabes cómo trabaja  |  No sabes qué hará con lo que no le dijiste
Un plan a medias vale: rellena con criterio  |  Rellena con lo plausible, no con lo correcto
La revisión es por muestreo  |  El muestreo no vale
Lo que era implícito tiene que ser explícito: un contrato antes
y una verificación mecánica después.
```

## Diapositiva 11

[imagen](diapositivas/dia1/11.jpg)

```text
LalA replica y amplifica lo
que encuentra.
Si encuentra tests, arquitectura y convenciones, produce
código que encaja. Si encuentra desorden, produce
desorden más rápido.
El techo no lo pone el modelo. Lo pone vuestro
repositorio.
```

## Diapositiva 12

[imagen](diapositivas/dia1/12.jpg)

```text
La escalera de fallos
Del primer vibecoding a cómo hacemos software nosotros.
Cada peldaño resuelve un problema y crea el siguiente.
•
Vibecoding
Pido a ciegas y acepto lo que sale, que parece plausible.
Contexto
Ya conoce mi código, pero el qué y el cómo los sigue
decidiendo él.
•
RPI
El plan es mío, pero para saber si el código está bien lo leo
entero.
```

## Diapositiva 13

[imagen](diapositivas/dia1/13.jpg)

```text
La escalera de fallos
•
Garantías
Ya no leo, verifico: que funciona y que se podrá mantener. Pero
son once comprobaciones y las aplico a mano.
Guardarrailes
Rules y hooks: el criterio deja de depender de mi memoria.
Fijado y repetible, pero lo conduzco yo.
MRRA
```

## Diapositiva 14

[imagen](diapositivas/dia1/14.jpg)

```text
La escalera de fallos
•
El sistema
Skills, subagentes y el harness que lo ata todo. Desatendido y
barato, y el cuello de botella se ha movido de sitio.
Especificación
Construye casi cualquier cosa; la pregunta cara pasa a ser qué
le pido y cómo sabrá que ha terminado. Pero sigo teniendo
encima todo lo que produce.
```

## Diapositiva 15

[imagen](diapositivas/dia1/15.jpg)

```text
La escalera de fallos
•
Verificación
Quince PRs que no he visto escribir, y leerlos todos no escala.
Decido cuáles merecen mis ojos y el resto entra solo. Pero todo
eso vive en mi máquina y en mi cabeza.
Y el último ya no es técnico
Nada de esto aguanta si es de una sola persona. Falta llevarlo al
equipo.
```

## Diapositiva 16

[imagen](diapositivas/dia1/16.jpg)

```text
Antes y después
Antes del curso  |  Después del curso
«Uso Claude Code.»  |  «Sé desarrollar software con agentes.»
«Consigo que genere  |  «Sé qué delegar, cómo dirigirlo y cómo comprobar automáticamente
muchísimo código.»  |  que está bien.»
«Voy probando cosas que vec  |  «Tengo un modelo mental y un método.»
por X.»
«Mi equipo experimenta con IA.»  |  «Tengo criterio para decidir, como equipo, cómo desarrollamos
con IA.»
```

## Diapositiva 17

[imagen](diapositivas/dia1/17.jpg)

```text
Antes de empezar
Qué no es esto  |  Cómo trabajamos
Un tutorial de Claude Code, Cursor o Codex.  |  Vuestra herramienta y vuestro lenguaje.
Una colección de prompts.  |  Prácticas cortas por parejas de la misma herramienta, y
puesta en común.
Una introducción a la IA.
Preguntad cuando surja, no al final.
```

## Diapositiva 18

[imagen](diapositivas/dia1/18.jpg)

```text
¿Dónde estaba el
cuello de botella?
Antes de la IA
Descubrimiento
Operación  |  Especificación
Fase 04
Implementación
Escribir el código era lo caro. Todo lo demás se
Entrega  |  Diseño  |  dimensionaba alrededor de cuánto tardaba el
equipo en construir.
Verificación  |  Implementación
```

## Diapositiva 19

[imagen](diapositivas/dia1/19.jpg)

```text
Vibecoding
```

## Diapositiva 20

[imagen](diapositivas/dia1/20.jpg)

```text
Donde nace el término
«Hay un nuevo tipo de programación que llamo vibe
coding, donde me dejo llevar del todo por las vibras,
abrazo las exponenciales y olvido que el código siquiera
existe.»
Andrej Karpathy, 2 de febrero de 2025. Él mismo lo llamó
después «un tuit desechable de ducha».
```

## Diapositiva 21

[imagen](diapositivas/dia1/21.jpg)

```text
Describir en lenguaje natural
lo que quieres y aceptar el
código sin leerlo.
Iterando sobre el comportamiento observado en vez de
sobre el código.
```

## Diapositiva 22

[imagen](diapositivas/dia1/22.jpg)

```text
El bucle de cinco pasos
Describes  |  →  |  Aceptas sin revisar  |  →  |  Ejecutas  |  →  |  Pegas el error  |  →  |  Vuelves al tres
Leer el código
```

## Diapositiva 23

[imagen](diapositivas/dia1/23.jpg)

```text
Dos condiciones
No revisas el código  |  Software desechable
Si lees los diffs y los apruebas uno a uno, eso es otra cosa y  |  Proyectos de fin de semana, prototipos, cosas que no van a
tiene otro nombre.  |  producción y que nadie va a mantener.
```

## Diapositiva 24

[imagen](diapositivas/dia1/24.jpg)

```text
Práctica • En parejas •
10 minutos
Clonad github.com/540/ai-development-trainingy
trabajad sobre la rama base: una Pokédex en React sobre
PokéAPl.
El prompt
Añade al proyecto web una tabla
interactiva con las ventajas y
desventajas entre todos los tipos de
Pokémon.
```

## Diapositiva 25

[imagen](diapositivas/dia1/25.jpg)

```text
Vibecodear sale barato mientras el
código se puede tirar
El día que el prototipo se queda y hay que seguir
manteniéndolo y evolucionándolo, la factura llega de
golpe: nadie entiende lo que hay, nadie puede estimar un
cambio, y el único que sabía algo del sistema era un
modelo que ya no tiene esa conversación abierta.
```

## Diapositiva 26

[imagen](diapositivas/dia1/26.jpg)

```text
Cuando lo vibecodeado
se queda, tanto
tú como el agente
necesitáis ayuda.
En cuanto tiene que evolucionarse y mantenerse, el agente
necesita saber cosas que no están ni en tu prompt ni en su
cabeza. A ese «lo que necesita saber» le llamamos contexto, y
resulta que es lo que peor gestionamos todos.
```

## Diapositiva 27

[imagen](diapositivas/dia1/27.jpg)

```text
El Contexto
```

## Diapositiva 28

[imagen](diapositivas/dia1/28.jpg)

```text
El contexto es todo el estado
disponible para el modelo en
el momento de la inferencia.
No es tu mensaje. Tu mensaje es una fracción pequeña, y
a menudo la más pequeña de todas.
```

## Diapositiva 29

[imagen](diapositivas/dia1/29.jpg)

```text
Por qué no es
prompt engineering
La diferencia es temporal
El prompt  |  El contexto
Algo que escribes una vez y reutilizas. Una frase.  |  Se decide cada vez que se llama al modelo. En una sesión
de agente eso son decenas o cientos de veces, y tú solo
escribiste la primera.
```

## Diapositiva 30

[imagen](diapositivas/dia1/30.jpg)

```text
Un presupuesto de
atención, no un almacén.
Cada token compite por la atención del modelo: no se acumula, se reparte. Meter algo irrelevante no es neutro.
```

## Diapositiva 31

[imagen](diapositivas/dia1/31.jpg)

```text
Anatomía del contexto
Cinco partidas con comportamientos distintos. Lo que importa
es la tercera columna.
Componente  |  Qué es  |  Comportamiento
System prompt  |  Instrucciones permanentes  |  Fijo, presente en todas las llamadas
del agente
Definiciones de  |  Qué puede hacer el agente  |  Fijo, y mucho más grande de lo que
herramientas  |  y cómo  |  nadie estima
Documentos  |  Ficheros leídos, búsquedas,  |  Crece por acumulación, rara vez
recuperados  |  documentación  |  se limpia
Historial de mensajes  |  Toda la conversación previa  |  Crece dos veces por cada acción
Salidas de herramientas  |  Resultados de cada ejecución  |  Suele ser lo que más ocupa
```

## Diapositiva 32

[imagen](diapositivas/dia1/32.jpg)

```text
La mayor parte de tu
ventana no la escribiste tú.
Se acumuló sola. La ventana del turno treinta es un artefacto
que nadie diseño.
System prompt  |  System prompt  |  System prompt  |  System prompt
Herramientas  |  Herramientas  |  Herramientas  |  Herramientas
Tu mensaje
60 %
Turno 1  |  Turno 5  |  Turno 15  |  Turno 30
Fijo  |  Lo que escribiste tú O Salidas de herramientas  |  • Respuestas del agente
Redibujado a partir de HumanLayer, Context forking to save time, trouble and tokens.
```

## Diapositiva 33

[imagen](diapositivas/dia1/33.jpg)

```text
Cantidad vs. calidad
Ventana nominal  |  Capacidad efectiva
El número que anuncia el proveedor: 200K, 1M. Es un limite  |  Materialmente menor que la nominal, y depende de la tarea.
duro, y superarlo es un error, no una degradación.  |  Context Rot: el rendimiento cae al crecer el input incluso en
tareas triviales
```

## Diapositiva 34

[imagen](diapositivas/dia1/34.jpg)

```text
La curva en U
Lost in the Middle, Liu et al., 2023
Recall
20 a 30 puntos menos
cuando el documento relevante
cae en el centro
principio  |  medio  |  final
Nunca pongas una restricción crítica en medio de un prompt
largo. El fallo parecerá desobediencia cuando es geometría.
```

## Diapositiva 35

[imagen](diapositivas/dia1/35.jpg)

```text
Las cuatro formas de fallar
Qué le pasa a la ventana, y cómo lo ves desde fuera
Poisoning  |  Distraction
Un error entra en la ventana y se sigue usando como si  |  La ventana crece tanto que el modelo copia del historial
fuera verdad. Se inventa usePokemonTypes ( ). Se lo  |  en vez de pensar. Tras dos horas con el mismo bug, repite
:orriges, pero cada fichero nuevo lo vuelve a importar: €  |  pasos que ya probasteis y no funcionaron. Con l
nombre falso sigue ahí, repetido, y pesa más que t  |  conversacion tan lagarteo a a lizo en lared
corrección.
Confusion  |  Clash
Hay información que sobra, y el modelo la usa porque  |  Dos partes de la ventana se contradicen y el modelo
está ahí. Tienes cargado el MCP de la base de datos y le  |  elige la que no es. Arregláis juntos el daño contra Pokémon
pides cambiar un texto de la interfaz. Acaba lanzando una  |  de dos tipos. Una hora después lo reescribe como estaba:
consulta que nadie le pidió.  |  la versión vieja sigue más arriba en el hilo, y la toma por
buena.
Esto convierte «el agente se está portando raro» en un
diagnóstico con nombre.
```

## Diapositiva 36

[imagen](diapositivas/dia1/36.jpg)

```text
El primer prompt no es una
pregunta. Es una decisión de
arquitectura.
La interpretación que el modelo hace de tu primer
prompt fija una trayectoria de la que ya no se sale: todo
lo que viene después se construye encima, incluidos los
errores.
```

## Diapositiva 37

[imagen](diapositivas/dia1/37.jpg)

```text
Cómo medir el contexto
Nivel 1  |  Nivel 2  |  Nivel 3
Ocupación  |  Composición  |  Degradación
¿Cuánto llevo gastado?  |  ¿En qué me lo he gastado?  |  ¿Se está estropeando?
```

## Diapositiva 38

[imagen](diapositivas/dia1/38.jpg)

```text
Nivel 1 • ¿Cuánto
llevo gastado?
Herramienta  |  Cómo verlo
Claude Code  |  /context: desglose por componente, más el porcentaje en la barra
Codex  |  / status: porcentaje libre y tokens usados. / statusline lo fija en el pie.
Sin desglose
Cursor  |  Anillo junto al prompt. Al pulsarlo, desglose por categoría: tools, rules, skills,
MCP, conversación
Copilot (VS  |  Anillo en la entrada del chat. Al pasar el ratón, tokens usados sobre el máximo
Code)  |  y desglose
Al 60 % de la ventana compactas o abres sesión nueva. Si la
ventana es de un millón, antes de unos 150.000 tokens. No
esperas al límite: al llegar al 100% la herramienta compacta de
urgencia y decide ella qué tira.
```

## Diapositiva 39

[imagen](diapositivas/dia1/39.jpg)

```text
540  |  Mismo mensaje,
mismo trabajo
Con cuatro MCP cargados, la tarea empieza al otro lado del
umbral antes de que escribas nada.
Sin MCP  |  Con cuatro MCP
System prompt  |  System prompt
CLAUDE.md  |  CLAUDE.md
Herramientas del agente  |  Herramientas del agente
«Actualiza el esquema de pedidos»
Read  |  MCP de GitHub
Read
Edit
Bash
«Listo para revisar»  |  MCP de Linear
MCP de la base de datos
MCP del navegador
60%
«Actualiza el esquema de pedidos»
Read
Read
Edit
Bash
«Listo para revisar»
Fijo • Definiciones de MCP  |  Tu mensaje  |  • Salidas de herramientas  |  • Respuesta
Redibujado a partir de HumanLayer, Skill issue: harness engineering for coding agents.  |  39 / 86
```

## Diapositiva 40

[imagen](diapositivas/dia1/40.jpg)

```text
Nivel 2 • ¿En qué
me lo he gastado?
Demo en vivo: un /context real de una sesión larga. Antes de
mirar los números: ¿en qué creéis que se va?
/context
Context Usage
• ggg  |  Opus 5.5 (1M context)
eggg  |  claude-opus-5-5 [1m]
0003 03  |  175.3k/1m tokens (18%)
1003 0303  |  Estimated usage by category
e System prompt: 2.2k tokens (0.2%)
e System tools: 14.9k tokens (1.5%)
e Custom agents: 4.2k tokens (0.4%)
5 03  |  e Memory files: 1.9k tokens (0.2%)
e Skills: 9.9k tokens (1.0%)
e Messages: 142.7k tokens (14.3%)
El Free space: 791.1k (79.1%)
• Autocompact buffer: 33k tokens (3.3%)
Auto-compact window: 1m tokens
MCP tools  |  • /mcp (loaded on-demand)
L 157 tools • 0 tokens
Custom agents  |  . claude/agents/
21 agents • 4.2k tokens
• /memory
1.9k tokens
Skills  |  • /skills
L 142 skills • 9.9k tokens
```

## Diapositiva 41

[imagen](diapositivas/dia1/41.jpg)

```text
Nivel 3 • ¿Se
está estropeando?
No hay contador. Se detecta por síntomas.
Lo que ves  |  Qué es  |  Qué haces
Insiste en una función o  |  Poisoning  |  No lo corrijas en el hilo: el error ya está referenciado
fichero que no existe  |  Rebobina a antes de que entrara; si no sabes cuándo entró,
sesión nueva
Empeora según avanza,  |  Distraction  |  Compactar
se vuelve genérico
Te reintroduce un bug  |  Clash  |  Sesión nueva, y la corrección en la spec, no en el chat
que ya arreglasteis
Ignora una restricción  |  Posición  |  Reponerla al final del prompt actual
que diste al principio
Si tienes que repetirle algo por segunda vez, no es que no te
haya entendido. Es que el contexto está saturado. Repetirlo por
tercera vez no lo arregla.
```

## Diapositiva 42

[imagen](diapositivas/dia1/42.jpg)

```text
Cuatro principios
Qué entra  |  Donde va
Solo lo que cambia la respuesta  |  Colocación consciente de la posición
Si lo quitas y el agente haría lo mismo, sobra. Lo demás, que  |  Restricciones críticas, formato de salida y guardarrailes van
lo busque cuando lo necesite.  |  al principio o al final. Nunca enterrados en medio.
Con cuánto detalle  |  Cada turno
Divulgación progresiva  |  Curación iterativa
Nombres y descripciones al arrancar; contenido completo  |  No escribas el CLAUDE.md pensando en todo lo que podría
solo cuando algo se activa. Y si se activa, cárgalo entero.  |  salir mal. Empieza con lo mínimo y añade una regla cada vez
que veas ala al a ente aue la raya era poder senalar
```

## Diapositiva 43

[imagen](diapositivas/dia1/43.jpg)

```text
Reducir lo que entra
Principio 1 • Solo lo que cambia la respuesta
Pide el trozo, no el fichero  |  Menos herramientas  |  Nombres que se explican
La función que vas a tocar, no el fichero  |  Cada una ocupa sitio en todos los  |  tarifas_clientes. json se encuentra
entero. El fichero, no el repositorio.  |  mensajes. Y con muchas, el agente duda  |  sin abrirlo. data/filel. json hay que
cuál usar.  |  abrirlo para saber qué es.
```

## Diapositiva 44

[imagen](diapositivas/dia1/44.jpg)

```text
Colocar bien lo que entra
Principio 2 • Colocación consciente de la posición
Lo que pides, al final  |  CLAUDE.md corto y por secciones  |  Cada regla con su porqué
Pega arriba el log o el fichero. Debajo, la  |  Encabezados y viñetas. Si ignora una regla  |  «Sin any: rompe el tipado de la API» guía
petición y lo que no se puede saltar.  |  que está escrita, sobra texto alrededor.  |  mejor que «NUNCA uses any».
```

## Diapositiva 45

[imagen](diapositivas/dia1/45.jpg)

```text
Diferir la carga
Principio 3
Notas estructuradas  |  Sub-agentes  |  Ficheros como memoria
El agente escribe fuera de la ventana y  |  Ventana limpia que devuelve 1.000 a  |  El sistema de ficheros es contexto que no
relee cuando lo necesita.  |  2.000 tokens destilados en vez de toda la  |  paga tokens hasta que se lee.
exploración.
Los sub-agentes no son gratis: un sistema multiagente
consume casi cuatro veces los tokens de un hilo único.
Compran aislamiento, no ahorro.
```

## Diapositiva 46

[imagen](diapositivas/dia1/46.jpg)

```text
540  |  Un sub-agente es
un cortafuegos
Tu sesión solo ve lo que pidió y lo que le devuelven. Las
búsquedas se quedan al otro lado.
Tu sesión  |  Sub-agente
System prompt  |  System prompt
Herramientas  |  Herramientas
«Cambia el esquema de pedidos»  |  pide  |  «¿Dónde se define el esquema?»
Sub-agente: ¿dónde se define?  |  Glob
Grep
src/pedidos/esquema.ts:42  |  X--  |  Read
Edit  |  Grep
«Hecho»  |  no pasa  |  Read
Bash
X---  |  Read
Grep
devuelve  |  Read
Read
Bash
Grep
src/pedidos/esquema.ts:42
Cortafuegos
de contexto
Lo que vuelve lo decides tú: pide el formato exacto, con rutas y
líneas. Si no, te devuelve su exploración entera.  |  46 / 86
Redibujado a partir de HumanLayer, Skill issue: harness engineering for coding agents.
```

## Diapositiva 47

[imagen](diapositivas/dia1/47.jpg)

```text
Podar lo acumulado
Principio 4 • de lo que menos tira a lo que más
Observation masking  |  Compactación  |  Rebobinar  |  Sesión nueva
Sustituir salidas de  |  Resumir la conversación y  |  Volver a un mensaje anterior  |  La opción nuclear, y la
herramientas ya procesadas  |  seguir en una ventana limpia.  |  y reescribirlo con lo que ya  |  correcta ante clash, o ante
por un resumen o una  |  El arte está en qué se  |  sabes. Conservas el contexto  |  poisoning cuando no sabes
referencia. La opción de  |  descarta: hazlo tú antes de  |  bueno y tiras solo lo que vino  |  en qué turno entró el error.
menor riesgo para empezar.  |  que lo haga la herramienta.  |  después.
Rebobinar es la corrección que no ensucia: en lugar de decir
«no, así no» en el hilo, reescribes el mensaje que lo provocó. Las
cuatro herramientas lo tienen.
```

## Diapositiva 48

[imagen](diapositivas/dia1/48.jpg)

```text
Compactar tú, en vez
de corregir en el hilo
«Escribe en progress.md el objetivo, el enfoque, los pasos
hechos y el fallo actual» Y sesión nueva.
Corregir en el hilo  |  Compactar tú  |  Ventana limpia
System prompt  |  System prompt
Herramientas  |  Herramientas
«Implementa el reembolso»  |  «Lee progress.md y sigue»
Read
progress.md
«No, así no. Usa la cola»
progress.md
60 %  |  escrina  |  Objetivo  |  relee  |  - 60%
«Tampoco. Vuelve a probar»  |  >  |  Enfoque
Pasos hechos
Fallo actual
«Sigue fallando el test»
Redibujado a partir de HumanLayer, Advanced Context Engineering for Coding Agents.
```

## Diapositiva 49

[imagen](diapositivas/dia1/49.jpg)

```text
El contexto no se
escribe: se acumula.
La disciplina consiste en decidir qué acumulas.
```

## Diapositiva 50

[imagen](diapositivas/dia1/50.jpg)

```text
Cinco mensajes clave
La tarjeta que os lleváis
01  |  El contexto es un presupuesto de atención, no un almacén. Cada token compite
con los demás.
o2 La ventana nominal no es la capacidad efectiva. Caber no es suficiente.
03 Lo que está en medio se pierde. Lo crítico va arriba o abajo.
04  |  Si tienes que repetir algo por segunda vez, el contexto está saturado. Mide antes
de insistir.
Restar suele ganar a sumar. Veinte veces más contexto puede rendir peor.
```

## Diapositiva 51

[imagen](diapositivas/dia1/51.jpg)

```text
Práctica • En parejas •
10 minutos
Mismo repositorio, rama contexto: la misma Pokédex, ahora
con capas, un AGENTS. md y un CONTEXT. md con el
conocimiento del negocio.
2 minutos  |  5 minutos  |  3 minutos
Arrancad  |  El mismo prompt  |  El cotejo
git switch contexto, popm install  |  Lanzad el mismo prompt y fijaos en qué
y popm dev. Echad un vistazo al  |  ficheros lee antes de escribir.
AGENTS.md.
El prompt
Añade al proyecto web una tabla
interactiva con las ventajas y
desventajas entre todos los tipos de
Pokémon.
```

## Diapositiva 52

[imagen](diapositivas/dia1/52.jpg)

```text
Con el contexto perfecto,
sigue decidiendo
por su cuenta.
Ya sabes qué meter en la ventana, cuánto, en qué orden
y cuándo podar. Pones todo eso bien. Y el agente, con el
contexto perfecto, sigue decidiendo por su cuenta el qué y
el cómo.
```

## Diapositiva 53

[imagen](diapositivas/dia1/53.jpg)

```text
Ya le habéis dado todo el
contexto. Y aun así decide por
su cuenta el qué y el cómo.
RPI: Research, Plan, Implement
```

## Diapositiva 54

[imagen](diapositivas/dia1/54.jpg)

```text
Lo que el agente ya hace solo
Lee el código antes de tocarlo  |  Planifica por dentro  |  Se le ocurren los casos límite
Los agentes modernos ya lo hacen, y cada  |  No hace falta obligarlo a pensar antes.  |  Y te avisa de lo que ya ha decidido.
versión lo hace mejor.
Si tu motivo para usar RPI es que el modelo piensa mejor así, la
próxima versión te quitará la razón.
```

## Diapositiva 55

[imagen](diapositivas/dia1/55.jpg)

```text
El plan es lo único que
puedes revisar antes de que
exista el código.
Revisar un plan cuesta minutos; revisar el diff que sale de
él, una tarde.
Es el último momento en que decir que no sale barato.
```

## Diapositiva 56

[imagen](diapositivas/dia1/56.jpg)

```text
Tres fases, definidas por
lo que tienen prohibido
Lo que hacen es obvio. Lo que se saltan es lo que tienen
prohibido.
Research  |  Plan  |  Implement
No propone soluciones. No escribe  |  No escribe código. No deja decisiones  |  No toma decisiones. Si se topa con una,
código.  |  abiertas.  |  para y pregunta.
```

## Diapositiva 57

[imagen](diapositivas/dia1/57.jpg)

```text
El techo del research es el
repositorio.
El agente puede investigar tu código perfectamente y
seguir sin saber que una consulta se ejecuta en cada
carga de la home, que hay clientes con diez mil pedidos,
o que los datos de hace dos años están en otro sistema y
cuestan dinero.
Eso no está en ningún fichero. Está en la cabeza de
alguien de tu empresa, y el único sitio por donde puede
entrar es el plan.
```

## Diapositiva 58

[imagen](diapositivas/dia1/58.jpg)

```text
El reparto de tiempo
es contraintuitivo
Research  |  Plan  |  Implement
Aqui se va tu tiempo  |  Y aquí también  |  Poco tiempo tuyo: se
delega entera
Si pasas la mayor parte del tiempo implementando, no has
delegado. Has pedido.
```

## Diapositiva 59

[imagen](diapositivas/dia1/59.jpg)

```text
Práctica • En parejas •
10 minutos
Mismo repositorio, rama rpi: la Pokédex con capas,
AGENTS. md y CONTEXT. md. El mismo prompt, esta vez por
fases. Antes de empezar, fijad el modelo y el nivel de esfuerzo,
y apuntadlos.
3 minutos  |  4 minutos  |  3 minutos
Research  |  Plan  |  Implement
Pedidle que investigue lo necesario para la  |  con lo investigado, que escriba el plar  |  Que implemente el plan corregido. No
tarea, sin proponer soluciones y sin  |  todavía sin código. Parad en el plar  |  hace falta que acabe
escribir código.  |  revisadlo y corregid lo que haga falta.
El prompt
Añade al proyecto web una tabla
interactiva con las ventajas y
desventajas entre todos los tipos de
Pokémon.
```

## Diapositiva 60

[imagen](diapositivas/dia1/60.jpg)

```text
Debate
10 minutos
¿Qué habéis corregido en el plan?  |  ¿En qué momento habríais podido decir que no?
Lo que el agente decidió por su cuenta sin preguntaros.  |  Con un plan delante, antes de que existiera una línea de
código. Sin él, leyendo el dift de contexto.
¿Corrigieron menos en el plan las parejas con el  |  ¿Qué restricción de vuestro trabajo no está escrita en
modelo más caro o el esfuerzo más alto?  |  ningún sitio?
Sale parecido. Más esfuerzo mejora el plan, pero no levanta  |  Casi siempre hay una, y suele ser la más cara.
el techo del research. Si pagas esfuerzo caro, gástalo en el
plan, no en implementar.
```

## Diapositiva 61

[imagen](diapositivas/dia1/61.jpg)

```text
El plan era bueno y el
código parece correcto.
¿Cómo sé que lo está?
Si lo leo entero, no he delegado nada.
```

## Diapositiva 62

[imagen](diapositivas/dia1/62.jpg)

```text
Parecer correcto no basta,
y leerlo entero no escala.
Garantías
```

## Diapositiva 63

[imagen](diapositivas/dia1/63.jpg)

```text
¿Qué tendría que existir para
que lo aceptaras sin leerlo,
hoy y dentro de un año?
Si para aceptarlo tienes que leerlo entero, has cambiado
el trabajo de escribir por el de leer.
AR RA
```

## Diapositiva 64

[imagen](diapositivas/dia1/64.jpg)

```text
No es una herramienta.
Es una red.
Once comprobaciones que miran cosas distintas; ninguna sustituye a las demás.
Van de la más asentada a la más abierta.
```

## Diapositiva 65

[imagen](diapositivas/dia1/65.jpg)

```text
Terreno firme
Lo que ya no discute nadie
Formateo  |  Linting  |  Cobertura con umbral
uita el ruido del diff para que si  |  os criterios que se comprueb  |  Mide qué código no ejercita ningún
jea el cambio de verdad. La más  |  yendo el código sin ejecutar  |  test; si baja del listón, el build falla.
barata de las once.
ESLint Oxlint  |  coverageThreshold de Jest
Prettier  |  Biome  |  check-coverage de c8
Duplicación estructural  |  Arquitectura y  |  Mutation testing
Lo mismo escrito en cuatro sitios se  |  dependencias  |  ¿Detectan mis tests un cambio en el
va a corregir en tres.  |  código? La única de las once que
onteras entre capas y ausencia
clos verificadas por u  |  dice si la suite protege algo.
jscpd  |  SonarQube  |  herramienta.
StrykerJS
dependency-cruiser  |  umbral en thresholds. break
madge --circular
```

## Diapositiva 66

[imagen](diapositivas/dia1/66.jpg)

```text
Maduro, pero hay que elegir
El concepto está claro; la herramienta la elige cada equipo
Métricas de calidad del  |  Calidad del código de
código  |  test
Complejidad, tamaño, acoplamiento.  |  El test también es código y también
La más rentable para empezar: el  |  se pudre. El concepto está claro y
riesgo CRAP, que cruza complejidad  |  las herramientas escasean: cas
con cobertura. Cada equipo elige  |  todo recae en el acuerdo de equipo
dos o tres y las pone en un umbral.  |  y en la revisión.
complexity de ESLint  |  eslint-plugin-jest
SonarQube  |  eslint-plugin-vitest
El acuerdo que no está en ninguna herramienta es folklore.
Funcionaba mientras quien escribía el código se sentaba en la
misma reunión en la que se acordó. El agente no estuvo en
esa reunión.
```

## Diapositiva 67

[imagen](diapositivas/dia1/67.jpg)

```text
El frente abierto:
la especificación
Lo que se está inventando ahora mismo
Comportamiento  |  Mutación de la  |  Proceso spec-first
funcional  |  especificación  |  Comprueba si la especificación
existió antes que el código o se
El comportamiento especificado  |  Si cambio un dato del criterio de
fuera del código y verificado contra  |  aceptación, ¿falla algún test?  |  escribió después para justificarlo.
la aplicación real.  |  Detecta criterios decorativos. No
hay herramienta estándar.  |  Sin herramienta
Cucumber js  |  Playwright
Script propio
Cuando el código sale en minutos y lo escribe el agente, lo que
revisas deja de ser el código y pasa a ser lo que pediste. La
especificación asciende a artefacto principal, y llega sin nada
del instrumental que el código sí tiene.
```

## Diapositiva 68

[imagen](diapositivas/dia1/68.jpg)

```text
De la prosa al invariante.
Una máquina puede verificar una precondición; un
párrafo, no. Ahí se está trabajando ahora, y casi todo
sigue en beta o en papers.
Lo que se puede hacer hoy es más modesto: escribir el
criterio antes que el código, y comprobar de vez en
cuando que el test se cae si el criterio cambia.
BARRA
```

## Diapositiva 69

[imagen](diapositivas/dia1/69.jpg)

```text
Cuándo se ejecuta
cada garantía
El momento bueno no es el más temprano posible: es el más
temprano en el que la comprobación compensa lo que cuesta.
Momento  |  Qué cabe ahí  |  Por qué ahí
Antes de escribir  |  Que la especificación existe, con  |  Es lo único que tiene sentido
el código  |  criterios de aceptación que se  |  mirar cuando todavía no
puedan comprobar  |  hay código
Al guardar un fichero  |  Formateo y linting  |  Milisegundos, y solo mira lo que
acabas de tocar
Cuando el agente  |  Lo mismo, pero el aviso le llega a él  |  Es el único momento en que se
termina de escribir  |  corrige solo, sin gastar tu tiempo
Antes de confirmar  |  Tests del área tocada, umbrales sobre  |  Segundos, y todavía no lo ha
el cambio  |  lo nuevo  |  visto nadie más
Antes de publicarlo  |  Suite rápida completa, fronteras y ciclos  |  Minutos, y es el último momento
en que sigue siendo privado
En la integración  |  Cobertura, mutación, duplicación  |  Tarda, y aquí ya no hay nadie
esperando delante
Al cerrar la sesión  |  La red entera, como criterio  |  Es donde decides si esto se
del agente  |  de aceptación  |  acepta o se lee entero
```

## Diapositiva 70

[imagen](diapositivas/dia1/70.jpg)

```text
Si avisa pero no
detiene, no es una
garantía. Es un informe.
Ejecutarla tolerando el fallo cuesta lo mismo y no protege igual. Lo único que compra es la tranquilidad de creerse cubierto.
```

## Diapositiva 71

[imagen](diapositivas/dia1/71.jpg)

```text
Una garantía que solo existe
dentro de tu IDE no es una
garantía.
Si no se puede invocar desde la línea de comandos, el
agente no puede ejecutarla ni saber si la ha pasado. Y tú
no puedes colgarla de ninguno de esos momentos, ni
meterla en el sistema que montamos mañana.
```

## Diapositiva 72

[imagen](diapositivas/dia1/72.jpg)

```text
Autodiagnóstico •
En parejas • 8 minutos
Sobre vuestro propio repositorio, de memoria y sin abrir nada.
Comprobación  |  ¿existe?  |  ¿En qué momento se ejecuta?  |  ¿Detiene el trabajo o solo avisa?
Cobertura con umbral
Arquitectura y dependencias
Mutation testing
Comportamiento funcional
Si tenéis que ir a mirarlo, ya tenéis la respuesta. Una
comprobación que detiene el trabajo se nota, porque alguien
se queja de ella.
```

## Diapositiva 73

[imagen](diapositivas/dia1/73.jpg)

```text
«Esto no va conmigo. Mi repositorio lleva
ocho años y no cumple nada.»
Justo para eso existe lo que viene ahora.
```

## Diapositiva 74

[imagen](diapositivas/dia1/74.jpg)

```text
El ratchet
Una carraca: deja girar en un sentido y bloquea el otro.
Mides hoy  |  Lo viejo pasa, lo nuevo detiene  |  La línea solo baja
Tomas el número que salga como línea de  |  Las violaciones que ya estaban pasan; una  |  La reescribe la propia comprobación
partida y lo declaras aceptable. No es  |  nueva detiene el trabajo. Todo lo que salta  |  cuando alguien deja un fichero viejo mejor
aprobar la deuda, es dejar de discutirla.  |  es de hoy.  |  de lo que estaba. Un ratchet que lleva un
año sin moverse es la misma deuda con
un certificado.
Para un agente, el ratchet es la frontera que le dice qué parte
del repositorio puede tocar sin preguntar. Con el listón
completo sobre un proyecto viejo le estás pidiendo que
reforme el proyecto entero, y lo va a intentar.
```

## Diapositiva 75

[imagen](diapositivas/dia1/75.jpg)

```text
Sé qué garantizar
y cuándo. Pero
soy yo quien se
acuerda de lanzarlas.
Son once comprobaciones, hay que aplicarlas en cada cambio,
y eso a mano no se sostiene. El bloque siguiente automatiza
una de ellas de punta a punta, el linting, para montar el
mecanismo completo con las manos.
```

## Diapositiva 76

[imagen](diapositivas/dia1/76.jpg)

```text
Lo que depende de
acordarse, un día se olvida.
Guardarrailes
```

## Diapositiva 77

[imagen](diapositivas/dia1/77.jpg)

```text
El criterio es el de tu equipo,
no el mío.
El ejemplo de hoy: las vistas no llaman a la API; los datos
llegan por pokemonService. Si tu equipo pone esa
frontera en otro sitio, el mecanismo es idéntico.
Lo que se codifica es el acuerdo.
```

## Diapositiva 78

[imagen](diapositivas/dia1/78.jpg)

```text
Tres escalones
El prompt  |  Las rules  |  El hook
Se lo pides y obedece. A la  |  Lo escribes una vez en el fichero  |  Un programa revisa cada fichero
tercera petición vuelve a llamar a  |  de reglas. Es sistemático, y es un  |  en cuanto el agente lo escribe y,
la API desde una vista.  |  avance real.  |  si incumple el criterio, lo obliga a
Hay que decirlo siempre, y cada  |  Sigue siendo una instrucción que  |  corregirlo.
persona lo dice a su manera.  |  el modelo pondera junto a las  |  No pondera, no interpreta, no
demás.  |  tiene días buenos y días malos.
Claude Code, Codex y Copilot:
código 2 y el motivo en
stderr
```

## Diapositiva 79

[imagen](diapositivas/dia1/79.jpg)

```text
No puedes demostrar
que no fallan.
Las rules son probabilísticas, así que el problema no es que fallen a veces. Un guardarrail cuya efectividad no puedes
demostrar no es un guardarrail.
```

## Diapositiva 80

[imagen](diapositivas/dia1/80.jpg)

```text
Dos ficheros de rules
para cuatro herramientas
Los hooks han convergido en los eventos, no en el sitio. Los de
Copilot están en Preview.
Herramienta  |  Rules  |  Hook
Claude Code  |  CLAUDE.md  |  •claude/settings. json • PostToolUse y Stop
Codex  |  AGENTS. md  |  .codex/hooks. json • PostToolUse y Stop
Cursor  |  AGENTS. md  |  •cursor/hooks. json postToolUse y stop
Copilot (VS Code)  |  AGENTS. md  |  • github/hooks/*. json • PostToolUse y Stop (Preview)
```

## Diapositiva 81

[imagen](diapositivas/dia1/81.jpg)

```text
Práctica • En parejas •
15 minutos
Mismo repositorio, rama guardarrailes: la misma Pokédex
con linters, tests y hooks. Los de git se ejecutan al hacer
commit y al hacer push; los del agente, cada vez que edita un
fichero.
3 minutos  |  8 minutos  |  4 minutos
Arrancad  |  El mismo prompt  |  El cotejo
git switch guardarrailes,  |  _anzad el prompt y fijaos en cuándo l  |  Comparad con lo que salió en contexto:
pnpm instally papm verify.  |  para un hook y qué hace despué  |  qué hooks saltaron, qué le obligaron a
cambiar y por dónde acabó yendo el
código.
El prompt
Añade al proyecto web una tabla
interactiva con las ventajas y
desventajas entre todos los tipos de
Pokémon.
```

## Diapositiva 82

[imagen](diapositivas/dia1/82.jpg)

```text
Debate
10 minutos, en este orden
¿Cuántas veces lo paró un hook y  |  ¿Qué regla del fichero de rules  |  La sorpresa
qué hizo con el error?  |  cumplió sin que hiciera falta e
look, y cuál solo porque el hook k  |  Todo en verde, ¿y la tabla está bien? Los
Nadie tuvo que leer el aviso: lo leyó el  |  paró?  |  linters no saben de Pokémon.
agente y lo corrigió.
A unas parejas les pasó una cosa y a otras
otra: eso es lo que significa probabilístico.
```

## Diapositiva 83

[imagen](diapositivas/dia1/83.jpg)

```text
Un guardarrail determinista
no es un guardarrail completo
Sus agujeros no avisan: por ahí el cambio pasa sin que nadie lo
mire.
Solo mira lo que conoce  |  Sin ruta, no decide
Revisa. ts, .tsx y .css dentro de src/. Un script, un test  |  Cada herramienta describe la edición a su manera. Si no
fuera de src/ o un fichero de configuración pasan sin  |  encuentra una ruta reconocible, deja pasar.
mirar.
Se rinde para no entrar en bucle  |  En Cursor, solo aconseja
Si pnpm verify sigue fallando después de reintentar, deja  |  Tras editar, el error le llega como contexto, sin bloqueo. Es
terminar al agente.  |  un informe, no una garantía.
```

## Diapositiva 84

[imagen](diapositivas/dia1/84.jpg)

```text
Mapa final
Cuatro piezas, y qué problema resuelve cada una
Hoy, con las manos  |  Mañana, dentro del sistema
Rules  |  Skills
Fijan criterio de forma probabilística.  |  Empaquetan un procedimiento que se repite.
Hooks  |  Subagentes
Lo imponen de forma determinista.  |  Aíslan contexto para que una tarea larga no contamine la
conversación principal.
Los MCPs conectan con fuera; no resuelven ninguno de
estos problemas.
```

## Diapositiva 85

[imagen](diapositivas/dia1/85.jpg)

```text
Tengo el proceso, la
red y los guardarrailes.
Pero lo sigo conduciendo yo, sesión a sesión.
Mañana: el sistema, la especificación y la verificación. Y el
último problema ya no es técnico.
Fin del día 1.
```

## Diapositiva 86

[imagen](diapositivas/dia1/86.jpg)

```text
Una formación sobre desarrollar software con agentes:
delegar cada vez más implementación, con garantías.
in X O
¡Gracias!
© 2026 540
```
