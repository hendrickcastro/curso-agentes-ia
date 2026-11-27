#!/usr/bin/env node
// Servidor local del curso. Sin dependencias (Node 20+).
//
//   node servidor.mjs            → http://localhost:5400
//
// Sirve el site y, para la pestaña «En vivo», lanza Claude Code (tu instalación y tu
// suscripción) sobre una copia del proyecto 06-en-vivo/pokedex y retransmite al navegador
// todo lo que hace. Cada ejecución queda guardada como una versión en 06-en-vivo/ejecuciones/
// y la web que dejó el agente se sirve aparte, en el puerto siguiente (5401).
//
// Solo escucha en tu equipo (127.0.0.1) y solo ejecuta los ejemplos de 06-en-vivo/ejemplos.mjs:
// no acepta prompts ni comandos del navegador.
//
// Variables: PUERTO (5400) · MODELO (claude-opus-5-5) · CLAUDE (ruta del ejecutable)
import { spawn, spawnSync } from 'node:child_process'
import { appendFileSync, cpSync, createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EJEMPLOS, ENCARGO } from './06-en-vivo/ejemplos.mjs'

const RAIZ = fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '')
const PUERTO = Number(process.env.PUERTO ?? 5400)
const PUERTO_WEBS = PUERTO + 1
const MODELO = process.env.MODELO ?? 'claude-opus-5-5'
const CLAUDE = process.env.CLAUDE ?? 'claude'
const BASE = join(RAIZ, '06-en-vivo/pokedex')
const EJECUCIONES = join(RAIZ, '06-en-vivo/ejecuciones')
const REVISAR = join(RAIZ, '06-en-vivo/comprobar/revisar.mjs')
const MAX_MINUTOS = 15
const WINDOWS = process.platform === 'win32'
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.zip': 'application/zip' }

// Aislamiento de Claude Code (macOS y Linux): el agente puede lanzar cualquier comando, pero el sistema
// operativo solo le deja escribir dentro de su copia y le corta la red. Así no hay comandos denegados.
const AISLADO = JSON.stringify({ sandbox: { enabled: true, autoAllowBashIfSandboxed: true, allowUnsandboxedCommands: false } })
// Donde no hay aislamiento (Windows), solo se permite esta lista y lo demás se deniega (y se ve en pantalla).
const PERMITIDO = ['npm run *', 'npm test*', 'node tools/*', 'node .claude/*', 'node --test*', 'node --check *', 'git status*', 'git diff*', 'git log*', 'git ls-files*', 'git show*', 'ls*', 'cat *', 'grep *', 'find *', 'mkdir *', 'cp *', 'cd *', 'pwd', 'head *', 'tail *', 'wc *', 'echo *', 'sort*', 'uniq*', 'test *', 'true'].map((c) => `Bash(${c})`)

const version = () => {
  const r = spawnSync(CLAUDE, ['--version'], { encoding: 'utf8', shell: WINDOWS })
  return r.status === 0 ? r.stdout.trim() : null
}
const enCurso = new Map() // id → proceso
const anotar = (texto) => console.log(`  ${new Date().toLocaleTimeString('es')}  ${texto}`)
const leerJson = (ruta, defecto) => { try { return JSON.parse(readFileSync(ruta, 'utf8')) } catch { return defecto } }
const promptDe = (ejemplo, variante) => `${variante.conPrefijo ? ejemplo.prefijoCon : ''}${ENCARGO}`

function publico(ejemplo) {
  return {
    id: ejemplo.id, tema: ejemplo.tema, titulo: ejemplo.titulo, idea: ejemplo.idea, mira: ejemplo.mira, guia: ejemplo.guia,
    variantes: ejemplo.variantes.map((v) => ({ id: v.id, nombre: v.nombre, rodea: v.rodea, prompt: promptDe(ejemplo, v) })),
    comprobaciones: ejemplo.comprobaciones.map((c) => c.nombre),
  }
}

