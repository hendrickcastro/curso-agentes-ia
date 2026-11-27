
// =====================================================================
// EN VIVO: el mismo encargo, dos veces, con Claude Code de verdad.
// Cada ejecución es una versión guardada en el servidor: se ve la web que dejó,
// todo lo que hizo y las comprobaciones, y se puede volver a cargar y comparar.
// Necesita el servidor local (node servidor.mjs): desde file:// solo explica cómo arrancarlo.
// =====================================================================
let VIVO = null // lo que devuelve /api/estado
const cargadas = new Map() // id de versión → ejecución reconstruida
const elegida = {} // «ejemplo:variante» → id de la versión que se está viendo
const corto = (texto, n = 1500) => { const t = String(texto ?? ''); return t.length > n ? `${t.slice(0, n)}\n… (${t.length - n} caracteres más)` : t }
const textoDe = (contenido) => (Array.isArray(contenido) ? contenido.map((c) => c.text ?? '').join('\n') : String(contenido ?? ''))
const versionesDe = (ejemplo, variante) => VIVO.ejecuciones.filter((e) => e.ejemplo === ejemplo && e.variante === variante && e.terminado)
// La web de una versión, abierta ya en la pantalla nueva si se sabe cuál es
const urlWeb = (id) => { const ruta = VIVO.ejecuciones.find((e) => e.id === id)?.ruta; return `http://${location.hostname}:${VIVO.puertoWebs}/${id}/index.html${ruta ? `#${ruta}` : ''}` }
const hora = (fecha) => new Date(fecha).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const aciertos = (meta) => `${meta.comprobaciones.filter((c) => c.bien).length}/${meta.comprobaciones.length}`
const nombreVersion = (meta) => { const ej = VIVO.ejemplos.find((e) => e.id === meta.ejemplo); return `${ej.tema} · ${ej.variantes.find((v) => v.id === meta.variante).nombre} · v${meta.n}` }

function resumirHerramienta(nombre, entrada, dir) {
  const ruta = (r) => String(r ?? '').replaceAll(`/private${dir}/`, '').replaceAll(`${dir}/`, '').replaceAll(dir, '.')
  if (nombre === 'Bash') return ruta(entrada.command)
  if (['Read', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(nombre)) return ruta(entrada.file_path)
  if (nombre === 'Skill') return entrada.skill ?? entrada.command ?? ''
  if (nombre === 'Grep' || nombre === 'Glob') return `${entrada.pattern ?? ''}${entrada.path ? ` en ${ruta(entrada.path)}` : ''}`
  if (nombre === 'Task' || nombre === 'Agent') return `${entrada.subagent_type ?? 'subagente'}: ${entrada.description ?? ''}`
  return ruta(JSON.stringify(entrada)).slice(0, 160)
}

const nuevaEjecucion = () => ({ registro: [], comprobaciones: [], metricas: { herramientas: 0, paradas: 0, escritos: [], skills: [] }, dir: '', respuesta: '' })

// Aplica un dato del servidor (en directo o leído de una versión guardada) y devuelve las entradas de registro que genera.
function aplicar(dato, ej) {
  if (dato.tipo === 'preparado') { Object.assign(ej, { id: dato.id, n: dato.n, dir: dato.dir, modelo: dato.modelo }); return [{ t: 'inicio', texto: `Copia limpia del proyecto${dato.quitar.length ? `, sin: ${dato.quitar.join(', ')}` : ', con todo'}.` }] }
  if (dato.tipo === 'aviso') return [{ t: 'aviso', texto: dato.texto }]
  if (dato.tipo === 'cambios') { ej.cambios = { ficheros: dato.ficheros, diff: dato.diff }; return [] }
  if (dato.tipo === 'comprobacion') { ej.comprobaciones.push(dato); return [] }
  if (dato.tipo === 'fin') { ej.fin = true; ej.meta = dato.meta; return [] }
  if (dato.tipo !== 'evento') return []
  const evento = dato.evento
  const dir = ej.dir
  if (evento.type === 'system' && evento.subtype === 'init') {
    const propias = (evento.skills ?? []).filter((s) => ['pantalla-nueva', 'implementar'].includes(s))
    return [{ t: 'inicio', texto: `Arranca ${evento.model}. Skills del proyecto a la vista: ${propias.join(', ') || 'ninguna'}.` }]
  }
  if (evento.type === 'system' && evento.subtype === 'hook_response') {
    const paro = evento.exit_code !== 0
    if (paro) ej.metricas.paradas++
    return [{ t: paro ? 'paro' : 'hook', texto: paro ? `El hook ${evento.hook_event} lo detiene (código ${evento.exit_code})` : `Hook ${evento.hook_event}: pasa`, detalle: paro ? corto(evento.stderr || evento.output || evento.stdout, 1200) : '' }]
  }
  if (evento.type === 'system' && evento.subtype === 'permission_denied') return [{ t: 'denegado', texto: 'El aislamiento bloqueó una acción que salía de la copia de trabajo o usaba la red. No es un fallo: el agente lo ve y sigue.' }]
  if (evento.type === 'assistant') {
    return (evento.message?.content ?? []).flatMap((c) => {
      if (c.type === 'text' && c.text.trim()) return [{ t: 'texto', texto: c.text.trim() }]
      if (c.type !== 'tool_use') return []
      const resumen = resumirHerramienta(c.name, c.input ?? {}, dir)
      ej.metricas.herramientas++
      if (['Edit', 'Write', 'MultiEdit'].includes(c.name)) ej.metricas.escritos.push(resumen)
      if (c.name === 'Skill') ej.metricas.skills.push(resumen)
      return [{ t: 'herr', nombre: c.name, texto: resumen }]
    })
  }
  if (evento.type === 'user') {
    return (Array.isArray(evento.message?.content) ? evento.message.content : [])
      .filter((c) => c.type === 'tool_result' && !(c.is_error && /^Permission for this tool use was denied/.test(textoDe(c.content))))
      .map((c) => { const texto = textoDe(c.content).replaceAll(`/private${dir}/`, '').replaceAll(`${dir}/`, ''); const codigo = c.is_error ? (/^Exit code (\d+)/.exec(texto)?.[1] ?? '≠0') : null; return { t: c.is_error ? 'fallo' : 'res', codigo, texto: corto(texto.replace(/^Exit code \d+\n?/, ''), 1200) } })
  }
  if (evento.type === 'result') {
    Object.assign(ej.metricas, { turnos: evento.num_turns, segundos: Math.round((evento.duration_ms ?? 0) / 1000), coste: evento.total_cost_usd, salida: evento.usage?.output_tokens })
    ej.respuesta = String(evento.result ?? '')
    return evento.is_error ? [{ t: 'error', texto: corto(evento.result ?? evento.subtype) }] : []
  }
  return []
}

async function cargarVersion(id) {
  if (cargadas.has(id)) return cargadas.get(id)
  const ej = nuevaEjecucion()
  const texto = await (await fetch(`/api/ejecuciones/${id}/eventos`)).text()
  for (const linea of texto.split('\n')) if (linea.trim()) ej.registro.push(...aplicar(JSON.parse(linea), ej))
  cargadas.set(id, ej)
  return ej
}

const ICONO = { inicio: '●', texto: '💬', herr: '🔧', res: '↩', fallo: '↩', denegado: '🚫', error: '✘', hook: '✓', paro: '⛔', aviso: '⚠' }
function nodoEntrada(e) {
  if (['res', 'fallo', 'error'].includes(e.t)) {
    const lineas = e.texto.split('\n').filter((l) => l.trim())
    const muestra = (lineas.find((l) => l.trim().length > 3) ?? lineas[0] ?? '(sin salida)').trim().slice(0, 80)
    const etiqueta = { res: 'Resultado', fallo: `Resultado (el comando salió con código ${e.codigo ?? '≠0'})`, error: 'Error' }[e.t]
    return h('details', { class: `ev ${e.t}` }, h('summary', {}, `${ICONO[e.t]} ${etiqueta} · ${muestra}${lineas.length > 1 ? ` … (${lineas.length} líneas)` : ''}`), h('pre', {}, e.texto || '(sin salida)'))
  }
  if (e.t === 'herr') return h('div', { class: 'ev herr' }, `${ICONO.herr} `, h('b', {}, e.nombre), ' ', h('code', {}, e.texto))
  if (e.t === 'paro') return h('div', { class: 'ev paro' }, `${ICONO.paro} ${e.texto}`, e.detalle ? h('pre', {}, e.detalle) : null)
  return h('div', { class: `ev ${e.t}` }, `${ICONO[e.t] ?? ''} ${e.texto}`)
}

const marcoWeb = (id) => h('div', { class: 'web-vista' },
  h('div', { class: 'web-barra' }, h('span', {}, 'La web que dejó el agente (puedes usarla aquí mismo)'), h('a', { href: urlWeb(id), target: '_blank', rel: 'noopener' }, 'Abrir en otra pestaña ↗')),
  h('div', { class: 'web-marco' }, h('iframe', { src: urlWeb(id), loading: 'lazy', title: `Web de la versión ${id}` })))

// esBase: la columna a la que le falta la pieza. Ahí un «No» es lo que el ejemplo quiere enseñar, no un fallo.
function nodosResultado(ej, esBase) {
  const m = ej.metricas
  const nodos = []
  if (ej.comprobaciones.length) {
    nodos.push(h('h4', {}, '¿Lo consiguió? Lo comprueba el servidor, no el agente'))
    for (const c of ej.comprobaciones) {
      const nota = c.bien ? '' : esBase ? ' — lo esperable sin esta pieza' : ' — no era lo esperado: el modelo no es determinista, lanza otra versión'
      nodos.push(h('details', { class: 'comprobacion' }, h('summary', {}, h('span', { class: `pastilla ${c.bien ? 'verde' : esBase ? 'ambar' : 'roja'}` }, c.bien ? 'Sí' : 'No'), ` ${c.nombre}`, h('small', {}, nota)), h('pre', {}, c.detalle)))
    }
  }
  const pasos = h('div', { class: 'registro' }, ej.registro.map(nodoEntrada))
  nodos.push(h('details', { class: 'pasos' }, h('summary', {}, `Todo lo que hizo: ${ej.registro.length} pasos · ${m.turnos ?? '–'} turnos · ${m.segundos ?? '–'} s${m.paradas ? ` · ${m.paradas} parada(s) de hook` : ''}`), pasos,
    ej.respuesta ? h('h4', {}, 'Su respuesta final') : null, ej.respuesta ? h('pre', { class: 'respuesta' }, ej.respuesta) : null))
  if (ej.cambios?.ficheros) nodos.push(h('details', { class: 'pasos' }, h('summary', {}, `Ficheros que cambió (${ej.cambios.ficheros.split('\n').length})`), h('pre', {}, ej.cambios.ficheros), h('pre', { class: 'diff' }, corto(ej.cambios.diff, 30000))))
  nodos.push(h('p', { class: 'ayuda' }, `${m.herramientas} herramientas · ${m.salida ?? '–'} tokens de salida${m.coste != null ? ` · ${m.coste.toFixed(2)} $ a precio de API` : ''} · ${ej.modelo ?? ''}`))
  return nodos
}

// ---------- comparación de dos ejecuciones ----------
function tablaComparada(a, b, nombres, conVeredicto) {
  const fila = (nombre, f) => [nombre, f(a), f(b)]
  const filas = [...new Set([...a.comprobaciones, ...b.comprobaciones].map((c) => c.nombre))].map((nombre) => fila(nombre, (e) => { const r = e.comprobaciones.find((x) => x.nombre === nombre); return r ? (r.bien ? 'Sí' : 'No') : '—' }))
  filas.push(
    fila('Skills que cargó', (e) => e.metricas.skills.join(', ') || '—'),
    fila('Veces que lo paró un hook', (e) => String(e.metricas.paradas)),
    fila('Ficheros que cambió', (e) => String(e.cambios?.ficheros ? e.cambios.ficheros.split('\n').length : 0)),
    fila('Herramientas usadas', (e) => String(e.metricas.herramientas)),
    fila('Turnos', (e) => String(e.metricas.turnos ?? '—')),
    fila('Duración', (e) => `${e.metricas.segundos ?? '—'} s`),
    fila('Coste a precio de API', (e) => (e.metricas.coste != null ? `${e.metricas.coste.toFixed(2)} $` : '—')))
  let veredicto = ''
  if (conVeredicto) {
    const gana = b.comprobaciones.filter((c) => c.bien && !a.comprobaciones.find((x) => x.nombre === c.nombre)?.bien).length
    const falla = b.comprobaciones.filter((c) => !c.bien).length
    const [clase, texto] = gana > 0 && falla === 0 ? ['verde', `Se ve la diferencia: «${nombres[1]}» consigue ${gana} cosa${gana === 1 ? '' : 's'} que «${nombres[0]}» no. Los «No» de la primera columna son el resultado esperado, no un error.`]
      : gana > 0 ? ['ambar', `Hay diferencia a favor de «${nombres[1]}» (${gana}), pero también se le escapó algo (${falla}). El modelo no es determinista: lanza otra versión de esa columna.`]
      : ['ambar', 'Esta vez las dos columnas han salido igual en las comprobaciones. Pasa: el modelo no es determinista y a veces deduce solo lo que falta. Compara las dos webs y los pasos, o lanza otra versión.']
    veredicto = `<p class="veredicto ${clase}">${texto}</p>`
  }
  const celda = (x, y, v) => `<td class="${x !== y ? 'distinto' : ''}">${v}</td>`
  return `${veredicto}<div class="tabla comparacion"><table><thead><tr><th></th>${nombres.map((n) => `<th>${n}</th>`).join('')}</tr></thead><tbody>${filas.map(([n, x, y]) => `<tr><th>${n}</th>${celda(x, y, x)}${celda(x, y, y)}</tr>`).join('')}</tbody></table></div>`
}

// ---------- cola: como mucho dos ejecuciones a la vez ----------
let enMarcha = 0
const enEspera = []
const turno = () => new Promise((listo) => { if (enMarcha < 2) { enMarcha++; listo() } else enEspera.push(listo) })
const soltar = () => { const siguiente = enEspera.shift(); if (siguiente) siguiente(); else enMarcha-- }

function pintarEjemplo(ejemplo, i) {
  const columnas = ejemplo.variantes.map(() => h('div', { class: 'col-vivo' }))
  const comparacion = h('div', {})
  const abortar = [null, null]
  const clave = (k) => `${ejemplo.id}:${ejemplo.variantes[k].id}`
  const idVista = (k) => { const vs = versionesDe(ejemplo.id, ejemplo.variantes[k].id); return vs.some((v) => v.id === elegida[clave(k)]) ? elegida[clave(k)] : vs.at(-1)?.id }

  async function comparar() {
    const ids = [idVista(0), idVista(1)]
    if (!ids[0] || !ids[1]) { comparacion.replaceChildren(h('p', { class: 'ayuda' }, 'Ejecuta las dos columnas para ver la comparación.')); return }
    const [a, b] = await Promise.all(ids.map(cargarVersion))
    comparacion.innerHTML = tablaComparada(a, b, ejemplo.variantes.map((v, k) => `${v.nombre} · v${[a, b][k].n}`), true)
  }

  // Pinta una columna con la versión elegida (por defecto, la última).
  async function montar(k) {
    const variante = ejemplo.variantes[k]
    const versiones = versionesDe(ejemplo.id, variante.id)
    const id = idVista(k)
    const ejecutar = h('button', { class: 'primario', onclick: () => correr(k) }, versiones.length ? '▶ Nueva versión' : '▶ Ejecutar')
    const cabecera = h('div', { class: 'col-cabecera' }, h('h3', {}, variante.nombre), h('span', { class: 'col-botones' }, ejecutar))
    const cuerpo = h('div', { class: 'col-cuerpo' })
    columnas[k].replaceChildren(cabecera, h('p', { class: 'rodea' }, variante.rodea), variante.prompt !== VIVO.encargo ? h('p', { class: 'ayuda' }, 'En esta columna el encargo se lanza así: ', h('code', {}, variante.prompt)) : '', cuerpo)
    if (!id) { cuerpo.append(h('p', { class: 'sin-ejecutar' }, 'Todavía sin ejecutar.')); return }
    const selector = h('select', { class: 'versiones', title: 'Versiones guardadas de esta columna', onchange: (ev) => { elegida[clave(k)] = ev.target.value; montar(k); comparar() } },
      versiones.map((v) => h('option', { value: v.id, selected: v.id === id }, `v${v.n} · ${hora(v.fecha)} · ${aciertos(v)} conseguido`)))
    const borrar = h('button', { title: 'Borra esta versión del disco', onclick: async () => {
      if (!confirm(`¿Borrar la versión v${versiones.find((v) => v.id === id).n} de «${variante.nombre}»?`)) return
      VIVO.ejecuciones = (await (await fetch(`/api/ejecuciones/${id}`, { method: 'DELETE' })).json()).ejecuciones ?? VIVO.ejecuciones
      cargadas.delete(id); delete elegida[clave(k)]
      montar(k); comparar(); pintarComparador()
    } }, '⟲ Borrar versión')
    cabecera.querySelector('.col-botones').prepend(selector, borrar)
    const ej = await cargarVersion(id)
    cuerpo.replaceChildren(marcoWeb(id), h('div', { class: 'resultado-vivo' }, nodosResultado(ej, k === 0)))
  }

  // El mismo botón lanza y, mientras corre, detiene.
  async function correr(k) {
    if (abortar[k]) { abortar[k](); return }
    const variante = ejemplo.variantes[k]
    const control = new AbortController()
    abortar[k] = () => control.abort()
    const ej = nuevaEjecucion()
    const boton = h('button', { class: 'primario', onclick: () => correr(k) }, '■ Detener (en cola)')
    const registro = h('div', { class: 'registro' }, h('p', { class: 'ayuda' }, 'Esperando a que termine otra ejecución (van de dos en dos)…'))
    const estado = h('p', { class: 'estado-vivo' })
    columnas[k].replaceChildren(h('div', { class: 'col-cabecera' }, h('h3', {}, variante.nombre), h('span', { class: 'col-botones' }, boton)), h('p', { class: 'rodea' }, variante.rodea), estado, registro)
    const anotar = (e) => { ej.registro.push(e); registro.append(nodoEntrada(e)); registro.scrollTop = registro.scrollHeight }
    await turno()
    boton.textContent = '■ Detener'
    registro.replaceChildren()
    const inicio = Date.now()
    let fase = 'arrancando Claude Code'
    const latido = () => (estado.textContent = `⏳ En marcha · ${Math.round((Date.now() - inicio) / 1000)} s · ${fase}. Construir la tabla suele llevar entre 1 y 4 minutos.`)
    latido()
    const reloj = setInterval(latido, 1000)
    let meta = null
    try {
      if (control.signal.aborted) throw new Error('detenida')
      const respuesta = await fetch(`/api/ejecutar?ejemplo=${ejemplo.id}&variante=${variante.id}`, { method: 'POST', signal: control.signal })
      if (!respuesta.ok) throw new Error(await respuesta.text())
      const lector = respuesta.body.getReader()
      const decodificador = new TextDecoder()
      let resto = ''
      for (;;) {
        const { done, value } = await lector.read()
        if (done) break
        const partes = (resto + decodificador.decode(value, { stream: true })).split('\n\n')
        resto = partes.pop()
        for (const parte of partes) {
          if (!parte.startsWith('data: ')) continue
          const dato = JSON.parse(parte.slice(6))
          const ev = dato.evento
          if (ev?.type === 'system' && ev.subtype === 'thinking_tokens') fase = 'el modelo está pensando'
          if (ev?.type === 'assistant') { const uso = (ev.message?.content ?? []).find((c) => c.type === 'tool_use'); fase = uso ? `usando ${uso.name}` : 'escribiendo' }
          if (ev?.type === 'user') fase = 'leyendo el resultado y decidiendo el siguiente paso'
          if (ev?.type === 'result') fase = 'terminado; lanzando las comprobaciones'
          aplicar(dato, ej).forEach(anotar)
          if (dato.tipo === 'fin') meta = dato.meta
        }
      }
    } catch (error) {
      if (!control.signal.aborted) alert(`No se pudo ejecutar «${variante.nombre}»: ${error.message}`)
    }
    clearInterval(reloj)
    soltar()
    abortar[k] = null
    if (meta && !control.signal.aborted) { // terminó: queda como versión nueva y pasa a ser la que se ve
      VIVO.ejecuciones.push(meta)
      cargadas.set(meta.id, ej)
      elegida[clave(k)] = meta.id
    }
    await montar(k)
    comparar()
    pintarComparador()
  }

  ejemplo.variantes.forEach((_, k) => montar(k))
  comparar()
  return h('article', { class: 'ejemplo-vivo', 'data-nivel': 1, 'data-agente': '', id: `vivo-${ejemplo.id}` },
    h('header', {}, h('p', { class: 'num' }, 'Ejemplo ', h('span', { class: 'n-vivo' }, String(i + 1)), ` · ${ejemplo.tema}`), h('h2', {}, ejemplo.titulo), h('button', { class: 'quitar', 'data-clave': `vivo-${ejemplo.id}` })),
    h('p', { class: 'lema' }, ejemplo.idea),
    h('p', {}, h('strong', {}, 'En qué fijarte: '), ejemplo.mira),
    h('div', { class: 'fila-botones' }, h('button', { class: 'primario', onclick: () => ejemplo.variantes.forEach((_, k) => { if (!abortar[k]) correr(k) }) }, '▶▶ Ejecutar las dos a la vez'), ejemplo.guia ? h('button', { class: 'ir-guia', 'data-guia': ejemplo.guia }, 'La explicación, en la guía') : null),
    h('div', { class: 'dos-columnas' }, columnas),
    h('h3', {}, 'Comparación de las dos versiones que estás viendo'), comparacion)
}

// ---------- comparador libre: dos versiones cualesquiera, lado a lado ----------
function pintarComparador() {
  const caja = $('#comparador-vivo')
  if (!caja) return
  const todas = VIVO.ejecuciones.filter((e) => e.terminado)
  if (todas.length < 2) { caja.replaceChildren(h('h2', {}, 'Comparador de versiones'), h('p', { class: 'ayuda' }, 'Cuando haya al menos dos versiones guardadas podrás poner aquí dos cualesquiera, de cualquier ejemplo, lado a lado.')); return }
  const previas = $$('select', caja).map((s) => s.value)
  const selector = (porDefecto) => h('select', { class: 'versiones' }, todas.map((v) => h('option', { value: v.id, selected: v.id === porDefecto }, `${nombreVersion(v)} · ${hora(v.fecha)} · ${aciertos(v)}`)))
  const existe = (id) => todas.some((v) => v.id === id)
  const ultima = (ejemplo, variante) => todas.filter((v) => v.ejemplo === ejemplo && v.variante === variante).at(-1)?.id
  const selectores = [selector(existe(previas[0]) ? previas[0] : ultima('harness', 'sin') ?? todas.at(-2).id), selector(existe(previas[1]) ? previas[1] : ultima('harness', 'con') ?? todas.at(-1).id)]
  const webs = h('div', { class: 'dos-columnas' })
  const tabla = h('div', {})
  const pintar = async () => {
    const ids = selectores.map((s) => s.value)
    const [a, b] = await Promise.all(ids.map(cargarVersion))
    webs.replaceChildren(...ids.map((id) => h('div', { class: 'col-vivo' }, marcoWeb(id))))
    tabla.innerHTML = tablaComparada(a, b, ids.map((id) => nombreVersion(todas.find((v) => v.id === id))), false)
  }
  selectores.forEach((s) => (s.onchange = pintar))
  caja.replaceChildren(h('h2', {}, 'Comparador de versiones'), h('p', { class: 'ayuda' }, 'Dos versiones cualesquiera, de cualquier ejemplo, lado a lado: por ejemplo «Solo el modelo» frente a «Con el harness».'), h('div', { class: 'dos-columnas selectores' }, selectores), webs, tabla)
  pintar()
}

// ---------- entorno: pruebas del equipo y chat con el agente que lo arregla ----------
async function leerFlujo(respuesta, cadaDato) {
  const lector = respuesta.body.getReader()
  const decodificador = new TextDecoder()
  let resto = ''
  for (;;) {
    const { done, value } = await lector.read()
    if (done) break
    const partes = (resto + decodificador.decode(value, { stream: true })).split('\n\n')
    resto = partes.pop()
    for (const parte of partes) if (parte.startsWith('data: ')) cadaDato(JSON.parse(parte.slice(6)))
  }
}

// **negrita** y `código` de la respuesta del agente, sin interpretar nada más.
const conMarcas = (texto) => texto.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/).map((t) => (t.startsWith('**') && t.length > 4 ? h('b', {}, t.slice(2, -2)) : t.startsWith('`') && t.length > 2 ? h('code', {}, t.slice(1, -1)) : t))

function pintarEntorno(panel, estado) {
  const historial = []
  const lista = h('ul', { class: 'pruebas-entorno' })
  const resumen = h('summary', {})
  const campos = h('div', { class: 'campos-entorno' })
  const charla = h('div', { class: 'charla' })
  const texto = h('textarea', { rows: 3, placeholder: 'Por ejemplo: «Ahora estamos en Windows. Claude Code está en C:\\Users\\ana\\.local\\bin y Git en D:\\Herramientas\\Git. Arregla el entorno.»' })
  const enviar = h('button', { class: 'primario' }, 'Enviar al agente')
  const NOMBRES = { claude: 'Ejecutable de Claude Code (o su carpeta)', gitBash: 'bash.exe de Git para Windows', path: 'Carpetas extra para el PATH (separadas por ;)', modelo: 'Modelo' }

  const pedir = async (url, opciones) => { const r = await fetch(url, opciones); const dato = await r.json(); if (!r.ok) throw new Error(dato.error ?? 'No se pudo'); return dato }
  const revisar = async (boton, completo) => {
    const antes = boton.textContent
    boton.disabled = true; boton.textContent = completo ? 'Preguntando al modelo…' : 'Revisando…'
    try { poner(await pedir(`/api/entorno${completo ? '?completo' : ''}`)) } catch (e) { alert(e.message) }
    boton.disabled = false; boton.textContent = antes
  }

  function poner(nuevo) {
    estado = nuevo
    const fallan = estado.pruebas.filter((p) => !p.ok)
    resumen.replaceChildren(h('span', { class: `pastilla ${fallan.length ? 'roja' : 'verde'}` }, fallan.length ? `Entorno: ${fallan.length} por arreglar` : 'Entorno listo'),
      ` ${fallan.length ? fallan.map((p) => p.nombre).join(' · ') : `${estado.pruebas.length} pruebas pasan en este equipo`}`)
    lista.replaceChildren(...estado.pruebas.map((p) => h('li', { class: p.ok ? 'bien' : 'mal' }, h('b', {}, `${p.ok ? '✔' : '✘'} ${p.nombre}`), h('span', {}, p.detalle), p.arreglo ? h('em', {}, p.arreglo) : null)))
    const claves = ['claude', ...(estado.sistema === 'win32' ? ['gitBash'] : []), 'path', 'modelo']
    const entradas = claves.map((clave) => [clave, h('input', { type: 'text', value: clave === 'path' ? (estado.ajustes.path ?? []).join(';') : (estado.ajustes[clave] ?? ''), placeholder: clave === 'modelo' ? estado.modelo : 'se busca solo' })])
    const guardar = h('button', { onclick: async () => {
      const cuerpo = Object.fromEntries(entradas.map(([clave, campo]) => [clave, clave === 'path' ? campo.value.split(';').map((x) => x.trim()).filter(Boolean) : campo.value.trim()]))
      try { poner(await pedir('/api/entorno/ajustes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })); refrescarClaude() } catch (e) { alert(e.message) }
    } }, 'Guardar y revisar')
    campos.replaceChildren(h('p', { class: 'ayuda' }, 'Rutas de este equipo. Vacío significa que se busca solo. Se guardan en ', h('code', {}, 'entorno.json'), ', que no se sube al repositorio.'),
      ...entradas.map(([clave, campo]) => h('label', {}, h('span', {}, NOMBRES[clave]), campo)), guardar)
    panel.classList.toggle('sin-claude', fallan.length > 0)
    if (fallan.length) detalles.open = true
    const sinAgente = !estado.pruebas.find((p) => p.id === 'claude')?.ok
    enviar.disabled = sinAgente
    texto.disabled = sinAgente
    aviso.hidden = !sinAgente
  }
  // Lo que sabe la cabecera de la página sobre Claude Code cambia al arreglar el entorno.
  async function refrescarClaude() { try { const nuevo = await (await fetch('/api/estado')).json(); VIVO.claude = nuevo.claude; VIVO.modelo = nuevo.modelo; $('#estado-claude')?.replaceChildren(...lineaClaude()) } catch { /* se queda como estaba */ } }

  async function hablar() {
    const mensaje = texto.value.trim()
    if (!mensaje) return
    texto.value = ''
    enviar.disabled = true; enviar.textContent = 'El agente está trabajando…'
    const pasos = h('div', { class: 'registro' })
    const ej = nuevaEjecucion()
    charla.append(h('div', { class: 'dicho yo' }, mensaje), h('details', { class: 'pasos', open: '' }, h('summary', {}, 'Lo que hace el agente'), pasos))
    try {
      const respuesta = await fetch('/api/entorno/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensaje, historial }) })
      if (!respuesta.ok) throw new Error((await respuesta.json()).error ?? 'No se pudo')
      await leerFlujo(respuesta, (dato) => {
        if (dato.tipo === 'entorno') { poner(dato.estado); return }
        if (dato.tipo === 'preparado') { ej.dir = dato.dir; return }
        aplicar(dato, ej).filter((e) => e.t !== 'inicio').forEach((e) => { pasos.append(nodoEntrada(e)); pasos.scrollTop = pasos.scrollHeight })
      })
      pasos.parentElement.open = false
      charla.append(h('div', { class: 'dicho agente' }, conMarcas(ej.respuesta || '(el agente no contestó nada)')))
      historial.push({ quien: 'yo', texto: mensaje }, { quien: 'agente', texto: ej.respuesta })
      refrescarClaude()
    } catch (e) { charla.append(h('div', { class: 'dicho agente ev aviso' }, e.message)) }
    enviar.textContent = 'Enviar al agente'
    poner(estado)
  }
  enviar.onclick = hablar
  texto.onkeydown = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) hablar() }

  const aviso = h('p', { class: 'ayuda', hidden: '' }, 'El chat usa Claude Code: mientras no aparezca, indica su ruta en el campo de arriba y pulsa «Guardar y revisar».')
  const detalles = h('details', { class: 'entorno' }, resumen, lista,
    h('p', {}, h('button', { onclick: (e) => revisar(e.currentTarget, false) }, 'Revisar de nuevo'), ' ', h('button', { onclick: (e) => revisar(e.currentTarget, true) }, 'Prueba completa: preguntar al modelo')),
    campos,
    h('h4', {}, 'Dile al agente que lo arregle'),
    h('p', { class: 'ayuda' }, 'Cuéntale en qué equipo estás y dónde están las cosas. Busca lo que falte, lo comprueba y lo deja escrito en entorno.json; las pruebas se repiten al terminar. No instala nada: si hace falta, te da el comando.'),
    charla, texto, h('p', {}, enviar), aviso)
  panel.replaceChildren(detalles)
  poner(estado)
}

const lineaClaude = () => (VIVO.claude
  ? [h('span', { class: 'pastilla verde' }, 'Listo'), ` Claude Code ${VIVO.claude} · modelo `, h('code', {}, VIVO.modelo), '. Cada ejecución consume de tu suscripción y tarda entre 1 y 4 minutos.']
  : [h('span', { class: 'pastilla roja' }, 'Falta Claude Code'), ' El servidor no lo encuentra en este equipo. Indícale dónde está en el panel «Entorno», justo encima.'])

window.iniciarVivo = async function () {
  const vista = $('#vista-vivo')
  if (vista.childElementCount) return
  vista.append(h('h1', {}, 'En vivo'), h('p', { class: 'lema' }, 'El mismo encargo, lanzado dos veces con Claude Code de verdad: una sin la pieza y otra con ella. Ves la web que deja cada una, todo lo que hizo para llegar ahí y si cumple lo que el equipo espera.'))
  vista.append(h('p', { class: 'ayuda' }, 'Estos seis ejemplos son la ruta resumida entera: en esa ruta, la Guía y el Taller enseñan solo lo que explica cada uno. Las rutas media y completa añaden el resto del curso en esas dos pestañas; aquí los ejemplos son los mismos.'))
  try { if (location.protocol.startsWith('http')) VIVO = await (await fetch('/api/estado')).json() } catch { /* sin servidor */ }
  if (!VIVO) {
    vista.append(h('div', { class: 'panel' }, h('h3', {}, 'Para ejecutar los ejemplos hay que arrancar el servidor local'),
      h('p', {}, 'Esta página está abierta como fichero y desde ahí no puede lanzar nada. En la carpeta del repositorio:'),
      h('figure', { class: 'codigo' }, h('figcaption', {}, 'bash', h('button', { class: 'copiar' }, 'Copiar')), h('pre', {}, h('code', {}, 'bash run.bash'))),
      h('p', {}, 'y abre ', h('a', { href: 'http://localhost:5400' }, 'http://localhost:5400'), '. Necesitas Node 20 o superior, git y Claude Code instalado con tu sesión iniciada (', h('code', {}, 'claude'), ' en la terminal). Los ejemplos usan tu suscripción y el modelo Opus 5.5.')))
    return
  }
  const entorno = h('section', { class: 'panel', id: 'entorno-vivo' })
  vista.append(entorno)
  try { pintarEntorno(entorno, await (await fetch('/api/entorno')).json()) } catch { entorno.remove() }
  vista.append(h('div', { class: `panel ${VIVO.claude ? '' : 'sin-claude'}` },
    h('p', { class: 'num' }, 'El encargo, el mismo en todos los ejemplos'),
    h('figure', { class: 'codigo encargo' }, h('figcaption', {}, 'prompt', h('button', { class: 'copiar' }, 'Copiar')), h('pre', {}, h('code', {}, VIVO.encargo))),
    h('p', { id: 'estado-claude' }, lineaClaude()),
    h('p', { class: 'ayuda' }, 'El proyecto de partida es una Pokédex de Kanto con buscador (06-en-vivo/pokedex). Cada ejecución trabaja sobre una copia propia y queda guardada como una versión (v1, v2…) que puedes volver a cargar, abrir y comparar. El agente trabaja aislado: puede lanzar cualquier comando, pero solo escribe dentro de su copia y no tiene red.'),
    h('p', {}, h('a', { href: `http://${location.hostname}:${VIVO.puertoWebs}/base/index.html`, target: '_blank', rel: 'noopener' }, 'Ver el proyecto de partida ↗'))))
  VIVO.ejemplos.forEach((ejemplo, i) => vista.append(pintarEjemplo(ejemplo, i)))
  vista.append(h('section', { class: 'panel', id: 'comparador-vivo' }))
  pintarComparador()
  aplicarEdicion()
}
