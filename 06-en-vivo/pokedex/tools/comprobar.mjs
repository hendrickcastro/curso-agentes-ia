#!/usr/bin/env node
// LA RED DEL EQUIPO: tres comprobaciones que DETIENEN (salen con código 1).
//   capas    las pantallas (src/ui) no leen datos por su cuenta: ni importan de src/data ni usan fetch
//   colores  los colores solo se escriben en src/estilos/tokens.css; en el resto, var(--…)
//   tamaño   ningún fichero de src/ pasa de 120 líneas (los datos de src/data no cuentan)
// Uso: node tools/comprobar.mjs            todo el proyecto (la carpeta actual)
//      node tools/comprobar.mjs <fichero>  solo ese fichero (lo usa el hook del agente)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const RAIZ = process.cwd()
const MAX_LINEAS = 120
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/

function ficheros(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre)
    return statSync(ruta).isDirectory() ? ficheros(ruta) : [ruta]
  })
}

export function violaciones(ruta) {
  const rel = relative(RAIZ, ruta).split('\\').join('/')
  if (!existsSync(ruta) || !/\.(js|mjs|css|html)$/.test(rel) || !(rel.startsWith('src/') || rel === 'index.html')) return []
  const lineas = readFileSync(ruta, 'utf8').split('\n')
  const fallos = []
  lineas.forEach((linea, i) => {
    if (rel.startsWith('src/ui/') && /from\s+['"][^'"]*\/data\//.test(linea)) fallos.push(`${rel}:${i + 1}  capas: una pantalla no importa de src/data; pide el dato a src/core.`)
    if (rel.startsWith('src/ui/') && /\bfetch\(/.test(linea)) fallos.push(`${rel}:${i + 1}  capas: una pantalla no llama a la red; pide el dato a src/core.`)
    if (rel !== 'src/estilos/tokens.css' && !rel.startsWith('src/data/') && COLOR.test(linea)) fallos.push(`${rel}:${i + 1}  colores: usa una variable de src/estilos/tokens.css (var(--…)); si falta el color, añádelo allí.`)
  })
  const total = lineas.at(-1) === '' ? lineas.length - 1 : lineas.length
  if (rel.startsWith('src/') && !rel.startsWith('src/data/') && total > MAX_LINEAS) fallos.push(`${rel}  tamaño: tiene ${total} líneas y el máximo es ${MAX_LINEAS}; sepáralo en ficheros más pequeños.`)
  return fallos
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const objetivo = process.argv[2]
  const lista = objetivo ? [resolve(RAIZ, objetivo)] : [...ficheros(join(RAIZ, 'src')), join(RAIZ, 'index.html')]
  const fallos = lista.flatMap(violaciones)
  if (fallos.length === 0) {
    console.log('Red del equipo: en verde (capas, colores y tamaño).')
    process.exit(0)
  }
  console.error(`Red del equipo: ${fallos.length} problema(s).\n${fallos.join('\n')}`)
  process.exit(1)
}
