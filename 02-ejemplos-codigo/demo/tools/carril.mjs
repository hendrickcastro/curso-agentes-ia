#!/usr/bin/env node
// EL EMBUDO DE CARRILES: ¿qué PR no vas a leer?
//
//   verde     → se fusiona solo, nadie lo lee
//   muestreo  → un revisor automático hace la primera pasada y una persona mira lo que señala
//   lectura   → una persona lo revisa línea a línea
//   bloqueado → la red está en rojo: vuelve a quien lo escribió
//
// Regla de oro: cada etapa solo puede mandar el cambio a un carril MÁS LENTO. Ninguna abre.
// Uso:  node tools/carril.mjs cambios/01-texto.json [--json]
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RAIZ } from './fronteras.mjs'

const ORDEN = ['verde', 'muestreo', 'lectura', 'bloqueado']
const masLento = (a, b) => (ORDEN.indexOf(b) > ORDEN.indexOf(a) ? b : a)

const ETAPAS = [
  {
    nombre: '01 Zonas vetadas (regla)',
    decidir: (cambio, config) => {
      const tocadas = cambio.ficheros.filter((f) => config.zonasVetadas.some((zona) => f.startsWith(zona)))
      return tocadas.length ? { carril: 'lectura', motivo: `toca zona vetada: ${tocadas.join(', ')}` } : null
    },
  },
  {
    nombre: '02 Quién lo escribió (regla)',
    decidir: (cambio, config) =>
      config.autoresSinHistorial.includes(cambio.autor)
        ? { carril: 'muestreo', motivo: `autor sin historial en este repositorio: ${cambio.autor}` }
        : null,
  },
  {
    nombre: '03 Señales del diff (regla)',
    decidir: (cambio, config) => {
      // La red puede crecer sola; lo que no puede es encogerse sin que nadie lo vea.
      const encoge = [
        cambio.testsModificadosOBorrados > 0 && `modifica o borra ${cambio.testsModificadosOBorrados} test(s) que ya existían`,
        cambio.relajaUmbrales && 'relaja un umbral',
        cambio.anadeExcepciones && 'añade una excepción (eslint-disable, skip, ignore…)',
      ].filter(Boolean)
      if (encoge.length && !cambio.cambioLaEspecificacion) {
        return { carril: 'lectura', motivo: `encoge la red sin que haya cambiado la especificación: ${encoge.join('; ')}` }
      }
      if (encoge.length) return { carril: 'muestreo', motivo: `encoge la red (la especificación cambió): ${encoge.join('; ')}` }
      if (cambio.lineasCambiadas > config.maxLineasCarrilVerde) {
        return { carril: 'muestreo', motivo: `${cambio.lineasCambiadas} líneas, por encima de ${config.maxLineasCarrilVerde}` }
      }
      return null
    },
  },
  {
    nombre: '04 Nota de riesgo (modelo: cierra, nunca abre)',
    decidir: (cambio, config) => {
      const nota = cambio.notaDeRiesgo ?? 0
      if (nota >= config.riesgo.lecturaDesde) return { carril: 'lectura', motivo: `riesgo ${nota}/10` }
      if (nota >= config.riesgo.muestreoDesde) return { carril: 'muestreo', motivo: `riesgo ${nota}/10` }
      return null // una nota baja NO devuelve el cambio al carril verde
    },
  },
  {
    nombre: '05 Red de garantías (las comprobaciones)',
    decidir: (cambio, config) => {
      const estado = cambio.garantias ?? {}
      const enRojo = config.garantiasQueDebenDetener.filter((g) => estado[g] === 'rojo')
      if (enRojo.length) return { carril: 'bloqueado', motivo: `en rojo: ${enRojo.join(', ')}` }
      const soloAvisan = config.garantiasQueDebenDetener.filter((g) => estado[g] !== 'verde')
      return soloAvisan.length
        ? { carril: 'muestreo', motivo: `sin carril verde: no existe o solo avisa → ${soloAvisan.join(', ')}` }
        : null
    },
  },
]

export function decidirCarril(cambio, config) {
  return ETAPAS.reduce(
    (estado, etapa) => {
      const veredicto = etapa.decidir(cambio, config)
      const carril = veredicto ? masLento(estado.carril, veredicto.carril) : estado.carril
      return { carril, traza: [...estado.traza, { etapa: etapa.nombre, carril, motivo: veredicto?.motivo ?? 'pasa' }] }
    },
    { carril: 'verde', traza: [] },
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [rutaCambio, ...opciones] = process.argv.slice(2)
  if (!rutaCambio) {
    console.error('Uso: node tools/carril.mjs cambios/<cambio>.json [--json]')
    process.exit(64)
  }
  const cambio = JSON.parse(readFileSync(rutaCambio, 'utf8'))
  const config = JSON.parse(readFileSync(join(RAIZ, 'carriles.config.json'), 'utf8'))
  const { carril, traza } = decidirCarril(cambio, config)

  if (opciones.includes('--json')) {
    console.log(JSON.stringify({ carril, traza }, null, 2))
  } else {
    console.log(`Cambio: ${cambio.titulo}`)
    for (const paso of traza) console.log(`  ${paso.etapa.padEnd(48)} → ${paso.carril.padEnd(9)} ${paso.motivo}`)
    console.log(`CARRIL: ${carril.toUpperCase()}`)
  }
}
