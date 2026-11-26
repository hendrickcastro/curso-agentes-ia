// Los ejemplos en vivo: el MISMO prompt lanzado dos veces, cambiando solo lo que rodea al agente.
// Cada variante parte de una copia limpia de 02-ejemplos-codigo/demo a la que se le quitan piezas.
//
// Comprobaciones (las ejecuta el servidor al terminar, no el agente):
//   { cmd, espera: 'codigo0' | 'salida' | 'vacia' }   un comando en la copia de trabajo
//   { existe: 'ruta' }                                 que el agente haya dejado ese fichero
//   { respuesta: 'regex' }                             que la respuesta final contenga algo
// {REPO} se sustituye por la raíz de este repositorio.

const REGLAS = ['AGENTS.md', 'CLAUDE.md', 'CONTEXT.md']
const HOOKS = ['.claude/settings.json']
const SKILL_CARTA = ['.claude/skills/carta-pokemon']
const SKILL_IMPLEMENTAR = ['.claude/skills/implementar']
const TODO = [...REGLAS, '.claude']

const VERDE = { nombre: 'Tests y ratchet en verde', cmd: 'npm run -s check', espera: 'codigo0' }
const CRITERIO = { nombre: 'El comportamiento nuevo entró como criterio en specs/', cmd: 'git status --short -- specs', espera: 'salida' }
const TESTS_INTACTOS = { nombre: 'No tocó tests que ya existían', cmd: 'git diff --name-only HEAD -- test', espera: 'vacia' }
const FRONTERA = { nombre: 'Las vistas no llaman a la API', cmd: 'npm run -s ratchet', espera: 'codigo0' }

const LIMITE = 'Haz que el buscador muestre como máximo 3 resultados y avise de cuántos más hay.'

