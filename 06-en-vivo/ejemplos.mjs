// Los ejemplos en vivo: SIEMPRE el mismo encargo (el del curso), lanzado dos veces
// cambiando solo lo que rodea al agente. Cada variante parte de una copia limpia de
// 06-en-vivo/pokedex a la que se le quitan piezas (`quitar`) o se le reescribe algún fichero (`escribir`).
// `copiar` mueve ficheros dentro de la copia antes de quitar nada ({ destino: origen }); `ocultar` los deja fuera de git.
// Las comprobaciones son nombres de 06-en-vivo/comprobar/revisar.mjs: las lanza el servidor, no el agente.

export const ENCARGO = 'Añade al proyecto web una tabla interactiva con las ventajas y desventajas entre todos los tipos de Pokémon.'

const REGLAS = ['AGENTS.md', 'CLAUDE.md']
const CONTEXTO = ['CONTEXT.md']
const HOOKS = ['.claude/settings.json']
const SKILL_PANTALLA = ['.claude/skills/pantalla-nueva']
const SKILL_IMPLEMENTAR = ['.claude/skills/implementar']
const SKILLS = ['.claude/skills']
// Sin red: ni comprobaciones ni hooks. El package.json se queda solo con los tests.
const RED = ['tools', '.claude/settings.json']
const PAQUETE_SIN_RED = `${JSON.stringify({ name: 'pokedex-kanto', private: true, type: 'module', scripts: { test: 'node --test test/*.test.mjs' } }, null, 2)}\n`
// Solo el hook: la red no está en tools/ ni en package.json. Nadie le ha contado al agente que existe;
// se entera cuando el hook lo detiene. Es lo que pasa cuando un equipo añade un guardarraíl sin tocar las reglas.
const AJUSTES_HOOK = `${JSON.stringify({
  // El guardarraíl es una caja negra para el agente, como lo sería un servicio del equipo: no puede leerlo ni tocarlo.
  permissions: { deny: ['Read(./.claude/**)', 'Edit(./.claude/**)'] },
  hooks: {
  PostToolUse: [{ matcher: 'Edit|Write|MultiEdit', hooks: [{ type: 'command', command: 'node .claude/hooks/guardarrail.mjs edit' }] }],
  Stop: [{ hooks: [{ type: 'command', command: 'node .claude/hooks/guardarrail.mjs stop' }] }],
} }, null, 2)}\n`
const SOLO_HOOK = {
  copiar: { '.claude/hooks/comprobar.mjs': 'tools/comprobar.mjs', '.claude/hooks/guardarrail.mjs': 'tools/guardarrail.mjs' },
  quitar: [...REGLAS, ...CONTEXTO, ...SKILLS, 'tools'],
  escribir: { 'package.json': PAQUETE_SIN_RED, '.claude/settings.json': AJUSTES_HOOK },
  ocultar: ['.claude/'], // como la configuración de equipo: está en la máquina, no entre los ficheros del proyecto
}
const SOLO_CODIGO = { quitar: [...REGLAS, ...CONTEXTO, '.claude', 'tools'], escribir: { 'package.json': PAQUETE_SIN_RED } }

const C = {
  tabla: ['tabla', 'Ha añadido la tabla a la web'],
  sintaxis: ['sintaxis', 'El JavaScript se puede cargar (sin errores de sintaxis)'],
  nombre: ['nombre', 'La llama «Tabla de combate», como decidió producto'],
  kanto: ['kanto', 'Solo los 15 tipos de Kanto clásico'],
  mitad: ['mitad', 'Escribe ×½, no 0,5'],
  novedades: ['novedades', 'Dejó la línea para producto en NOVEDADES.md'],
  criterio: ['criterio', 'El comportamiento nuevo tiene criterio en specs/'],
  menu: ['menu', 'La pantalla está enlazada en el menú'],
  plan: ['plan', 'Dejó un plan.md que se puede revisar'],
  red: ['red', 'Pasa la red del equipo (capas, colores y tamaño)'],
  patron: ['patron', 'Sigue el patrón de tabla del equipo'],
  tests: ['tests', 'Tests en verde y sin tocar los que ya existían'],
}
const comprobaciones = (...claves) => claves.map((k) => ({ id: C[k][0], nombre: C[k][1] }))

