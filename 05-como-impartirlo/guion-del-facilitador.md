# Guion del facilitador

## Menos hablar, más hacer

El curso se da desde la vista **Taller**: cada bloque es un ejercicio que la gente hace en su equipo, y tu explicación viene después y dura tres minutos. Si llevas más de diez minutos hablando sin que nadie teclee, para y lanza el siguiente ejercicio. La guía es para consultar, no para leerla en directo.

## El hilo que no se puede perder

Cada módulo termina con un problema que abre el siguiente. Si se cuenta así, el curso se sostiene solo; si se cuenta como una lista de herramientas, se convierte en un tutorial.

| Módulo | Frase de cierre (dila literalmente) |
|---|---|
| Vibecoding | «Cuando lo vibecodeado se queda, tanto tú como el agente necesitáis ayuda.» |
| Contexto | «Con el contexto perfecto, sigue decidiendo por su cuenta el qué y el cómo.» |
| RPI | «El plan era bueno y el código parece correcto. ¿Cómo sé que lo está? Si lo leo entero, no he delegado nada.» |
| Garantías | «Sé qué garantizar y cuándo. Pero soy yo quien se acuerda de lanzarlas.» |
| Guardarraíles | «Tengo el proceso, la red y los guardarraíles. Pero lo sigo conduciendo yo, sesión a sesión.» |
| Skills y workflow | «Montar un flujo que te funcione a ti es fácil. Que le funcione a todo tu equipo es lo difícil.» |
| Especificación | «Sé qué dejar dicho para que sepa cuándo ha terminado. Y ahora tengo quince PRs encima que no he visto escribir.» |
| Verificación | «Sé qué no voy a leer. Ahora que corre solo, quiero lanzar varios.» |
| Después de delegar | «Mi máquina aguanta varios agentes y lo que monto dura. Ahora lo tiene que usar todo el equipo.» |

## Las frases que tienen que quedar

1. Si tienes que leerlo entero, no has delegado. Has pedido.
2. El techo no lo pone el modelo. Lo pone vuestro repositorio.
3. El contexto es un presupuesto de atención, no un almacén.
4. Si tienes que repetirle algo por segunda vez, el contexto está saturado.
5. El plan es lo único que puedes revisar antes de que exista el código.
6. Si avisa pero no detiene, no es una garantía. Es un informe.
7. El acuerdo que no está en ninguna herramienta es folklore.
8. Lo viejo pasa, lo nuevo detiene, la línea solo baja.
9. Si para saber si ha terminado tiene que mirarlo una persona, no has especificado. Has descrito.
10. La red puede crecer sola. Lo que no puede es encogerse sin que nadie lo vea.

## El mismo prompt, cinco veces

La mecánica central de las prácticas es lanzar **el mismo prompt** rodeando al agente de cosas distintas: nada (base), contexto, plan (RPI), guardarraíles y workflow. Lo que se aprende sale de **comparar**, no de cada intento por separado.

Por eso el *Cuaderno de prácticas* del laboratorio: cada persona guarda un intento por rama con su nombre, y en la puesta en común se abre la comparación. Las filas que más suelen cambiar: ficheros leídos antes de escribir, si respetó la frontera, paradas por hook y cuánto código hubo que leer.

## Impartirlo en línea

Todo el grupo está conectado por videollamada y no se trabaja en parejas. Lo que en el curso original hacía la pareja (contrastar, discutir, atacar la regla del otro) se reparte entre el chat y la pantalla compartida.

**La mecánica de cada práctica, siempre igual:**

1. **Enunciado en pantalla.** Deja la sección de la práctica a la vista y pon un temporizador visible.
2. **Trabajo individual**, cada persona en su equipo y con su herramienta. Micrófonos cerrados; las dudas, por el chat.
3. **Una línea al chat** al terminar: el dato que pide la práctica (qué ficheros leyó, cuántas veces paró el hook, qué corrigió en el plan).
4. **Guardar en el laboratorio** con su nombre. Cuando toca comparar entre personas, cada una pulsa *Exportar todo* y envía el JSON.
5. **Cotejo en pantalla.** Importas los ficheros (se suman, no se pisan) y abres la comparación, o dos personas comparten su pantalla. Elige a gente con herramientas distintas.

**Equivalencias con el formato presencial:**

| Presencial | En línea |
|---|---|
| Parejas de la misma herramienta | Individual; el contraste sale de comparar los intentos de todos |
| Comentarlo con la pareja | Una línea en el chat |
| A mano alzada | Encuesta o reacción de la videollamada |
| Cruzar las reglas con la pareja (práctica 8) | Cada persona pega su regla y ataca la del mensaje anterior |
| Puesta en común en la sala | Enviar todos a la vez en el chat y comentar dos o tres |
| Pizarra | Documento o pizarra compartida |
| Pasear entre las mesas | Leer el chat durante la práctica; pedir pantalla a quien se atasque |

**Lo que cambia para ti:**

- **Sin pareja nadie tira de quien se queda atrás.** Pregunta por nombre, y si alguien no ha escrito su línea en el chat, pídesela.
- **Los silencios duran más.** Haz preguntas que se contesten escribiendo; «envía a la vez» evita que todo el mundo copie la primera respuesta.
- **Los problemas de instalación no se arreglan en directo.** Quien no tenga el repositorio listo sigue la práctica en la pantalla de otra persona y hace igualmente el laboratorio, que no necesita instalar nada.
- **Pausas más frecuentes** y bloques de exposición de 20 minutos como mucho.

## Objeciones frecuentes y por dónde responder

| Objeción | Respuesta (y dónde está en la guía) |
|---|---|
| «Yo ya voy rápido con el agente.» | ¿Lees todo lo que produce? Entonces has cambiado escribir por leer (Garantías › La pregunta). |
| «Mi repositorio es viejo y no cumple nada.» | El ratchet: no se pide cumplir, se pide no empeorar (Garantías › El ratchet). |
| «Ya tenemos un CLAUDE.md con las reglas.» | Las rules son probabilísticas: no puedes demostrar que no fallan (Guardarraíles › Tres escalones). |
| «El linter ya nos avisa.» | Si avisa pero no detiene, es un informe (Garantías › Dos reglas). |
| «Le dije que no tocara los tests.» | No funciona: ImpossibleBench (Verificación › Pedirle que no toque los tests). |
| «Especificar tanto es burocracia.» | La especificación mínima solo parece barata; y hay un punto en que preguntar más produce documento, no información (Especificación › La curva). |
| «No me fío de fusionar sin leer.» | No se abre con fe: empieza estrecho, mide, ajusta (Verificación › El carril verde). |
| «Esto con más agentes va más rápido.» | Con cinco agentes, el cuello de botella eres tú (Después de delegar). |

## Qué no hacer

- No lo conviertas en un tutorial de una herramienta: el curso es deliberadamente agnóstico (Claude Code, Codex, Cursor, Copilot).
- No presentes los simuladores del laboratorio como medidas: son modelos ilustrativos con supuestos editables.
- No te saltes los cotejos: sin comparación, las prácticas son solo demos.
- No expliques un concepto antes del ejercicio que lo enseña: primero que lo vean fallar o detener, después le pones nombre.
