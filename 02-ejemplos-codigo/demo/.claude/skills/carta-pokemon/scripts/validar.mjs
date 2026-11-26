#!/usr/bin/env node
// Paso 4 de la skill: ¿la carta sigue la plantilla y lleva los datos del equipo?
// Sale con 1 si hay algún ✘. Uso: validar.mjs cartas/pikachu.md
import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'

const ruta = process.argv[2]
if (!ruta || !existsSync(ruta)) {
  console.log(`✘ No existe la carta: ${ruta ?? '(sin ruta)'}`)
  process.exit(1)
}
const pokedex = JSON.parse(readFileSync(new URL('../datos/pokedex.json', import.meta.url), 'utf8'))
const ficha = pokedex[basename(ruta, '.md').toLowerCase()]
if (!ficha) {
  console.log(`✘ El nombre del fichero no corresponde a ningún Pokémon de la colección: ${basename(ruta)}`)
  process.exit(1)
}

const plantilla = readFileSync(new URL('../plantilla.md', import.meta.url), 'utf8')
const esperada = plantilla.replace(/\{\{(\w+)\}\}/g, (_, campo) => ficha[campo]).trim().split('\n')
const real = readFileSync(ruta, 'utf8').trim().split('\n')
const nombres = ['Título con emoji y número', '', 'Cabecera de la tabla', '', 'Tipo', 'PS', 'Ataque estrella y daño', 'Debilidad', 'Rareza', '', 'Frase de la colección', '', 'Pie de la colección']

let fallos = 0
esperada.forEach((linea, i) => {
  if (!nombres[i]) return
  const bien = (real[i] ?? '').trim() === linea.trim()
  if (!bien) fallos++
  console.log(`${bien ? '✔' : '✘'} ${nombres[i]}${bien ? '' : `\n    se esperaba: ${linea}\n    hay:         ${real[i] ?? '(nada)'}`}`)
})
if (real.length !== esperada.length) {
  fallos++
  console.log(`✘ Número de líneas: se esperaban ${esperada.length} y hay ${real.length}`)
}
console.log(fallos ? `\n${fallos} diferencia(s) con el formato del equipo.` : '\nLa carta sigue el formato y los datos del equipo.')
process.exit(fallos ? 1 : 0)
