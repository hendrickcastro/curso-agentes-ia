// Punto de entrada: un enrutador mínimo por hash. Cada pantalla se registra aquí.
import { renderBuscador } from './ui/buscador.js'

const PANTALLAS = {
  '/': renderBuscador,
}

function pintar() {
  const ruta = location.hash.replace(/^#/, '').split('?')[0] || '/'
  const raiz = document.querySelector('#app')
  raiz.textContent = ''
  ;(PANTALLAS[ruta] ?? PANTALLAS['/'])(raiz)
  for (const enlace of document.querySelectorAll('.menu a')) {
    enlace.classList.toggle('activo', enlace.getAttribute('href') === `#${ruta}`)
  }
}

window.addEventListener('hashchange', pintar)
pintar()
