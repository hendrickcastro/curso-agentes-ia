# Transcripción · Día 2

> Texto extraído por OCR de las diapositivas (los PDF originales son imágenes y no permiten buscar). Puede contener erratas de reconocimiento; la referencia es siempre la imagen enlazada.

## Diapositiva 1

[imagen](diapositivas/dia2/01.jpg)

```text
Desarrollo de software
con lA
Una formación de dos días para
equipos que ya usan agentes.
Día 2
El sistema, especificación, verificación y adopción.
```

## Diapositiva 2

[imagen](diapositivas/dia2/02.jpg)

```text
Índice
01  |  Resumen día 1  |  3
02 Skills  |  5
03 Workflow  |  9
04 Especificación  |  15
05 Verificación  |  27
06 Después de delegar  |  38
07  |  Llevarlo al equipo  |  50
Otros temas  |  63
Cierre  |  72
```

## Diapositiva 3

[imagen](diapositivas/dia2/03.jpg)

```text
Ayer trabajamos una sola fase
Resumen del día 1
Descubrimiento
Operación  |  Especificación
Fase 04
Implementación
Vibecoding, contexto, RPI, garantías y
6
Entrega  |  Diseño  |  guardarrailes: todo el día 1 fue delegar esta fase
en un agente sin perder el control.
Verificación  |  Implementación
```

## Diapositiva 4

[imagen](diapositivas/dia2/04.jpg)

```text
Resumen día 1
•
Sentando las bases
Pedir no es delegar: si tienes que leerlo entero, has pedido. Y la
IA amplifica lo que encuentra en tu repositorio.
Contexto
Todo el estado que ve el modelo al inferir. Tu mensaje es la
parte más pequeña.
Problemas
La ventana nominal no es la capacidad efectiva: la curva en U y
las cuatro formas de fallar.
```

## Diapositiva 5

[imagen](diapositivas/dia2/05.jpg)

```text
Skills
*skill('planning', "80%
80%", " (I can plan we
*skill ('organisation", "77%
"T7%", " (1 an port sin
+skill ('visual design', "75%*, "(1 an estly bang
N1(style="margin: 0") }
ha my[personal-"skills"]
al.skills
'98%  |  "(creative Bonig
eskill ('creativity',
```

## Diapositiva 6

[imagen](diapositivas/dia2/06.jpg)

```text
Una skill es un proceso tuyo
escrito en lenguaje natural
para que lo haga el agente.
Cómo revisas un PR, cómo preparas una release, cómo
investigas una alerta. Lo que hoy vive en tu cabeza o en
una wiki pasa a un fichero que el agente sigue paso a
paso.
```

## Diapositiva 7

[imagen](diapositivas/dia2/07.jpg)

```text
Una técnica de contexto
Divulgación progresiva: el principio 3 del día 1, empaquetado
Siempre  |  Al usarla  |  Si hace falta
El nombre y la descripción. Unas pocas  |  El SKILL.md entero: los pasos del proceso,  |  Scripts, plantillas y referencias que la skill
líneas por skill con eso el agente sabe  |  escritos como se los contarías a alguien  |  nombra. Se leen o se ejecutan en el paso
cuándo le toca usarla.  |  del equipo.  |  que los pide.
```

## Diapositiva 8

[imagen](diapositivas/dia2/08.jpg)

```text
Un ejemplo: revisar un PR
Una carpeta con un SKILL.md y lo que este necesita
•claude/skills/ revisar-or/SKILL.mo
name:  |  revisar-pr
description: Revisa un pull request como lo hace el equipo.
Úsala cuando pidan revisar un PR, una rama o un diff.
AL USARLA
# Revisar un PR
1. Lee la descripción del PR y el ticket enlazado.
scripts/riesgo.sh  |  para ver qué ficheros
tocan pagos o migraciones.
3. Revisa esos ficheros primero; después, el resto.
4. Agrupa los comentarios por gravedad, según
referencias/criterios.md.
SI HACE FALTA
revisar-pr/
- SKILL. md
scripts/riesgo.sh  |  se ejecuta en el paso 2
referencias/criterios.md  |  se lee en el paso 4
```

## Diapositiva 9

[imagen](diapositivas/dia2/09.jpg)

```text
Workflow de implementación
```

## Diapositiva 10

[imagen](diapositivas/dia2/10.jpg)

```text
Cómo lo adoptamos
Invirtiendo la dependencia
•
Rules de consenso
Lo que el equipo ya acordaba, escrito para la máquina: testing,
estilos, navegación, traducciones.
Skills
Tareas concretas y repetibles: componer la PR, investigar un
problema, parchear una vulnerabilidad.
El problema
Por bien definidos que estén, siguen siendo
comandos: el humano los lanza uno detrás
de otro, todo el rato.
```

