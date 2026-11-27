#!/usr/bin/env node
// Un Claude Code de mentira para las pruebas: habla el mismo formato que el de verdad, sin gastar ni necesitar sesión.
// Devuelve el prompt tal cual le llegó, para comprobar que los argumentos no se rompen por el camino.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
if (args.includes('--version')) { console.log('9.9.9 (Claude Code de prueba)'); process.exit(0) }
const valor = (nombre) => { const i = args.indexOf(nombre); return i >= 0 ? args[i + 1] : undefined }
let prompt = valor('-p')
if (prompt === undefined || prompt.startsWith('--')) prompt = await new Promise((listo) => { let t = ''; process.stdin.setEncoding('utf8').on('data', (d) => (t += d)).on('end', () => listo(t)) })

if (valor('--output-format') === 'json') { console.log(JSON.stringify({ type: 'result', is_error: false, result: 'OK', duration_ms: 5 })); process.exit(0) }

const emitir = (evento) => console.log(JSON.stringify(evento))
emitir({ type: 'system', subtype: 'init', model: valor('--model'), skills: [] })
if (existsSync('src/app.js')) { // es la copia de un ejemplo: deja una tabla, como haría el agente
  mkdirSync('src/ui', { recursive: true })
  emitir({ type: 'assistant', message: { content: [{ type: 'text', text: 'Añado la tabla.' }, { type: 'tool_use', id: 't1', name: 'Write', input: { file_path: `${process.cwd()}/src/ui/tabla.js` } }] } })
  writeFileSync('src/ui/tabla.js', "export const tabla = () => '<table class=\"tabla-datos\"><caption>Tabla de combate</caption></table>'\n")
  emitir({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }] } })
}
emitir({ type: 'result', subtype: 'success', is_error: false, result: prompt, num_turns: 2, duration_ms: 10, total_cost_usd: 0, usage: { output_tokens: 1 } })
