# La tesis: pedir no es delegar {R}

> **En una frase.** Pedirle código a un agente no es delegarle trabajo. El curso enseña a delegar cada vez más implementación, con garantías. [D1:1] [D1:4-5]

## El punto de partida {M} [D1:3]

Cuatro frases que se oyen en cualquier equipo, dos de confianza y dos de desconfianza, y una misma respuesta para las cuatro:

| Confianza | Desconfianza |
|---|---|
| «Yo ya uso Claude Code y voy mucho más rápido. Genero más código, así que más negocio.» | «Genero más código. No sé si eso es desarrollar mejor.» |
| «Si ya voy rápido y voy bien, ¿qué más pasos hay?» | «No me fío de dejarlo solo. No vaya a ser que me la líe.» |

La respuesta: **delegar cada vez más, con garantías.**

## Pedir frente a delegar {R} [D1:8-9]

| | El qué | El cómo | Escribe | Verifica |
|---|---|---|---|---|
| **Escribes** | Tú | Tú | Tú (la IA autocompleta o responde dudas) | Tú |
| **Pides** | Tú | Tú: dónde va, qué toca, qué patrón sigue | El agente | Tú, leyéndolo todo |
| **Delegas** | Tú | El agente | El agente | Tú, sin leerlo entero, con garantías |

**Si tienes que leerlo entero, no has delegado. Has pedido.** De pedir a delegar hay menos distancia de la que parece, y más incomodidad. Nadie está mal donde está: la pregunta «¿dónde estáis?» se hace con una encuesta rápida o una reacción en la videollamada.

## Por qué con personas sí funciona {R} [D1:10]

| Con un compañero | Con un agente |
|---|---|
| Confianza acumulada | Cero historial |
| Sabes cómo trabaja | No sabes qué hará con lo que no le dijiste |
| Un plan a medias vale: rellena con criterio | Rellena con lo plausible, no con lo correcto |
| La revisión es por muestreo | El muestreo no vale |

Lo que era implícito tiene que ser explícito: **un contrato antes y una verificación mecánica después.** Todo el curso desarrolla esas dos mitades: el contrato (contexto, plan, especificación) y la verificación (garantías, guardarraíles, carriles).

> **Analogía.** Delegar en un agente es como subcontratar una obra a una cuadrilla excelente que no conoce tu casa y que nunca pregunta. Si le das el plano (contrato) y pasas la inspección técnica al final (verificación mecánica), puedes no estar en la obra. Si no, tienes que estar mirando cada ladrillo, y entonces no has subcontratado nada.

## La IA replica y amplifica lo que encuentra {R} [D1:11]

Si encuentra tests, arquitectura y convenciones, produce código que encaja. Si encuentra desorden, produce desorden más rápido. **El techo no lo pone el modelo. Lo pone vuestro repositorio.**

## Tres términos, un significado cada uno {M} [D1:6]

- **Proveedor / modelo / herramienta.** Anthropic es el proveedor, Claude el modelo, Claude Code la herramienta. Tres capas y tres decisiones distintas, que se confunden.
- **Agente.** Modelo más bucle más herramientas. Lee, decide, ejecuta y vuelve a leer.
- **Contexto.** Todo lo que el agente sabe ahora mismo. Es finito: la mesa de trabajo.

## El ecosistema {M} [D1:7]

| Pieza | Qué es |
|---|---|
| **Rules** | Instrucciones que el agente carga siempre, o al entrar en una ruta. |
| **Skills** | Conocimiento y pasos que carga solo cuando la tarea los pide. |
| **Hooks** | Código que se ejecuta en eventos del agente, le haga caso o no. |
| **Subagentes** | Un agente con contexto propio al que le pasas una parte del trabajo. |
| **MCPs** | Conectan el agente con sistemas externos: Jira, bases de datos, navegador. |
| **CLIs** (por debajo de todo) | Siempre han estado ahí. Lo nuevo es que ahora las usa la IA. |

## La escalera de fallos {R} [D1:12-15]

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

## Dónde estaba el cuello de botella {M} [D1:18]

El ciclo tiene siete fases: descubrimiento, especificación, diseño, implementación, verificación, entrega y operación. **Antes de la IA** el cuello de botella era la **implementación**: escribir el código era lo caro, y todo lo demás se dimensionaba alrededor de cuánto tardaba el equipo en construir. El día 1 entero consiste en delegar esa fase sin perder el control; el día 2 sigue al cuello de botella cuando se mueve (primero a la especificación, luego a la verificación).

## Antes y después del curso {C} [D1:16]

| Antes | Después |
|---|---|
| «Uso Claude Code.» | «Sé desarrollar software con agentes.» |
| «Consigo que genere muchísimo código.» | «Sé qué delegar, cómo dirigirlo y cómo comprobar automáticamente que está bien.» |
| «Voy probando cosas que veo por X.» | «Tengo un modelo mental y un método.» |
| «Mi equipo experimenta con IA.» | «Tengo criterio para decidir, como equipo, cómo desarrollamos con IA.» |

## Qué no es esto y cómo se trabaja {C} [D1:2] [D1:17]

**No es** un tutorial de Claude Code, Cursor o Codex, ni una colección de prompts, ni una introducción a la IA. **Se trabaja** con vuestra herramienta y vuestro lenguaje, en prácticas cortas con puesta en común, y preguntando cuando surge, no al final. El curso original las hacía por parejas de la misma herramienta; **esta edición es en línea y cada persona las hace sola en su equipo**: guarda su intento en el laboratorio, lo comparte por el chat y el cotejo se hace entre todos con la pantalla compartida.

Índice del día 1: intro, vibecoding, contexto, RPI, garantías y guardarraíles.
