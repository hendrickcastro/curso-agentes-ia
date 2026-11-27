#!/usr/bin/env node
// Genera, a partir de 01-guia/modulos/*.md:
//   04-site/index.html            el site (un solo fichero, funciona abriéndolo con doble clic)
//   01-guia/ruta-1-resumida.md    las tres rutas en Markdown limpio
//   01-guia/ruta-2-media.md
//   01-guia/ruta-3-completa.md
//   01-guia/cobertura.md          diapositiva → sección (y falla si alguna queda sin cubrir)
// Y a partir de 01-guia/taller.md, la vista Taller: los ejercicios paso a paso.
//
// Etiquetas en los títulos de los módulos:  {R} resumida · {M} media · {C} completa
// Referencias a diapositivas:               [D1:34]  o  [D2:73-76]
// Uso: node 04-site/build.mjs
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = fileURLToPath(new URL('.', import.meta.url))
const RAIZ = join(AQUI, '..')
const DIR_MODULOS = join(RAIZ, '01-guia/modulos')
const TOTAL = { 1: 86, 2: 80 }
const NIVEL = { R: 1, M: 2, C: 3 }
const RUTAS = [
  { n: 1, id: 'resumida', nombre: 'Resumida', lema: 'Solo lo que se hace en vivo: contexto, reglas, skills, hooks, workflow y harness', duracion: 'unas 2 horas' },
  { n: 2, id: 'media', nombre: 'Media', lema: 'Todos los grandes temas de desarrollo, con el detalle y las prácticas', duracion: 'media jornada' },
  { n: 3, id: 'completa', nombre: 'Completa', lema: 'Cada tema y cada diapositiva del curso', duracion: 'dos jornadas' },
]

// La ruta resumida es solo lo que se hace en vivo: en estos módulos se respeta la etiqueta {R};
// en los demás, lo que estaba marcado {R} baja a la ruta media.
const MODULOS_EN_VIVO = ['02', '03', '05', '06']
const nivelDe = (etiqueta, numero) => (NIVEL[etiqueta] === 1 && !MODULOS_EN_VIVO.includes(numero) ? 2 : NIVEL[etiqueta])
const enAgente = () => false
const incluye = (nodo, ruta) => nodo.nivel <= ruta.n
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const RE_REF = /\[D([12]):(\d+)(?:-(\d+))?\]/g
const RE_TITULO = /^(#{1,3})\s+(.*?)\s*(?:\{([RMC])\})?\s*((?:\[D[12]:[\d-]+\]\s*)*)$/

const expandir = (texto) =>
  [...texto.matchAll(RE_REF)].flatMap(([, d, a, b]) => {
    const desde = Number(a)
    const hasta = Number(b ?? a)
    return Array.from({ length: hasta - desde + 1 }, (_, i) => ({ d: Number(d), n: desde + i }))
  })

// ---------- Markdown → HTML (subconjunto suficiente para la guía) ----------
const chip = (_, d, a, b) => `<button class="dia" data-d="${d}" data-n="${a}"${b ? ` data-b="${b}"` : ''} title="Ver la diapositiva">D${d}·${a}${b ? `–${b}` : ''}</button>`

function enLinea(texto) {
  const codigos = []
  let t = texto.replace(/`([^`]+)`/g, (_, c) => `\u0000${codigos.push(c) - 1}\u0000`)
  t = esc(t)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/&lt;(https?:[^&]+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(«])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(RE_REF, chip)
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codigos[Number(i)])}</code>`)
}

