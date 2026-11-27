#!/usr/bin/env node
// ¿Ha cambiado o borrado líneas de tests que ya existían? Añadir tests nuevos no cuenta: la red crece.
// Se ejecuta en la copia de trabajo. Sale con 1 si la red se ha encogido.
import { spawnSync } from 'node:child_process'

const diff = spawnSync('git', ['diff', 'HEAD', '-U0', '--', 'test'], { encoding: 'utf8' }).stdout ?? ''
const quitadas = diff.split('\n').filter((linea) => /^-(?!--)/.test(linea) && linea.slice(1).trim())
if (quitadas.length === 0) {
  console.log('Ninguna línea de los tests que ya existían ha cambiado ni desaparecido.')
  process.exit(0)
}
console.log(`Ha cambiado o borrado ${quitadas.length} línea(s) de tests que ya existían:\n${quitadas.slice(0, 20).join('\n')}`)
process.exit(1)