## Diapositiva 11

[imagen](diapositivas/dia2/11.jpg)

```text
Workflow /implement
La skill se convierte en orquestación: agentes dedicados,
revisión del plan, review puntuado y umbral de merge.
•
Zoom
Workflow / implement, orquestación
Ocho fases, tres en paralelo. Agentes dedicados y nada espera al humano.
Análisis
2 Planreview  |  Rama  |  (4)  |  Preflight
Implementación
simulador en background
Review
Verificación
PR
```

## Diapositiva 12

[imagen](diapositivas/dia2/12.jpg)

```text
Práctica • En parejas •
20 minutos
Repositorio de las prácticas,
github.com/540/ai-development-training, rama
harness. El prompt de siempre, pero esta vez lo lleva el
workflow.
Antes de empezar  |  El prompt
git switch harness  |  lanza el workflow
popm install  |  @. claude/workflows/implement.mjs para
Cambiad de rama e instalad los paquetes antes de abrir el  |  la siguiente funcionalidad: Añade al
agente.  |  proyecto web una tabla interactiva
con las ventajas y desventajas entre
todos los tipos de Pokémon.
```

## Diapositiva 13

[imagen](diapositivas/dia2/13.jpg)

```text
Montar un flujo que te
funcione a ti es fácil.
Montar un flujo que
le funcione a todo tu
equipo es lo difícil.
```

## Diapositiva 14

[imagen](diapositivas/dia2/14.jpg)

```text
¿A dónde se ha movido
el cuello de botella?
Después de la IA
Descubrimiento
Operación  |  Especificación
2
Fase 02
Especificación
Ahora está aquí: lo que le pides no llega bajado a
Entrega  |  Diseño  |  tierra.
Verificación  |  Implementación
```

## Diapositiva 15

[imagen](diapositivas/dia2/15.jpg)

```text

```

## Diapositiva 16

[imagen](diapositivas/dia2/16.jpg)

```text
El sistema ya construye
casi cualquier cosa. La
pregunta es qué le pides.
Especificación
```

## Diapositiva 17

[imagen](diapositivas/dia2/17.jpg)

```text
Un sistema que trabaja sin ti
necesita saber cuándo ha
terminado. Y eso no lo decide
él.
Mientras el código era caro, la fricción de escribirlo
sacaba a la luz los huecos uno a uno, y había alguien en
medio decidiendo.
Ahora nadie lo escribe a mano, y los huecos ya no afloran
solos. El criterio de aceptación deja de ser una
formalidad del ticket y pasa a ser la condición de parada:
el «contrato antes» del día 1.
```

## Diapositiva 18

[imagen](diapositivas/dia2/18.jpg)

```text
Describir no es especificar
Si para saber si ha terminado tiene que mirarlo una persona, no
has especificado. Has descrito.
Descrito  |  Especificado
Añade un buscador de Pokémon.  |  Busca por nombre sin distinguir mayúsculas.
«PIKA» encuentra a Pikachu.
«chu» también encuentra a Pikachu.
Con menos de dos letras no busca.
Sin resultados, dice «Ningún Pokémon se llama así».
Cada línea de la segunda la puede comprobar alguien que no
estuvo en la conversación. Y por tanto, un agente.
```

## Diapositiva 19

[imagen](diapositivas/dia2/19.jpg)

```text
Las cuatro piezas de
una definición que sirve
El conocimiento de  |  La intención  |  Las restricciones  |  Los criterios de
negocio  |  aceptación
Para qué se hace, qué  |  Lo que no se puede tocar ni
El que no está en el  |  problema resuelve.  |  romper.  |  En una forma que alguien
repositorio.  |  pueda comprobar sin opinar.
Spec-first, parte de la red de garantías, no es un ritual: es que
exista condición de parada antes de que exista código.
```

## Diapositiva 20

[imagen](diapositivas/dia2/20.jpg)

```text
En RPI revisabas el plan. El
sistema ya no espera a nadie.
La decisión no desaparece: lo que ayer entraba por el
plan, hoy entra al definir la tarea.
Una buena definición deja el plan acotado, y un plan
acotado se puede automatizar sin que nadie lo revise
antes.
```

## Diapositiva 21

[imagen](diapositivas/dia2/21.jpg)

```text
La especificación mínima
solo parece barata
Hasta que cuentas el retrabajo.
Coste  |  Curva ilustrativa
coste total
especificar  |  retrabajo
a pelo  |  exhaustiva
el óptimo
Completitud de la especificación
Con varios agentes, el óptimo se va a la derecha: cada uno
reinterpreta lo que recibe y el error se acumula en cada
traspaso. Si el agente redacta y tú revisas, especificar cuesta
menos, y el óptimo también se desplaza a la derecha.
```

