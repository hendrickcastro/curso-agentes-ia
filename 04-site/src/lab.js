// ======================= LABORATORIO =======================
// Cada herramienta declara sus campos y una función calcular(estado) → { html, resumen }.
// El marco común se encarga de pintar el formulario, guardar intentos, compararlos,
// exportarlos e importarlos. Todo se guarda en este navegador (localStorage).
const SI_NO = ['—', 'Sí', 'No', 'A medias']
const GARANTIAS = ['Formateo', 'Linting', 'Cobertura con umbral', 'Duplicación estructural', 'Arquitectura y dependencias', 'Mutation testing',
  'Métricas de calidad (CRAP, complejidad)', 'Calidad del código de test', 'Comportamiento funcional (aceptación)', 'Mutación de la especificación', 'Proceso spec-first']
const pastilla = (texto, clase) => `<span class="pastilla ${clase}">${texto}</span>`
const escapar = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')

const HERRAMIENTAS = [
  {
    id: 'cuaderno', nombre: 'Cuaderno de prácticas', sub: 'El mismo prompt, rama a rama',
    ayuda: 'Apunta cada intento del mismo prompt (base, contexto, RPI, guardarraíles, workflow…) y compáralos: es «el cotejo» de las prácticas. Guarda uno por rama, con tu nombre.',
    campos: [
      { id: 'practica', label: 'Práctica', type: 'select', opts: ['1 · Vibecoding (rama base)', '2 · Contexto', '3 · RPI', '5 · Guardarraíles', '6 · Workflow /implement', '7 · Especificación a pelo', '7 · Especificación con /grill-me', 'Otra'] },
      { id: 'herramienta', label: 'Herramienta', type: 'select', opts: ['Claude Code', 'Codex', 'Cursor', 'Copilot', 'Otra'] },
      { id: 'modelo', label: 'Modelo y nivel de esfuerzo', type: 'text' },
      { id: 'minutos', label: 'Minutos hasta el resultado', type: 'number', def: 10 },
      { id: 'leidos', label: 'Ficheros que leyó antes de escribir', type: 'number', def: 0 },
      { id: 'tocados', label: 'Ficheros creados o modificados', type: 'number', def: 0 },
      { id: 'frontera', label: '¿Respetó la frontera (las vistas no llaman a la API)?', type: 'select', opts: SI_NO },
      { id: 'tests', label: '¿Escribió tests?', type: 'select', opts: SI_NO },
      { id: 'hooks', label: 'Veces que lo paró un hook', type: 'number', def: 0 },
      { id: 'correcto', label: '¿El resultado es correcto para negocio?', type: 'select', opts: SI_NO },
      { id: 'leiste', label: '¿Cuánto código tuviste que leer para aceptarlo?', type: 'select', opts: ['Todo', 'Una parte', 'Solo lo que señaló la red', 'Nada'] },
      { id: 'decisiones', label: 'Decisiones que tomó por su cuenta sin preguntar', type: 'textarea', ancho: true },
      { id: 'notas', label: 'Notas, plan corregido o resultado pegado', type: 'textarea', ancho: true },
    ],
    calcular(e) {
      const veredicto = { Todo: ['Has pedido, no delegado', 'roja'], 'Una parte': ['A medio camino', 'ambar'], 'Solo lo que señaló la red': ['Has delegado, con garantías', 'verde'], Nada: ['Has delegado… ¿con qué garantías?', 'ambar'] }[e.leiste]
      return {
        html: `${pastilla(veredicto[0], veredicto[1])} <p>«Si tienes que leerlo entero, no has delegado. Has pedido.» Compara este intento con el de otra rama para ver qué cambió al rodear al agente de contexto, plan, garantías o guardarraíles.</p>`,
        resumen: { Práctica: e.practica, Herramienta: e.herramienta, Modelo: e.modelo, Minutos: e.minutos, 'Ficheros leídos antes': e.leidos, 'Ficheros tocados': e.tocados, 'Respetó la frontera': e.frontera, 'Escribió tests': e.tests, 'Paradas por hook': e.hooks, 'Correcto para negocio': e.correcto, 'Código leído': e.leiste, Veredicto: veredicto[0], 'Decisiones por su cuenta': e.decisiones, Notas: e.notas },
      }
    },
  },
  {
    id: 'contexto', nombre: 'Ventana de contexto', sub: 'Simulador por turnos',
    ayuda: 'Modelo ilustrativo: las cifras son supuestos editables, no medidas. Sirve para ver qué partidas crecen, cuándo se cruza el 60 % y qué compra cada decisión.',
    campos: [
      { id: 'ventana', label: 'Ventana nominal', type: 'select', opts: ['200000', '1000000'] },
      { id: 'umbral', label: 'Umbral para compactar (tokens; vacío = 60 %)', type: 'number', def: '' },
      { id: 'turnos', label: 'Turno de la sesión', type: 'range', min: 1, max: 80, def: 30 },
      { id: 'mcp', label: 'Servidores MCP cargados siempre', type: 'range', min: 0, max: 8, def: 4 },
      { id: 'tokMcp', label: 'Tokens por MCP (supuesto)', type: 'number', def: 9000 },
      { id: 'rules', label: 'Tamaño del fichero de rules (tokens)', type: 'number', def: 2000 },
      { id: 'salida', label: 'Salida de herramientas por turno (tokens)', type: 'number', def: 2500 },
      { id: 'respuesta', label: 'Respuesta del agente por turno (tokens)', type: 'number', def: 600 },
      { id: 'sub', label: 'Delega las búsquedas en subagentes (vuelve ~30 % de la salida)', type: 'check' },
    ],
    calcular(e) {
      const ventana = Number(e.ventana)
      const partes = [
        ['System prompt y herramientas', 17100, '#7a8794'], ['Definiciones de MCP', e.mcp * e.tokMcp, '#b3261e'], ['Rules', Number(e.rules), '#8a5a00'],
        ['Lo que escribiste tú', 150 * e.turnos, '#0f6e66'], ['Salidas de herramientas', e.salida * e.turnos * (e.sub ? 0.3 : 1), '#6a4c93'], ['Respuestas del agente', e.respuesta * e.turnos, '#3b7dd8'],
      ]
      const total = partes.reduce((s, p) => s + p[1], 0)
      const limite = Number(e.umbral) > 0 ? Number(e.umbral) : ventana * 0.6
      const fijo = partes[0][1] + partes[1][1] + partes[2][1]
      const porTurno = (total - fijo) / e.turnos
      const cruce = fijo >= limite ? 0 : Math.ceil((limite - fijo) / porTurno)
      const pct = (total / ventana) * 100
      const mayor = [...partes].sort((a, b) => b[1] - a[1])[0]
      const tuyo = (partes[3][1] / total) * 100
      const estado = total > ventana ? ['Supera la ventana: error, no degradación', 'roja'] : total >= limite ? ['Pasado el umbral: compacta o abre sesión nueva', 'roja'] : total >= limite * 0.75 ? ['Cerca del umbral', 'ambar'] : ['Con margen', 'verde']
      return {
        html: `${pastilla(estado[0], estado[1])}
          <div class="barra-ctx">${partes.map((p) => `<i style="width:${(p[1] / ventana) * 100}%;background:${p[2]}" title="${p[0]}: ${Math.round(p[1]).toLocaleString('es')}"></i>`).join('')}<span class="umbral" style="left:${(limite / ventana) * 100}%"></span></div>
          <div class="leyenda">${partes.map((p) => `<span><i style="background:${p[2]}"></i>${p[0]} · ${Math.round(p[1] / 1000)}k</span>`).join('')}</div>
          <p><strong>${Math.round(total / 1000)}k de ${ventana / 1000}k (${pct.toFixed(0)} %)</strong> en el turno ${e.turnos}. Lo que escribiste tú es el ${tuyo.toFixed(1)} % de la ventana. La mayor partida: ${mayor[0].toLowerCase()}.
          ${cruce === 0 ? 'Empiezas ya al otro lado del umbral, antes de escribir nada.' : `Cruzas el umbral en el turno <strong>${cruce}</strong>.`}</p>`,
        resumen: { Ventana: `${ventana / 1000}k`, Turno: e.turnos, 'MCP cargados': e.mcp, Subagentes: e.sub ? 'Sí' : 'No', 'Ocupación': `${Math.round(total / 1000)}k (${pct.toFixed(0)} %)`, 'Turno en que cruza el umbral': cruce === 0 ? 'Desde el inicio' : cruce, 'Mayor partida': mayor[0], 'Tu parte de la ventana': `${tuyo.toFixed(1)} %`, Estado: estado[0] },
      }
    },
  },
  {
    id: 'diagnostico', nombre: 'Diagnóstico de contexto', sub: 'Del síntoma al nombre',
    ayuda: '«El agente se está portando raro» no es un diagnóstico. Para cada síntoma, elige qué fallo es y qué harías.',
    campos: [{
      id: 'casos', type: 'matriz',
      filas: ['Insiste en importar usePokemonTypes(), que no existe, aunque ya se lo corregiste', 'Tras dos horas con el mismo bug, repite pasos que ya probasteis', 'Le pides cambiar un texto de la interfaz y lanza una consulta a la base de datos',
        'Reescribe el cálculo de daño como estaba antes de que lo arreglaseis', 'Ignora la restricción que diste al principio de un prompt largo', 'Según avanza la sesión, sus respuestas se vuelven genéricas'],
      columnas: [
        { id: 'fallo', label: '¿Qué es?', type: 'select', opts: ['—', 'Poisoning', 'Distraction', 'Confusion', 'Clash', 'Posición'] },
        { id: 'accion', label: '¿Qué haces?', type: 'select', opts: ['—', 'Rebobinar (o sesión nueva)', 'Compactar', 'Quitar lo que sobra de la ventana', 'Sesión nueva y la corrección en la spec', 'Reponerla al final del prompt'] },
      ],
    }],
    soluciones: [['Poisoning', 'Rebobinar (o sesión nueva)'], ['Distraction', 'Compactar'], ['Confusion', 'Quitar lo que sobra de la ventana'], ['Clash', 'Sesión nueva y la corrección en la spec'], ['Posición', 'Reponerla al final del prompt'], ['Distraction', 'Compactar']],
    calcular(e) {
      const filas = this.campos[0].filas
      let aciertos = 0
      let respondidas = 0
      const lineas = filas.map((texto, i) => {
        const r = e.casos[i]
        const [fallo, accion] = this.soluciones[i]
        if (r.fallo === '—' && r.accion === '—') return ''
        respondidas++
        const bien = r.fallo === fallo && r.accion === accion
        if (bien) aciertos++
        return `<li>${bien ? '✅' : '❌'} ${escapar(texto)}${bien ? '' : ` → <strong>${fallo}</strong>: ${accion.toLowerCase()}`}</li>`
      })
      return { html: `<p><strong>${aciertos} de ${filas.length}</strong> (${respondidas} respondidas)</p><ul>${lineas.join('')}</ul><p>Regla general: si tienes que repetirle algo por segunda vez, el contexto está saturado. Mide antes de insistir.</p>`, resumen: { Aciertos: `${aciertos}/${filas.length}`, ...Object.fromEntries(filas.map((t, i) => [`Caso ${i + 1}`, `${e.casos[i].fallo} · ${e.casos[i].accion}`])) } }
    },
  },
  {
    id: 'red', nombre: 'Autodiagnóstico de la red', sub: 'Las once garantías',
    ayuda: 'De memoria y sin abrir el repositorio: si tienes que ir a mirarlo, ya tienes la respuesta. Guarda uno por repositorio o por equipo y compáralos; repítelo dentro de un mes.',
    campos: [
      { id: 'repo', label: 'Repositorio o equipo', type: 'text' },
      { id: 'cli', label: '¿Toda la red se lanza con un comando desde la terminal?', type: 'select', opts: SI_NO },
      { id: 'filas', type: 'matriz', filas: GARANTIAS, columnas: [
        { id: 'estado', label: 'Estado', type: 'select', opts: ['No existe', 'Solo avisa', 'Detiene'] },
        { id: 'momento', label: '¿Cuándo se ejecuta?', type: 'select', opts: ['—', 'Al guardar', 'Cuando el agente termina (hook)', 'Antes de confirmar (pre-commit)', 'Antes de publicar (pre-push)', 'En la integración (CI)'] },
      ] },
    ],
    calcular(e) {
      const puntos = { 'No existe': 0, 'Solo avisa': 1, Detiene: 2 }
      const nota = GARANTIAS.reduce((s, _, i) => s + puntos[e.filas[i].estado], 0)
      const avisan = GARANTIAS.filter((_, i) => e.filas[i].estado === 'Solo avisa')
      const faltan = GARANTIAS.filter((_, i) => e.filas[i].estado === 'No existe')
      const detienen = GARANTIAS.length - avisan.length - faltan.length
      const clase = nota >= 16 ? 'verde' : nota >= 8 ? 'ambar' : 'roja'
      return {
        html: `${pastilla(`${nota} / 22`, clase)} <p>${detienen} detienen, ${avisan.length} solo avisan, ${faltan.length} no existen.</p>
          ${avisan.length ? `<p><strong>Lo casi gratis:</strong> convertir en garantía lo que ya está instalado. Hoy son informes, no garantías: ${avisan.join(', ').toLowerCase()}.</p>` : ''}
          ${faltan.includes('Mutation testing') ? '<p><strong>El mayor salto de confianza:</strong> mutation testing, la única comprobación que dice si la suite protege algo.</p>' : ''}
          ${e.cli !== 'Sí' ? '<p><strong>Ojo:</strong> una garantía que no se puede invocar desde la línea de comandos no la puede ejecutar el agente.</p>' : ''}
          <p>Zonas cuyas comprobaciones solo avisan no tienen carril verde.</p>`,
        resumen: { Repositorio: e.repo, Nota: `${nota}/22`, Detienen: detienen, 'Solo avisan': avisan.length, 'No existen': faltan.length, 'Un comando por CLI': e.cli, ...Object.fromEntries(GARANTIAS.map((g, i) => [g, `${e.filas[i].estado}${e.filas[i].momento !== '—' ? ` · ${e.filas[i].momento}` : ''}`])) },
      }
    },
  },
  {
    id: 'ratchet', nombre: 'Ratchet', sub: 'Lo viejo pasa, lo nuevo detiene',
    ayuda: 'Cambia el número de violaciones «ahora» de cada fichero y mira qué decide la carraca. Es la misma lógica que 02-ejemplos-codigo/demo/tools/ratchet.mjs.',
    campos: [{ id: 'filas', type: 'matriz', filas: ['src/ui/legacy/viejaVista', 'src/ui/legacy/informes', 'src/ui/buscadorView', 'src/ui/tablaTiposView (nuevo)'], columnas: [
      { id: 'base', label: 'Línea base', type: 'number', def: [2, 5, 0, 0] }, { id: 'ahora', label: 'Ahora', type: 'number', def: [2, 5, 0, 0] } ] }],
    calcular(e) {
      const filas = this.campos[0].filas.map((nombre, i) => ({ nombre, base: Number(e.filas[i].base) || 0, ahora: Number(e.filas[i].ahora) || 0 }))
      const peor = filas.filter((f) => f.ahora > f.base)
      const mejor = filas.filter((f) => f.ahora < f.base)
      const totalBase = filas.reduce((s, f) => s + f.base, 0)
      const nueva = filas.reduce((s, f) => s + Math.min(f.base, f.ahora), 0)
      const veredicto = peor.length ? ['DETIENE', 'roja'] : mejor.length ? ['PASA y la línea baja', 'verde'] : ['PASA', 'verde']
      return {
        html: `${pastilla(veredicto[0], veredicto[1])}
          <ul>${filas.map((f) => `<li><code>${f.nombre}</code>: ${f.base} → ${f.ahora} ${f.ahora > f.base ? '— <strong>violación nueva: todo lo que salta es de hoy</strong>' : f.ahora < f.base ? '— mejor de lo que estaba' : f.base ? '— deuda conocida, pasa' : ''}</li>`).join('')}</ul>
          <p>${peor.length ? 'El trabajo se detiene hasta corregirlo. La línea base no cambia.' : `Línea base: ${totalBase} → <strong>${nueva}</strong>. ${mejor.length ? 'La reescribe la propia comprobación; ya no se puede volver atrás.' : 'Un ratchet que lleva un año sin moverse es la misma deuda con un certificado.'}`}</p>`,
        resumen: { Veredicto: veredicto[0], 'Línea base': totalBase, 'Nueva línea base': peor.length ? totalBase : nueva, 'Ficheros que empeoran': peor.map((f) => f.nombre).join(', ') || '—', 'Ficheros que mejoran': mejor.map((f) => f.nombre).join(', ') || '—' },
      }
    },
  },
  {
    id: 'spec', nombre: 'Descrito o especificado', sub: 'Criterios de aceptación',
    ayuda: 'Escribe los criterios de una tarea, uno por línea, y márcalos con honestidad. Guarda la versión «a pelo» y la de después del interrogatorio (/grill-me) y compáralas.',
    campos: [
      { id: 'tarea', label: 'Tarea', type: 'text', def: 'Añade un buscador de Pokémon' },
      { id: 'criterios', label: 'Criterios, uno por línea', type: 'textarea', ancho: true, repinta: true, def: 'Busca por nombre sin distinguir mayúsculas: «PIKA» encuentra a Pikachu\n«chu» también encuentra a Pikachu\nCon menos de dos letras no busca\nSin resultados, dice «Ningún Pokémon se llama así»\nLa búsqueda es rápida' },
      { id: 'filas', type: 'matriz', filasDe: (e) => String(e.criterios ?? '').split('\n').map((l) => l.trim()).filter(Boolean), columnas: [
        { id: 'dato', label: 'Tiene un dato concreto', type: 'check' }, { id: 'ajeno', label: 'Lo comprueba alguien que no estuvo', type: 'check' }, { id: 'test', label: 'Un test cae si cambia el dato', type: 'check' } ] },
    ],
    calcular(e) {
      const lineas = this.campos[2].filasDe(e)
      const clases = lineas.map((_, i) => { const f = e.filas[i] ?? {}; return f.dato && f.ajeno && f.test ? 'Protegido' : f.dato && f.ajeno ? 'Especificado' : 'Descrito' })
      const n = (c) => clases.filter((x) => x === c).length
      const decorativos = lineas.filter((_, i) => clases[i] === 'Especificado')
      const estado = n('Descrito') ? ['Hay criterios que solo describen', 'roja'] : decorativos.length ? ['Especificado, con criterios decorativos', 'ambar'] : ['Condición de parada completa', 'verde']
      return {
        html: `${pastilla(estado[0], estado[1])} <p><strong>${n('Protegido')}</strong> protegidos · <strong>${n('Especificado')}</strong> especificados sin test que los defienda · <strong>${n('Descrito')}</strong> solo descritos.</p>
          <ul>${lineas.map((l, i) => `<li>${{ Protegido: '🟢', Especificado: '🟡', Descrito: '🔴' }[clases[i]]} ${escapar(l)} — <em>${clases[i].toLowerCase()}</em></li>`).join('')}</ul>
          <p>Si para saber si ha terminado tiene que mirarlo una persona, no has especificado: has descrito. Y un criterio que ningún test defiende es decorativo (lo detecta la mutación de la especificación).</p>`,
        resumen: { Tarea: e.tarea, Criterios: lineas.length, Protegidos: n('Protegido'), 'Especificados sin test': n('Especificado'), 'Solo descritos': n('Descrito'), Estado: estado[0], Texto: lineas.map((l, i) => `${clases[i][0]} · ${l}`).join('\n') },
      }
    },
  },
  {
    id: 'carriles', nombre: 'Embudo de carriles', sub: '¿Qué PR no vas a leer?',
    ayuda: 'Describe un cambio y mira por qué carril entra. Cada etapa solo puede mandarlo a un carril más lento. Cambia los umbrales: el apetito de riesgo es una decisión del equipo.',
    campos: [
      { id: 'titulo', label: 'Cambio', type: 'text', def: 'Añade la tabla de ventajas entre tipos' },
      { id: 'zona', label: 'Toca una zona vetada (pagos, migraciones, la propia red)', type: 'check' },
      { id: 'autor', label: 'Autor sin historial en esta zona (p. ej. agente desatendido)', type: 'check' },
      { id: 'lineas', label: 'Líneas cambiadas', type: 'number', def: 120 },
      { id: 'tests', label: 'Tests existentes modificados o borrados', type: 'number', def: 0 },
      { id: 'umbrales', label: 'Relaja un umbral', type: 'check' },
      { id: 'excepciones', label: 'Añade una excepción (eslint-disable, skip…)', type: 'check' },
      { id: 'spec', label: 'La especificación cambió', type: 'check', def: true },
      { id: 'riesgo', label: 'Nota de riesgo del modelo (0–10)', type: 'range', min: 0, max: 10, def: 2 },
      { id: 'red', label: 'Estado de la red de garantías', type: 'select', opts: ['Todo en verde y deteniendo', 'Alguna solo avisa o no existe', 'Alguna en rojo'] },
      { id: 'maxLineas', label: 'Umbral · máximo de líneas para carril verde', type: 'number', def: 150 },
      { id: 'rMuestreo', label: 'Umbral · riesgo desde el que va a muestreo', type: 'number', def: 4 },
      { id: 'rLectura', label: 'Umbral · riesgo desde el que se lee entero', type: 'number', def: 7 },
    ],
    calcular(e) {
      const orden = ['verde', 'muestreo', 'lectura', 'bloqueado']
      const encoge = [e.tests > 0 && `modifica o borra ${e.tests} test(s) que ya existían`, e.umbrales && 'relaja un umbral', e.excepciones && 'añade una excepción'].filter(Boolean)
      const etapas = [
        ['01 Zonas vetadas (regla)', e.zona ? ['lectura', 'toca una zona vetada'] : null],
        ['02 Quién lo escribió (regla)', e.autor ? ['muestreo', 'autor sin historial'] : null],
        ['03 Señales del diff (regla)', encoge.length ? (e.spec ? ['muestreo', `encoge la red (la especificación cambió): ${encoge.join('; ')}`] : ['lectura', `encoge la red sin que cambie la especificación: ${encoge.join('; ')}`]) : Number(e.lineas) > Number(e.maxLineas) ? ['muestreo', `${e.lineas} líneas, por encima de ${e.maxLineas}`] : null],
        ['04 Nota de riesgo (modelo: cierra, nunca abre)', e.riesgo >= Number(e.rLectura) ? ['lectura', `riesgo ${e.riesgo}/10`] : e.riesgo >= Number(e.rMuestreo) ? ['muestreo', `riesgo ${e.riesgo}/10`] : null],
        ['05 Red de garantías (comprobaciones)', e.red === 'Alguna en rojo' ? ['bloqueado', 'la red está en rojo'] : e.red === 'Alguna solo avisa o no existe' ? ['muestreo', 'si solo avisa, no hay carril verde'] : null],
      ]
      let carril = 'verde'
      const traza = etapas.map(([nombre, v]) => { if (v && orden.indexOf(v[0]) > orden.indexOf(carril)) carril = v[0]; return [nombre, carril, v ? v[1] : 'pasa'] })
      const texto = { verde: ['SE FUSIONA SOLO', 'verde'], muestreo: ['POR MUESTREO', 'ambar'], lectura: ['SE LEE ENTERO', 'roja'], bloqueado: ['BLOQUEADO: vuelve al autor', 'roja'] }[carril]
      return {
        html: `${pastilla(texto[0], texto[1])}<div class="tabla"><table><thead><tr><th>Etapa</th><th>Carril tras la etapa</th><th>Motivo</th></tr></thead><tbody>${traza.map((t) => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${escapar(t[2])}</td></tr>`).join('')}</tbody></table></div>`,
        resumen: { Cambio: e.titulo, Carril: texto[0], ...Object.fromEntries(traza.map((t) => [t[0], `${t[1]} · ${t[2]}`])), 'Umbrales (líneas / muestreo / lectura)': `${e.maxLineas} / ${e.rMuestreo} / ${e.rLectura}` },
      }
    },
  },
  {
    id: 'coste', nombre: 'Coste de especificar', sub: 'La curva y su óptimo',
    ayuda: 'Curva ilustrativa, como la del curso: el coste total es especificar más retrabajo. Mira cómo se mueve el óptimo con más traspasos entre agentes y cuando el agente redacta y tú revisas.',
    campos: [
      { id: 'completitud', label: 'Completitud de tu especificación (%)', type: 'range', min: 0, max: 100, def: 20 },
      { id: 'traspasos', label: 'Traspasos entre agentes', type: 'range', min: 0, max: 6, def: 0 },
      { id: 'redacta', label: 'Quién redacta', type: 'select', opts: ['La redactas tú', 'El agente redacta y tú revisas'] },
    ],
    calcular(e) {
      const kEspec = e.redacta === 'La redactas tú' ? 1 : 0.5
      const kRetrabajo = 1.2 * (1 + 0.6 * e.traspasos)
      const especificar = (c) => kEspec * c
      const retrabajo = (c) => kRetrabajo * (1 - c) ** 2
      const total = (c) => especificar(c) + retrabajo(c)
      const puntos = Array.from({ length: 101 }, (_, i) => i / 100)
      const optimo = puntos.reduce((mejor, c) => (total(c) < total(mejor) ? c : mejor), 0)
      const c = e.completitud / 100
      const maxY = Math.max(...puntos.map(total), 1)
      const x = (v) => 40 + v * 420
      const y = (v) => 170 - (v / maxY) * 150
      const linea = (f, color, guiones) => `<polyline fill="none" stroke="${color}" stroke-width="2" ${guiones ? 'stroke-dasharray="5 4"' : ''} points="${puntos.map((p) => `${x(p)},${y(f(p))}`).join(' ')}"/>`
      const exceso = ((total(c) / total(optimo) - 1) * 100).toFixed(0)
      return {
        html: `<svg viewBox="0 0 480 200" width="100%" style="max-width:640px" role="img" aria-label="Curva de coste de la especificación">
          <line x1="40" y1="170" x2="460" y2="170" stroke="currentColor" opacity=".3"/><line x1="40" y1="20" x2="40" y2="170" stroke="currentColor" opacity=".3"/>
          ${linea(especificar, '#8a5a00', true)}${linea(retrabajo, '#b3261e', true)}${linea(total, '#0f6e66')}
          <line x1="${x(optimo)}" y1="20" x2="${x(optimo)}" y2="170" stroke="#0f6e66" stroke-dasharray="2 3"/><circle cx="${x(c)}" cy="${y(total(c))}" r="5" fill="#0f6e66"/>
          <text x="40" y="188">a pelo</text><text x="418" y="188">exhaustiva</text><text x="${Math.min(x(optimo) + 4, 400)}" y="30">óptimo ${Math.round(optimo * 100)} %</text></svg>
          <div class="leyenda"><span><i style="background:#8a5a00"></i>especificar</span><span><i style="background:#b3261e"></i>retrabajo</span><span><i style="background:#0f6e66"></i>coste total</span></div>
          <p>Tu punto: ${e.completitud} %. El óptimo está en el <strong>${Math.round(optimo * 100)} %</strong>; estás pagando un ${exceso} % más que en el óptimo. ${c < optimo ? 'La especificación mínima solo parece barata hasta que cuentas el retrabajo.' : c > optimo + 0.1 ? 'Has pasado el punto en que preguntar más produce documento, no información.' : 'Estás cerca del óptimo.'}</p>`,
        resumen: { 'Tu completitud': `${e.completitud} %`, Traspasos: e.traspasos, Redacta: e.redacta, 'Óptimo': `${Math.round(optimo * 100)} %`, 'Sobrecoste frente al óptimo': `${exceso} %` },
      }
    },
  },
]

// ---------- marco común ----------
const CLAVE = 'kt540.lab'
let almacen = memoria.leer(CLAVE, {})
const persistir = () => memoria.guardar(CLAVE, almacen)
const quien = () => String(memoria.leer(`${CLAVE}.quien`, '') || '').trim()
const porDefecto = (campo, i) => (Array.isArray(campo.def) ? campo.def[i] : campo.def) ?? (campo.type === 'check' ? false : campo.type === 'select' ? campo.opts[0] : campo.type === 'number' ? 0 : campo.type === 'range' ? campo.min : '')

function estadoInicial(herramienta) {
  const e = {}
  for (const campo of herramienta.campos) {
    if (campo.type === 'matriz') continue
    e[campo.id] = porDefecto(campo)
  }
  for (const campo of herramienta.campos.filter((c) => c.type === 'matriz')) e[campo.id] = {}
  return completar(herramienta, e)
}
function completar(herramienta, e) {
  for (const campo of herramienta.campos.filter((c) => c.type === 'matriz')) {
    const filas = campo.filasDe ? campo.filasDe(e) : campo.filas
    e[campo.id] ??= {}
    filas.forEach((_, i) => { e[campo.id][i] ??= {}; for (const col of campo.columnas) e[campo.id][i][col.id] ??= porDefecto(col, i) })
  }
  return e
}

function control(campo, valor, alCambiar) {
  const emitir = (ev) => alCambiar(campo.type === 'check' ? ev.target.checked : ['number', 'range'].includes(campo.type) && ev.target.value !== '' ? Number(ev.target.value) : ev.target.value, ev.type)
  if (campo.type === 'select') return h('select', { onchange: emitir }, campo.opts.map((o) => h('option', { selected: o === String(valor) }, o)))
  if (campo.type === 'textarea') { const t = h('textarea', { oninput: emitir, onchange: emitir }); t.value = valor; return t }
  if (campo.type === 'check') { const c = h('input', { type: 'checkbox', onchange: emitir }); c.checked = Boolean(valor); return c }
  const entrada = h('input', { type: campo.type, min: campo.min, max: campo.max, oninput: emitir })
  entrada.value = valor
  return entrada
}

function pintarHerramienta(herramienta, caja) {
  let estado = completar(herramienta, memoria.leer(`${CLAVE}.borrador.${herramienta.id}`, null) ?? estadoInicial(herramienta))
  const salida = h('div', { class: 'resultado' })
  const formulario = h('div', {})
  let ultimo = null

  const recalcular = () => {
    estado = completar(herramienta, estado)
    memoria.guardar(`${CLAVE}.borrador.${herramienta.id}`, estado)
    ultimo = herramienta.calcular(estado)
    salida.innerHTML = ultimo.html
  }
  const pintarFormulario = () => {
    formulario.textContent = ''
    const campos = h('div', { class: 'campos' })
    for (const campo of herramienta.campos) {
      if (campo.type === 'matriz') {
        const filas = campo.filasDe ? campo.filasDe(estado) : campo.filas
        campos.append(h('div', { class: 'campo ancho tabla' }, h('table', {},
          h('thead', {}, h('tr', {}, h('th', {}, ''), campo.columnas.map((c) => h('th', {}, c.label)))),
          h('tbody', {}, filas.map((nombre, i) => h('tr', {}, h('td', {}, nombre), campo.columnas.map((col) => h('td', {}, control(col, estado[campo.id][i][col.id], (v) => { estado[campo.id][i][col.id] = v; recalcular() })))))))))
        continue
      }
      const etiqueta = h('span', {}, campo.label)
      const valorRango = campo.type === 'range' ? h('b', {}, ` ${estado[campo.id]}`) : null
      if (valorRango) etiqueta.append(valorRango)
      const c = control(campo, estado[campo.id], (v, tipo) => {
        estado[campo.id] = v
        if (valorRango) valorRango.textContent = ` ${v}`
        recalcular()
        if (campo.repinta && tipo === 'change') pintarFormulario()
      })
      campos.append(campo.type === 'check' ? h('label', { class: 'campo', style: 'flex-direction:row;align-items:center;gap:8px' }, c, campo.label) : h('label', { class: `campo${campo.ancho ? ' ancho' : ''}` }, etiqueta, c))
    }
    formulario.append(campos)
  }

  const nombre = h('input', { type: 'text', placeholder: 'Nombre para guardarlo (p. ej. «rama contexto»)', style: 'max-width:360px' })
  const lista = h('div', { class: 'guardados' })
  const comparacion = h('div', {})
  const guardados = () => (almacen[herramienta.id] ??= [])

  const pintarGuardados = () => {
    lista.textContent = ''
    if (!guardados().length) lista.append(h('p', { class: 'ayuda' }, 'Todavía no hay nada guardado de esta herramienta.'))
    for (const g of guardados()) {
      lista.append(h('label', {}, h('input', { type: 'checkbox', value: g.id }), h('span', {}, g.nombre, ' ', h('small', {}, new Date(g.fecha).toLocaleString('es'))),
        h('button', { onclick: (ev) => { ev.preventDefault(); estado = structuredClone(g.estado); nombre.value = g.nombre; pintarFormulario(); recalcular() } }, 'Cargar'),
        h('button', { onclick: (ev) => { ev.preventDefault(); if (confirm(`¿Borrar «${g.nombre}»?`)) { almacen[herramienta.id] = guardados().filter((x) => x.id !== g.id); persistir(); pintarGuardados(); comparacion.textContent = '' } } }, 'Borrar')))
    }
  }
  const elegidos = () => { const ids = $$('input:checked', lista).map((c) => c.value); return guardados().filter((g) => ids.includes(g.id)) }
  const tablaComparada = (items) => {
    const claves = [...new Set(items.flatMap((g) => Object.keys(g.resumen)))]
    return { claves, filas: claves.map((k) => items.map((g) => String(g.resumen[k] ?? '—'))) }
  }
  const comparar = () => {
    const items = elegidos().length >= 2 ? elegidos() : guardados()
    if (items.length < 2) { comparacion.innerHTML = '<p class="ayuda">Guarda al menos dos intentos para compararlos.</p>'; return null }
    const { claves, filas } = tablaComparada(items)
    comparacion.innerHTML = `<div class="tabla comparacion"><table><thead><tr><th></th>${items.map((g) => `<th>${escapar(g.nombre)}</th>`).join('')}</tr></thead><tbody>${claves
      .map((k, i) => { const distinto = new Set(filas[i]).size > 1; return `<tr><th>${escapar(k)}</th>${filas[i].map((v) => `<td class="${distinto ? 'distinto' : ''}">${escapar(v)}</td>`).join('')}</tr>` }).join('')}</tbody></table></div><p class="ayuda">Resaltado: las filas en las que los intentos difieren.</p>`
    return { items, claves, filas }
  }
  const copiarMarkdown = () => {
    const c = comparar()
    if (!c) return
    const celda = (v) => v.replace(/\n/g, '<br>').replace(/\|/g, '\\|')
    const md = [`| ${herramienta.nombre} | ${c.items.map((g) => celda(g.nombre)).join(' | ')} |`, `|---|${c.items.map(() => '---').join('|')}|`, ...c.claves.map((k, i) => `| ${k} | ${c.filas[i].map(celda).join(' | ')} |`)].join('\n')
    navigator.clipboard?.writeText(md)
  }

  caja.replaceChildren(
    h('div', { class: 'panel' }, h('h2', {}, herramienta.nombre), h('p', { class: 'ayuda' }, herramienta.ayuda), formulario, salida,
      h('div', { class: 'fila-botones' }, nombre,
        h('button', { class: 'primario', onclick: () => { const titulo = nombre.value.trim() || `Intento ${guardados().length + 1}`; guardados().push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, nombre: quien() && !titulo.startsWith(`${quien()} · `) ? `${quien()} · ${titulo}` : titulo, fecha: Date.now(), estado: structuredClone(estado), resumen: ultimo.resumen }); persistir() || alert('Este navegador no deja guardar datos (¿ventana privada?). Usa Exportar.'); pintarGuardados() } }, 'Guardar intento'),
        h('button', { onclick: () => { estado = estadoInicial(herramienta); nombre.value = ''; pintarFormulario(); recalcular() } }, 'Empezar de cero'))),
    h('div', { class: 'panel' }, h('h3', {}, 'Guardados y comparación'), lista,
      h('div', { class: 'fila-botones' }, h('button', { class: 'primario', onclick: comparar }, 'Comparar (marcados, o todos)'), h('button', { onclick: copiarMarkdown }, 'Copiar comparación como Markdown')), comparacion))
  pintarFormulario(); recalcular(); pintarGuardados()
}

window.iniciarLab = function () {
  const vista = $('#vista-lab')
  if (vista.childElementCount) return
  const menu = h('div', { class: 'lab-menu' })
  const caja = h('div', {})
  const abrir = (herramienta) => { $$('button[data-id]', menu).forEach((b) => b.classList.toggle('activo', b.dataset.id === herramienta.id)); memoria.guardar(`${CLAVE}.ultima`, herramienta.id); pintarHerramienta(herramienta, caja) }
  HERRAMIENTAS.forEach((x) => menu.append(h('button', { 'data-id': x.id, onclick: () => abrir(x) }, x.nombre, h('small', {}, x.sub))))
  const importar = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async (ev) => {
    try {
      const datos = JSON.parse(await ev.target.files[0].text())
      for (const [id, items] of Object.entries(datos)) { if (!Array.isArray(items)) continue; const ya = new Set((almacen[id] ??= []).map((g) => g.id)); almacen[id].push(...items.filter((g) => !ya.has(g.id))) }
      persistir(); abrir(HERRAMIENTAS.find((x) => x.id === memoria.leer(`${CLAVE}.ultima`, 'cuaderno')) ?? HERRAMIENTAS[0])
    } catch { alert('El fichero no es una exportación válida del laboratorio.') }
  } })
  menu.append(h('hr', { style: 'width:100%;border:0;border-top:1px solid var(--linea)' }),
    h('button', { onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(almacen, null, 2)], { type: 'application/json' })), download: `laboratorio-540${quien() ? '-' + quien().toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, '-') : ''}.json` }); a.click() } }, 'Exportar todo', h('small', {}, 'JSON para compartir')),
    h('button', { onclick: () => importar.click() }, 'Importar', h('small', {}, 'Suma los intentos de otra persona')), importar)
  const campoQuien = h('input', { type: 'text', value: quien(), placeholder: 'Tu nombre', style: 'max-width:240px', oninput: (ev) => memoria.guardar(`${CLAVE}.quien`, ev.target.value) })
  vista.append(h('h1', {}, 'Laboratorio'), h('p', {}, 'Haz los ejemplos, guarda cada intento y compáralos. Los datos se quedan en este navegador. En una sesión en línea: escribe tu nombre, guarda tus intentos, pulsa Exportar y envía el fichero por el chat; quien facilita pulsa Importar con el de cada persona y compara los de todos con la pantalla compartida.'), h('label', { class: 'campo', style: 'margin-bottom:16px' }, 'Tu nombre (se antepone a cada intento que guardes)', campoQuien), h('div', { class: 'lab' }, menu, caja))
  abrir(HERRAMIENTAS.find((x) => x.id === memoria.leer(`${CLAVE}.ultima`, 'cuaderno')) ?? HERRAMIENTAS[0])
}
