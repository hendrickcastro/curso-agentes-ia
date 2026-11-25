// Tests de aceptación GUIADOS POR LA ESPECIFICACIÓN.
// Los datos (consulta y resultado esperado) no están escritos aquí: se leen del
// fichero de criterios. Por eso, si alguien cambia un dato del criterio, un test cae.
// Esa es la propiedad que comprueba `npm run spec:mutacion`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buscarPokemon } from '../src/core/pokemonService.mjs'

const rutaSpec = process.env.SPEC_FILE ?? new URL('../specs/buscador.criterios.json', import.meta.url)
const spec = JSON.parse(readFileSync(rutaSpec, 'utf8'))

// Qué sabe comprobar este runner. OJO: `tiempoMaximoMs` NO está en la lista,
// así que el criterio AC5 es decorativo: está escrito, pero nada lo verifica.
const COMPROBACIONES = {
  resultados: (real, esperado) => assert.deepEqual(real.resultados, esperado),
  haBuscado: (real, esperado) => assert.equal(real.haBuscado, esperado),
  mensaje: (real, esperado) => assert.equal(real.mensaje, esperado),
}

for (const criterio of spec.criterios) {
  test(`${criterio.id} — ${criterio.texto}`, () => {
    const real = buscarPokemon(criterio.dado.consulta)
    for (const [clave, esperado] of Object.entries(criterio.entonces)) {
      COMPROBACIONES[clave]?.(real, esperado)
    }
  })
}
