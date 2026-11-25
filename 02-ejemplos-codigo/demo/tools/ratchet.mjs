#!/usr/bin/env node
// EL RATCHET (la carraca): deja girar en un sentido y bloquea el otro.
//
//   1. Mides hoy            → `node tools/ratchet.mjs --iniciar` guarda la línea de partida.
//   2. Lo viejo pasa,        → las violaciones que ya estaban en la línea base no detienen.
//      lo nuevo detiene        Una violación NUEVA sale con código 1.
//   3. La línea solo baja    → si un fichero queda mejor de lo que estaba, la propia
//                              comprobación reescribe la línea base a la baja.
//
// La línea base cuenta violaciones POR FICHERO (no números de línea, que se mueven al editar).
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { RAIZ, buscarViolaciones, describir } from './fronteras.mjs'

const RUTA_BASE = join(RAIZ, 'ratchet.base.json')

const contarPorFichero = (violaciones) =>
  violaciones.reduce((cuenta, { fichero }) => ({ ...cuenta, [fichero]: (cuenta[fichero] ?? 0) + 1 }), {})

const guardar = (cuenta) => writeFileSync(RUTA_BASE, `${JSON.stringify(cuenta, null, 2)}\n`)
const total = (cuenta) => Object.values(cuenta).reduce((suma, n) => suma + n, 0)

const violaciones = buscarViolaciones()
const actual = contarPorFichero(violaciones)

if (process.argv.includes('--iniciar')) {
  guardar(actual)
  console.log(`Ratchet: línea de partida fijada en ${total(actual)} violación(es). No es aprobar la deuda: es dejar de discutirla.`)
  process.exit(0)
}

if (!existsSync(RUTA_BASE)) {
  console.error('Ratchet: no hay línea base. Ejecuta `node tools/ratchet.mjs --iniciar` una vez.')
  process.exit(1)
}

const base = JSON.parse(readFileSync(RUTA_BASE, 'utf8'))

// Lo nuevo detiene: cualquier fichero con MÁS violaciones de las que tenía.
const empeorados = Object.entries(actual).filter(([fichero, n]) => n > (base[fichero] ?? 0))

if (empeorados.length > 0) {
  const detalle = empeorados
    .map(([fichero, n]) => {
      const lineas = violaciones.filter((v) => v.fichero === fichero).map(describir).join('\n')
      return `${fichero}: tenía ${base[fichero] ?? 0}, ahora ${n}\n${lineas}`
    })
    .join('\n')
  console.error(`Ratchet: hay violaciones nuevas. Todo lo que salta es de hoy.\n${detalle}`)
  process.exit(1)
}

// La línea solo baja: se queda con el mínimo entre lo que había y lo que hay.
const nuevaBase = Object.fromEntries(
  Object.entries(base)
    .map(([fichero, n]) => [fichero, Math.min(n, actual[fichero] ?? 0)])
    .filter(([, n]) => n > 0),
)

if (total(nuevaBase) < total(base)) {
  guardar(nuevaBase)
  console.log(`Ratchet: la línea baja de ${total(base)} a ${total(nuevaBase)}. Haz commit de ratchet.base.json.`)
} else {
  console.log(`Ratchet: en verde. Deuda conocida: ${total(base)} violación(es); nuevas: 0.`)
}