export const EJEMPLOS = [
  {
    id: 'contexto',
    tema: 'Contexto',
    titulo: 'Lo que no está escrito no existe',
    idea: 'El agente solo sabe lo que cabe en su ventana. Un fichero corto que apunta al conocimiento del negocio cambia la respuesta.',
    prompt: 'Sin escribir código: ¿en qué orden deben salir los resultados del buscador y quién decide el mensaje de «sin resultados»? Responde en tres líneas y di de qué fichero sacas cada cosa.',
    mira: 'Qué ficheros lee antes de contestar, y si la respuesta sale de una decisión escrita o de lo que deduce del código.',
    guia: 'm02',
    variantes: [
      { id: 'sin', nombre: 'Sin contexto', rodea: 'Solo el código. Sin AGENTS.md, CLAUDE.md ni CONTEXT.md.', quitar: REGLAS },
      { id: 'con', nombre: 'Con contexto', rodea: 'CLAUDE.md → AGENTS.md → CONTEXT.md, con el glosario y las decisiones de negocio.', quitar: [] },
    ],
    comprobaciones: [
      { nombre: 'Contesta «orden de la Pokédex nacional»', respuesta: 'pok[eé]dex nacional' },
      { nombre: 'Sabe que el mensaje lo decide producto', respuesta: 'producto' },
    ],
  },
  {
    id: 'reglas',
    tema: 'Reglas',
    titulo: 'Las reglas del equipo, escritas',
    idea: 'AGENTS.md lleva los acuerdos del equipo con su porqué. Sin él, el agente decide por su cuenta dónde va cada cosa. Son probabilísticas: casi siempre se cumplen.',
    prompt: LIMITE,
    mira: 'Si el criterio nuevo entra en specs/ antes que el código, si toca tests que ya existían y qué decide sin preguntar (el texto del aviso, dónde va el límite).',
    guia: 'm05-tres-escalones',
    variantes: [
      { id: 'sin', nombre: 'Sin reglas', rodea: 'Solo el código. Sin AGENTS.md, sin contexto y sin hooks.', quitar: TODO },
      { id: 'con', nombre: 'Con reglas', rodea: 'AGENTS.md y CONTEXT.md. Sin hooks: aquí solo actúan las reglas escritas.', quitar: HOOKS },
    ],
    comprobaciones: [CRITERIO, TESTS_INTACTOS, VERDE],
  },
  {
    id: 'skill',
    tema: 'Skills',
    titulo: 'La carta de Pikachu, sin skill y con skill',
    idea: 'Una skill es un proceso tuyo empaquetado: instrucciones, una plantilla y scripts. Al arrancar solo entran su nombre y su descripción; el resto se carga cuando hace falta.',
    prompt: 'Hazme la carta de Pikachu y guárdala en cartas/pikachu.md',
    mira: 'Sin skill inventa el formato y los datos. Con skill carga el SKILL.md, saca los datos con un script, rellena la plantilla del equipo y se valida sola.',
    guia: 'm06-que-es-una-skill',
    variantes: [
      { id: 'sin', nombre: 'Sin skill', rodea: 'El proyecto completo, pero sin la skill carta-pokemon.', quitar: SKILL_CARTA },
      { id: 'con', nombre: 'Con skill', rodea: '.claude/skills/carta-pokemon/: SKILL.md, plantilla.md, datos del equipo y dos scripts.', quitar: [] },
    ],
    mostrar: ['cartas/pikachu.md'],
    comprobaciones: [
      { nombre: 'La carta sigue el formato y los datos del equipo', cmd: 'node "{REPO}/02-ejemplos-codigo/demo/.claude/skills/carta-pokemon/scripts/validar.mjs" cartas/pikachu.md', espera: 'codigo0' },
    ],
  },
  {
    id: 'hook',
    tema: 'Hooks',
    titulo: 'El hook para al agente',
    idea: 'Una regla escrita se cumple casi siempre; un hook, siempre. Sale con código 2 y escribe el motivo por stderr: quien lo lee es el agente, no tú.',
    prompt: 'Tengo prisa. Sin explorar el proyecto ni leer otros ficheros, edita solo src/ui/buscadorView.mjs para que muestre también el tipo de cada Pokémon, pidiéndolo con fetch a PokéAPI desde la propia vista.',
    mira: 'El prompt empuja al agente a saltarse el acuerdo del equipo sin mirar nada. Con hook: edita la vista, el hook lo detiene, lee el motivo y cambia de rumbo. Sin hook: la llamada se queda en la vista y nadie se entera.',
    guia: 'm05-el-hook-de-punta-a-punta',
    variantes: [
      { id: 'sin', nombre: 'Sin hook', rodea: 'Sin reglas escritas y sin hooks. La comprobación existe, pero nadie la lanza.', quitar: [...REGLAS, ...HOOKS] },
      { id: 'con', nombre: 'Con hook', rodea: 'Sin reglas escritas, pero con .claude/settings.json: un hook tras cada edición y otro al terminar.', quitar: REGLAS },
    ],
    comprobaciones: [FRONTERA],
  },
  {
    id: 'workflow',
    tema: 'Workflow',
    titulo: 'El mismo encargo, llevado por fases',
    idea: 'Un workflow fija el orden: investigar, planificar, especificar, implementar y verificar, cada fase con algo prohibido. El plan es lo único que puedes revisar antes del código.',
    prompt: 'Haz que la búsqueda ignore las tildes: «pikachú» tiene que encontrar a Pikachu.',
    promptCon: '/implementar Haz que la búsqueda ignore las tildes: «pikachú» tiene que encontrar a Pikachu.',
    mira: 'Con workflow deja un plan.md con las decisiones que tomó por su cuenta, y el criterio entra en specs/ antes que el código.',
    guia: 'm06-el-workflow-implement',
    variantes: [
      { id: 'sin', nombre: 'Encargo directo', rodea: 'Reglas y contexto, pero sin workflow y sin hooks.', quitar: [...HOOKS, ...SKILL_IMPLEMENTAR] },
      { id: 'con', nombre: 'Con /implementar', rodea: 'Lo mismo, más la skill implementar, que marca las seis fases.', quitar: HOOKS, usaPromptCon: true },
    ],
    mostrar: ['plan.md'],
    comprobaciones: [{ nombre: 'Dejó un plan que se puede revisar', existe: 'plan.md' }, CRITERIO, TESTS_INTACTOS, VERDE],
  },
  {
    id: 'harness',
    tema: 'Harness',
    titulo: 'Todo junto: pedir frente a delegar',
    idea: 'El harness es todo lo que rodea al modelo: contexto, reglas, skills, hooks y comprobaciones. El modelo es el mismo en las dos columnas; lo que cambia es el repositorio.',
    prompt: LIMITE,
    mira: 'Cuánto tendrías que leer para aceptar cada resultado. En una columna, todo. En la otra, lo que señala la red.',
    guia: 'm05-mapa-final-del-dia-1',
    variantes: [
      { id: 'sin', nombre: 'Solo el modelo', rodea: 'El código y nada más.', quitar: TODO },
      { id: 'con', nombre: 'Con el harness', rodea: 'Contexto, reglas, skills, hooks y la red de comprobaciones.', quitar: [] },
    ],
    comprobaciones: [CRITERIO, TESTS_INTACTOS, FRONTERA, VERDE],
  },
]
