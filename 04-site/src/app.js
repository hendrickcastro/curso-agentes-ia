// ---------- utilidades ----------
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const h = (tag, attrs = {}, ...hijos) => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (k === 'class') el.className = v
    else if (k === 'html') el.innerHTML = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v)
  }
  for (const hijo of hijos.flat()) if (hijo != null && hijo !== false) el.append(hijo.nodeType ? hijo : document.createTextNode(hijo))
  return el
}
const memoria = {
  leer(clave, defecto) { try { return JSON.parse(localStorage.getItem(clave)) ?? defecto } catch { return defecto } },
  guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); return true } catch { return false } },
}
const pad = (n) => String(n).padStart(2, '0')
const rutaDia = (d, n) => `../00-material-original/diapositivas/dia${d}/${pad(n)}.jpg`

// ---------- rutas ----------
const cajaRutas = $('.rutas')
function ponerRuta(n) {
  document.body.dataset.ruta = n
  memoria.guardar('kt540.ruta', n)
  $$('button', cajaRutas).forEach((b) => b.classList.toggle('activo', Number(b.dataset.n) === n))
  const r = DATOS.rutas.find((x) => x.n === n)
  $('#resumen-ruta').innerHTML = `<b>Ruta ${r.nombre.toLowerCase()}</b>${r.lema}.<br><small>${r.modulos} módulos · ${r.secciones} secciones · ${r.duracion}</small>`
  pintarIndice()
  pintarCabeceraTaller()
}
DATOS.rutas.forEach((r) => cajaRutas.append(h('button', { 'data-n': r.n, title: `${r.lema} (${r.duracion})`, onclick: () => ponerRuta(r.n) }, r.nombre)))

const visible = (el) => Number(el.dataset.nivel) <= Number(document.body.dataset.ruta)
const tituloDe = (el) => { const t = el.querySelector('h1,h2,h3').cloneNode(true); $$('.marca,.dia,.refs', t).forEach((x) => x.remove()); return t.textContent.trim() }

function pintarIndice() {
  const toc = $('#toc')
  toc.textContent = ''
  for (const modulo of $$('.modulo').filter(visible)) {
    toc.append(h('a', { href: `#${modulo.id}`, class: 'mod' }, `${modulo.dataset.numero} · ${tituloDe(modulo)}`))
    for (const seccion of $$(':scope > .seccion', modulo).filter(visible)) toc.append(h('a', { href: `#${seccion.id}` }, tituloDe(seccion)))
  }
}

// ---------- taller: ejercicios, progreso y saltos a la guía y al laboratorio ----------
const hechos = () => memoria.leer('kt540.taller', {})
function pintarCabeceraTaller() {
  const r = DATOS.rutas.find((x) => x.n === Number(document.body.dataset.ruta))
  const visibles = $$('.ejercicio').filter(visible)
  const marcados = visibles.filter((e) => hechos()[e.id]).length
  $('#taller-cabecera').innerHTML = `<h1>Taller</h1><p class="lema">Menos explicación y más teclado: cada ejercicio es <strong>haz esto → deberías ver esto → cuéntalo en el chat</strong>, y la teoría cabe en una frase. Ruta ${r.nombre.toLowerCase()}: ${r.ejercicios} ejercicios, ${r.minutosTaller} minutos de práctica.</p><div class="progreso-taller"><i style="width:${visibles.length ? (marcados / visibles.length) * 100 : 0}%"></i></div><p class="ayuda">${marcados} de ${visibles.length} hechos. El progreso se guarda en este navegador.</p>`
}
$$('[data-hecho]').forEach((c) => {
  c.checked = Boolean(hechos()[c.dataset.hecho])
  c.closest('.ejercicio').classList.toggle('terminado', c.checked)
  c.addEventListener('change', () => { memoria.guardar('kt540.taller', { ...hechos(), [c.dataset.hecho]: c.checked }); c.closest('.ejercicio').classList.toggle('terminado', c.checked); pintarCabeceraTaller() })
})
document.addEventListener('click', (e) => {
  const lab = e.target.closest('.ir-lab')
  if (lab) { pase.hidden = true; memoria.guardar('kt540.lab.ultima', lab.dataset.lab); ponerVista('lab'); $(`.lab-menu button[data-id="${lab.dataset.lab}"]`)?.click() }
  const guia = e.target.closest('.ir-guia')
  if (guia) { pase.hidden = true; const destino = document.getElementById(guia.dataset.guia); const nivel = Number(destino.dataset.nivel); if (nivel > Number(document.body.dataset.ruta)) ponerRuta(nivel); ponerVista('guia'); setTimeout(() => destino.scrollIntoView(), 30) }
})

