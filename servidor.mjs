#!/usr/bin/env node
// Servidor local del curso. Sin dependencias (Node 20+).
//
//   node servidor.mjs            → http://localhost:5400
//
// Sirve el site y, para la pestaña «En vivo», lanza Claude Code (tu instalación y tu
// suscripción) sobre una copia temporal del proyecto demo y retransmite al navegador
// todo lo que hace. Solo escucha en tu equipo (127.0.0.1) y solo ejecuta los ejemplos
// definidos en 06-en-vivo/ejemplos.mjs: no acepta prompts ni comandos del navegador.
//
// Variables: PUERTO (5400) · MODELO (claude-opus-5-5) · CLAUDE (ruta del ejecutable)
import { spawn, spawnSync } from 'node:child_process'
import { cpSync, createReadStream, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EJEMPLOS } from './06-en-vivo/ejemplos.mjs'

const RAIZ = fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '')
const PUERTO = Number(process.env.PUERTO ?? 5400)
const MODELO = process.env.MODELO ?? 'claude-opus-5-5'
const CLAUDE = process.env.CLAUDE ?? 'claude'
const DEMO = join(RAIZ, '02-ejemplos-codigo/demo')
const TRABAJO = join(tmpdir(), 'curso540-en-vivo')
const MAX_MINUTOS = 12
const WINDOWS = process.platform === 'win32'
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.zip': 'application/zip', '.svg': 'image/svg+xml' }

// Lo que el agente puede hacer sin preguntar. Lo demás se deniega (y se ve en pantalla).
const PERMITIDO = ['npm run *', 'npm test*', 'node tools/*', 'node .claude/*', 'node --test*', 'node --check *', 'git status*', 'git diff*', 'git log*', 'git ls-files*', 'git show*', 'ls*', 'cat *', 'grep *', 'find *', 'mkdir *', 'cd *', 'pwd', 'head *', 'tail *', 'wc *', 'echo *', 'sort*', 'uniq*', 'test *', 'true'].map((c) => `Bash(${c})`)

const version = () => {
  const r = spawnSync(CLAUDE, ['--version'], { encoding: 'utf8', shell: WINDOWS })
  return r.status === 0 ? r.stdout.trim() : null
}
const enCurso = new Set()

function publico(ejemplo) {
  return {
    ...ejemplo,
    variantes: ejemplo.variantes.map((v) => ({ id: v.id, nombre: v.nombre, rodea: v.rodea, quitar: v.quitar, prompt: v.usaPromptCon ? ejemplo.promptCon : ejemplo.prompt })),
    comprobaciones: ejemplo.comprobaciones.map((c) => c.nombre),
  }
}

function prepararCopia(ejemplo, variante) {
  mkdirSync(TRABAJO, { recursive: true })
  const dir = join(realpathSync(TRABAJO), `${ejemplo.id}-${variante.id}-${Date.now()}`)
  cpSync(DEMO, dir, { recursive: true })
  for (const ruta of ['README.md', ...variante.quitar]) rmSync(join(dir, ruta), { recursive: true, force: true })
  const git = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
  git('init', '-q', '-b', 'main')
  git('add', '-A')
  git('-c', 'user.name=curso', '-c', 'user.email=curso@local', 'commit', '-q', '-m', 'punto de partida')
  return dir
}

function comprobar(comprobacion, dir, respuesta) {
  if (comprobacion.respuesta) {
    const bien = new RegExp(comprobacion.respuesta, 'i').test(respuesta)
    return { nombre: comprobacion.nombre, bien, detalle: bien ? 'Aparece en la respuesta.' : 'No aparece en la respuesta.' }
  }
  if (comprobacion.existe) {
    const bien = existsSync(join(dir, comprobacion.existe))
    return { nombre: comprobacion.nombre, bien, detalle: bien ? `Existe ${comprobacion.existe}.` : `No existe ${comprobacion.existe}.` }
  }
  const cmd = comprobacion.cmd.replaceAll('{REPO}', RAIZ)
  const r = spawnSync(cmd, { cwd: dir, encoding: 'utf8', shell: true, timeout: 120_000 })
  const salida = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim()
  const bien = comprobacion.espera === 'codigo0' ? r.status === 0 : comprobacion.espera === 'salida' ? salida.length > 0 : salida.length === 0
  const vacio = { salida: '(ningún cambio)', vacia: '(ningún cambio)', codigo0: '(sin salida)' }[comprobacion.espera]
  return { nombre: comprobacion.nombre, bien, cmd: comprobacion.cmd.replaceAll('{REPO}/', ''), detalle: (salida || vacio).slice(-4000) }
}

