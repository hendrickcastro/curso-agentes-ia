#!/usr/bin/env node
// ¿Hay alguna pantalla que siga el patrón de tabla del equipo? Sale con 1 si queda algún ✘.
// Se lanza en la raíz del proyecto. Mira todas las pantallas de src/ui menos las de serie.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), 'src/ui')
const pantallas = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.js') && !['buscador.js', 'pantalla.js'].includes(f)) : []
const codigo = pantallas.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')
const html = existsSync('index.html') ? readFileSync('index.html', 'utf8') : ''

const pruebas = [
  ['Hay una pantalla nueva en src/ui', pantallas.length > 0],
  ['La tabla usa la clase del equipo (tabla-datos)', /tabla-datos/.test(codigo)],
  ['La hoja de estilos del patrón está enlazada en index.html', /tabla-datos\.css/.test(html)],
  ['La tabla tiene <caption> y cabeceras con scope', /caption/.test(codigo) && /scope/.test(codigo)],
  ['Hay una leyenda que explica los colores', /leyenda/.test(codigo)],
  ['Resaltado cruzado de fila y columna (clase resaltada)', /resaltada/.test(codigo)],
  ['Se puede recorrer con teclado (tabindex)', /tabindex|tabIndex/.test(codigo)],
  ['El filtro se guarda en la dirección para compartir el enlace', /location\.hash|URLSearchParams|history\./.test(codigo)],
]
let fallos = 0
for (const [nombre, bien] of pruebas) {
  if (!bien) fallos++
  console.log(`${bien ? '✔' : '✘'} ${nombre}`)
}
console.log(fallos ? `\n${fallos} punto(s) no siguen el patrón de tabla del equipo.` : '\nLa pantalla sigue el patrón de tabla del equipo.')
process.exit(fallos ? 1 : 0)
