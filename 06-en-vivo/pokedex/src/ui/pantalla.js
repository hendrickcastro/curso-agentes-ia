// El marco común de todas las pantallas: título, texto de ayuda y cuerpo.
export function crearPantalla(raiz, { titulo, ayuda }) {
  const seccion = document.createElement('section')
  seccion.className = 'pantalla'
  seccion.innerHTML = '<header class="pantalla-cabecera"><h1></h1><p class="pantalla-ayuda"></p></header><div class="pantalla-cuerpo"></div>'
  seccion.querySelector('h1').textContent = titulo
  seccion.querySelector('.pantalla-ayuda').textContent = ayuda
  raiz.append(seccion)
  return { seccion, cuerpo: seccion.querySelector('.pantalla-cuerpo') }
}

export function etiquetaTipo(tipo) {
  const etiqueta = document.createElement('span')
  etiqueta.className = 'tipo'
  etiqueta.style.background = `var(--tipo-${tipo})`
  etiqueta.textContent = tipo
  return etiqueta
}