function ejecutar(ejemplo, variante, res) {
  const enviar = (dato) => res.write(`data: ${JSON.stringify(dato)}\n\n`)
  const prompt = variante.usaPromptCon ? ejemplo.promptCon : ejemplo.prompt
  const dir = prepararCopia(ejemplo, variante)
  enviar({ tipo: 'preparado', dir, prompt, modelo: MODELO, quitar: variante.quitar })

  const args = ['-p', prompt, '--model', MODELO, '--output-format', 'stream-json', '--verbose', '--include-hook-events',
    '--setting-sources', 'project', '--permission-mode', 'acceptEdits', '--permission-prompts', 'none',
    '--strict-mcp-config', '--no-session-persistence', '--allowedTools', ...PERMITIDO]
  const hijo = spawn(CLAUDE, args, { cwd: dir, shell: WINDOWS, stdio: ['ignore', 'pipe', 'pipe'] })
  enCurso.add(hijo)
  let respuesta = ''
  let resto = ''
  let errores = ''
  const limite = setTimeout(() => { enviar({ tipo: 'aviso', texto: `Detenido: superó ${MAX_MINUTOS} minutos.` }); hijo.kill() }, MAX_MINUTOS * 60_000)

  hijo.stdout.on('data', (trozo) => {
    const lineas = (resto + trozo).split('\n')
    resto = lineas.pop()
    for (const linea of lineas) {
      if (!linea.trim()) continue
      try {
        const evento = JSON.parse(linea)
        if (evento.type === 'result') respuesta = String(evento.result ?? '')
        enviar({ tipo: 'evento', evento })
      } catch { /* línea que no es JSON: se ignora */ }
    }
  })
  hijo.stderr.on('data', (trozo) => { errores += trozo })
  hijo.on('error', (error) => { enviar({ tipo: 'aviso', texto: `No se pudo lanzar Claude Code (${error.message}). ¿Está instalado y en el PATH?` }) })
  hijo.on('close', (codigo) => {
    clearTimeout(limite)
    enCurso.delete(hijo)
    if (codigo !== 0) enviar({ tipo: 'aviso', texto: `Claude Code terminó con error (código ${codigo}). ${errores.trim().slice(-1200)}\nComprueba en una terminal que esto funciona con tu cuenta:  claude -p "hola" --model ${MODELO}` })
    const git = (...a) => (spawnSync('git', a, { cwd: dir, encoding: 'utf8', maxBuffer: 8e6 }).stdout ?? '').trim()
    git('add', '-A', '-N')
    enviar({ tipo: 'cambios', ficheros: git('status', '--short'), diff: git('diff', 'HEAD').slice(0, 60_000) })
    for (const ruta of ejemplo.mostrar ?? []) {
      const completa = join(dir, ruta)
      enviar({ tipo: 'fichero', ruta, contenido: existsSync(completa) ? readFileSync(completa, 'utf8').slice(0, 20_000) : null })
    }
    for (const c of ejemplo.comprobaciones) enviar({ tipo: 'comprobacion', ...comprobar(c, dir, respuesta) })
    enviar({ tipo: 'fin', codigo })
    res.end()
  })
  res.on('close', () => { if (enCurso.has(hijo)) hijo.kill() })
}

const local = (req) => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? '')
const mismoOrigen = (req) => !req.headers.origin || req.headers.origin === `http://${req.headers.host}`

const servidor = createServer((req, res) => {
  if (!local(req)) { res.writeHead(403).end('Solo se atiende desde este equipo.'); return }
  const url = new URL(req.url, 'http://localhost')

  if (url.pathname === '/api/estado') {
    res.writeHead(200, { 'Content-Type': TIPOS['.json'], 'Cache-Control': 'no-store' })
    res.end(JSON.stringify({ claude: version(), modelo: MODELO, ejemplos: EJEMPLOS.map(publico), limiteMinutos: MAX_MINUTOS }))
    return
  }
  if (url.pathname === '/api/ejecutar') {
    if (req.method !== 'POST' || !mismoOrigen(req)) { res.writeHead(405).end(); return }
    const ejemplo = EJEMPLOS.find((e) => e.id === url.searchParams.get('ejemplo'))
    const variante = ejemplo?.variantes.find((v) => v.id === url.searchParams.get('variante'))
    if (!variante) { res.writeHead(404).end('Ejemplo o variante desconocidos.'); return }
    if (enCurso.size >= 4) { res.writeHead(429).end('Ya hay cuatro ejecuciones en marcha. Espera a que termine alguna.'); return }
    res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', Connection: 'keep-alive' })
    try { ejecutar(ejemplo, variante, res) } catch (error) { res.write(`data: ${JSON.stringify({ tipo: 'aviso', texto: error.message })}\n\ndata: {"tipo":"fin","codigo":1}\n\n`); res.end() }
    return
  }

  // estáticos: el site y sus vecinos (vídeos, diapositivas). Nada oculto ni fuera de la raíz.
  if (url.pathname === '/') { res.writeHead(302, { Location: '/04-site/index.html#vista-vivo' }).end(); return }
  const ruta = normalize(join(RAIZ, decodeURIComponent(url.pathname)))
  const oculta = ruta.slice(RAIZ.length).split(sep).some((parte) => parte.startsWith('.'))
  if (!ruta.startsWith(RAIZ + sep) || oculta || !existsSync(ruta) || !statSync(ruta).isFile()) { res.writeHead(404).end('No encontrado'); return }
  const { size } = statSync(ruta)
  const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  const cabeceras = { 'Content-Type': TIPOS[extname(ruta).toLowerCase()] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' }
  if (rango) {
    const inicio = rango[1] ? Number(rango[1]) : 0
    const fin = rango[2] ? Math.min(Number(rango[2]), size - 1) : size - 1
    res.writeHead(206, { ...cabeceras, 'Content-Range': `bytes ${inicio}-${fin}/${size}`, 'Content-Length': fin - inicio + 1 })
    createReadStream(ruta, { start: inicio, end: fin }).pipe(res)
  } else {
    res.writeHead(200, { ...cabeceras, 'Content-Length': size })
    createReadStream(ruta).pipe(res)
  }
})

rmSync(TRABAJO, { recursive: true, force: true })
servidor.listen(PUERTO, '127.0.0.1', () => {
  const v = version()
  console.log(`\n  Curso «Desarrollo de software con IA»\n  Abre  http://localhost:${PUERTO}\n`)
  console.log(v ? `  Claude Code ${v} · modelo ${MODELO}` : '  ⚠ No encuentro Claude Code («claude»). El site funciona, pero «En vivo» no podrá ejecutar los ejemplos.\n    Instálalo: https://claude.com/claude-code')
  console.log(`  Las copias de trabajo de cada ejecución van a ${TRABAJO}\n  Ctrl+C para parar.\n`)
})
process.on('SIGINT', () => { for (const hijo of enCurso) hijo.kill(); process.exit(0) })
