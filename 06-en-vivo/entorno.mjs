// El entorno de quien ejecuta el curso: dónde está cada cosa en este equipo y si funciona.
//
// Lo que no se encuentra solo se puede fijar en `entorno.json` (en la raíz, fuera de git):
//
//   {
//     "claude":  "C:\\Users\\ana\\.local\\bin\\claude.exe",    ejecutable de Claude Code, o su carpeta
//     "gitBash": "C:\\Program Files\\Git\\bin\\bash.exe",       solo Windows: el bash que usa Claude Code
//     "path":    ["C:\\Program Files\\Git\\cmd"],               carpetas que se añaden al PATH (git, node…)
//     "modelo":  "claude-opus-5-5"
//   }
//
// Se relee en cada uso: un cambio vale sin reiniciar el servidor.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '')
export const FICHERO = join(RAIZ, 'entorno.json')
export const WINDOWS = process.platform === 'win32'
const CLAVES = ['claude', 'gitBash', 'path', 'modelo']
const PATH_ORIGINAL = process.env.PATH ?? process.env.Path ?? ''
const CASA = homedir()
const esFichero = (ruta) => { try { return statSync(ruta).isFile() } catch { return false } }
const esCarpeta = (ruta) => { try { return statSync(ruta).isDirectory() } catch { return false } }

// Admite rutas escritas al estilo de Git Bash (/c/Users/ana) o con ~, y quita las comillas de un pegado.
export function normalizar(ruta) {
  let r = String(ruta ?? '').trim().replace(/^["']|["']$/g, '')
  if (r.startsWith('~')) r = join(CASA, r.slice(1))
  if (WINDOWS) r = r.replace(/^\/([a-zA-Z])\//, (_, unidad) => `${unidad.toUpperCase()}:\\`).replaceAll('/', '\\')
  return r.replace(/[\\/]+$/, '')
}

export function ajustes() {
  let datos = {}
  let error = null
  if (existsSync(FICHERO)) { try { datos = JSON.parse(readFileSync(FICHERO, 'utf8')) } catch (e) { error = `entorno.json no es JSON válido: ${e.message}` } }
  const extra = (Array.isArray(datos.path) ? datos.path : []).map(normalizar).filter(Boolean)
  process.env.PATH = [...extra, PATH_ORIGINAL].join(delimiter)
  return { datos, error }
}

export function guardarAjustes(nuevos) {
  const { datos } = ajustes()
  for (const clave of CLAVES) {
    if (!(clave in nuevos)) continue
    const valor = nuevos[clave]
    if (valor === '' || valor == null) delete datos[clave]
    else datos[clave] = clave === 'path' ? [].concat(valor).map(String) : String(valor)
  }
  writeFileSync(FICHERO, `${JSON.stringify(datos, null, 2)}\n`)
}

export const modelo = () => process.env.MODELO ?? ajustes().datos.modelo ?? 'claude-opus-5-5'

// ---------- localizar ejecutables ----------
const EXTENSIONES = WINDOWS ? ['.exe', '.cmd', '.bat', ''] : ['']
const enCarpeta = (carpeta, nombre) => EXTENSIONES.map((ext) => join(carpeta, nombre + ext)).find(esFichero)
const enPath = (nombre, mas = []) => {
  for (const carpeta of [...(process.env.PATH ?? '').split(delimiter), ...mas]) { const ruta = carpeta && enCarpeta(carpeta, nombre); if (ruta) return ruta }
  return null
}
const HABITUALES_CLAUDE = process.env.CURSO_SIN_BUSCAR ? [] : [
  join(CASA, '.local/bin'), join(CASA, '.claude/local'), join(CASA, '.npm-global/bin'), '/usr/local/bin', '/opt/homebrew/bin',
  join(CASA, 'AppData/Roaming/npm'), join(CASA, 'AppData/Local/Programs/claude'),
]
const HABITUALES_BASH = ['C:\\Program Files\\Git\\bin\\bash.exe', 'C:\\Program Files (x86)\\Git\\bin\\bash.exe', join(CASA, 'AppData/Local/Programs/Git/bin/bash.exe')]

// Devuelve cómo lanzar Claude Code en este equipo, o null si no aparece.
export function claude() {
  const { datos } = ajustes()
  const pedido = process.env.CLAUDE ?? datos.claude
  let ruta = null
  if (pedido) {
    const r = normalizar(pedido)
    ruta = esFichero(r) ? r : esCarpeta(r) ? enCarpeta(r, 'claude') : (enPath(pedido) ?? null)
    if (!ruta) return null // se indicó una ruta y no vale: mejor decirlo que usar otra a escondidas
  } else ruta = enPath('claude', HABITUALES_CLAUDE)
  if (!ruta) return null
  // Un .cmd de npm no se puede lanzar sin pasar por cmd.exe, que rompe los argumentos con espacios:
  // se lanza directamente el JavaScript que hay detrás.
  if (/\.(cmd|bat)$/i.test(ruta)) {
    const cli = join(dirname(ruta), 'node_modules/@anthropic-ai/claude-code/cli.js')
    if (esFichero(cli)) return { ruta, cmd: process.execPath, pre: [cli], shell: false }
    return { ruta, cmd: `"${ruta}"`, pre: [], shell: true }
  }
  return { ruta, cmd: ruta, pre: [], shell: false }
}

function entornoHijo() {
  const { datos } = ajustes()
  const env = { ...process.env }
  if (WINDOWS && datos.gitBash) env.CLAUDE_CODE_GIT_BASH_PATH = normalizar(datos.gitBash)
  return env
}
const entreComillas = (c, args) => (c.shell ? args.map((a) => `"${String(a).replaceAll('"', '\\"')}"`) : args)

export function lanzarClaude(args, opciones = {}) {
  const c = claude()
  if (!c) throw new Error('No encuentro Claude Code en este equipo. Revisa el entorno (arriba, en «En vivo»).')
  return spawn(c.cmd, entreComillas(c, [...c.pre, ...args]), { shell: c.shell, env: entornoHijo(), stdio: ['ignore', 'pipe', 'pipe'], ...opciones })
}

export function versionClaude() {
  const c = claude()
  if (!c) return null
  const r = spawnSync(c.cmd, entreComillas(c, [...c.pre, '--version']), { encoding: 'utf8', shell: c.shell, env: entornoHijo(), timeout: 20_000 })
  return r.status === 0 ? r.stdout.trim().split('\n')[0] : null
}

// ---------- las pruebas ----------
const salida = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 15_000 }); return r.status === 0 ? r.stdout.trim().split('\n')[0] : null }

