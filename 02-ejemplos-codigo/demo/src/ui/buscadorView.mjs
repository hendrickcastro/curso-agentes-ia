// Vista: pinta, no pide datos por su cuenta. Los datos llegan por pokemonService.
import { buscarPokemon } from '../core/pokemonService.mjs'

export function renderBuscador(consulta) {
  const { resultados, mensaje, haBuscado } = buscarPokemon(consulta)

  if (!haBuscado) return 'Escribe al menos dos letras.'
  if (mensaje) return mensaje
  return resultados.map((nombre) => `• ${nombre}`).join('\n')
}
