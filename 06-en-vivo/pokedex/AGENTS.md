# Pokédex de Kanto

Web estática sin dependencias ni compilación: HTML, CSS y módulos de JavaScript.

## Arrancar

```bash
npm run check    # la red del equipo (capas, colores, tamaño) y los tests
```

## Cómo está organizado

- `src/data/` — los datos. Solo los lee `src/core/`.
- `src/core/` — servicios: lo único que una pantalla puede usar para pedir datos.
- `src/ui/` — pantallas: pintan. `pantalla.js` da el marco común.
- `src/estilos/tokens.css` — los colores del equipo. `base.css` — el resto de estilos.
- `specs/criterios.json` — criterios de aceptación con sus datos. Los tests los leen de ahí.

## Dominio

El vocabulario y las decisiones de producto están en `CONTEXT.md`. Léelo antes de añadir una pantalla.

## Reglas del proyecto

- Una pantalla no lee datos por su cuenta: ni importa de `src/data` ni llama a la red. Así hay un solo sitio donde cambiar el origen de los datos.
- Los colores solo se escriben en `tokens.css`; en el resto, `var(--…)`. Si falta uno, se añade allí: así cambiar la marca es cambiar un fichero.
- Ningún fichero de `src/` pasa de 120 líneas (los datos de `src/data` no cuentan): un fichero que se lee de una vez se revisa de una vez.
- Una pantalla nueva se registra en `src/app.js` y se enlaza en el menú de `index.html`.
- Un comportamiento nuevo entra primero como criterio en `specs/criterios.json`: es la condición de parada de la tarea.
- Cada cambio visible deja una línea en `NOVEDADES.md` (créalo si no existe) con el formato `- <qué cambia para quien usa la Pokédex>`: producto lee ese fichero, no los diffs.
- No se modifica ni se borra un test que ya existía.
- Antes de dar una tarea por terminada, `npm run check` tiene que pasar.
