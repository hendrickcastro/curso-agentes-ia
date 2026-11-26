---
name: carta-pokemon
description: Crea la carta coleccionable de un Pokémon con el formato y los datos del equipo. Úsala siempre que pidan una carta, una ficha o un cromo de un Pokémon.
---

# Carta de un Pokémon

Las cartas del equipo tienen un formato fijo y unos datos propios. No se inventa ni uno ni otro.

1. Saca los datos con `node .claude/skills/carta-pokemon/scripts/datos.mjs <nombre>`. Si el Pokémon no está, dilo y para: no rellenes de memoria.
2. Copia `plantilla.md` (está junto a este fichero) y sustituye cada `{{campo}}` por su dato. No añadas ni quites líneas, secciones ni emojis.
3. Guarda la carta en `cartas/<nombre-en-minúsculas>.md`.
4. Valídala con `node .claude/skills/carta-pokemon/scripts/validar.mjs cartas/<nombre>.md` y corrige hasta que no quede ningún ✘.
5. Responde con una sola línea: la ruta de la carta y el resultado de la validación.
