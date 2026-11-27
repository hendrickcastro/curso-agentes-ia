
// =====================================================================
// EN VIVO: el mismo prompt, dos veces, con Claude Code de verdad.
// Necesita el servidor local (node servidor.mjs): desde file:// solo explica cómo arrancarlo.
// =====================================================================
const CLAVE_VIVO = 'kt540.vivo'
let corridas = memoria.leer(CLAVE_VIVO, {})
const guardarCorridas = () => memoria.guardar(CLAVE_VIVO, corridas)
const corto = (texto, n = 1500) => { const t = String(texto ?? ''); return t.length > n ? `${t.slice(0, n)}\n… (${t.length - n} caracteres más)` : t }
const textoDe = (contenido) => (Array.isArray(contenido) ? contenido.map((c) => c.text ?? '').join('\n') : String(contenido ?? ''))

function resumirHerramienta(nombre, entrada, dir) {
  const ruta = (r) => String(r ?? '').replaceAll(`/private${dir}/`, '').replaceAll(`${dir}/`, '').replaceAll(dir, '.')
  if (nombre === 'Bash') return ruta(entrada.command)
  if (['Read', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(nombre)) return ruta(entrada.file_path)
  if (nombre === 'Skill') return entrada.skill ?? entrada.command ?? ''
  if (nombre === 'Grep' || nombre === 'Glob') return `${entrada.pattern ?? ''}${entrada.path ? ` en ${ruta(entrada.path)}` : ''}`
  if (nombre === 'Task' || nombre === 'Agent') return `${entrada.subagent_type ?? 'subagente'}: ${entrada.description ?? ''}`
  return ruta(JSON.stringify(entrada)).slice(0, 160)
}

// Convierte un evento del flujo de Claude Code en entradas compactas del registro.
function entradasDe(evento, corrida) {
  const dir = corrida.dir
  if (evento.type === 'system' && evento.subtype === 'init') {
    const propias = (evento.skills ?? []).filter((s) => ['revisar-pr', 'carta-pokemon', 'implementar'].includes(s))
    return [{ t: 'inicio', texto: `Arranca ${evento.model}. Skills del proyecto a la vista: ${propias.join(', ') || 'ninguna'}.` }]
  }
  if (evento.type === 'system' && evento.subtype === 'hook_response') {
    const paro = evento.exit_code !== 0
    if (paro) corrida.metricas.paradas++
    return [{ t: paro ? 'paro' : 'hook', texto: paro ? `El hook ${evento.hook_event} lo detiene (código ${evento.exit_code})` : `Hook ${evento.hook_event}: pasa`, detalle: paro ? corto(evento.stderr || evento.output || evento.stdout, 1200) : '' }]
  }
  if (evento.type === 'system' && evento.subtype === 'permission_denied') { corrida.metricas.denegados = (corrida.metricas.denegados ?? 0) + 1; return [{ t: 'denegado', texto: 'Comando no permitido en esta demostración. No es un fallo: el agente lo ve y sigue por otro camino.' }] }
  if (evento.type === 'assistant') {
    return (evento.message?.content ?? []).flatMap((c) => {
      if (c.type === 'text' && c.text.trim()) return [{ t: 'texto', texto: c.text.trim() }]
      if (c.type !== 'tool_use') return []
      const resumen = resumirHerramienta(c.name, c.input ?? {}, dir)
      corrida.metricas.herramientas++
      if (c.name === 'Read') corrida.metricas.leidos.push(resumen)
      if (['Edit', 'Write', 'MultiEdit'].includes(c.name)) corrida.metricas.escritos.push(resumen)
      if (c.name === 'Skill') corrida.metricas.skills.push(resumen)
      return [{ t: 'herr', nombre: c.name, texto: resumen }]
    })
  }
  if (evento.type === 'user') {
    return (Array.isArray(evento.message?.content) ? evento.message.content : []).filter((c) => c.type === 'tool_result' && !(c.is_error && /^Permission for this tool use was denied/.test(textoDe(c.content)))).map((c) => ({ t: c.is_error ? 'fallo' : 'res', texto: corto(textoDe(c.content).replaceAll(`/private${dir}/`, '').replaceAll(`${dir}/`, ''), 1200) }))
  }
  if (evento.type === 'result') {
    Object.assign(corrida.metricas, { turnos: evento.num_turns, segundos: Math.round((evento.duration_ms ?? 0) / 1000), coste: evento.total_cost_usd, salida: evento.usage?.output_tokens, denegados: (evento.permission_denials ?? []).length })
    corrida.respuesta = String(evento.result ?? '')
    return evento.is_error ? [{ t: 'error', texto: corto(evento.result ?? evento.subtype) }] : []
  }
  return []
}

const ICONO = { inicio: '●', texto: '💬', herr: '🔧', res: '↩', fallo: '↩', denegado: '🚫', error: '✘', hook: '✓', paro: '⛔', aviso: '⚠' }
function nodoEntrada(e) {
  if (['res', 'fallo', 'error'].includes(e.t)) return h('details', { class: `ev ${e.t}` }, h('summary', {}, `${ICONO[e.t]} ${{ res: 'Resultado', fallo: 'El comando devolvió un error (el agente lo lee y sigue)', error: 'Error' }[e.t]} · ${e.texto.split('\n')[0].slice(0, 90)}`), h('pre', {}, e.texto))
  if (e.t === 'herr') return h('div', { class: 'ev herr' }, `${ICONO.herr} `, h('b', {}, e.nombre), ' ', h('code', {}, e.texto))
  if (e.t === 'paro') return h('div', { class: 'ev paro' }, `${ICONO.paro} ${e.texto}`, e.detalle ? h('pre', {}, e.detalle) : null)
  return h('div', { class: `ev ${e.t}` }, `${ICONO[e.t] ?? ''} ${e.texto}`)
}

function pintarColumna(caja, ejemplo, variante) {
  const clave = `${ejemplo.id}:${variante.id}`
  const corrida = corridas[clave]
  const boton = h('button', { class: 'primario', 'data-ejecutar': clave }, corrida ? '↻ Repetir' : '▶ Ejecutar')
  const reset = corrida ? h('button', { title: 'Borra este resultado y deja la columna como al principio' }, '⟲ Restablecer') : null
  const registro = h('div', { class: 'registro' })
  const resultado = h('div', { class: 'resultado-vivo' })
  caja.replaceChildren(...[
    h('div', { class: 'col-cabecera' }, h('h3', {}, variante.nombre), h('span', { class: 'col-botones' }, reset, boton)),
    h('p', { class: 'rodea' }, variante.rodea),
    variante.prompt !== ejemplo.prompt ? h('p', { class: 'ayuda' }, 'Prompt de esta columna: ', h('code', {}, variante.prompt)) : null,
    registro, resultado].filter(Boolean))
  if (!corrida) { registro.append(h('p', { class: 'ayuda' }, 'Todavía sin ejecutar.')); return { boton, reset, registro, resultado } }
  corrida.registro.forEach((e) => registro.append(nodoEntrada(e)))
  pintarResultado(resultado, corrida)
  return { boton, reset, registro, resultado }
}

function pintarResultado(caja, corrida) {
  const m = corrida.metricas
  caja.replaceChildren()
  if (corrida.respuesta) caja.append(h('h4', {}, 'Respuesta final'), h('pre', { class: 'respuesta' }, corrida.respuesta))
  for (const f of corrida.ficheros ?? []) caja.append(h('h4', {}, `Lo que dejó en ${f.ruta}`), f.contenido == null ? h('p', { class: 'ayuda' }, 'No creó ese fichero.') : h('pre', { class: 'fichero' }, f.contenido))
  if (corrida.comprobaciones?.length) {
    caja.append(h('h4', {}, 'Comprobaciones (las lanza el servidor, no el agente)'))
    for (const c of corrida.comprobaciones) caja.append(h('details', { class: 'comprobacion' }, h('summary', {}, h('span', { class: `pastilla ${c.bien ? 'verde' : 'roja'}` }, c.bien ? '✔' : '✘'), ` ${c.nombre}`), c.cmd ? h('p', { class: 'ayuda' }, h('code', {}, c.cmd)) : null, h('pre', {}, c.detalle)))
  }
  if (corrida.cambios?.ficheros) caja.append(h('details', {}, h('summary', {}, `Ficheros que cambió (${corrida.cambios.ficheros.split('\n').length})`), h('pre', {}, corrida.cambios.ficheros), h('pre', { class: 'diff' }, corrida.cambios.diff)))
  if (corrida.fin) caja.append(h('p', { class: 'ayuda' }, `${m.turnos ?? '–'} turnos · ${m.herramientas} herramientas · ${m.segundos ?? '–'} s · ${m.salida ?? '–'} tokens de salida · ${m.coste != null ? `${m.coste.toFixed(2)} $ a precio de API` : ''} · ${corrida.modelo}`))
}

function filasComparacion(ejemplo) {
  const [a, b] = ejemplo.variantes.map((v) => corridas[`${ejemplo.id}:${v.id}`])
  if (!a?.fin || !b?.fin) return null
  const fila = (nombre, f) => [nombre, f(a), f(b)]
  const filas = [
    fila('Ficheros que escribió', (c) => String(new Set(c.metricas.escritos).size)),
    fila('Skills que cargó', (c) => c.metricas.skills.join(', ') || '—'),
    fila('Veces que lo paró un hook', (c) => String(c.metricas.paradas)),
    fila('Herramientas usadas', (c) => String(c.metricas.herramientas)),
    fila('Turnos', (c) => String(c.metricas.turnos ?? '—')),
    fila('Duración', (c) => `${c.metricas.segundos ?? '—'} s`),
  ]
  ejemplo.comprobaciones.forEach((nombre) => filas.push(fila(nombre, (c) => { const r = c.comprobaciones.find((x) => x.nombre === nombre); return r ? (r.bien ? '✔ sí' : '✘ no') : '—' })))
  return filas
}
function pintarComparacion(caja, ejemplo) {
  const filas = filasComparacion(ejemplo)
  if (!filas) { caja.replaceChildren(h('p', { class: 'ayuda' }, 'Ejecuta las dos columnas para ver la comparación.')); return }
  caja.innerHTML = `<div class="tabla comparacion"><table><thead><tr><th></th>${ejemplo.variantes.map((v) => `<th>${v.nombre}</th>`).join('')}</tr></thead><tbody>${filas.map(([n, x, y]) => `<tr><th>${n}</th><td class="${x !== y ? 'distinto' : ''}">${x}</td><td class="${x !== y ? 'distinto' : ''}">${y}</td></tr>`).join('')}</tbody></table></div>`
}

let enMarcha = 0
const enEspera = []
const turno = () => new Promise((listo) => { if (enMarcha < 2) { enMarcha++; listo() } else enEspera.push(listo) })
const soltar = () => { const siguiente = enEspera.shift(); if (siguiente) siguiente(); else enMarcha-- }

async function lanzar(ejemplo, variante, refs, alTerminar) {
  const clave = `${ejemplo.id}:${variante.id}`
  const corrida = { fecha: Date.now(), registro: [], comprobaciones: [], ficheros: [], metricas: { herramientas: 0, paradas: 0, leidos: [], escritos: [], skills: [] }, dir: '', respuesta: '' }
  const anotar = (e) => { corrida.registro.push(e); refs.registro.append(nodoEntrada(e)); refs.registro.scrollTop = refs.registro.scrollHeight }
  const control = new AbortController()
  refs.abortar = () => control.abort()
  if (refs.reset) refs.reset.hidden = true
  refs.boton.textContent = '■ Detener (en cola)'
  refs.registro.replaceChildren(h('p', { class: 'ayuda' }, 'Esperando a que termine otra ejecución (van de dos en dos)…'))
  refs.resultado.replaceChildren()
  await turno()
  refs.boton.textContent = '■ Detener'
  refs.registro.replaceChildren()
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
        if (dato.tipo === 'preparado') { corrida.dir = dato.dir; corrida.modelo = dato.modelo; anotar({ t: 'inicio', texto: `Copia limpia del proyecto${dato.quitar.length ? `, sin: ${dato.quitar.join(', ')}` : ', con todo'}.` }) }
        if (dato.tipo === 'evento') entradasDe(dato.evento, corrida).forEach(anotar)
        if (dato.tipo === 'aviso') anotar({ t: 'aviso', texto: dato.texto })
        if (dato.tipo === 'cambios') corrida.cambios = { ficheros: dato.ficheros, diff: dato.diff }
        if (dato.tipo === 'fichero') corrida.ficheros.push({ ruta: dato.ruta, contenido: dato.contenido })
        if (dato.tipo === 'comprobacion') corrida.comprobaciones.push(dato)
        if (dato.tipo === 'fin') corrida.fin = true
      }
    }
  } catch (error) {
    anotar({ t: 'aviso', texto: `No se pudo ejecutar: ${error.message}` })
  }
  soltar()
  refs.abortar = null
  // Una ejecución detenida no se guarda: la columna vuelve a como estaba antes de lanzarla.
  if (!control.signal.aborted) {
    delete corrida.dir
    if (corrida.cambios) corrida.cambios.diff = corto(corrida.cambios.diff, 12000)
    corridas[clave] = corrida
    guardarCorridas()
  }
  alTerminar()
}

