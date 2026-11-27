#!/usr/bin/env node
// Prueba de punta a punta del servidor, igual en Windows, macOS y Linux:  npm test
// Arranca el servidor con un Claude Code de mentira (claude-falso.mjs), instalado de las formas en que
// aparece en cada sistema, y recorre lo que hace la pestaña «En vivo». No gasta ni necesita sesión.
import { spawn } from 'node:child_process'
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = join(AQUI, '..', '..')
const WINDOWS = process.platform === 'win32'
const FALSO = join(AQUI, 'claude-falso.mjs')
const TMP = mkdtempSync(join(tmpdir(), 'curso prueba ')) // con espacios a propósito
const ENTORNO = join(RAIZ, 'entorno.json')
const GUARDADO = `${ENTORNO}.de-antes`
let fallos = 0
const ok = (bien, texto, detalle = '') => { console.log(`  ${bien ? '✔' : '✘'} ${texto}${bien || !detalle ? '' : `\n      ${String(detalle).slice(0, 600)}`}`); if (!bien) fallos++ }
const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

// Las formas de instalación: [nombre, carpeta que se pasa en CLAUDE]
function instalaciones() {
  const lista = []
  if (WINDOWS) {
    const envoltorio = join(TMP, 'con envoltorio cmd'); mkdirSync(envoltorio)
    writeFileSync(join(envoltorio, 'claude.cmd'), `@echo off\r\n"${process.execPath}" "${FALSO}" %*\r\n`)
    lista.push(['claude.cmd (pasa por cmd.exe)', envoltorio])
    const npm = join(TMP, 'como npm'); mkdirSync(join(npm, 'node_modules/@anthropic-ai/claude-code'), { recursive: true })
    writeFileSync(join(npm, 'claude.cmd'), '@echo off\r\nexit /b 9\r\n') // si se usara este, fallaría: debe ir al cli.js
    cpSync(FALSO, join(npm, 'node_modules/@anthropic-ai/claude-code/cli.js'))
    writeFileSync(join(npm, 'node_modules/@anthropic-ai/claude-code/package.json'), '{"type":"module"}')
    lista.push(['claude.cmd de npm (se lanza su cli.js)', npm])
  } else {
    const bin = join(TMP, 'carpeta bin'); mkdirSync(bin)
    writeFileSync(join(bin, 'claude'), `#!/bin/sh\nexec "${process.execPath}" "${FALSO}" "$@"\n`); chmodSync(join(bin, 'claude'), 0o755)
    lista.push(['ejecutable en una carpeta con espacios', bin])
  }
  return lista
}

async function leerFlujo(respuesta) {
  const datos = []
  for (const parte of (await respuesta.text()).split('\n\n')) if (parte.startsWith('data: ')) datos.push(JSON.parse(parte.slice(6)))
  return datos
}

