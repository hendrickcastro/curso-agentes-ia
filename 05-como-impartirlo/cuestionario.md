# Cuestionario de repaso

Veinte preguntas. Las respuestas están al final, con la sección de la guía donde se explican.

## Preguntas

1. ¿Cuál es la prueba para saber si has delegado o solo has pedido?
2. ¿Por qué un plan a medias funciona con un compañero y no con un agente?
3. ¿Qué dos condiciones tienen que cumplirse para que algo sea vibecoding?
4. ¿Por qué «contexto» no es lo mismo que «prompt engineering»?
5. De las cinco partidas de la ventana, ¿cuál suele ocupar más?
6. ¿Dónde no hay que poner nunca una restricción crítica, y por qué?
7. El agente insiste en usar una función que no existe aunque ya se lo corregiste. ¿Qué fallo es y qué haces?
8. Te reintroduce un bug que arreglasteis hace una hora. ¿Qué fallo es y qué haces?
9. ¿A partir de qué ocupación compactas o abres sesión nueva? ¿Por qué no esperar al límite?
10. ¿Qué compran los subagentes y qué no?
11. ¿Qué tiene prohibido cada fase de RPI?
12. ¿Cuál es el motivo de usar RPI que aguantará a la próxima versión del modelo?
13. ¿Qué diferencia una garantía de un informe?
14. ¿Cuál es la única comprobación que dice si la suite de tests protege algo?
15. Describe el ratchet en tres pasos.
16. ¿Qué diferencia hay entre una rule y un hook? ¿Cuál es el contrato del hook?
17. Nombra dos agujeros de un guardarraíl determinista.
18. ¿Qué tres momentos de carga tiene una skill?
19. ¿Cuándo es legítimo que un agente modifique un test que ya existía?
20. En el embudo de carriles, ¿qué puede hacer la nota de riesgo del modelo y qué no?

## Respuestas

1. Si tienes que leerlo entero, has pedido. (La tesis › Pedir frente a delegar)
2. El compañero rellena los huecos con criterio y hay confianza acumulada; el agente rellena con lo plausible, no con lo correcto, y no tiene historial. (La tesis › Por qué con personas sí funciona)
3. No revisas el código, y el software es desechable. (Vibecoding › Qué es exactamente)
4. El prompt se escribe una vez; el contexto se decide en cada llamada al modelo, decenas o cientos de veces por sesión. (Contexto › Qué es el contexto)
5. Las salidas de herramientas. (Contexto › Anatomía de la ventana)
6. En medio de un prompt largo: por la curva en U, lo del centro se pierde. (Contexto › Ventana nominal y capacidad efectiva)
7. Poisoning. No corregir en el hilo: rebobinar a antes de que entrara el error o, si no se sabe cuándo, sesión nueva. (Contexto › Nivel 3)
8. Clash. Sesión nueva, y la corrección en la especificación, no en el chat. (Contexto › Nivel 3)
9. Al 60 %. Porque al 100 % la herramienta compacta de urgencia y decide ella qué tira. (Contexto › Nivel 1)
10. Compran aislamiento de contexto, no ahorro: un sistema multiagente consume casi cuatro veces los tokens. (Contexto › Principio 3)
11. Research: no propone soluciones ni escribe código. Plan: no escribe código ni deja decisiones abiertas. Implement: no toma decisiones. (RPI › Tres fases)
12. Que el plan es lo único que puedes revisar antes de que exista el código. (RPI › Por qué RPI)
13. La garantía detiene el trabajo; el informe solo avisa. Y tiene que poder invocarse desde la línea de comandos. (Garantías › Dos reglas)
14. El mutation testing. (Garantías › Terreno firme)
15. Mides hoy y fijas la línea; lo viejo pasa y lo nuevo detiene; la línea solo baja. (Garantías › El ratchet)
16. La rule es una instrucción que el modelo pondera (probabilística); el hook es un programa que se ejecuta en un evento (determinista). Contrato: código de salida 2 y el motivo en stderr. (Guardarraíles › Tres escalones)
17. Solo mira lo que conoce; sin ruta reconocible deja pasar; se rinde para no entrar en bucle; en Cursor solo aconseja. (Guardarraíles › Un guardarraíl determinista…)
18. Siempre: nombre y descripción. Al usarla: el SKILL.md entero. Si hace falta: scripts y referencias. (Skills › Una técnica de contexto)
19. Cuando cambió la especificación. Si no cambió, es sospechoso y sube de carril. (Verificación › La red puede crecer sola)
20. Puede cerrar (mandar a un carril más lento), nunca abrir. (Verificación › El embudo)
