// Capa de servicio: lo ÚNICO que la interfaz puede usar para pedir datos.
// (El acuerdo de equipo del curso: «las vistas no llaman a la API».)

const POKEMON = ['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu', 'Raichu', 'Jigglypuff', 'Psyduck', 'Machu']

export const MENSAJE_SIN_RESULTADOS = 'Ningún Pokémon se llama así'
export const MINIMO_LETRAS = 2

/**
 * Busca por nombre sin distinguir mayúsculas.
 * Devuelve { resultados, mensaje, haBuscado }.
 */
export function buscarPokemon(consulta) {
  const texto = String(consulta ?? '').trim().toLowerCase()

  if (texto.length < MINIMO_LETRAS) {
    return { resultados: [], mensaje: '', haBuscado: false }
  }

  const resultados = POKEMON.filter((nombre) => nombre.toLowerCase().includes(texto))

  return {
    resultados,
    mensaje: resultados.length === 0 ? MENSAJE_SIN_RESULTADOS : '',
    haBuscado: true,
  }
}
