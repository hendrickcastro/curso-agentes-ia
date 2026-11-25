import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { decidirCarril } from '../tools/carril.mjs'

const leer = (ruta) => JSON.parse(readFileSync(new URL(ruta, import.meta.url), 'utf8'))
const config = leer('../carriles.config.json')
const carrilDe = (fichero) => decidirCarril(leer(`../cambios/${fichero}`), config).carril

test('un cambio pequeño, con la red en verde y deteniendo, se fusiona solo', () => {
  assert.equal(carrilDe('01-texto-de-pantalla.json'), 'verde')
})

test('un cambio grande de un autor sin historial va por muestreo', () => {
  assert.equal(carrilDe('02-funcionalidad-grande.json'), 'muestreo')
})

test('tocar tests existentes sin que cambie la especificación obliga a leerlo entero', () => {
  assert.equal(carrilDe('03-toca-los-tests.json'), 'lectura')
})

test('una zona vetada se lee siempre, por pequeño y seguro que parezca', () => {
  assert.equal(carrilDe('04-zona-vetada.json'), 'lectura')
})

test('si una garantía solo avisa o no existe, no hay carril verde', () => {
  assert.equal(carrilDe('05-red-que-solo-avisa.json'), 'muestreo')
})

test('con la red en rojo el cambio no entra por ningún carril', () => {
  assert.equal(carrilDe('06-red-en-rojo.json'), 'bloqueado')
})

test('una nota de riesgo baja nunca devuelve un cambio al carril verde', () => {
  const cambio = { ...leer('../cambios/04-zona-vetada.json'), notaDeRiesgo: 0 }
  assert.equal(decidirCarril(cambio, config).carril, 'lectura')
})