export const EJEMPLOS = [
  {
    id: 'contexto', tema: 'Contexto', titulo: 'Lo que no está escrito no existe',
    idea: 'El agente solo sabe lo que cabe en su ventana. Producto decidió cómo se llama la tabla, qué tipos entran y cómo se escribe la mitad de daño; nada de eso está en el código.',
    mira: 'El título de la pantalla, cuántos tipos tiene la tabla (15 o 18) y cómo escribe la mitad de daño.',
    guia: 'm02',
    variantes: [
      { id: 'sin', nombre: 'Sin contexto', rodea: 'Solo el código. Sin CONTEXT.md, sin reglas, sin hooks y sin skills.', quitar: [...REGLAS, ...CONTEXTO, '.claude'] },
      { id: 'con', nombre: 'Con contexto', rodea: 'Lo mismo, más CONTEXT.md con el glosario y las decisiones de producto.', quitar: ['AGENTS.md', '.claude'], escribir: { 'CLAUDE.md': '@CONTEXT.md\n' } },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'nombre', 'kanto', 'mitad'),
  },
  {
    id: 'reglas', tema: 'Reglas', titulo: 'Los acuerdos del equipo, escritos',
    idea: 'AGENTS.md lleva los acuerdos del equipo con su porqué. Un buen modelo deduce mucho leyendo el código, pero un acuerdo que no está en ningún fichero no lo puede adivinar. Son probabilísticas: casi siempre se cumplen.',
    mira: 'Si anota el cambio en NOVEDADES.md, si lo especifica antes de programarlo y si enlaza la pantalla en el menú.',
    guia: 'm05-tres-escalones',
    variantes: [
      { id: 'sin', nombre: 'Sin reglas', rodea: 'Solo el código y la red. Sin AGENTS.md, sin contexto, sin hooks y sin skills.', quitar: [...REGLAS, ...CONTEXTO, '.claude'] },
      { id: 'con', nombre: 'Con reglas', rodea: 'Lo mismo, más AGENTS.md con los acuerdos del equipo. Sin hooks: aquí solo actúan las reglas escritas.', quitar: [...CONTEXTO, '.claude'] },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'novedades', 'criterio', 'menu', 'red'),
  },
  {
    id: 'skill', tema: 'Skills', titulo: 'La misma tabla, con el patrón del equipo',
    idea: 'Una skill es un proceso tuyo empaquetado: instrucciones, una hoja de estilos y un validador. Al arrancar solo entran su nombre y su descripción; el resto se carga cuando hace falta.',
    mira: 'Sin skill la tabla funciona, pero cada vez sale distinta. Con skill lleva la leyenda, el resaltado de fila y columna, el filtro en la dirección y el mismo aspecto que el resto de tablas del equipo.',
    guia: 'm06-que-es-una-skill',
    variantes: [
      { id: 'sin', nombre: 'Sin skill', rodea: 'El proyecto completo (reglas, contexto, hooks), pero sin la skill pantalla-nueva.', quitar: SKILLS },
      { id: 'con', nombre: 'Con skill', rodea: 'Lo mismo, más .claude/skills/pantalla-nueva: SKILL.md, la hoja de estilos del patrón y su validador.', quitar: SKILL_IMPLEMENTAR },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'patron', 'red'),
  },
  {
    id: 'hook', tema: 'Hooks', titulo: 'La red que detiene',
    idea: 'Una regla escrita se cumple casi siempre; un hook, siempre. Tras cada edición pasa la red del equipo; si falla, sale con código 2 y el motivo lo lee el agente, no tú.',
    mira: 'Con hook, abre «Todo lo que hizo» y busca las paradas en rojo: el hook lo detiene, le dice por qué y él corrige. Sin red nadie le dice que hay un límite de tamaño ni que los colores van en un solo fichero.',
    guia: 'm05-el-hook-de-punta-a-punta',
    variantes: [
      { id: 'sin', nombre: 'Sin red', rodea: 'Solo el código. Sin reglas escritas, sin comprobaciones y sin hooks.', ...SOLO_CODIGO },
      { id: 'con', nombre: 'Con hook', rodea: 'El mismo código, sin reglas escritas, más un hook de la configuración del equipo que pasa la red tras cada edición y al terminar. No está entre los ficheros del proyecto y nadie le ha avisado de que existe.', ...SOLO_HOOK },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'red', 'tests'),
  },
  {
    id: 'workflow', tema: 'Workflow', titulo: 'El mismo encargo, llevado por fases',
    idea: 'Un workflow fija el orden: investigar, planificar, especificar, implementar y verificar, cada fase con algo prohibido. El plan es lo único que puedes revisar antes del código.',
    mira: 'El plan.md que deja, con las decisiones que tomó por su cuenta, y que el criterio entra en specs/ antes que el código.',
    guia: 'm06-el-workflow-implement',
    prefijoCon: '/implementar ',
    variantes: [
      { id: 'sin', nombre: 'Encargo directo', rodea: 'Reglas y contexto, sin hooks y sin workflow.', quitar: ['.claude'] },
      { id: 'con', nombre: 'Con /implementar', rodea: 'Lo mismo, más la skill implementar, que marca las seis fases.', quitar: [...HOOKS, ...SKILL_PANTALLA], conPrefijo: true },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'plan', 'criterio', 'novedades', 'red'),
  },
  {
    id: 'harness', tema: 'Harness', titulo: 'Todo junto: pedir frente a delegar',
    idea: 'El harness es todo lo que rodea al modelo: contexto, reglas, skills, hooks y comprobaciones. El modelo es el mismo en las dos columnas; lo que cambia es el repositorio.',
    mira: 'Cuánto tendrías que leer para aceptar cada resultado. En una columna, todo. En la otra, lo que señala la red.',
    guia: 'm05-mapa-final-del-dia-1',
    variantes: [
      { id: 'sin', nombre: 'Solo el modelo', rodea: 'El código y nada más.', ...SOLO_CODIGO },
      { id: 'con', nombre: 'Con el harness', rodea: 'Contexto, reglas, skills, hooks y la red de comprobaciones.', quitar: [] },
    ],
    comprobaciones: comprobaciones('tabla', 'sintaxis', 'nombre', 'kanto', 'novedades', 'criterio', 'patron', 'red', 'tests'),
  },
]