// ---------- vistas ----------
function ponerVista(nombre) {
  document.body.dataset.vista = nombre
  $$('.vistas button').forEach((b) => b.classList.toggle('activo', b.dataset.vista === nombre))
  $$('.vista').forEach((v) => (v.hidden = v.id !== `vista-${nombre}`))
  if (nombre === 'diapos' && !$('#vista-diapos').childElementCount) pintarDiapositivas()
  if (nombre === 'videos' && !$('#vista-videos').childElementCount) pintarVideos()
  if (nombre === 'lab' && window.iniciarLab) window.iniciarLab()
  window.scrollTo(0, 0)
}
$$('.vistas button').forEach((b) => b.addEventListener('click', () => ponerVista(b.dataset.vista)))

function pintarVideos() {
  const caja = $('#vista-videos')
  caja.append(h('h1', {}, 'Vídeos explicativos'), h('p', {}, 'Un vídeo corto por módulo, con narración. Los guiones están en 03-videos/guiones.md.'))
  if (!DATOS.videos.length) caja.append(h('p', {}, 'Todavía no hay vídeos generados (ejecuta 03-videos/generar.sh y después 04-site/build.mjs).'))
  for (const v of DATOS.videos) {
    caja.append(h('div', { class: 'panel' }, h('h3', {}, `${v.numero} · ${v.titulo}`), h('video', { controls: true, preload: 'none', src: `../03-videos/${v.fichero}` })))
  }
}

function pintarDiapositivas() {
  const caja = $('#vista-diapos')
  caja.append(h('h1', {}, 'Diapositivas originales'), h('p', {}, 'Las 166 diapositivas del curso. Cada una enlaza con la sección de la guía donde se explica.'))
  for (const d of [1, 2]) {
    caja.append(h('h2', {}, `Día ${d}`))
    const rejilla = h('div', { class: 'rejilla' })
    for (let n = 1; n <= DATOS.total[d]; n++) {
      const info = DATOS.donde[`${d}:${n}`]
      rejilla.append(h('button', { onclick: () => abrirVisor(d, n) }, h('img', { loading: 'lazy', src: rutaDia(d, n), alt: `Día ${d}, diapositiva ${n}` }), h('span', {}, `D${d}·${n} — ${info.etiqueta.split(' › ').slice(-1)[0]}`)))
    }
    caja.append(rejilla)
  }
}

// ---------- visor de diapositivas ----------
const visor = $('#visor')
let actual = { d: 1, n: 1 }
function abrirVisor(d, n) {
  actual = { d, n }
  const info = DATOS.donde[`${d}:${n}`]
  $('img', visor).src = rutaDia(d, n)
  const pie = $('figcaption', visor)
  pie.textContent = `Día ${d} · diapositiva ${n} de ${DATOS.total[d]} — `
  pie.append(h('a', { href: `#${info.id}`, onclick: () => irA(info) }, info.etiqueta))
  visor.hidden = false
}
function irA(info) {
  visor.hidden = true
  if (info.nivel > Number(document.body.dataset.ruta)) ponerRuta(info.nivel)
  ponerVista('guia')
  setTimeout(() => document.getElementById(info.id)?.scrollIntoView(), 30)
}
function moverVisor(paso) {
  let { d, n } = actual
  n += paso
  if (n < 1) { d = d === 1 ? 2 : 1; n = DATOS.total[d] }
  if (n > DATOS.total[d]) { d = d === 1 ? 2 : 1; n = 1 }
  abrirVisor(d, n)
}
$('.cerrar', visor).onclick = () => (visor.hidden = true)
$('.previa', visor).onclick = () => moverVisor(-1)
$('.siguiente', visor).onclick = () => moverVisor(1)
visor.addEventListener('click', (e) => { if (e.target === visor) visor.hidden = true })
document.addEventListener('click', (e) => {
  const dia = e.target.closest('.dia')
  if (dia) abrirVisor(Number(dia.dataset.d), Number(dia.dataset.n))
  const copiar = e.target.closest('.copiar')
  if (copiar) {
    navigator.clipboard?.writeText(copiar.closest('figure').querySelector('code').textContent)
    copiar.textContent = 'Copiado'
    setTimeout(() => (copiar.textContent = 'Copiar'), 1200)
  }
})