function probarSesion() {
  return new Promise((listo) => {
    let hijo
    try { hijo = lanzarClaude(['-p', 'Responde solo con la palabra OK.', '--model', modelo(), '--output-format', 'json', '--no-session-persistence', '--strict-mcp-config'], { cwd: RAIZ }) } catch (e) { listo({ ok: false, detalle: e.message }); return }
    let fuera = ''
    let errores = ''
    const limite = setTimeout(() => hijo.kill(), 120_000)
    hijo.stdout.on('data', (t) => { fuera += t })
    hijo.stderr.on('data', (t) => { errores += t })
    hijo.on('error', (e) => { clearTimeout(limite); listo({ ok: false, detalle: e.message }) })
    hijo.on('close', (codigo) => {
      clearTimeout(limite)
      let r = null
      try { r = JSON.parse(fuera) } catch { /* no contestó en JSON */ }
      if (codigo === 0 && r && !r.is_error) listo({ ok: true, detalle: `El modelo ${modelo()} contesta («${String(r.result).trim().slice(0, 40)}») en ${Math.round((r.duration_ms ?? 0) / 1000)} s.` })
      else listo({ ok: false, detalle: `${String(r?.result ?? '').slice(0, 600)} ${errores.trim().slice(-600)}`.trim() || `Claude Code salió con código ${codigo} sin explicar nada.` })
    })
  })
}

