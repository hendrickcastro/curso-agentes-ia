// Tests de aceptación guiados por specs/criterios.json: los datos esperados se leen de la especificación.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buscarPokemon, listarPokemon } from '../src/core/pokedex.js'

const spec = JSON.parse(readFileSync(new URL('../specs/criterios.json', import.meta.url), 'utf8'))

for (const criterio of spec.criterios.filter((c) => c.dado?.consulta !== undefined)) {
  test(`${criterio.id} — ${criterio.texto}`, () => {
    const real = buscarPokemon(criterio.dado.consulta)
    if ('haBuscado' in criterio.entonces) assert.equal(real.haBuscado, criterio.entonces.haBuscado)
    if ('resultados' in criterio.entonces) assert.deepEqual(real.resultados.map((p) => p.nombre), criterio.entonces.resultados)
  })
}

test('la lista completa sale ordenada por número', () => {
  const numeros = listarPokemon().map((p) => p.numero)
  assert.deepEqual(numeros, [...numeros].sort((a, b) => a - b))
})
