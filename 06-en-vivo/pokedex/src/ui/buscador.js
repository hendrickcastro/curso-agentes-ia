// Pantalla del buscador. Pinta; los datos se los pide a la capa de servicio.
import { buscarPokemon, listarPokemon } from '../core/pokedex.js'
import { crearPantalla, etiquetaTipo } from './pantalla.js'

export function renderBuscador(raiz) {
  const { cuerpo } = crearPantalla(raiz, { titulo: 'Buscador', ayuda: 'Escribe al menos dos letras del nombre.' })
  const campo = document.createElement('input')
  campo.type = 'search'
  campo.className = 'campo'
  campo.placeholder = 'Pikachu, char, chu…'
  campo.setAttribute('aria-label', 'Nombre del Pokémon')
  const lista = document.createElement('ul')
  lista.className = 'tarjetas'
  cuerpo.append(campo, lista)

  const pintar = () => {
    const { haBuscado, resultados } = buscarPokemon(campo.value)
    const visibles = haBuscado ? resultados : listarPokemon()
    lista.textContent = ''
    if (haBuscado && visibles.length === 0) {
      lista.innerHTML = '<li class="vacio">Ningún Pokémon se llama así</li>'
      return
    }
    for (const pokemon of visibles) {
      const tarjeta = document.createElement('li')
      tarjeta.className = 'tarjeta'
      const numero = document.createElement('small')
      numero.textContent = `Nº ${String(pokemon.numero).padStart(3, '0')}`
      const nombre = document.createElement('strong')
      nombre.textContent = pokemon.nombre
      tarjeta.append(numero, nombre, ...pokemon.tipos.map(etiquetaTipo))
      lista.append(tarjeta)
    }
  }
  campo.addEventListener('input', pintar)
  pintar()
}
