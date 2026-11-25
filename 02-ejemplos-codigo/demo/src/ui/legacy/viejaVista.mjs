// Código viejo: incumple el acuerdo (llama a la API desde la vista) DOS veces.
// El ratchet lo deja pasar porque ya estaba; una tercera llamada, aquí o en
// cualquier otra vista, detiene el trabajo.

export async function cargarListado() {
  const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  return respuesta.json()
}

export async function cargarDetalle(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
  return respuesta.json()
}
