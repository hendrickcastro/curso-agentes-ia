// Guiones de los vídeos: un vídeo por módulo.
// Cada escena tiene un título (t), un bloque de código opcional (c) y puntos (p).
// Cada punto es [lo que se ve en pantalla, lo que dice la narración].
export const VIDEOS = [
  { n: '00', slug: 'la-tesis', titulo: 'La tesis: pedir no es delegar', escenas: [
    { t: 'Pedir no es delegar', p: [
      ['Pedirle código a un agente no es delegarle trabajo', 'Esta es la idea central del curso: pedirle código a un agente no es delegarle trabajo.'],
      ['Pides: tú decides el qué y el cómo, y lo lees todo', 'Cuando pides, tú defines el qué y el cómo, el agente escribe, y tú lo lees todo.'],
      ['Delegas: tú decides el qué; las garantías verifican', 'Cuando delegas, tú defines solo el qué. El agente decide el cómo, y son las garantías las que verifican.'],
      ['Si tienes que leerlo entero, no has delegado: has pedido', 'La prueba es sencilla. Si tienes que leerlo entero, no has delegado. Has pedido.'] ] },
    { t: '¿Por qué con personas sí funciona?', p: [
      ['Con un compañero: confianza acumulada, revisión por muestreo', 'Con un compañero hay confianza acumulada. Un plan a medias vale, porque rellena los huecos con criterio.'],
      ['Con un agente: cero historial; rellena con lo plausible', 'Con un agente no hay historial. Rellena los huecos con lo plausible, no con lo correcto.'],
      ['Un contrato antes y una verificación mecánica después', 'Por eso lo implícito tiene que hacerse explícito: un contrato antes, y una verificación mecánica después.'],
      ['El techo no lo pone el modelo: lo pone tu repositorio', 'Y recuerda: la inteligencia artificial amplifica lo que encuentra. El techo no lo pone el modelo, lo pone tu repositorio.'] ] },
    { t: 'La escalera de fallos', p: [
      ['Vibecoding → Contexto → RPI', 'El curso es una escalera. Cada peldaño resuelve un problema y crea el siguiente. Vibecoding, contexto, y planificar antes de implementar.'],
      ['Garantías → Guardarraíles → El sistema', 'Después, garantías para no tener que leer, guardarraíles para no depender de la memoria, y un sistema que lo ata todo.'],
      ['Especificación → Verificación → El equipo', 'Y al final, qué le pides, qué decides no leer, y cómo llevarlo al equipo, porque el último problema ya no es técnico.'] ] } ] },

  { n: '01', slug: 'vibecoding', titulo: 'Vibecoding', escenas: [
    { t: 'Qué es vibecoding', p: [
      ['Describir lo que quieres y aceptar el código sin leerlo', 'Vibecoding es describir en lenguaje natural lo que quieres, y aceptar el código sin leerlo.'],
      ['Describes → aceptas → ejecutas → pegas el error → repites', 'El bucle tiene cinco pasos: describes, aceptas sin revisar, ejecutas, pegas el error, y vuelves a empezar. Leer el código no está en la lista.'],
      ['Dos condiciones: no revisas el código, y es desechable', 'Para que sea vibecoding hacen falta dos condiciones: que no revises el código, y que el software sea desechable.'] ] },
    { t: 'Cuándo deja de salir barato', p: [
      ['Sale barato mientras el código se puede tirar', 'Vibecodear sale barato mientras el código se puede tirar.'],
      ['Si el prototipo se queda, la factura llega de golpe', 'El día que el prototipo se queda, la factura llega de golpe. Nadie entiende lo que hay, y nadie puede estimar un cambio.'],
      ['Lo que el agente necesita saber se llama contexto', 'En ese momento el agente necesita saber cosas que no están en tu prompt. A eso lo llamamos contexto.'] ] } ] },

  { n: '02', slug: 'contexto', titulo: 'Contexto', escenas: [
    { t: 'Un presupuesto de atención', p: [
      ['Todo el estado disponible para el modelo al inferir', 'El contexto es todo el estado disponible para el modelo en el momento de la inferencia. Tu mensaje es solo una fracción pequeña.'],
      ['No es un almacén: cada token compite con los demás', 'No es un almacén, es un presupuesto de atención. Cada token compite con los demás, así que meter algo irrelevante no es neutro.'],
      ['La mayor parte de tu ventana no la escribiste tú', 'Y la mayor parte de la ventana no la escribiste tú. Se acumuló sola, con salidas de herramientas y respuestas del agente.'] ] },
    { t: 'Caber no es suficiente', p: [
      ['Ventana nominal ≠ capacidad efectiva', 'La ventana que anuncia el proveedor no es la capacidad efectiva. El rendimiento cae al crecer la entrada, incluso en tareas triviales.'],
      ['La curva en U: lo que está en medio se pierde', 'Además existe la curva en U. El modelo recuerda el principio y el final, y pierde lo que queda en medio.'],
      ['Lo crítico va arriba o abajo, nunca en medio', 'Por eso una restricción crítica va arriba o abajo. Si la entierras en medio, parecerá desobediencia cuando es geometría.'] ] },
    { t: 'Las cuatro formas de fallar', p: [
      ['Poisoning: un error se usa como si fuera verdad', 'Primer fallo, poisoning. Un error entra en la ventana y se sigue usando como si fuera verdad.'],
      ['Distraction: copia del historial en vez de pensar', 'Segundo, distraction. La ventana crece tanto que el modelo copia del historial en vez de pensar.'],
      ['Confusion: usa lo que sobra porque está ahí', 'Tercero, confusion. Hay información que sobra, y el modelo la usa simplemente porque está ahí.'],
      ['Clash: dos partes se contradicen y elige la que no es', 'Y cuarto, clash. Dos partes de la ventana se contradicen, y el modelo elige la que no es.'] ] },
    { t: 'Medir y actuar', p: [
      ['Al 60 % de la ventana: compactas o sesión nueva', 'La regla práctica: al sesenta por ciento de la ventana, compactas o abres sesión nueva. No esperes al límite.'],
      ['Si repites algo por segunda vez, el contexto está saturado', 'Y si tienes que repetirle algo por segunda vez, no es que no te haya entendido. Es que el contexto está saturado.'],
      ['Rebobinar: la corrección que no ensucia', 'En vez de decir "no, así no" en el hilo, rebobina y reescribe el mensaje que lo provocó. Es la corrección que no ensucia.'],
      ['Compactar tú: progress.md y sesión nueva', 'O compacta tú: pide que escriba el objetivo, el enfoque, los pasos hechos y el fallo actual en un fichero, y sigue en una sesión limpia.'] ] },
    { t: 'Los cuatro principios', p: [
      ['Qué entra: solo lo que cambia la respuesta', 'Cuatro principios. Uno: solo entra lo que cambia la respuesta.'],
      ['Dónde va: al principio o al final', 'Dos: colocación consciente. Lo importante, al principio o al final.'],
      ['Con cuánto detalle: divulgación progresiva', 'Tres: divulgación progresiva. Nombres y descripciones al arrancar, y el contenido completo solo cuando hace falta.'],
      ['Cada turno: curación iterativa', 'Y cuatro: curación iterativa. Empieza con lo mínimo y añade una regla cada vez que veas fallar al agente.'] ] } ] },

  { n: '03', slug: 'rpi', titulo: 'RPI: Research, Plan, Implement', escenas: [
    { t: 'Por qué planificar', p: [
      ['Con el contexto perfecto, sigue decidiendo por su cuenta', 'Aunque le des el contexto perfecto, el agente sigue decidiendo por su cuenta el qué y el cómo.'],
      ['El plan es lo único revisable antes de que exista el código', 'El plan es lo único que puedes revisar antes de que exista el código.'],
      ['Revisar un plan: minutos. Revisar el diff: una tarde', 'Revisar un plan cuesta minutos. Revisar el diff que sale de él, una tarde. Es el último momento en que decir que no sale barato.'] ] },
    { t: 'Tres fases, definidas por lo que tienen prohibido', p: [
      ['Research: no propone soluciones, no escribe código', 'Research investiga. Tiene prohibido proponer soluciones y escribir código.'],
      ['Plan: no escribe código, no deja decisiones abiertas', 'Plan decide. Tiene prohibido escribir código y dejar decisiones abiertas.'],
      ['Implement: no toma decisiones; si hay una, para y pregunta', 'Implement ejecuta. Tiene prohibido tomar decisiones: si se topa con una, para y pregunta.'],
      ['Cada fase, en una sesión nueva', 'Y cada fase arranca en una sesión nueva, con el fichero de la anterior como única entrada.'] ] },
    { t: 'Dónde va tu tiempo', p: [
      ['El techo del research es el repositorio', 'El techo del research es el repositorio. Lo que solo está en la cabeza de alguien de tu empresa solo puede entrar por el plan.'],
      ['Tu tiempo se va en research y plan', 'El reparto de tiempo es contraintuitivo: tu tiempo se va en research y en plan, y la implementación se delega entera.'],
      ['Si pasas el tiempo implementando, has pedido', 'Si pasas la mayor parte del tiempo implementando, no has delegado. Has pedido.'] ] } ] },

  { n: '04', slug: 'garantias', titulo: 'Garantías', escenas: [
    { t: 'La pregunta', p: [
      ['¿Qué tendría que existir para aceptarlo sin leerlo?', 'La pregunta de este módulo es: ¿qué tendría que existir para que aceptaras un cambio sin leerlo, hoy y dentro de un año?'],
      ['No es una herramienta: es una red de once comprobaciones', 'La respuesta no es una herramienta. Es una red de once comprobaciones que miran cosas distintas.'] ] },
    { t: 'La red', p: [
      ['Terreno firme: formateo, linting, cobertura, duplicación, arquitectura, mutación', 'En terreno firme hay seis: formateo, linting, cobertura con umbral, duplicación, arquitectura, y mutation testing.'],
      ['Mutation testing: la única que dice si la suite protege algo', 'De todas, el mutation testing es la única que dice si tus tests detectan de verdad un cambio en el código.'],
      ['Maduro: métricas de calidad y calidad de los tests', 'Después, dos maduras pero que cada equipo elige: métricas de calidad, como el riesgo CRAP, y calidad del código de test.'],
      ['Frente abierto: aceptación, mutación de la spec, spec-first', 'Y el frente abierto, la especificación: comportamiento funcional, mutación de la especificación, y proceso spec-first.'] ] },
    { t: 'Garantía o adorno', c: '# Informe: el fallo se tolera\neslint . || true\n\n# Garantía: detiene el commit,\n# el push o el build\neslint .', p: [
      ['Si avisa pero no detiene, es un informe', 'Dos reglas separan una garantía de un adorno. Primera: si avisa pero no detiene, no es una garantía. Es un informe.'],
      ['Si solo existe en tu IDE, el agente no puede ejecutarla', 'Segunda: si solo existe dentro de tu editor, tampoco. Tiene que poder lanzarse desde la línea de comandos, o el agente no puede ejecutarla.'],
      ['Cada una, en el momento más temprano que compense', 'Y cada comprobación se ejecuta en el momento más temprano en el que compensa lo que cuesta: al guardar, al terminar el agente, antes del commit, o en la integración.'] ] },
    { t: 'El ratchet', c: '$ npm run ratchet\nRatchet: en verde.\nDeuda conocida: 2; nuevas: 0.\n\n$ # alguien añade un fetch\nRatchet: hay violaciones nuevas.\nbuscadorView: tenía 0, ahora 1', p: [
      ['"Mi repositorio lleva ocho años y no cumple nada"', '¿Y si tu repositorio lleva ocho años y no cumple nada? Para eso existe el ratchet, la carraca.'],
      ['Mides hoy y fijas la línea de partida', 'Primero mides hoy y fijas ese número como línea de partida. No es aprobar la deuda, es dejar de discutirla.'],
      ['Lo viejo pasa, lo nuevo detiene', 'Segundo: lo viejo pasa, lo nuevo detiene. Todo lo que salta es de hoy.'],
      ['La línea solo baja', 'Y tercero: la línea solo baja. Para un agente, es la frontera que le dice qué puede tocar sin preguntar.'] ] } ] },

  { n: '05', slug: 'guardarrailes', titulo: 'Guardarraíles', escenas: [
    { t: 'Tres escalones', p: [
      ['Lo que depende de acordarse, un día se olvida', 'Sabes qué garantizar, pero eres tú quien se acuerda de lanzarlo. Y lo que depende de acordarse, un día se olvida.'],
      ['El prompt: hay que decirlo siempre', 'Primer escalón, el prompt. Se lo pides y obedece, pero hay que decirlo siempre, y cada persona lo dice a su manera.'],
      ['Las rules: sistemáticas, pero el modelo las pondera', 'Segundo, las rules. Lo escribes una vez. Es un avance real, pero sigue siendo una instrucción que el modelo pondera junto a las demás.'],
      ['El hook: un programa que no interpreta', 'Tercero, el hook. Un programa revisa cada fichero en cuanto el agente lo escribe. No pondera, no interpreta, no tiene días malos.'] ] },
    { t: 'Cómo es un hook', c: 'const evento = JSON.parse(stdin)\n\nconst { ok, salida } =\n  ejecutar("tools/ratchet.mjs")\n\nif (!ok) {\n  console.error(salida) // stderr\n  process.exit(2)       // corrige\n}', p: [
      ['Dos eventos: tras cada edición, y al terminar', 'Se cuelga de dos eventos: después de cada edición, y cuando el agente va a terminar.'],
      ['Código de salida 2 y el motivo en stderr', 'El contrato es simple: si la comprobación falla, el programa sale con código dos y escribe el motivo en la salida de error.'],
      ['El aviso lo lee el agente, y corrige solo', 'Ese aviso no lo lees tú. Lo lee el agente, y corrige solo, sin gastar tu tiempo.'],
      ['Las rules no puedes demostrar que no fallan', 'Esa es la diferencia con las rules: son probabilísticas, y no puedes demostrar que no fallan.'] ] },
    { t: 'Determinista no significa completo', p: [
      ['Solo mira lo que conoce', 'Un hook también tiene agujeros, y no avisan. Solo mira los ficheros que conoce.'],
      ['Sin ruta reconocible, deja pasar', 'Si no encuentra una ruta reconocible, deja pasar.'],
      ['Se rinde para no entrar en bucle', 'Y se rinde tras varios intentos, para no entrar en bucle.'],
      ['Rules fijan criterio; hooks lo imponen', 'El mapa final: las rules fijan el criterio de forma probabilística, y los hooks lo imponen de forma determinista.'] ] } ] },

  { n: '06', slug: 'skills-y-workflow', titulo: 'El sistema: skills y workflow', escenas: [
    { t: 'Qué es una skill', c: 'revisar-pr/\n├── SKILL.md\n├── scripts/riesgo.sh\n└── referencias/criterios.md', p: [
      ['Un proceso tuyo, escrito para que lo haga el agente', 'Una skill es un proceso tuyo, escrito en lenguaje natural para que lo haga el agente. Cómo revisas un pull request, cómo preparas una release.'],
      ['Siempre: nombre y descripción', 'Es divulgación progresiva empaquetada. Siempre se cargan solo el nombre y la descripción.'],
      ['Al usarla: el SKILL.md entero', 'Al usarla, se carga el fichero entero, con los pasos del proceso.'],
      ['Si hace falta: scripts y referencias', 'Y solo si hace falta, los scripts y las referencias que la skill nombra.'] ] },
    { t: 'De la skill al workflow', p: [
      ['Las skills siguen siendo comandos que lanzas tú', 'Por bien definidas que estén, las skills siguen siendo comandos. El humano los lanza uno detrás de otro, todo el rato.'],
      ['El workflow: la skill se convierte en orquestación', 'El workflow convierte la skill en orquestación: agentes dedicados, revisión del plan, revisión puntuada, y un umbral de merge.'],
      ['Ocho fases, tres en paralelo: nada espera al humano', 'Ocho fases: análisis, revisión del plan, rama, comprobación previa, implementación, revisión, verificación, y pull request. Nada espera al humano.'],
      ['Un gate en rojo pone tope a la nota del revisor', 'Un detalle que conviene copiar: una comprobación determinista en rojo pone tope a la nota. La opinión de un modelo nunca la compensa.'] ] },
    { t: 'El cuello de botella se mueve', p: [
      ['Pasas de estar dentro del bucle a estar encima', 'Con el workflow pasas de estar dentro del bucle a estar encima.'],
      ['Ahora el cuello de botella es la especificación', 'Y el cuello de botella se mueve. Ya no está en implementar, está en la especificación: lo que le pides no llega bajado a tierra.'] ] } ] },

  { n: '07', slug: 'especificacion', titulo: 'Especificación', escenas: [
    { t: 'La condición de parada', p: [
      ['Un sistema que trabaja sin ti necesita saber cuándo ha terminado', 'Un sistema que trabaja sin ti necesita saber cuándo ha terminado. Y eso no lo decide él.'],
      ['El criterio de aceptación es la condición de parada', 'El criterio de aceptación deja de ser una formalidad del ticket, y pasa a ser la condición de parada.'] ] },
    { t: 'Describir no es especificar', c: 'Descrito:\n  Añade un buscador de Pokémon.\n\nEspecificado:\n  «PIKA» encuentra a Pikachu.\n  «chu» también lo encuentra.\n  Con menos de dos letras\n    no busca.\n  Sin resultados, dice «Ningún\n    Pokémon se llama así».', p: [
      ['Si lo tiene que mirar una persona, has descrito', 'Si para saber si ha terminado tiene que mirarlo una persona, no has especificado. Has descrito.'],
      ['Cada línea la comprueba alguien que no estuvo', 'En una especificación, cada línea la puede comprobar alguien que no estuvo en la conversación. Y por tanto, un agente.'] ] },
    { t: 'Las cuatro piezas', p: [
      ['Conocimiento de negocio: el que no está en el repositorio', 'Una definición que sirve tiene cuatro piezas. El conocimiento de negocio que no está en el repositorio.'],
      ['Intención: para qué se hace', 'La intención: para qué se hace, y qué problema resuelve.'],
      ['Restricciones: lo que no se puede tocar ni romper', 'Las restricciones: lo que no se puede tocar ni romper.'],
      ['Criterios de aceptación comprobables sin opinar', 'Y los criterios de aceptación, en una forma que alguien pueda comprobar sin opinar.'] ] },
    { t: 'Cuánto especificar', p: [
      ['La especificación mínima solo parece barata', 'La especificación mínima solo parece barata, hasta que cuentas el retrabajo.'],
      ['Con varios agentes, el óptimo se va a la derecha', 'Con varios agentes, conviene especificar más: cada uno reinterpreta lo que recibe, y el error se acumula en cada traspaso.'],
      ['Spec-first: que exista antes que el código', 'Lo que el curso propone es spec-first: que la condición de parada exista antes de que exista el código.'] ] } ] },

  { n: '08', slug: 'verificacion', titulo: 'Verificación', escenas: [
    { t: 'Quince PRs que no has visto escribir', p: [
      ['¿Cuáles no vas a leer?', 'Tienes quince pull requests que no has visto escribir. ¿Cuáles no vas a leer?'],
      ['No es si dejas de leer: es si lo decides tú o te pasa', 'La cuestión no es si vas a dejar de leer. Es si lo decides tú, o te pasa.'] ] },
    { t: 'Tres carriles y un embudo', p: [
      ['Se lee entero · Por muestreo · Se fusiona solo', 'Hay tres carriles. Se lee entero, línea a línea. Por muestreo, con un revisor automático delante. O se fusiona solo.'],
      ['01 Zonas vetadas · 02 Quién lo escribió · 03 Señales del diff', 'El carril se decide en un embudo de cinco etapas. Tres reglas: zonas vetadas, quién lo escribió, y señales del diff.'],
      ['04 Nota de riesgo: un modelo que cierra, nunca abre', 'Después, una nota de riesgo que pone un modelo. Y ese modelo cierra, nunca abre.'],
      ['05 Red de garantías', 'Y al final, la red de garantías.'],
      ['Cada etapa solo puede mandar a un carril más lento', 'La regla de oro: cada etapa solo puede mandar el cambio a un carril más lento.'] ] },
    { t: 'Que la red no se encoja', p: [
      ['Pedirle que no toque los tests no funciona', 'Pedirle al agente que no toque los tests no funciona. Cuando la especificación y los tests chocan, los modelos modifican los tests.'],
      ['La red puede crecer sola; encogerse sube de carril', 'Así que la red puede crecer sola, con tests nuevos. Pero modificar un test que ya existía, o relajar un umbral, sube de carril.'],
      ['Tocar un test es legítimo si cambió la especificación', '¿Cuándo es legítimo tocar un test? Cuando cambió la especificación. Si no cambió, es sospechoso.'],
      ['El carril verde se abre con evidencia, no con fe', 'Y el carril verde se abre con evidencia, no con fe: empieza estrecho, mide, y ajusta.'] ] } ] },

  { n: '09', slug: 'despues-de-delegar', titulo: 'Después de delegar', escenas: [
    { t: 'Varios agentes a la vez', p: [
      ['Un worktree: otra copia del repositorio, en su rama', 'Si ya corre solo, puedes lanzar varios. Cada agente trabaja en un worktree: otra copia del repositorio, en su propia rama.'],
      ['Lo que no está en git no viene con la copia', 'Crear la copia es un comando. Lo difícil es que arranque, porque lo que no está en git no viene con ella: secretos, dependencias, servicios, puertos y datos.'],
      ['Aislar la ejecución no evita el choque al integrar', 'Y aislar la ejecución no evita el choque al integrar. Parte el trabajo por zonas que no se tocan.'] ] },
    { t: 'El coste y el largo plazo', p: [
      ['Con cinco agentes, el cuello de botella eres tú', 'Con cinco agentes, el cuello de botella eres tú: cinco colas de revisión, y cinco saltos de contexto.'],
      ['Tokens, infraestructura, comprobaciones y mantenimiento', 'Y cuesta: tokens, infraestructura, comprobaciones, y mantener el propio sistema. La pregunta es si cuesta menos que el tiempo que liberas.'],
      ['El código dice qué hace, no por qué', 'Para que dure, escribe lo que el código no explica: un glosario del negocio, y las decisiones difíciles de revertir.'],
      ['Cada cambio pasa; el conjunto puede empeorar', 'Y vigila el conjunto. Cada cambio pasa la red, pero la complejidad y la duplicación crecen. Hacen falta métricas de calidad.'] ] } ] },

  { n: '10', slug: 'llevarlo-al-equipo', titulo: 'Llevarlo al equipo', escenas: [
    { t: 'Diagnosticar', p: [
      ['Nada de esto aguanta si es de una sola persona', 'El último problema no es técnico. Nada de esto aguanta si es de una sola persona.'],
      ['VSM: cada paso, con IA activa, posible o no aplica', 'Primero, diagnosticar. Dibuja cada paso desde la necesidad hasta producción, y márcalo: inteligencia artificial activa, posible, o no aplica. Lo posible es por donde avanzar.'],
      ['Gauntlet: nueve campos, de 0 a 4', 'Y mide tu red con una auditoría: nueve campos, puntuados de cero a cuatro. Te dice dónde mirar.'] ] },
    { t: 'Compartir y mejorar', p: [
      ['Tu capa no se versiona; el repositorio sí', 'Segundo, compartir. Tu configuración personal no se versiona. Lo del equipo vive en el repositorio.'],
      ['Pruebas en tu capa → lo usa más gente → sube al repositorio', 'El camino es: lo pruebas tú, lo usa más gente, y sube al repositorio.'],
      ['Reunión de mejora continua del flujo con IA', 'Tercero, mejorar. Una retrospectiva sobre el flujo: qué falla, cómo mejoramos el sistema, y qué podemos añadir.'],
      ['La curva J: al principio cuesta, después compensa', 'Y paciencia con la curva jota: cualquier mejora al principio cuesta, y después compensa.'] ] } ] },

  { n: '11', slug: 'otros-temas', titulo: 'Otros temas', escenas: [
    { t: 'Cosas que tienes que saber que existen', p: [
      ['Antes de adoptar un flujo ajeno: cuatro preguntas', 'Antes de adoptar un flujo ya escrito, cuatro preguntas: qué fases tiene, dónde para, si limpia el contexto, y qué artefactos deja.'],
      ['El IDE es para editar; el ADE, para supervisar', 'El editor está hecho para que tú edites. Los entornos de agentes, para que tú supervises.'],
      ['Bucles sin nadie delante: miran el sistema entero', 'Hay bucles que corren sin nadie delante: triaje de errores, vigilancia de la integración, mutación general. Lo que producen entra por los mismos carriles.'],
      ['MCP solo cuando aporta algo que la CLI no da', 'Usa un servidor MCP solo cuando aporta algo que la línea de comandos no da.'] ] },
    { t: 'Tres riesgos reales', p: [
      ['Inyección: todo lo que el agente lee es entrada no confiable', 'Tres riesgos. Inyección: todo lo que el agente lee es entrada no confiable.'],
      ['Filtrado de datos hacia terceros', 'Filtrado: secretos y código que salen hacia terceros.'],
      ['Permisos: lo que tú puedes borrar, él también', 'Y permisos: el agente tiene los tuyos. Todo lo que tú puedes hacer, puede hacerlo él.'] ] } ] },

  { n: '12', slug: 'cierre', titulo: 'Cierre: la escala de uso', escenas: [
    { t: 'La escala de uso', p: [
      ['Prompting → sesiones y rules → RPI', 'Cada escalón se mide en dos ejes: qué haces tú, y cuánto lees. Al principio pides sin especificar, y lo lees todo.'],
      ['Garantías y guardarraíles: lees todo, pero te fías más', 'Con garantías y guardarraíles fijas el criterio. Sigues leyendo, pero te fías más.'],
      ['Workflow: lees el resultado y lo que la red señala', 'Con el workflow defines la tarea y lees solo el resultado, y lo que la red señala.'],
      ['El sistema: lees solo lo que merece tus ojos', 'Y con el sistema completo preparas la tarea, supervisas, y lees solo lo que merece tus ojos.'] ] },
    { t: 'Por dónde empezar', p: [
      ['Mide tu contexto y escribe unas rules cortas', 'Para empezar el lunes: mide tu contexto, y escribe unas rules cortas, con el porqué de cada una.'],
      ['Convierte en garantía lo que ya tienes instalado', 'Convierte en garantía lo que ya tienes instalado: que detenga, en vez de avisar. Y pon un ratchet sobre la deuda.'],
      ['Un hook, criterios comprobables y un carril verde estrecho', 'Después, un hook, criterios de aceptación comprobables, y un primer carril verde, estrecho.'],
      ['Las herramientas las tendrán todos. El sistema, no', 'En seis meses todos tendrán las mismas herramientas. El sistema, no. Se construye ahora.'] ] } ] },
]