## Diapositiva 22

[imagen](diapositivas/dia2/22.jpg)

```text
Cuánto merece
cada tipo de trabajo
El conocimiento de negocio se escribe una vez por proyecto. El
entendimiento común, por cambio. El diseño técnico, solo
algunas cosas. Con varios agentes, todo por escrito: cada
traspaso reinterpreta.
Tipo de trabajo  |  Connimiento do  |  Entendimiento común  |  Diseño técnico
Exploratorio  |  El que ya exista  |  Una frase de intención y qué queda  |  No: se
fuera. No va al sistema: lo trabajas  |  descubre
tú delante  |  haciendo
Tarea acotada  |  El del proyecto,  |  Criterios de aceptación comprobables  |  Solo si cruza
ya escrito  |  una frontera
Contrato entre  |  El del proyecto  |  Criterios de los dos lados  |  Sí: el contrato
servicios  |  es el diseño
```

## Diapositiva 23

[imagen](diapositivas/dia2/23.jpg)

```text
Práctica • En parejas •
10 minutos
Mismo repositorio, rama especificacion. El prompt de
siempre, pero esta vez no se implementa: se especifica.
3 minutos  |  4 minutos  |  3 minutos
A pelo  |  Interrogatorio  |  Cotejo
Pedidle los criterios de aceptación. Sin  |  Lo mismo, en sesión nueva y con  |  ¿Qué salió solo en la segunda vuelta?
implementar.  |  /grill-me. Contestad vosotros como  |  ¿Estaba escrito en algún sitio?
negocio.
Antes de empezar  |  El prompt
npx skills@latest add mattpocock/skills \  |  Añade al proyecto web una tabla
--skill  |  grill-me grilling  |  interactiva con las  |  ventajas y
Las skills de Matt Pocock. Instaladlas en la pausa: el  |  desventajas entre todos los tipos de
instalador pregunta la herramienta.  |  Pokémon.
```

## Diapositiva 24

[imagen](diapositivas/dia2/24.jpg)

```text
Debate
7 minutos
¿Qué dudas de negocio salieron?  |  ¿Cuántas preguntas cambiaron lo que se construye y
cuántas fueron relleno?
Qué generación manda, qué tipos entran, si hay tipos
A mano alzada.
decidiendo
¿En qué momento dejó de rendir el interrogatorio?  |  ¿Cuánto estaba en un sitio consultable?
Llega un punto en que preguntar más produce documento,  |  Jira, Linear o Slack, vía MCP, levantan el techo del research a
no información. Es la rama derecha de la curva.  |  medias. Lo que nunca se escribió sigue sin estar.
```

## Diapositiva 25

[imagen](diapositivas/dia2/25.jpg)

```text
SDD: la especificación
por delante
Spec-Driven Development. Tres niveles, según cuánto vive la
especificación. Birgitta Böckeler, «Understanding Spec-Driven-
Development», octubre de 2025.
Spec-first  |  Spec-anchored  |  Spec-as-source
Se escribe antes del código y sirve para  |  Se queda después de la tarea y se  |  Es el fichero principal. Solo se edita la
esta tarea. Al terminarla, no se mantiene  |  mantiene. Los cambios siguientes parten  |  especificación; el código no lo toca nadie.
de ella.
Lo de hoy es spec-first, la comprobación de la red de
garantías. Cuanto más a la derecha, menos probado está.
```

## Diapositiva 26

[imagen](diapositivas/dia2/26.jpg)

```text
Sé qué tengo que
dejar dicho para
que el sistema sepa
cuándo ha terminado.
Y ahora tengo quince PRs encima que no he visto escribir.
```

## Diapositiva 27

[imagen](diapositivas/dia2/27.jpg)

```text
Verificación
Quality
```

## Diapositiva 28

[imagen](diapositivas/dia2/28.jpg)

```text
¿A dónde se ha
movido ahora?
Después de la IA
Descubrimiento
Operación  |  Especificación
2
Fase 05
Verificación
Aquí estaba el cuello de botella: más código del
3
Entrega  |  Diseño  |  que nadie puede leer y una revisión humana que
no escala.
Verificación  |  Implementación
```

## Diapositiva 29

[imagen](diapositivas/dia2/29.jpg)

```text
Quince PRs que no has visto
escribir. ¿Cuáles no vas a leer?
No es si vas a dejar de leer. Es si lo decides tú o te pasa.
```

## Diapositiva 30

[imagen](diapositivas/dia2/30.jpg)

