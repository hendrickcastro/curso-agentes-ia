# Vibecoding {M}

> **En una frase.** Describir en lenguaje natural lo que quieres y aceptar el código sin leerlo sale barato mientras el código se puede tirar. [D1:19]

## De dónde sale el término {C} [D1:20]

«Hay un nuevo tipo de programación que llamo *vibe coding*, donde me dejo llevar del todo por las vibras, abrazo las exponenciales y olvido que el código siquiera existe.» — Andrej Karpathy, 2 de febrero de 2025. Él mismo lo llamó después «un tuit desechable de ducha».

## Qué es exactamente {M} [D1:21-23]

**Describir en lenguaje natural lo que quieres y aceptar el código sin leerlo**, iterando sobre el comportamiento observado en vez de sobre el código.

El bucle de cinco pasos: **describes → aceptas sin revisar → ejecutas → pegas el error → vuelves al tres.** El paso que falta, a propósito, es «leer el código».

Dos condiciones para que sea vibecoding de verdad:

- **No revisas el código.** Si lees los diffs y los apruebas uno a uno, eso es otra cosa y tiene otro nombre.
- **Software desechable.** Proyectos de fin de semana, prototipos, cosas que no van a producción y que nadie va a mantener.

## Cuándo deja de salir barato {M} [D1:25-26]

El día que el prototipo se queda y hay que mantenerlo y evolucionarlo, la factura llega de golpe: nadie entiende lo que hay, nadie puede estimar un cambio, y el único que sabía algo del sistema era un modelo que ya no tiene esa conversación abierta.

Cuando lo vibecodeado se queda, **tanto tú como el agente necesitáis ayuda**: el agente necesita saber cosas que no están ni en tu prompt ni en su cabeza. A ese «lo que necesita saber» le llamamos **contexto**, y es lo que peor gestionamos todos.

> **Analogía.** Vibecodear es cocinar sin receta para ti solo un domingo: si sale mal, pides pizza. El problema empieza cuando ese plato entra en la carta del restaurante y otro cocinero tiene que repetirlo cada día sin saber qué llevaba.

## Práctica 1 · Vibecodear (10 min, individual) {M} [D1:24]

Cada persona en su equipo: clona `github.com/540/ai-development-training` y trabaja sobre la rama `base`. Lanza el prompt tal cual y acepta lo que salga:

```text
Añade al proyecto web una tabla interactiva con las ventajas y
desventajas entre todos los tipos de Pokémon.
```

Este mismo prompt se repite en todas las prácticas del curso: lo que cambia es lo que rodea al agente. Guarda el resultado en el *Cuaderno de prácticas* del laboratorio, con tu nombre, para compararlo después. Al terminar, escribe en el chat una línea: qué salió y cuánto tuviste que leer.

> **Nota sobre el repositorio.** Las diapositivas hablan de una Pokédex en React sobre PokéAPI. El repositorio público contiene hoy un comparador de coches sobre la API de fueleconomy.gov con la misma progresión de ramas (`base`, `rpi`, `guardarrailes`, `especificacion`, `harness`) y otro prompt («Añade al comparador cuál de los coches sale más barato en España»). La mecánica de cada práctica es idéntica.
