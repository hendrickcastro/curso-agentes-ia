#!/usr/bin/env node
// GUARDARRAÍL DEL AGENTE (hook de Claude Code).
//   edit  tras cada edición: pasa la red del equipo sobre el fichero tocado
//   stop  al terminar: pasa la red entera y los tests
// Si algo falla sale con código 2 y escribe el motivo por stderr: quien lo lee es el agente.
import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const RED = fileURLToPath(new URL('./comprobar.mjs', import.meta.url)) // la red vive junto a este fichero

const modo = process.argv[2]
let entrada = {}
try { entrada = JSON.parse(await new Promise((listo) => { let t = ''; process.stdin.on('data', (d) => (t += d)).on('end', () => listo(t || '{}')) })) } catch { /* sin entrada */ }
const lanzar = (args) => spawnSync(process.execPath, args, { encoding: 'utf8' })

if (modo === 'edit') {
  const fichero = entrada.tool_input?.file_path
  if (!fichero) process.exit(0)
  const red = lanzar([RED, fichero])
  if (red.status !== 0) {
    process.stderr.write(`El cambio incumple la red del equipo. Corrígelo antes de seguir:\n${red.stderr}`)
    process.exit(2)
  }
}
if (modo === 'stop' && !entrada.stop_hook_active) {
  const red = lanzar([RED])
  const tests = lanzar(['--test', ...readdirSync('test').filter((f) => /\.test\.m?js$/.test(f)).map((f) => `test/${f}`)])
  if (red.status !== 0 || tests.status !== 0) {
    process.stderr.write(`No puedes dar la tarea por terminada:\n${red.status !== 0 ? red.stderr : ''}${tests.status !== 0 ? 'Hay tests en rojo: ejecuta npm test.\n' : ''}`)
    process.exit(2)
  }
}