function pintarEjemplo(ejemplo, i) {
  const columnas = ejemplo.variantes.map(() => h('div', { class: 'col-vivo' }))
  const comparacion = h('div', {})
  const refs = []
  const comparar = () => pintarComparacion(comparacion, ejemplo)
  const restablecer = (k) => { delete corridas[`${ejemplo.id}:${ejemplo.variantes[k].id}`]; guardarCorridas(); montar(k); comparar() }
  // Pinta la columna desde lo guardado y engancha sus botones. Se llama al cargar, al terminar y al restablecer.
  function montar(k) {
    refs[k] = pintarColumna(columnas[k], ejemplo, ejemplo.variantes[k])
    refs[k].boton.onclick = () => correr(k)
    if (refs[k].reset) refs[k].reset.onclick = () => restablecer(k)
  }
  // El mismo botón lanza y, mientras corre, detiene.
  const correr = (k) => { if (refs[k].abortar) refs[k].abortar(); else lanzar(ejemplo, ejemplo.variantes[k], refs[k], () => { montar(k); comparar() }) }
  ejemplo.variantes.forEach((_, k) => montar(k))
  comparar()
  return h('article', { class: 'ejemplo-vivo', 'data-nivel': 1, 'data-agente': '', id: `vivo-${ejemplo.id}` },
    h('header', {}, h('p', { class: 'num' }, 'Ejemplo ', h('span', { class: 'n-vivo' }, String(i + 1)), ` · ${ejemplo.tema}`), h('h2', {}, ejemplo.titulo), h('button', { class: 'quitar', 'data-clave': `vivo-${ejemplo.id}` })),
    h('p', { class: 'lema' }, ejemplo.idea),
    h('figure', { class: 'codigo' }, h('figcaption', {}, 'el mismo prompt en las dos columnas', h('button', { class: 'copiar' }, 'Copiar')), h('pre', {}, h('code', {}, ejemplo.prompt))),
    h('p', {}, h('strong', {}, 'En qué fijarte: '), ejemplo.mira),
    h('div', { class: 'fila-botones' }, h('button', { class: 'primario', onclick: () => refs.forEach((r, k) => { if (!r.abortar) correr(k) }) }, '▶▶ Ejecutar las dos a la vez'), h('button', { title: 'Borra los dos resultados de este ejemplo', onclick: () => refs.forEach((r, k) => { if (!r.abortar) restablecer(k) }) }, '⟲ Restablecer el ejemplo'), ejemplo.guia ? h('button', { class: 'ir-guia', 'data-guia': ejemplo.guia }, 'La explicación, en la guía') : null),
    h('div', { class: 'dos-columnas' }, columnas),
    h('h3', {}, 'Comparación'), comparacion)
}