export async function revisarEntorno({ completo = false } = {}) {
  const { datos, error } = ajustes()
  const pruebas = []
  const prueba = (id, nombre, ok, detalle, arreglo = '') => pruebas.push({ id, nombre, ok, detalle, arreglo: ok ? '' : arreglo })

  const nodeMayor = Number(process.versions.node.split('.')[0])
  prueba('sistema', 'Sistema y Node', nodeMayor >= 20, `${{ win32: 'Windows', darwin: 'macOS', linux: 'Linux' }[process.platform] ?? process.platform} (${process.arch}) · Node ${process.version}`, 'Hace falta Node 20 o superior: https://nodejs.org')

  if (error) prueba('ajustes', 'entorno.json', false, error, 'Corrige el fichero o bórralo.')

  const faltan = ['servidor.mjs', '04-site/index.html', '06-en-vivo/pokedex/index.html', '06-en-vivo/pokedex/src/app.js', '06-en-vivo/comprobar/revisar.mjs'].filter((f) => !esFichero(join(RAIZ, f)))
  let escribe = true
  try { const p = join(RAIZ, '06-en-vivo/ejecuciones/.prueba'); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, ''); rmSync(p) } catch { escribe = false }
  prueba('curso', 'Archivos del curso', !faltan.length && escribe, faltan.length ? `En ${RAIZ} faltan: ${faltan.join(', ')}` : escribe ? RAIZ : `No se puede escribir en ${join(RAIZ, '06-en-vivo/ejecuciones')}`,
    faltan.includes('04-site/index.html') && faltan.length === 1 ? 'Genera el site: node 04-site/build.mjs' : 'Clona de nuevo el repositorio o mueve el servidor a la carpeta donde está el curso.')

  const git = salida('git', ['--version'])
  prueba('git', 'Git', Boolean(git), git ?? 'No encuentro «git» en el PATH.', 'Instálalo (https://git-scm.com) o añade su carpeta en "path" de entorno.json.')

  if (WINDOWS) {
    const bash = [datos.gitBash && normalizar(datos.gitBash), process.env.CLAUDE_CODE_GIT_BASH_PATH, enPath('bash'), ...HABITUALES_BASH].filter(Boolean).find(esFichero)
    prueba('bash', 'Git Bash (lo necesita Claude Code en Windows)', Boolean(bash), bash ?? 'No encuentro bash.exe.', 'Instala Git para Windows o indica la ruta de bash.exe en "gitBash" de entorno.json.')
  }

  const c = claude()
  const pedido = process.env.CLAUDE ?? datos.claude
  const version = c ? versionClaude() : null
  prueba('claude', 'Claude Code', Boolean(version), version ? `${version} · ${c.ruta}` : c ? `Está en ${c.ruta}, pero no arranca.` : pedido ? `La ruta indicada no vale: ${pedido}` : 'No encuentro «claude» ni en el PATH ni en las carpetas habituales.',
    'Indica abajo dónde está el ejecutable, o instálalo: https://claude.com/claude-code')

  if (process.platform === 'linux') {
    const bwrap = Boolean(enPath('bwrap'))
    prueba('aislamiento', 'Aislamiento del agente', bwrap, bwrap ? 'bubblewrap disponible.' : 'Falta bubblewrap (bwrap), que es lo que aísla al agente.', 'Instálalo: sudo apt install bubblewrap socat')
  } else prueba('aislamiento', 'Aislamiento del agente', true, WINDOWS ? 'En Windows no hay aislamiento del sistema: el agente solo puede usar una lista corta de comandos.' : 'Aislamiento de Claude Code: el agente solo escribe dentro de su copia y no tiene red.')

  if (completo && version) {
    const r = await probarSesion()
    prueba('sesion', `Sesión iniciada y acceso a ${modelo()}`, r.ok, r.detalle, 'Abre una terminal, escribe «claude» e inicia sesión. Si el modelo no está en tu plan, cambia "modelo" en entorno.json.')
  }

  return { pruebas, bien: pruebas.every((p) => p.ok), ajustes: datos, fichero: FICHERO, sistema: process.platform, modelo: modelo(), casa: CASA, completo: Boolean(completo && version) }
}

// ---------- el encargo para el agente que arregla el entorno ----------
export function promptArreglo(mensaje, historial, estado) {
  const anterior = historial.length ? `\nLo hablado hasta ahora:\n${historial.map((m) => `${m.quien === 'yo' ? 'Persona' : 'Tú'}: ${m.texto}`).join('\n')}\n` : ''
  return `Eres el asistente que deja listo el entorno de un curso para que funcione en ESTE equipo. Responde siempre en español, breve y sin tecnicismos innecesarios.

El curso es un servidor local (node servidor.mjs, en ${RAIZ}) que lanza Claude Code sobre copias de un proyecto de ejemplo. Para funcionar necesita: Node 20+, git, Claude Code con la sesión iniciada y, en Windows, Git Bash.

Sistema: ${process.platform} (${process.arch}) · carpeta personal: ${CASA}
PATH del servidor: ${PATH_ORIGINAL}

Resultado de las pruebas del entorno ahora mismo:
${JSON.stringify(estado.pruebas, null, 2)}

Lo único que puedes modificar es el fichero ${FICHERO} (créalo si no existe). Es JSON con estas claves, todas opcionales:
- "claude": ruta del ejecutable de Claude Code o de su carpeta.
- "gitBash": solo Windows, ruta de bash.exe de Git para Windows.
- "path": lista de carpetas que se añaden al PATH del servidor (por ejemplo donde está git).
- "modelo": identificador del modelo (por defecto claude-opus-5-5).
Contenido actual: ${JSON.stringify(estado.ajustes)}

Cómo trabajar:
1. Si la persona te da rutas, comprueba que existen antes de escribirlas. Si no existen, búscalas tú (ls, find, where, which) en los sitios habituales y dilo.
2. Escribe en entorno.json solo lo que haga falta. En Windows usa rutas de Windows (C:\\\\...) con las barras escapadas como exige JSON.
3. No instales nada, no inicies sesión y no toques ningún otro fichero del curso. Si falta instalar algo o iniciar sesión, da el comando exacto para que lo haga la persona.
4. El servidor relee entorno.json solo: no hay que reiniciarlo. Las pruebas se repiten automáticamente cuando termines.
5. Termina con dos o tres líneas: qué has cambiado y qué queda por hacer a mano, si queda algo.
${anterior}
La persona dice ahora:
${mensaje}`
}
