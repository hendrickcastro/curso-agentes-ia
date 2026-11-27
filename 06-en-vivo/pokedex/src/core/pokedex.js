// Capa de servicio: lo único que las pantallas pueden usar para pedir datos.
import { POKEMON } from '../data/pokemon.js'

export const MINIMO_LETRAS = 2

/** Todos los Pokémon, en el orden de la Pokédex nacional. */
export function listarPokemon() {
  return [...POKEMON].sort((a, b) => a.numero - b.numero)
}

/** Busca por cualquier parte del nombre, sin distinguir mayúsculas. */
export function buscarPokemon(consulta) {
  const texto = String(consulta ?? '').trim().toLowerCase()
  if (texto.length < MINIMO_LETRAS) return { haBuscado: false, resultados: [] }
  return { haBuscado: true, resultados: listarPokemon().filter((p) => p.nombre.toLowerCase().includes(texto)) }
}