async function probar(nombre, carpeta, puerto) {
  console.log(`\n${nombre}`)
  const servidor = spawn(process.execPath, [join(RAIZ, 'servidor.mjs')], { cwd: RAIZ, env: { ...process.env, PUERTO: String(puerto), CLAUDE: carpeta, MODELO: 'modelo-de-prueba', CURSO_SIN_BUSCAR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })
  let registro = ''
  servidor.stdout.on('data', (t) => { registro += t }); servidor.stderr.on('data', (t) => { registro += t })
  const base = `http://localhost:${puerto}`
  const pedir = async (ruta, opciones) => { const r = await fetch(base + ruta, opciones); return { r, dato: r.headers.get('content-type')?.includes('json') ? await r.json() : null } }
  try {
    let arriba = false
    for (let i = 0; i < 40 && !arriba; i++) { await pausa(250); try { arriba = (await fetch(`${base}/api/estado`)).ok } catch { /* aún no */ } }
    ok(arriba, 'el servidor arranca', registro)
    if (!arriba) return

    const estado = (await pedir('/api/estado')).dato
    ok(/9\.9\.9/.test(estado.claude ?? ''), `encuentra Claude Code y lee su versión (${estado.claude})`)
    ok(estado.ejemplos.length === 6, 'ofrece los seis ejemplos')
    ok((await fetch(`${base}/04-site/index.html`)).ok, 'sirve el site')
    ok((await fetch(`http://localhost:${puerto + 1}/base/index.html`)).ok, 'sirve el proyecto de partida en el otro puerto')

    const entorno = (await pedir('/api/entorno?completo')).dato
    ok(entorno.bien, 'todas las pruebas del entorno pasan, también la de sesión', JSON.stringify(entorno.pruebas.filter((p) => !p.ok)))

    // Una ejecución entera: copia, git, agente, comprobaciones y versión guardada.
    const datos = await leerFlujo(await fetch(`${base}/api/ejecutar?ejemplo=workflow&variante=con`, { method: 'POST' }))
    const fin = datos.find((d) => d.tipo === 'fin')
    const resultado = datos.find((d) => d.evento?.type === 'result')?.evento
    const avisos = datos.filter((d) => d.tipo === 'aviso').map((d) => d.texto).join(' | ')
    ok(fin?.codigo === 0, 'la ejecución termina bien', avisos || registro)
    ok(resultado?.result === `/implementar ${estado.encargo}`, 'el encargo le llega al agente entero, con espacios y acentos', `llegó: ${resultado?.result}`)
    const pasa = (nombreParte) => datos.find((d) => d.tipo === 'comprobacion' && d.nombre.toLowerCase().includes(nombreParte))
    const comprobaciones = datos.filter((d) => d.tipo === 'comprobacion')
    ok(comprobaciones.length === 6, `se lanzan las comprobaciones (${comprobaciones.map((c) => (c.bien ? '✔' : '✘')).join('')})`)
    ok(comprobaciones[0]?.bien, 'detecta la tabla nueva con git', comprobaciones[0]?.detalle)
    ok(comprobaciones.some((c) => /test/i.test(c.nombre) && c.bien) || !comprobaciones.some((c) => /test/i.test(c.nombre)), 'los tests del proyecto pasan en este sistema', comprobaciones.find((c) => /test/i.test(c.nombre))?.detalle)
    ok(/tabla\.js/.test(datos.find((d) => d.tipo === 'cambios')?.ficheros ?? ''), 'recoge los ficheros que cambió el agente')
    void pasa
    const id = fin?.meta?.id
    if (id) {
      ok((await fetch(`http://localhost:${puerto + 1}/${id}/src/ui/tabla.js`)).ok, 'la web de esa versión se puede abrir')
      ok((await (await fetch(`${base}/api/ejecuciones/${id}/eventos`)).text()).includes('"fin"'), 'la versión se puede volver a cargar')
      const borrado = await pedir(`/api/ejecuciones/${id}`, { method: 'DELETE' })
      ok(borrado.r.ok && !borrado.dato.ejecuciones.some((e) => e.id === id), 'la versión se puede borrar')
    }

    // La red del equipo sobre el proyecto de partida (rutas con \ en Windows).
    const harness = await leerFlujo(await fetch(`${base}/api/ejecutar?ejemplo=harness&variante=con`, { method: 'POST' }))
    const red = harness.filter((d) => d.tipo === 'comprobacion')
    ok(red.length === 9, `el ejemplo del harness lanza sus nueve comprobaciones (${red.map((c) => (c.bien ? '✔' : '✘')).join('')})`)
    const idHarness = harness.find((d) => d.tipo === 'fin')?.meta?.id
    if (idHarness) await pedir(`/api/ejecuciones/${idHarness}`, { method: 'DELETE' })

    // Ajustes del entorno y chat.
    const ajustes = await pedir('/api/entorno/ajustes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: [TMP] }) })
    ok(ajustes.r.ok && JSON.parse(readFileSync(ENTORNO, 'utf8')).path[0] === TMP, 'guarda rutas en entorno.json')
    const chat = await leerFlujo(await fetch(`${base}/api/entorno/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensaje: 'Estamos en Windows: «C:\\Program Files\\Git» y "D:\\mis cosas". Arréglalo.' }) }))
    const dicho = chat.find((d) => d.evento?.type === 'result')?.evento?.result ?? ''
    ok(dicho.includes('«C:\\Program Files\\Git» y "D:\\mis cosas"'), 'el chat entrega el mensaje al agente tal cual, con rutas de Windows y comillas', dicho.slice(-300) || chat.map((d) => d.texto).join(' '))
    ok(chat.some((d) => d.tipo === 'entorno'), 'tras el chat se repiten las pruebas del entorno')
    const ajeno = await fetch(`${base}/api/entorno/chat`, { method: 'POST', headers: { Origin: 'http://otra.web', 'Content-Type': 'application/json' }, body: '{"mensaje":"x"}' })
    ok(ajeno.status === 405, 'otra web no puede usar el chat')
  } finally {
    servidor.kill()
    rmSync(ENTORNO, { force: true })
    await pausa(300)
  }
}

console.log(`Probando en ${process.platform} · Node ${process.version}`)
if (existsSync(ENTORNO)) renameSync(ENTORNO, GUARDADO)
try {
  let puerto = 5460
  for (const [nombre, carpeta] of instalaciones()) { await probar(nombre, carpeta, puerto); puerto += 10 }
} finally {
  if (existsSync(GUARDADO)) renameSync(GUARDADO, ENTORNO)
  rmSync(TMP, { recursive: true, force: true })
}
console.log(fallos ? `\n${fallos} fallo(s).` : '\nTodo bien.')
process.exit(fallos ? 1 : 0)
