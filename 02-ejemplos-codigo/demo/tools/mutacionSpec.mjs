#!/usr/bin/env node
// MUTACIÓN DE LA ESPECIFICACIÓN: «Si cambio un dato del criterio de aceptación, ¿falla algún test?»
// Detecta criterios decorativos: los que están escritos pero que ningún test comprueba.
// No hay herramienta estándar para esto (el curso lo dice: «script propio»). Este es uno.
//
// Para cada criterio: cambia un dato esperado, lanza los tests de aceptación contra esa
// copia mutada y espera que FALLEN. Si siguen en verde, el criterio no protege nada.
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { RAIZ } from './fronteras.mjs'

const RUTA_SPEC = join(RAIZ, 'specs/buscador.criterios.json')
const spec = JSON.parse(readFileSync(RUTA_SPEC, 'utf8'))
const temporal = mkdtempSync(join(tmpdir(), 'mutacion-spec-'))

const mutar = (valor) => {
  if (typeof valor === 'boolean') return !valor
  // Un número suele ser un umbral («menos de 200 ms»): sumarle 1 no lo rompería. Se lleva a negativo.
  if (typeof valor === 'number') return -1 - valor
  if (typeof valor === 'string') return `${valor} (mutado)`
  if (Array.isArray(valor)) return [...valor, 'Mutante']
  return valor
}

const testsPasanCon = (specMutada, indice) => {
  const ruta = join(temporal, `spec-${indice}.json`)
  writeFileSync(ruta, JSON.stringify(specMutada))
  const { status } = spawnSync(process.execPath, ['--test', 'test/aceptacion.test.mjs'], {
    cwd: RAIZ,
    env: { ...process.env, SPEC_FILE: ruta },
    encoding: 'utf8',
  })
  return status === 0
}

const resultados = spec.criterios.map((criterio, indice) => {
  const [clave, valor] = Object.entries(criterio.entonces)[0]
  const mutada = structuredClone(spec)
  mutada.criterios[indice].entonces[clave] = mutar(valor)
  const sobrevive = testsPasanCon(mutada, indice)
  return { id: criterio.id, texto: criterio.texto, clave, sobrevive }
})

for (const { id, texto, clave, sobrevive } of resultados) {
  console.log(`${sobrevive ? 'DECORATIVO' : 'protegido '}  ${id}  (${clave})  ${texto}`)
}

const decorativos = resultados.filter(({ sobrevive }) => sobrevive)
if (decorativos.length > 0) {
  console.error(
    `\nMutación de la spec: ${decorativos.length} criterio(s) decorativo(s): ${decorativos.map(({ id }) => id).join(', ')}.` +
      '\nCambiar su dato no hace caer ningún test. O se escribe el test, o se quita el criterio.',
  )
  process.exit(1)
}
console.log('\nMutación de la spec: todos los criterios están protegidos por algún test.')