```text
Tres carriles
Se lee entero  |  Por muestreo  |  Se fusiona solo
Una persona lo revisa línea a línea.  |  Un revisor automático hace la primera  |  Nadie lo lee.
pasada y una persona mira lo que señala.
```

## Diapositiva 31

[imagen](diapositivas/dia2/31.jpg)

```text
El carril se decide
en un embudo
Cada etapa solo puede mandar el cambio a un carril más lento.
01
Zonas vetadas  |  Quién lo escribió  |  03  |  04
Señales del diff  |  Nota de riesgo  |  Red de garantías
Una regla  |  Una regla  |  Una regla  |  Un modelo  |  Las comprobaciones
cierra, nunca abre
MERGE
CARRIL MÁS LENTO
Los umbrales los pone cada equipo: el apetito de riesgo es una
decisión, no una constante.
```

## Diapositiva 32

[imagen](diapositivas/dia2/32.jpg)

```text
Práctica • En parejas •
20 minutos
Sobre vuestro repositorio y el diagnóstico de ayer: si la
comprobación de una zona solo avisa, esa zona no tiene carril
verde.
10 minutos  |  10 minutos
Tres reglas  |  Abogado del diablo
• Una ruta o tipo de cambio que siempre se lee.  |  Cruzadlas con vuestra pareja. Atacad su segunda regla:
• Una que no haría falta leer nunca.  |  buscad el cambio que entraría por ella y no debería.
• Qué tendría que estar en verde y deteniendo para que la
segunda sea cierta hoy.
```

## Diapositiva 33

[imagen](diapositivas/dia2/33.jpg)

```text
Debate
10 minutos
¿Qué regla verde has escrito?  |  ¿Qué te falta de la red para poder  |  Lo que hoy entra sin que nadie lo
escribirla?  |  lea, ¿en qué carril estaba?
¿Y quién no se atreve a escribir ninguna?
Casi siempre, poco. Lo que falta es que  |  A mano alzada.
algo pase de avisar a detener.
```

## Diapositiva 34

[imagen](diapositivas/dia2/34.jpg)

```text
Pedirle que no toque los tests
no funciona.
Cuando la especificación y los tests chocan, los modelos
modifican los tests aunque la instrucción diga que no, o
programan casos especiales para pasar sin cumplir la
especificación.
Un modelo que vigila a otro caza entre el 42 y el 65% de
esas trampas en proyectos de varios ficheros.
Zhong, Raghunathan y Carlini, «ImpossibleBench», octubre de
2025.
```

## Diapositiva 35

[imagen](diapositivas/dia2/35.jpg)

```text
La red puede crecer sola. Lo
que no puede es encogerse
sin que nadie lo vea.
Ampliar  |  Encoger  |  Cuándo es legítimo tocar un test
Tests nuevos para el comportamiento  |  Modificar o borrar un test que ya existía,  |  Cuando cambió la especificación. Si no
nuevo. Los escribe el agente, y la  |  relajar un umbral, añadir una excepción.  |  cambió, es sospechoso.
mutación dice si detectan algo.  |  Sube de carril.
```

## Diapositiva 36

[imagen](diapositivas/dia2/36.jpg)

```text
El carril verde se abre
con evidencia, no con fe
Un caso publicado empezó dejando pasar el 25 % de cambios
más seguros, y lo subió al 50 % cuando vio que las incidencias
no crecían.
Empieza estrecho  |  Mide  |  Ajusta
Solo lo obvio.  |  Cuánto de lo que entró sin leer se revierte  |  Si aguanta, se ensancha. Si falla, se
o acaba en un incidente, comparado con  |  estrecha.
lo revisado.
Es el ratchet del día 1, aplicado a los carriles.
```

## Diapositiva 37

[imagen](diapositivas/dia2/37.jpg)

```text
Sé qué no voy a
leer, y cómo sé que
sigue siendo verdad.
Ahora que corre solo, quiero lanzar varios.
```

## Diapositiva 38

[imagen](diapositivas/dia2/38.jpg)

```text
Lo que te preocupa
después de delegar
```

## Diapositiva 39

[imagen](diapositivas/dia2/39.jpg)

```text
Ya corre solo. ¿Y ahora qué?
Si no tienes que estar encima, puedes lanzar varios.
```

## Diapositiva 40

[imagen](diapositivas/dia2/40.jpg)

```text
Un worktree es otra copia de
trabajo del mismo repositorio,
en su propia rama.
Cada agente trabaja en su carpeta. Nadie pisa los
ficheros ni el estado de git de otro.
Crear la copia es un comando. Lo difícil es que arranque.
```

## Diapositiva 41

[imagen](diapositivas/dia2/41.jpg)