function bloques(lineas) {
  const html = []
  let i = 0
  const celdas = (fila) => fila.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
  while (i < lineas.length) {
    const linea = lineas[i]
    if (!linea.trim()) { i++; continue }
    const valla = linea.match(/^(`{3,})(\w*)/)
    if (valla) {
      const cuerpo = []
      i++
      while (i < lineas.length && !lineas[i].startsWith(valla[1])) cuerpo.push(lineas[i++])
      i++
      html.push(`<figure class="codigo"><figcaption>${valla[2] || 'texto'}<button class="copiar">Copiar</button></figcaption><pre><code>${esc(cuerpo.join('\n'))}</code></pre></figure>`)
      continue
    }
    if (linea.startsWith('|') && /^\|[\s:|-]+\|$/.test((lineas[i + 1] ?? '').trim())) {
      const cabecera = celdas(linea)
      i += 2
      const filas = []
      while (i < lineas.length && lineas[i].startsWith('|')) filas.push(celdas(lineas[i++]))
      html.push(`<div class="tabla"><table><thead><tr>${cabecera.map((c) => `<th>${enLinea(c)}</th>`).join('')}</tr></thead><tbody>${filas
        .map((f) => `<tr>${f.map((c) => `<td>${enLinea(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)
      continue
    }
    if (linea.startsWith('>')) {
      const cuerpo = []
      while (i < lineas.length && lineas[i].startsWith('>')) cuerpo.push(lineas[i++].replace(/^>\s?/, ''))
      const texto = cuerpo.join(' ')
      const clase = /^\*\*(Analogía|Ejemplo)/.test(texto) ? 'analogia' : /^\*\*En una frase/.test(texto) ? 'frase' : 'nota'
      html.push(`<blockquote class="${clase}">${bloques(cuerpo)}</blockquote>`)
      continue
    }
    const item = /^(\s*)([-*]|\d+\.)\s+(.*)$/
    if (item.test(linea)) {
      const ordenada = /^\s*\d+\./.test(linea)
      const items = []
      while (i < lineas.length && (item.test(lineas[i]) || /^\s{2,}\S/.test(lineas[i]))) {
        const m = lineas[i].match(item)
        if (m) items.push(m[3])
        else items[items.length - 1] += ` ${lineas[i].trim()}`
        i++
      }
      const tag = ordenada ? 'ol' : 'ul'
      const inicio = ordenada ? Number(linea.match(/\d+/)[0]) : 1
      html.push(`<${tag}${inicio > 1 ? ` start="${inicio}"` : ''}>${items.map((t) => `<li>${enLinea(t)}</li>`).join('')}</${tag}>`)
      continue
    }
    const parrafo = []
    while (i < lineas.length && lineas[i].trim() && !/^(`{3,}|>|\||\s*([-*]|\d+\.)\s)/.test(lineas[i])) parrafo.push(lineas[i++])
    if (parrafo.length === 0) parrafo.push(lineas[i++])
    html.push(`<p>${enLinea(parrafo.join(' '))}</p>`)
  }
  return html.join('\n')
}

// ---------- Lectura de los módulos como árbol módulo → sección → subsección ----------
function leerModulo(fichero) {
  const lineas = readFileSync(join(DIR_MODULOS, fichero), 'utf8').split('\n')
  const numero = fichero.slice(0, 2)
  let modulo = null
  let seccion = null
  let sub = null
  let enValla = false
  for (const linea of lineas) {
    if (/^`{3,}/.test(linea)) enValla = !enValla
    const m = !enValla && linea.match(RE_TITULO)
    if (!m) {
      (sub ?? seccion ?? modulo)?.lineas.push(linea)
      continue
    }
    const [, almohadillas, titulo, etiqueta, refs] = m
    const nodo = { titulo, etiqueta, refs: expandir(refs), lineas: [], hijos: [] }
    if (almohadillas.length === 1) {
      modulo = { ...nodo, numero, fichero, nivel: nivelDe(etiqueta ?? 'R', numero), id: `m${numero}` }
      seccion = sub = null
    } else if (almohadillas.length === 2) {
      seccion = { ...nodo, nivel: Math.max(modulo.nivel, nivelDe(etiqueta, numero) ?? modulo.nivel), id: `m${numero}-${slug(titulo)}` }
      modulo.hijos.push(seccion)
      sub = null
    } else {
      sub = { ...nodo, nivel: Math.max(seccion.nivel, nivelDe(etiqueta, numero) ?? seccion.nivel), id: `${seccion.id}-${slug(titulo)}` }
      seccion.hijos.push(sub)
    }
  }
  for (const nodo of [modulo, ...modulo.hijos, ...modulo.hijos.flatMap((s) => s.hijos)]) {
    nodo.refs.push(...expandir(nodo.lineas.join('\n')))
  }
  return modulo
}

const modulos = readdirSync(DIR_MODULOS).filter((f) => f.endsWith('.md')).sort().map(leerModulo)

// ---------- Cobertura: toda diapositiva tiene que estar referenciada ----------
const donde = new Map()
for (const modulo of modulos) {
  const apuntar = (nodo, etiqueta) => nodo.refs.forEach(({ d, n }) => {
    const clave = `${d}:${n}`
    if (!donde.has(clave)) donde.set(clave, { id: nodo.id, etiqueta, nivel: nodo.nivel })
  })
  for (const seccion of modulo.hijos) {
    for (const s of seccion.hijos) apuntar(s, `${modulo.titulo} › ${seccion.titulo} › ${s.titulo}`)
    apuntar(seccion, `${modulo.titulo} › ${seccion.titulo}`)
  }
  apuntar(modulo, modulo.titulo)
}
const faltan = []
const invalidas = [...donde.keys()].filter((k) => { const [d, n] = k.split(':').map(Number); return n < 1 || n > TOTAL[d] })
for (const d of [1, 2]) for (let n = 1; n <= TOTAL[d]; n++) if (!donde.has(`${d}:${n}`)) faltan.push(`D${d}:${n}`)
if (faltan.length || invalidas.length) {
  console.error(`COBERTURA INCOMPLETA. Sin cubrir: ${faltan.join(', ') || '—'}. Referencias inválidas: ${invalidas.join(', ') || '—'}`)
  process.exit(1)
}

const nombreRuta = { 1: 'Resumida', 2: 'Media', 3: 'Completa' }
const cobertura = ['# Cobertura: cada diapositiva y dónde se explica', '',
  `Las ${TOTAL[1] + TOTAL[2]} diapositivas del curso están cubiertas en la ruta completa. La columna «Ruta» indica la ruta más corta en la que aparece esa sección.`, '']
for (const d of [1, 2]) {
  cobertura.push(`## Día ${d}`, '', '| Diapositiva | Dónde se explica | Ruta |', '|---|---|---|')
  for (let n = 1; n <= TOTAL[d]; n++) {
    const { etiqueta, nivel } = donde.get(`${d}:${n}`)
    cobertura.push(`| [D${d}·${n}](../00-material-original/diapositivas/dia${d}/${String(n).padStart(2, '0')}.jpg) | ${etiqueta} | ${nombreRuta[nivel]} |`)
  }
  cobertura.push('')
}
writeFileSync(join(RAIZ, '01-guia/cobertura.md'), cobertura.join('\n'))

// ---------- Las tres rutas en Markdown limpio ----------
const limpiar = (linea) => linea.replace(RE_REF, (_, d, a, b) => `(D${d}·${a}${b ? `–${b}` : ''})`)
function rutaMarkdown(ruta) {
  const salida = [`# Desarrollo de software con IA · Ruta ${ruta.nombre.toLowerCase()}`, '',
    `> ${ruta.lema}. Duración orientativa para explicarla: ${ruta.duracion}. Las referencias (D1·34) remiten a las diapositivas originales en \`00-material-original/diapositivas/\`.`, '']
  const volcar = (nodo, almohadillas, numero = nodo.numero) => {
    if (!incluye(nodo, ruta, numero)) return
    const refs = nodo.refs.length ? '' : ''
    salida.push(`${almohadillas} ${nodo.titulo}${refs}`, ...nodo.lineas.map(limpiar))
    nodo.hijos.forEach((hijo) => volcar(hijo, `${almohadillas}#`, numero))
  }
  modulos.forEach((m) => volcar(m, '#'))
  return salida.join('\n').replace(/\n{3,}/g, '\n\n')
}
for (const ruta of RUTAS) writeFileSync(join(RAIZ, `01-guia/ruta-${ruta.n}-${ruta.id}.md`), rutaMarkdown(ruta))

// ---------- El site ----------
const videos = existsSync(join(RAIZ, '03-videos')) ? readdirSync(join(RAIZ, '03-videos')).filter((f) => f.endsWith('.mp4')).sort() : []
const videoDe = (numero) => videos.find((f) => f.startsWith(`${numero}-`))
const refsHtml = (nodo) => {
  const propias = [...new Map(nodo.refs.map((r) => [`${r.d}:${r.n}`, r])).values()]
  return propias.length ? `<span class="refs">${propias.map(({ d, n }) => chip(null, d, n)).join('')}</span>` : ''
}
const sinRefs = (lineas) => lineas // las referencias en línea se convierten en chips dentro del texto

const seccionHtml = (nodo, clase, tag, numero) => `<section class="${clase}" data-nivel="${nodo.nivel}"${enAgente(nodo, numero) ? ' data-agente' : ''} id="${nodo.id}">
<${tag}>${enLinea(nodo.titulo)}<span class="marca n${nodo.nivel}">${nombreRuta[nodo.nivel]}</span></${tag}><button class="quitar" data-clave="${nodo.id}"></button>
${nodo.etiqueta !== undefined || nodo.refs.length ? '' : ''}${bloques(sinRefs(nodo.lineas))}
${nodo.hijos.map((h) => seccionHtml(h, 'sub', 'h3', numero)).join('\n')}
</section>`

const contenido = modulos.map((m) => {
  const video = videoDe(m.numero)
  return `<article class="modulo" data-nivel="${m.nivel}"${enAgente(m, m.numero) ? ' data-agente' : ''} id="${m.id}" data-numero="${m.numero}">
<header><p class="num">Módulo <span class="n-mod">${m.numero}</span></p><h1>${enLinea(m.titulo)}<span class="marca n${m.nivel}">${nombreRuta[m.nivel]}</span></h1><button class="quitar" data-clave="${m.id}"></button></header>
${bloques(m.lineas)}
${video ? `<details class="video" data-video="${m.numero}"><summary>Vídeo explicativo del módulo</summary><video controls preload="none" src="../03-videos/${video}"></video></details>` : ''}
${m.hijos.map((s) => seccionHtml(s, 'seccion', 'h2', m.numero)).join('\n')}
</article>`
}).join('\n')

// ---------- El taller: ejercicios paso a paso (01-guia/taller.md) ----------
const NOMBRE_LAB = { cuaderno: 'Cuaderno de prácticas', contexto: 'Ventana de contexto', diagnostico: 'Diagnóstico de contexto', red: 'Autodiagnóstico de la red', ratchet: 'Ratchet', spec: 'Descrito o especificado', carriles: 'Embudo de carriles', coste: 'Coste de especificar' }
const CLASE_PARTE = { Haz: 'haz', 'Deberías ver': 'ver', 'Al chat': 'chat', 'La idea': 'idea' }
const ejercicios = readFileSync(join(RAIZ, '01-guia/taller.md'), 'utf8').split(/^## /m).slice(1).map((trozo, i) => {
  const [cabecera, ...resto] = trozo.split('\n')
  const [, titulo, etiqueta] = cabecera.match(/^(.*?)\s*\{([RMC])\}\s*$/)
  const meta = Object.fromEntries(resto.find((l) => l.startsWith('@')).slice(1).split(';').map((p) => p.split('=').map((x) => x.trim())))
  const partes = resto.filter((l) => !l.startsWith('@')).join('\n').split(/^### /m).slice(1).map((p) => { const [nombre, ...cuerpo] = p.split('\n'); return { nombre: nombre.trim(), cuerpo } })
  for (const p of partes) if (!CLASE_PARTE[p.nombre]) throw new Error(`Taller: parte desconocida «${p.nombre}» en «${titulo}»`)
  if (meta.guia && !modulos.some((m) => m.id === meta.guia || m.hijos.some((s) => s.id === meta.guia))) throw new Error(`Taller: «${titulo}» enlaza a una sección que no existe: ${meta.guia}`)
  if (meta.lab && !NOMBRE_LAB[meta.lab]) throw new Error(`Taller: «${titulo}» enlaza a una herramienta que no existe: ${meta.lab}`)
  return { n: i, id: `t${i}`, titulo, nivel: NIVEL[etiqueta] === 1 && meta.vivo !== 'si' ? 2 : NIVEL[etiqueta], meta, partes, agente: false }
})
const taller = ejercicios.map((e) => `<article class="ejercicio" data-nivel="${e.nivel}"${e.agente ? ' data-agente' : ''} id="${e.id}" data-min="${e.meta.tiempo}">
<header><p class="num">Ejercicio <span class="n-ej">${e.n + 1}</span> · ${e.meta.tiempo} min · ${esc(e.meta.necesita)}</p><h2>${enLinea(e.titulo)}<span class="marca n${e.nivel}">${nombreRuta[e.nivel]}</span></h2><button class="quitar" data-clave="${e.id}"></button></header>
${e.partes.map((p) => `<div class="parte ${CLASE_PARTE[p.nombre]}"><h3>${p.nombre}</h3>${bloques(p.cuerpo)}</div>`).join('\n')}
<footer>${e.meta.lab ? `<button class="ir-lab" data-lab="${e.meta.lab}">Abrir en el laboratorio: ${NOMBRE_LAB[e.meta.lab]}</button>` : ''}${e.meta.guia ? `<button class="ir-guia" data-guia="${e.meta.guia}">La explicación, en la guía</button>` : ''}<label class="hecho"><input type="checkbox" data-hecho="${e.id}"> Hecho</label></footer>
</article>`).join('\n')

const cuenta = (ruta) => modulos.flatMap((m) => m.hijos.map((s) => [s, m.numero])).filter(([s, numero]) => incluye(s, ruta, numero)).length
const datos = {
  rutas: RUTAS.map((r) => { const suyos = ejercicios.filter((e) => e.nivel <= r.n); return { ...r, secciones: cuenta(r), modulos: modulos.filter((m) => incluye(m, r, m.numero)).length, ejercicios: suyos.length, minutosTaller: suyos.reduce((s, e) => s + Number(e.meta.tiempo), 0) } }),
  total: TOTAL,
  donde: Object.fromEntries(donde),
  videos: modulos.filter((m) => videoDe(m.numero)).map((m) => ({ numero: m.numero, titulo: m.titulo, fichero: videoDe(m.numero), nivel: m.nivel })),
}

const leer = (nombre) => readFileSync(join(AQUI, 'src', nombre), 'utf8')
const html = leer('plantilla.html')
  .replace('/*CSS*/', () => leer('estilos.css'))
  .replace('<!--CONTENIDO-->', () => contenido)
  .replace('<!--TALLER-->', () => taller)
  .replace('/*DATOS*/', () => `const DATOS = ${JSON.stringify(datos)};`)
  .replace('/*APP*/', () => leer('app.js'))
  .replace('/*LAB*/', () => leer('lab.js'))
  .replace('/*VIVO*/', () => leer('vivo.js'))
writeFileSync(join(AQUI, 'index.html'), html)

console.log(`Site: 04-site/index.html (${(html.length / 1024).toFixed(0)} KB)`)
for (const r of datos.rutas) console.log(`  Ruta ${r.nombre.padEnd(9)} ${String(r.modulos).padStart(2)} módulos, ${String(r.secciones).padStart(3)} secciones, ${String(r.ejercicios).padStart(2)} ejercicios (${r.minutosTaller} min de práctica)`)
console.log(`Cobertura: ${TOTAL[1] + TOTAL[2]}/${TOTAL[1] + TOTAL[2]} diapositivas. Vídeos enlazados: ${datos.videos.length}`)
