#!/usr/bin/env node
// Paso 1 de la skill: los datos del equipo para un Pokémon. Determinista: no opina, devuelve.
import { readFileSync } from 'node:fs'

const pokedex = JSON.parse(readFileSync(new URL('../datos/pokedex.json', import.meta.url), 'utf8'))
const nombre = String(process.argv[2] ?? '').trim().toLowerCase()
const ficha = pokedex[nombre]

if (!ficha) {
  console.error(`«${process.argv[2] ?? ''}» no está en la colección. Disponibles: ${Object.values(pokedex).map((p) => p.nombre).join(', ')}.`)
  process.exit(1)
}
console.log(JSON.stringify(ficha, null, 2))