```text
Qué necesita un worktree
nuevo para arrancar
Lo que no está en git no viene con la copia.
Configuración y secretos  |  Dependencias  |  Servicios y puertos
Los . env y las claves no están en git. Hay  |  Instalar los paquetes y compilar lo que  |  Base de datos, caché, colas. Dos copias
que copiarlos o generarlos.  |  haga falta.  |  no pueden escuchar en el mismo puerto.
Datos  |  Limpieza
Una base de datos con datos de prueba, propia o  |  Al cerrar la tarea, parar los servicios y borrar la copia.
compartida.
Si cada worktree nuevo te pide diez minutos de ajustes a mano,
no vas a tener cinco.
```

## Diapositiva 42

[imagen](diapositivas/dia2/42.jpg)

```text
Los contenedores: dos
formas de montarlos
Todo por worktree  |  Infraestructura común
Cada copia levanta su pila entera. Aísla del todo, pero pesa  |  Base de datos, caché y buscador en un solo sitio, y cada
y tarda.  |  worktree levanta solo su aplicación. Los datos se
comparten, y dos tareas pueden chocar en ellos.
En los dos casos: una dirección por tarea
Un proxy da a cada tarea un nombre fijo en lugar de un
puerto all azar. Traefik lo hace para los contenedores;
Portless, para el servidor de desarrollo.
```

## Diapositiva 43

[imagen](diapositivas/dia2/43.jpg)

```text
Aislar la ejecución no evita el
choque al integrar.
Dos tareas que tocan los mismos ficheros chocan igual,
solo que más tarde.
Parte el trabajo por zonas que no se tocan. Si no se
puede, hazlo en serie.
```

## Diapositiva 44

[imagen](diapositivas/dia2/44.jpg)

```text
Con cinco agentes, el cuello
de botella eres tú.
Cada agente que para a preguntar es un salto de
contexto. Cinco agentes a la vez son cinco colas de
revisión.
Y tu ordenador, que también se satura y también tiene un
límite.
```

## Diapositiva 45

[imagen](diapositivas/dia2/45.jpg)

```text
Lo que cuesta
estar en este punto
Tokens y límites  |  Infraestructura
Más autonomía gasta más: cada fase delegada consume  |  Entornos en paralelo, contenedores y minutos de Cl.
tokens. Y varios agentes a la vez llegan antes al límite del
Comprobaciones  |  Mantener el sistema
La red de verificación corre en cada cambio de cada  |  Rules, skills y scripts son código que alguien mantiene. Si
agente. Algunas comprobaciones, como la mutación, son  |  caducan, el agente sigue una rule que ya no es verdad
caras y lentas.
La pregunta no es si cuesta. Es si cuesta menos que el tiempo
que liberas.
```

## Diapositiva 46

[imagen](diapositivas/dia2/46.jpg)

```text
Dentro de seis meses,
alguien otro agente tendrá que
entender y cambiar lo que
hoy escriben cinco agentes.
Y tú, cuando te toque.
Mantenibilidad a largo plazo
```

## Diapositiva 47

[imagen](diapositivas/dia2/47.jpg)

```text
Lo que el código no explica
El código dice qué hace el sistema. No dice por qué.
Negocio y lenguaje ubicuo  |  Decisiones técnicas
Un glosario vivo: qué significa cada término del dominio,  |  Un ADR, solo si la decisión es difícil de revertir, sorprende
para ti y para el agente. No es una especificación.  |  sin contexto y es un trade-off real.
grill-with-docs: el interrogatorio de siempre, pero deja ficheros
en el repositorio y no solo en tu cabeza
```

## Diapositiva 48

[imagen](diapositivas/dia2/48.jpg)

```text
Cada cambio pasa. El
conjunto empeora.
La red comprueba que cada cambio es correcto, no que
el código siga siendo mantenible. Con cinco agentes, la
complejidad y la duplicación crecen más rápido de lo
que nadie lo nota.
La respuesta es la de todo el curso: métricas de calidad y
garantías que te digan que el código sigue sano, hoy y
dentro de seis meses.
```

## Diapositiva 49

[imagen](diapositivas/dia2/49.jpg)

```text
Mi máquina ya aguanta
varios agentes y lo
que monto dura.
Ahora lo tiene que usar todo el equipo.
```

## Diapositiva 50

[imagen](diapositivas/dia2/50.jpg)

```text
Llevarlo al equipo
```

## Diapositiva 51

[imagen](diapositivas/dia2/51.jpg)

```text
¿En qué punto
estás tú está tu equipo?
Diagnosticar, compartir y mejorar.
```

## Diapositiva 52

[imagen](diapositivas/dia2/52.jpg)

