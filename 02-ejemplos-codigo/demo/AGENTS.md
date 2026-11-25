# Buscador de Pokémon (demo)

Mini proyecto en Node sin dependencias. Sirve para practicar garantías, guardarraíles y carriles.

## Arrancar

```bash
npm run check    # lo rápido: ratchet de fronteras + tests
npm run verify   # la red entera: añade la mutación de la especificación
```

## Cómo está organizado

- `src/core/` — servicios: lo único que la interfaz puede usar para pedir datos.
- `src/ui/` — vistas: pintan, no piden datos por su cuenta.
- `specs/` — criterios de aceptación con sus datos. Los tests de aceptación los leen de aquí.
- `tools/` — las comprobaciones. Todas se invocan por línea de comandos.

## Dominio

El vocabulario del negocio está en `CONTEXT.md`. Léelo antes de tocar la búsqueda.

## Reglas del proyecto

- Las vistas no llaman a la API: así hay un solo sitio donde cambiar el origen de los datos y se pueden probar sin red. Los datos se piden a `pokemonService`.
- Un comportamiento nuevo entra primero como criterio en `specs/`: es la condición de parada de la tarea.
- No se modifica ni se borra un test existente salvo que haya cambiado su criterio en `specs/`: un test que cambia sin que cambie la especificación esconde una regresión.
- Antes de dar una tarea por terminada, `npm run check` tiene que pasar.
