import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderBuscador } from '../src/ui/buscadorView.mjs'

test('la vista pide más letras cuando la consulta es demasiado corta', () => {
  assert.equal(renderBuscador('p'), 'Escribe al menos dos letras.')
})

test('la vista pinta un resultado por línea', () => {
  assert.equal(renderBuscador('chu'), '• Pikachu\n• Raichu\n• Machu')
})

test('la vista enseña el mensaje de sin resultados', () => {
  assert.equal(renderBuscador('zzz'), 'Ningún Pokémon se llama así')
})