```text
VSM: el mapa de cómo
trabaja el equipo.
Cada paso, desde la necesidad hasta producción. EI VSM
clásico, de lean, mide dónde espera el trabajo.
Aquí, cada paso lleva una marca: IA activa, lA posible o no
aplica.
```

## Diapositiva 53

[imagen](diapositivas/dia2/53.jpg)

```text
Así se ve un equipo
31 pasos en 5 etapas.
Definir  |  →  |  Planificar  |  →  |  Implementar  |  →  |  Entregar  |  →  |  Operar
48 %  |  32 %  |  20 %
IA activa  |  IA posible  |  No aplica
Lo posible es por donde avanzar. Demo del VSM
```

## Diapositiva 54

[imagen](diapositivas/dia2/54.jpg)

```text
Gauntlet: ¿podrías
dejar de leer el código?
Un ejemplo de cómo medir tus garantías y guardarraíles.
Aceptación  |  Mutation testing  |  Mutación de la spec  |  CRAP  |  Cobertura  |  DRY  |  Arquitectura
Calidad de tests  |  Spec-first
No es cerrado y es mejorable, pero te dice dónde mirar.
```

## Diapositiva 55

[imagen](diapositivas/dia2/55.jpg)

```text
La base contra la última rama
Cada campo de 0 a 4, una nota sobre 36 y un roadmap.
Rama principal  |  Última rama del día 2
Antes de cualquier práctica. Sin red.  |  Con las comprobaciones de los módulos 4 a 6.
La skill: Gauntlet Audit.
```

## Diapositiva 56

[imagen](diapositivas/dia2/56.jpg)

```text
Qué es tuyo y
qué es del equipo
Capa de usuario  |  Repositorio
Tuyo  |  Del equipo
No se versiona  |  Se versiona
~/. claude/ ~/.codex/  |  AGENTS. md, . claude/skills/
Las instrucciones y las skills ya tienen formato común. Los
hooks, los subagentes y los permisos, no.
```

## Diapositiva 57

[imagen](diapositivas/dia2/57.jpg)

```text
Así lo compartimos:
agentic-toolbox
github.com/540/agentic-toolbox
Plugin  |  skills.sh
En Claude Code. Skills, hooks y agentes.  |  En el resto de herramientas. Solo skills.
/plugin install gauntlet-audit@540  |  npx skills add 540/agentic-toolbox
```

## Diapositiva 58

[imagen](diapositivas/dia2/58.jpg)

```text
Probar cada uno,
converger en común
Pruebas en tu capa  |  →  |  Lo usa más gente  |  →  |  Sube al repositorio
```

## Diapositiva 59

[imagen](diapositivas/dia2/59.jpg)

```text
La reunión de
mejora continua
Como la retrospectiva de siempre, sobre el flujo con IA.
o1 ¿Qué está fallando?
o2 ¿Cómo mejoramos el sistema y el flujo con lA?
¿Qué podemos añadir?
```

## Diapositiva 60

[imagen](diapositivas/dia2/60.jpg)

```text
Si no leemos el código, ¿qué
miramos?
Teníamos un tablero de mejoras técnicas y
preocupaciones. Se llenaba leyendo código; al delegar, se
queda vacío. l
Un panel de métricas ocupa el sitio del tablero. Sigue
decidiendo el equipo. Panel de salud del código
```

## Diapositiva 61

[imagen](diapositivas/dia2/61.jpg)

```text
La curva J
Cualquier mejora que adoptéis.
Rendimiento  |  Curva ilustrativa
compensa
nivel de partida
al principio cuesta
Tiempo desde que adoptáis la mejora
Como el interés compuesto: cada mejora permite ir más rápido
y seguir mejorando.
```

## Diapositiva 62

[imagen](diapositivas/dia2/62.jpg)

```text
Práctica • Toda la sala •
7 minutos
Con todo lo visto en los dos días.
Dónde estáis  |  Qué atacaríais primero
• ¿Compartís algo en el repositorio?  |  Piensa un momento qué es lo primero que atacarías en tu
• ¿Hacéis alguna reunión de mejora continua?  |  equipo. Después lo ponemos en común.
• ¿Cuándo cambió vuestro equipo por última vez cómo
trabaja con IA, y qué fue?
```

## Diapositiva 63

[imagen](diapositivas/dia2/63.jpg)

```text
*  |  540
Otros temas
400
```

## Diapositiva 64

[imagen](diapositivas/dia2/64.jpg)

```text
Cosas que tenéis que
saber que existen.
SARA
```

## Diapositiva 65

[imagen](diapositivas/dia2/65.jpg)

