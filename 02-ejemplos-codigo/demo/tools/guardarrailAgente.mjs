#!/usr/bin/env node
// EL HOOK: el tercer escalón (prompt → rules → hook).
// Un programa revisa cada fichero en cuanto el agente lo escribe y, si incumple el
// criterio, lo obliga a corregirlo. No pondera, no interpreta, no tiene días malos.
//
// Contrato (Claude Code, Codex y Copilot): salir con CÓDIGO 2 y el motivo en STDERR.
// El agente recibe ese texto y corrige solo, sin gastar tu tiempo.
//
//   node tools/guardarrailAgente.mjs edit   ← evento PostToolUse (tras cada edición)
//   node tools/guardarrailAgente.mjs stop   ← evento Stop (cuando el agente va a terminar)
//
// Versión reducida del script real del curso (rama `harness` de 540/ai-development-training,
// tools/agentGuardrails.mjs), que además da soporte a Cursor, Copilot y Antigravity.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import { RAIZ } from './fronteras.mjs'

const [modo = 'edit'] = process.argv.slice(2)
const REVISADO = /^src\/.*\.mjs$/ // AGUJERO 1: solo mira lo que conoce. Un script fuera de src/ pasa sin mirar.

const leerEvento = () => {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

const ejecutar = (argumentos) => {
  const r = spawnSync(process.execPath, argumentos, { cwd: RAIZ, encoding: 'utf8' })
  return { ok: r.status === 0, salida: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() }
}

const ultimasLineas = (texto) => texto.split('\n').slice(-40).join('\n')

const bloquear = (mensaje) => {
  console.error(mensaje) // el motivo, en stderr: es lo que lee el agente
  process.exit(2) // código 2 = «detén y corrige»
}

const evento = leerEvento()

if (modo === 'edit') {
  const ruta = evento.tool_input?.file_path
  if (!ruta) process.exit(0) // AGUJERO 2: sin ruta reconocible, no decide: deja pasar.
  const enProyecto = relative(RAIZ, isAbsolute(ruta) ? ruta : resolve(RAIZ, ruta)).split('\\').join('/')
  if (!REVISADO.test(enProyecto)) process.exit(0)

  const { ok, salida } = ejecutar(['tools/ratchet.mjs'])
  if (!ok) bloquear(`${enProyecto} incumple los guardarraíles del proyecto. Corrígelo:\n${ultimasLineas(salida)}`)
}

if (modo === 'stop') {
  // AGUJERO 3: se rinde para no entrar en bucle. Si ya está reintentando, deja terminar.
  if (evento.stop_hook_active === true) process.exit(0)

  const { ok, salida } = ejecutar(['--test', ...['aceptacion', 'vista', 'carril'].map((n) => `test/${n}.test.mjs`)])
  if (!ok) bloquear(`Los tests fallan. Arréglalos antes de dar la tarea por terminada:\n${ultimasLineas(salida)}`)
}
