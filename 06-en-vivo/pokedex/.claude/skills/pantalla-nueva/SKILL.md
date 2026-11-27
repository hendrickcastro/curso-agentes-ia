---
name: pantalla-nueva
description: Añade una pantalla con una tabla de datos interactiva siguiendo el patrón del equipo. Úsala siempre que pidan una pantalla nueva, una tabla, una matriz o una comparativa en la web.
---

# Pantalla nueva con tabla interactiva

Todas las tablas del equipo se ven y se manejan igual. No inventes otra interacción.

1. Copia `tabla-datos.css` (junto a este fichero) a `src/estilos/tabla-datos.css` y enlázalo en `index.html`. No cambies sus clases.
2. Crea la pantalla en `src/ui/` con `crearPantalla` y monta la tabla así:
   - `<table class="tabla-datos">` con `<caption>` y una cabecera de fila y de columna por dato, con `scope="row"` y `scope="col"`.
   - Encima de la tabla, una `<div class="leyenda">` que explique cada color o símbolo.
   - **Resaltado cruzado:** al pasar el ratón o poner el foco en una celda, su fila y su columna reciben la clase `resaltada`. Las celdas llevan `tabindex="0"` para que funcione con teclado.
   - **Filtro:** un `<select class="campo">` encima de la tabla para quedarse con una sola fila. La opción elegida se guarda en la dirección (`#/ruta?ver=valor`) para que el enlace se pueda compartir.
3. Los datos van en `src/data/` y se sirven por `src/core/`. La pantalla solo pinta.
4. Registra la pantalla en `src/app.js` y enlázala en el menú de `index.html`.
5. Valida con `node .claude/skills/pantalla-nueva/scripts/validar.mjs` y corrige hasta que no quede ningún ✘.