```text
No hace falta que
montes el flujo de cero.
Ya hay flujos escritos. Te dan ideas, y los puedes coger y
adaptar a tu equipo.
Qué fases tiene  |  Dónde para  |  Limpia el contexto  |  Qué artefactos deja
Si no puedes nombrarlas, no  |  Un flujo sin paradas para que  |  Si arrastra el research a la  |  Research, plan y decisiones
sabes qué va a hacer.  |  revises decide por ti.  |  implementación, se degrada.  |  en ficheros, no solo en la
conversación.
Antes de adoptar uno, cuatro preguntas. Si no puedes
responder a las cuatro, no lo adoptes.
```

## Diapositiva 66

[imagen](diapositivas/dia2/66.jpg)

```text
ELIDE está hecho para que tú
edites. El ADE, para que tú
supervises.
Un worktree, un terminal y un navegador por agente. Y
una cola de cosas que revisar.
Pídele tres cosas: que pare para que revises, que aísle
cada agente y que te enseñe qué pasó.
```

## Diapositiva 67

[imagen](diapositivas/dia2/67.jpg)

```text
Bucles que corren
sin nadie delante
Mutación general  |  Triaje de errores de producción  |  Monitorización de la CI
Barre todo el código, encuentra los tests  |  Agrupa, prioriza y abre la tarea con el  |  Detecta lo que se rompe o se vuelve
que no detectan nada y propone los que  |  contexto del fallo.  |  inestable, y abre el arreglo.
faltan.
Reviews de usuarios  |  Releases a las stores
Las recoge, las clasifica y las convierte en tareas.  |  Prepara la versión, las notas y la publicación.
No miran un cambio: miran el sistema entero. Si producen uno,
entra por los mismos carriles que cualquier PR.
```

## Diapositiva 68

[imagen](diapositivas/dia2/68.jpg)

```text
MCP solo cuando aporta algo
que la CLI no da.
Autenticación o una función que la CLI no tiene. Si es un
envoltorio de la CLI, sobra.
Y una vez decidido, consistencia: siempre la misma vía
para la misma herramienta.
```

## Diapositiva 69

[imagen](diapositivas/dia2/69.jpg)

```text
El inventario de 540
Seis equipos, en abril de 2026. Cada celda dice la vía.
CATEGORÍA  |  HCRRAMIENTAI  |  EQUIPO 1  |  EQUIPO 2  |  EQUIPO 3  |  EQUIPO 4  |  EQUIPO 5  |  EQUIPO 6
GESTIÓN DE PROYECTO Y  |  GitHub  |  CLI  |  CLI  |  CLI  |  CLI  |  CLI
REPOSITORIO
Jira  |  CLI  |  CLI  |  CLI
Azure DevOps  |  MCP
DISEÑO  |  Figma  |  MCP  |  MCP  |  MCP  |  MCP  |  MCP
OBSERVABILIDAD  |  Sentry  |  MCP  |  MCP  |  MCP
CI/CD  |  Jenkins  |  MCP  |  MCP
GitHub  |  CLI  |  CLI  |  CLI
Azure DevOps  |  MCP
BASE DE DATOS  |  Tiger/Timescale  |  MCP
AUTOMATIZACIÓN WEB Y  |  Chrome DevTools  |  MCP  |  MCP  |  MCP
MÓVIL
agent-device  |  CLI
```

## Diapositiva 70

[imagen](diapositivas/dia2/70.jpg)

```text
Tres riesgos reales
El módulo de verificación contó el caso de la CI. Este es el
panorama.
Inyección  |  Filtrado de datos  |  Permisos
Todo lo que el agente lee es entrada no  |  Secretos y código que salen en prompts,  |  El agente tiene los permisos de tu usuario.
confiable: una issue, una web, un fichero, la  |  hacia MCPs o hacia terceros. Una  |  Todo lo que puedes borrar, puede
salida de una herramienta.  |  dependencia MCP tiene los permisos de  |  borrarlo.
tu agente.
Todo lo que lee es entrada no confiable. Y todo lo que tú
puedes hacer, puede hacerlo él.
```

## Diapositiva 71

[imagen](diapositivas/dia2/71.jpg)

```text
Lo que está por venir
Observabilidad de lo que corre  |  Evals  |  Fuera de tu ordenador
solo
Cambiar de modelo, de rule o de skill es  |  Cuanto más delegas, menos sentido tien
Si nadie mira, el registro es lo único que  |  un cambio. Un conjunto fijo de tareas,  |  ue corra en tu portátil. Nadie va a tene
queda: qué hizo cada agente, cuánto  |  antes y después, y comparas.  |  algo corriendo una hora en local.
tardó y por qué falló.
Modelos de pesos abiertos  |  Modelos especializados
Hoy dependes de dos proveedores. Los modelos abiertos  |  No todo es un LLM. Clasificadores que deciden rápido
se acercan y corren en tu infraestructura, con un arnés  |  entre opciones, sin generar texto: un interruptor inteligente
abierto.  |  delante del agente.
```