window.iniciarVivo = async function () {
  const vista = $('#vista-vivo')
  if (vista.childElementCount) return
  vista.append(h('h1', {}, 'En vivo'), h('p', { class: 'lema' }, 'El mismo prompt, lanzado dos veces con Claude Code de verdad: una sin la pieza y otra con ella. Ves cada fichero que lee, cada comando y cada parada, y al final el resultado y las comprobaciones de las dos, lado a lado.'))
  let estado = null
  try { if (location.protocol.startsWith('http')) estado = await (await fetch('/api/estado')).json() } catch { /* sin servidor */ }
  if (!estado) {
    vista.append(h('div', { class: 'panel' }, h('h3', {}, 'Para ejecutar los ejemplos hay que arrancar el servidor local'),
      h('p', {}, 'Esta página está abierta como fichero y desde ahí no puede lanzar nada. En la carpeta del repositorio:'),
      h('figure', { class: 'codigo' }, h('figcaption', {}, 'bash', h('button', { class: 'copiar' }, 'Copiar')), h('pre', {}, h('code', {}, 'node servidor.mjs'))),
      h('p', {}, 'y abre ', h('a', { href: 'http://localhost:5400' }, 'http://localhost:5400'), '. Necesitas Node 20 o superior, git y Claude Code instalado con tu sesión iniciada (', h('code', {}, 'claude'), ' en la terminal). Los ejemplos usan tu suscripción y el modelo Opus 5.5.')))
    return
  }
  vista.append(h('div', { class: `panel ${estado.claude ? '' : 'sin-claude'}` },
    estado.claude ? h('p', {}, h('span', { class: 'pastilla verde' }, 'Listo'), ` Claude Code ${estado.claude} · modelo `, h('code', {}, estado.modelo), '. Cada ejecución consume de tu suscripción y tarda entre medio minuto y unos minutos.')
      : h('p', {}, h('span', { class: 'pastilla roja' }, 'Falta Claude Code'), ' El servidor no encuentra el comando ', h('code', {}, 'claude'), '. Instálalo, inicia sesión y vuelve a arrancar el servidor.'),
    h('p', { class: 'ayuda' }, 'Cada columna trabaja sobre una copia temporal y limpia del proyecto demo, así que no toca tu repositorio. El agente puede leer, editar y lanzar los comandos del proyecto; lo demás se deniega y se ve en el registro. Los resultados se guardan en este navegador.'),
    h('div', { class: 'fila-botones' },
      h('button', { onclick: () => h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(corridas, null, 2)], { type: 'application/json' })), download: 'en-vivo-540.json' }).click() }, 'Exportar resultados'),
      h('button', { onclick: () => { if (confirm('¿Borrar todos los resultados guardados de En vivo?')) { corridas = {}; guardarCorridas(); vista.replaceChildren(); window.iniciarVivo() } } }, 'Borrar resultados'))))
  estado.ejemplos.forEach((ejemplo, i) => vista.append(pintarEjemplo(ejemplo, i)))
  aplicarEdicion()
}
