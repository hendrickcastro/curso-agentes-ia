# Contexto del buscador

Lo que hay que saber del negocio y que no se deduce leyendo el código.

## Glosario (lenguaje ubicuo)

| Término | Significa | No confundir con |
|---|---|---|
| **Consulta** | Lo que la persona escribe en el buscador, sin espacios a los lados | El nombre completo del Pokémon |
| **Coincidencia** | Un Pokémon cuyo nombre contiene la consulta, sin distinguir mayúsculas | Coincidencia exacta o por prefijo |
| **Búsqueda corta** | Una consulta de menos de dos letras: no se busca | Una búsqueda sin resultados |

## Decisiones de negocio que no están en el código

- El orden de los resultados es el de la Pokédex nacional, no el alfabético.
- El mensaje de «sin resultados» lo decide producto y está en `specs/buscador.criterios.json`.

## Lo que este proyecto no tiene

- No hay API real: la lista está en memoria. `src/ui/legacy/` es código viejo que sí llama a PokéAPI y está pendiente de migrar (lo vigila el ratchet).