// ---------- versiones guardadas ----------
function listarEjecuciones() {
  if (!existsSync(EJECUCIONES)) return []
  return readdirSync(EJECUCIONES)
    .map((id) => leerJson(join(EJECUCIONES, id, 'meta.json'), null))
    .filter(Boolean)
    .map((meta) => ({ ...meta, ruta: meta.ruta ?? rutaNueva(join(EJECUCIONES, meta.id, 'proyecto')) }))
    .sort((a, b) => a.fecha - b.fecha)
}
function siguienteVersion(ejemplo, variante) {
  const usadas = listarEjecuciones().filter((e) => e.ejemplo === ejemplo && e.variante === variante).map((e) => e.n)
  return Math.max(0, ...usadas) + 1
}
// La pantalla nueva: el último enlace del menú o, si no la enlazó, la última ruta registrada en src/app.js.
function rutaNueva(dir) {
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : '')
  const delMenu = [...leer('index.html').matchAll(/href=["']#(\/[\w\-/]+)["']/g)].map((m) => m[1])
  const delRouter = [...leer('src/app.js').matchAll(/['"](\/[\w\-/]+)['"]\s*:/g)].map((m) => m[1])
  return delMenu.at(-1) ?? delRouter.at(-1) ?? ''
}
const idValido = (id) => /^[a-z]+-[a-z]+-v\d+$/.test(id ?? '') && existsSync(join(EJECUCIONES, id))

function prepararCopia(ejemplo, variante, id) {
  const dir = join(EJECUCIONES, id, 'proyecto')
  mkdirSync(dirname(dir), { recursive: true })
  cpSync(BASE, dir, { recursive: true })
  for (const [destino, origen] of Object.entries(variante.copiar ?? {})) { mkdirSync(dirname(join(dir, destino)), { recursive: true }); cpSync(join(dir, origen), join(dir, destino)) }
  for (const ruta of variante.quitar ?? []) rmSync(join(dir, ruta), { recursive: true, force: true })
  for (const [ruta, contenido] of Object.entries(variante.escribir ?? {})) { mkdirSync(dirname(join(dir, ruta)), { recursive: true }); writeFileSync(join(dir, ruta), contenido) }
  const git = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
  git('init', '-q', '-b', 'main')
  // `ocultar`: ficheros que existen en disco pero no forman parte del repositorio (como la configuración del equipo)
  if (variante.ocultar?.length) writeFileSync(join(dir, '.git/info/exclude'), `${variante.ocultar.join('\n')}\n`)
  git('add', '-A')
  git('-c', 'user.name=curso', '-c', 'user.email=curso@local', 'commit', '-q', '-m', 'punto de partida')
  return dir
}

function comprobar(comprobacion, dir) {
  const r = spawnSync(process.execPath, [REVISAR, comprobacion.id], { cwd: dir, encoding: 'utf8', timeout: 120_000 })
  return { nombre: comprobacion.nombre, bien: r.status === 0, detalle: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().slice(-4000) || '(sin salida)' }
}

function ejecutar(ejemplo, variante, res) {
  const n = siguienteVersion(ejemplo.id, variante.id)
  const id = `${ejemplo.id}-${variante.id}-v${n}`
  const carpeta = join(EJECUCIONES, id)
  const dir = prepararCopia(ejemplo, variante, id)
  const prompt = promptDe(ejemplo, variante)
  const meta = { id, ejemplo: ejemplo.id, variante: variante.id, n, fecha: Date.now(), modelo: MODELO, terminado: false, comprobaciones: [], metricas: {} }
  const guardarMeta = () => writeFileSync(join(carpeta, 'meta.json'), JSON.stringify(meta, null, 2))
  guardarMeta()
  anotar(`▶ ${id}: empieza`)
  let abierto = true
  // Todo lo que se retransmite queda también en disco: así una versión se puede volver a cargar tal cual.
  const enviar = (dato) => {
    const linea = JSON.stringify(dato)
    appendFileSync(join(carpeta, 'eventos.jsonl'), `${linea}\n`)
    if (abierto) res.write(`data: ${linea}\n\n`)
  }
  enviar({ tipo: 'preparado', id, n, dir, prompt, modelo: MODELO, quitar: variante.quitar ?? [], web: `http://localhost:${PUERTO_WEBS}/${id}/index.html` })

  const args = ['-p', prompt, '--model', MODELO, '--output-format', 'stream-json', '--verbose', '--include-hook-events',
    '--setting-sources', 'project', '--permission-mode', 'acceptEdits', '--permission-prompts', 'none',
    '--strict-mcp-config', '--no-session-persistence', ...(WINDOWS ? ['--allowedTools', ...PERMITIDO] : ['--settings', AISLADO, '--allowedTools', 'Bash'])]
  const hijo = spawn(CLAUDE, args, { cwd: dir, shell: WINDOWS, stdio: ['ignore', 'pipe', 'pipe'] })
  enCurso.set(id, hijo)
  let resto = ''
  let errores = ''
  let detenido = false
  const limite = setTimeout(() => { enviar({ tipo: 'aviso', texto: `Detenido: superó ${MAX_MINUTOS} minutos.` }); hijo.kill() }, MAX_MINUTOS * 60_000)

  hijo.stdout.on('data', (trozo) => {
    const lineas = (resto + trozo).split('\n')
    resto = lineas.pop()
    for (const linea of lineas) {
      if (!linea.trim()) continue
      try {
        const evento = JSON.parse(linea)
        if (evento.type === 'result') meta.metricas = { turnos: evento.num_turns, segundos: Math.round((evento.duration_ms ?? 0) / 1000), coste: evento.total_cost_usd, salida: evento.usage?.output_tokens }
        enviar({ tipo: 'evento', evento })
      } catch { /* línea que no es JSON: se ignora */ }
    }
  })
  hijo.stderr.on('data', (trozo) => { errores += trozo })
  hijo.on('error', (error) => { enviar({ tipo: 'aviso', texto: `No se pudo lanzar Claude Code (${error.message}). ¿Está instalado y en el PATH?` }) })
  hijo.on('close', (codigo) => {
    clearTimeout(limite)
    enCurso.delete(id)
    if (detenido) { anotar(`■ ${id}: detenida desde el navegador; no se guarda`); rmSync(carpeta, { recursive: true, force: true }); if (abierto) res.end(); return } // una ejecución detenida no deja versión
    if (codigo !== 0) enviar({ tipo: 'aviso', texto: `Claude Code terminó con error (código ${codigo}). ${errores.trim().slice(-1200)}\nComprueba en una terminal que esto funciona con tu cuenta:  claude -p "hola" --model ${MODELO}` })
    const git = (...a) => (spawnSync('git', a, { cwd: dir, encoding: 'utf8', maxBuffer: 8e6 }).stdout ?? '').trim()
    git('add', '-A', '-N')
    enviar({ tipo: 'cambios', ficheros: git('status', '--short'), diff: git('diff', 'HEAD').slice(0, 60_000) })
    for (const c of ejemplo.comprobaciones) {
      const resultado = comprobar(c, dir)
      meta.comprobaciones.push({ nombre: resultado.nombre, bien: resultado.bien })
      enviar({ tipo: 'comprobacion', ...resultado })
    }
    meta.terminado = true
    meta.ruta = rutaNueva(dir)
    anotar(`✔ ${id}: termina · ${meta.comprobaciones.filter((c) => c.bien).length}/${meta.comprobaciones.length} conseguido · ${meta.metricas.segundos ?? '?'} s`)
    guardarMeta()
    enviar({ tipo: 'fin', codigo, meta })
    if (abierto) res.end()
  })
  res.on('close', () => { abierto = false; if (enCurso.has(id) && !res.writableFinished) { detenido = true; hijo.kill() } })
}

// ---------- estáticos ----------
function servirFichero(req, res, base, relativa, extra = {}) {
  let ruta = normalize(join(base, decodeURIComponent(relativa)))
  const oculta = ruta.slice(base.length).split(sep).some((parte) => parte.startsWith('.'))
  if (existsSync(ruta) && statSync(ruta).isDirectory()) ruta = join(ruta, 'index.html')
  if (!(ruta + sep).startsWith(base + sep) || oculta || !existsSync(ruta) || !statSync(ruta).isFile()) { res.writeHead(404).end('No encontrado'); return }
  const { size } = statSync(ruta)
  const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  const cabeceras = { 'Content-Type': TIPOS[extname(ruta).toLowerCase()] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store', ...extra }
  if (rango) {
    const inicio = rango[1] ? Number(rango[1]) : 0
    const fin = rango[2] ? Math.min(Number(rango[2]), size - 1) : size - 1
    res.writeHead(206, { ...cabeceras, 'Content-Range': `bytes ${inicio}-${fin}/${size}`, 'Content-Length': fin - inicio + 1 })
    createReadStream(ruta, { start: inicio, end: fin }).pipe(res)
  } else {
    res.writeHead(200, { ...cabeceras, 'Content-Length': size })
    createReadStream(ruta).pipe(res)
  }
}
const local = (req) => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? '')
const mismoOrigen = (req) => !req.headers.origin || req.headers.origin === `http://${req.headers.host}`
const json = (res, dato, codigo = 200) => { res.writeHead(codigo, { 'Content-Type': TIPOS['.json'], 'Cache-Control': 'no-store' }); res.end(JSON.stringify(dato)) }

const servidor = createServer((req, res) => {
  if (!local(req)) { res.writeHead(403).end('Solo se atiende desde este equipo.'); return }
  const url = new URL(req.url, 'http://localhost')
  const ruta = url.pathname

  if (ruta === '/api/estado') return json(res, { claude: version(), modelo: MODELO, encargo: ENCARGO, ejemplos: EJEMPLOS.map(publico), ejecuciones: listarEjecuciones(), puertoWebs: PUERTO_WEBS, limiteMinutos: MAX_MINUTOS })

  const deVersion = /^\/api\/ejecuciones\/([^/]+)(\/eventos)?$/.exec(ruta)
  if (deVersion) {
    const [, id, eventos] = deVersion
    if (!idValido(id)) return json(res, { error: 'No existe esa versión.' }, 404)
    if (eventos && req.method === 'GET') return servirFichero(req, res, join(EJECUCIONES, id), 'eventos.jsonl', { 'Content-Type': 'text/plain; charset=utf-8' })
    if (!eventos && req.method === 'DELETE' && mismoOrigen(req)) {
      if (enCurso.has(id)) return json(res, { error: 'Esa versión se está ejecutando.' }, 409)
      rmSync(join(EJECUCIONES, id), { recursive: true, force: true })
      anotar(`⟲ ${id}: versión borrada desde el navegador`)
      return json(res, { ejecuciones: listarEjecuciones() })
    }
    res.writeHead(405).end()
    return
  }
  if (ruta === '/api/ejecutar') {
    if (req.method !== 'POST' || !mismoOrigen(req)) { res.writeHead(405).end(); return }
    const ejemplo = EJEMPLOS.find((e) => e.id === url.searchParams.get('ejemplo'))
    const variante = ejemplo?.variantes.find((v) => v.id === url.searchParams.get('variante'))
    if (!variante) { res.writeHead(404).end('Ejemplo o variante desconocidos.'); return }
    if (enCurso.size >= 4) { res.writeHead(429).end('Ya hay cuatro ejecuciones en marcha. Espera a que termine alguna.'); return }
    res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', Connection: 'keep-alive' })
    try { ejecutar(ejemplo, variante, res) } catch (error) { res.write(`data: ${JSON.stringify({ tipo: 'aviso', texto: error.message })}\n\ndata: {"tipo":"fin","codigo":1}\n\n`); res.end() }
    return
  }
  if (ruta === '/') { res.writeHead(302, { Location: '/04-site/index.html#vista-vivo' }).end(); return }
  if (ruta.startsWith('/06-en-vivo/ejecuciones/')) { res.writeHead(404).end('No encontrado'); return } // las webs generadas solo se sirven en el otro puerto
  servirFichero(req, res, RAIZ, ruta)
})

// Las webs que dejó el agente, en otro puerto: otro origen, así su código no puede llamar a esta API.
//   http://localhost:5401/<id>/index.html
const webs = createServer((req, res) => {
  if (!local(req)) { res.writeHead(403).end(); return }
  const [, id, ...partes] = new URL(req.url, 'http://localhost').pathname.split('/')
  if (id === 'favicon.ico') { res.writeHead(204).end(); return }
  if (id === 'base') { servirFichero(req, res, BASE, partes.join('/') || 'index.html'); return } // el proyecto de partida, sin tocar
  if (!idValido(id)) { res.writeHead(404, { 'Content-Type': TIPOS['.html'] }).end('<p>Esa versión ya no existe.</p>'); return }
  servirFichero(req, res, join(EJECUCIONES, id, 'proyecto'), partes.join('/') || 'index.html')
})

// Al arrancar se limpian las versiones que quedaron a medias (el servidor se paró mientras corrían).
for (const e of listarEjecuciones().filter((x) => !x.terminado)) rmSync(join(EJECUCIONES, e.id), { recursive: true, force: true })
webs.listen(PUERTO_WEBS, '127.0.0.1')
servidor.listen(PUERTO, '127.0.0.1', () => {
  const v = version()
  console.log(`\n  Curso «Desarrollo de software con IA»\n  Abre  http://localhost:${PUERTO}\n`)
  console.log(v ? `  Claude Code ${v} · modelo ${MODELO}` : '  ⚠ No encuentro Claude Code («claude»). El site funciona, pero «En vivo» no podrá ejecutar los ejemplos.\n    Instálalo: https://claude.com/claude-code')
  console.log(`  Cada ejecución se guarda como una versión en 06-en-vivo/ejecuciones/ (${listarEjecuciones().length} guardadas)\n  y su web se sirve en http://localhost:${PUERTO_WEBS}/<versión>/\n  Ctrl+C para parar.\n`)
})
process.on('SIGINT', () => { for (const hijo of enCurso.values()) hijo.kill(); process.exit(0) })
