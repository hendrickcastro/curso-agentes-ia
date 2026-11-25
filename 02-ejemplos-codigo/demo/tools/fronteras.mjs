#!/usr/bin/env node
// GARANTÍA DE ARQUITECTURA (versión de juguete, sin dependencias).
// Acuerdo del equipo: «las vistas no llaman a la API; los datos llegan por pokemonService».
// En un proyecto real esto lo hacen ESLint (no-restricted-globals / no-restricted-imports)
// y dependency-cruiser: mira ../referencia/garantias/.
//
// Uso:  node tools/fronteras.mjs [fichero...]   → sale con 1 si hay violaciones (DETIENE, no avisa).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const RAIZ = fileURLToPath(new URL('..', import.meta.url))
const VISTAS = /^src\/ui\/.*\.mjs$/

const REGLAS = [
  { patron: /\bfetch\s*\(/, motivo: 'Las vistas no llaman a la API: pide el dato a pokemonService.' },
  { patron: /\bXMLHttpRequest\b/, motivo: 'Las vistas no llaman a la API: pide el dato a pokemonService.' },
  { patron: /from\s+['"].*infrastructure/, motivo: 'Las vistas no importan infraestructura.' },
]

const listar = (dir) =>
  readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre)
    return statSync(ruta).isDirectory() ? listar(ruta) : [ruta]
  })

export const aRutaDeProyecto = (ruta) => relative(RAIZ, ruta).split('\\').join('/')

/** Devuelve [{ fichero, linea, motivo }] para los ficheros dados (o todo src/ui). */
export function buscarViolaciones(ficheros = listar(join(RAIZ, 'src/ui'))) {
  return ficheros
    .map((ruta) => ({ ruta, fichero: aRutaDeProyecto(ruta) }))
    .filter(({ fichero }) => VISTAS.test(fichero))
    .flatMap(({ ruta, fichero }) =>
      readFileSync(ruta, 'utf8')
        .split('\n')
        .flatMap((texto, indice) =>
          texto.trim().startsWith('//')
            ? []
            : REGLAS.filter(({ patron }) => patron.test(texto)).map(({ motivo }) => ({ fichero, linea: indice + 1, motivo })),
        ),
    )
}

export const describir = ({ fichero, linea, motivo }) => `  ${fichero}:${linea}  ${motivo}`

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argumentos = process.argv.slice(2).map((ruta) => join(process.cwd(), ruta))
  const violaciones = buscarViolaciones(argumentos.length ? argumentos : undefined)
  if (violaciones.length === 0) {
    console.log('Fronteras: sin violaciones.')
  } else {
    console.error(`Fronteras: ${violaciones.length} violación(es).\n${violaciones.map(describir).join('\n')}`)
    process.exit(1)
  }
}