// ---------- modo presentación: una sección por pantalla, según la ruta elegida ----------
const pase = $('#pase')
let hojas = []
let indiceHoja = 0
function construirHojas() {
  hojas = []
  if (document.body.dataset.vista === 'taller') {
    for (const ejercicio of $$('.ejercicio').filter(visible)) hojas.push({ modulo: 'Taller', nodo: ejercicio.cloneNode(true), id: ejercicio.id })
    return
  }
  for (const modulo of $$('.modulo').filter(visible)) {
    const portada = h('div', {})
    for (const nodo of modulo.children) { if (nodo.matches('.seccion')) break; if (!nodo.matches('details')) portada.append(nodo.cloneNode(true)) }
    hojas.push({ modulo: tituloDe(modulo), nodo: portada, id: modulo.id })
    for (const seccion of $$(':scope > .seccion', modulo).filter(visible)) {
      const copia = seccion.cloneNode(true)
      $$('[data-nivel]', copia).filter((x) => !visible(x)).forEach((x) => x.remove())
      hojas.push({ modulo: tituloDe(modulo), nodo: copia, id: seccion.id })
    }
  }
}
function mostrarHoja(i) {
  indiceHoja = Math.max(0, Math.min(hojas.length - 1, i))
  const hoja = hojas[indiceHoja]
  $('#pase-hoja').replaceChildren(hoja.nodo)
  $('#pase-hoja').scrollTop = 0
  $('#pase-donde').textContent = hoja.modulo
  $('#pase-cuenta').textContent = `${indiceHoja + 1} / ${hojas.length}`
  $('#pase-progreso i').style.width = `${((indiceHoja + 1) / hojas.length) * 100}%`
}
function presentar() {
  construirHojas()
  // empieza en la sección que está a la vista
  const y = window.scrollY + 120
  const cerca = hojas.findLastIndex((x) => (document.getElementById(x.id)?.offsetTop ?? Infinity) <= y)
  pase.hidden = false
  mostrarHoja(['guia', 'taller'].includes(document.body.dataset.vista) ? Math.max(0, cerca) : 0)
}
$('#presentar').onclick = presentar
$('#pase-salir').onclick = () => (pase.hidden = true)
$('#pase-previa').onclick = () => mostrarHoja(indiceHoja - 1)
$('#pase-siguiente').onclick = () => mostrarHoja(indiceHoja + 1)
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea,select')) return
  if (!visor.hidden) {
    if (e.key === 'Escape') visor.hidden = true
    if (e.key === 'ArrowLeft') moverVisor(-1)
    if (e.key === 'ArrowRight') moverVisor(1)
    return
  }
  if (!pase.hidden) {
    if (e.key === 'Escape') pase.hidden = true
    if (['ArrowLeft', 'PageUp'].includes(e.key)) mostrarHoja(indiceHoja - 1)
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); mostrarHoja(indiceHoja + 1) }
    return
  }
  if (e.key === 'p' || e.key === 'P') presentar()
  if (['1', '2', '3'].includes(e.key)) ponerRuta(Number(e.key))
})

ponerRuta(memoria.leer('kt540.ruta', 1))

// enlaces directos: index.html#vista-lab  ·  #vista-lab:carriles  ·  #vista-diapos
const destino = location.hash.match(/^#vista-(\w+)(?::(\w+))?$/)
if (destino) setTimeout(() => {
  if (destino[2]) memoria.guardar('kt540.lab.ultima', destino[2])
  ponerVista(destino[1])
}, 0)