## Diapositiva 72

[imagen](diapositivas/dia2/72.jpg)

```text
Cierre
```

## Diapositiva 73

[imagen](diapositivas/dia2/73.jpg)

```text
La escala de uso
Cada escalón por lo que ganas, y en dos ejes: qué haces tú y
cuánto lees.
•
Prompting
Sale algo plausible, y rápido.
Tú: pides sin especificar • Lees: lo que sale, sin criterio para juzgarlo.
Sesiones y rules
El agente tiene directrices y la sesión no se degrada.
Tú: cuidas el contexto • Lees: todo el código.
RPI
Feedback temprano sobre el plan, y cada fase empieza con el contexto
```

## Diapositiva 74

[imagen](diapositivas/dia2/74.jpg)

```text
Sesiones y rules
El agente tiene directrices y la sesión no se degrada.
Tú: cuidas el contexto • Lees: todo el código.
RPI
Feedback temprano sobre el plan, y cada fase empieza con el contexto
limpio.
Tú: revisas el plan • Lees: todo el código.
Garantías y guardarrailes
El resultado se comprueba solo, y el criterio no depende de la
especificación ni de las reglas.
Tú: fijas el criterio • Lees: todo el código, pero te fías más.
Workflow de implementación
Lo lanzas en local y hace la implementación entera sin pararse. Pasas de
estar dentro del bucle a estar encima.
Tú: defines la tarea, lo lanzas y estás pendiente • Lees: el resultado y lo que la red
señala.
```

## Diapositiva 75

[imagen](diapositivas/dia2/75.jpg)

```text
*540  |  Feedback temprano sobre el plan, y cada fase empieza con el contexto
limpio.
Tú: revisas el plan • Lees: todo el código.
Garantías y guardarrailes
El resultado se comprueba solo, y el criterio no depende de la
especificación ni de las reglas.
Tú: fijas el criterio • Lees: todo el código, pero te fías más.
Workflow de implementación
Lo lanzas en local y hace la implementación entera sin pararse. Pasas de
estar dentro del bucle a estar encima.
Tú: defines la tarea, lo lanzas y estás pendiente • Lees: el resultado y lo que la red
señala.
El sistema
Si la tarea está bien definida, el sistema la recoge solo y ejecuta el proceso
entero, hasta la verificación.
Tú: preparas la tarea y supervisas • Lees: solo lo que merece tus ojos.
```

## Diapositiva 76

[imagen](diapositivas/dia2/76.jpg)

```text
El resultado se comprueba solo, y el criterio no depende de la
*-540  |  especificación ni de las reglas.
Tú: fijas el criterio • Lees: todo el código, pero te fías más.
Workflow de implementación
Lo lanzas en local y hace la implementación entera sin pararse. Pasas de
estar dentro del bucle a estar encima.
Tú: defines la tarea, lo lanzas y estás pendiente Lees: el resultado y lo que la red
señala.
El sistema
Si la tarea está bien definida, el sistema la recoge solo y ejecuta el proceso
entero, hasta la verificación.
Tú: preparas la tarea y supervisas • Lees: solo lo que merece tus ojos.
```

## Diapositiva 77

[imagen](diapositivas/dia2/77.jpg)

```text
Antes y después
Antes del curso  |  Después del curso
«Uso Claude Code.»  |  «Sé desarrollar software con agentes.»
«Consigo que genere  |  «Sé qué delegar, cómo dirigirlo y cómo comprobar automáticamente
muchísimo código.»  |  que está bien.»
«Voy probando cosas que veo  |  «Tengo un modelo mental y un método.»
por X.»
«Mi equipo experimenta con IA.»  |  «Tengo criterio para decidir, como equipo, cómo desarrollamos
con IA.»
```

## Diapositiva 78

[imagen](diapositivas/dia2/78.jpg)

```text
En seis meses todos
tendrán las mismas
herramientas.
El sistema, no.
El sistema se construye ahora, mientras la
mayoría improvisa.
```

## Diapositiva 79

[imagen](diapositivas/dia2/79.jpg)

```text
¿Dudas?
ai-training@540deg.com • El formulario y las diapositivas os
llegan por correo.
Recursos  |  Newsletter
resources.540deg.com  |  newsletter.540deg.com
```

## Diapositiva 80

[imagen](diapositivas/dia2/80.jpg)

```text
Una formación sobre desarrollar software con agentes:
delegar cada vez más implementación, con garantías.
in X @
¡Gracias!
© 2026 540
```
