---
name: revisar-pr
description: Revisa un pull request como lo hace el equipo. Úsala cuando pidan revisar un PR, una rama o un diff.
---

# Revisar un PR

1. Lee la descripción del PR y el ticket enlazado. Si no hay criterios de aceptación, dilo lo primero.
2. Ejecuta `scripts/riesgo.sh <rama-base>` para ver qué ficheros tocan zonas vetadas o tests que ya existían.
3. Revisa esos ficheros primero; después, el resto.
4. Agrupa los comentarios por gravedad, según `referencias/criterios.md`.
5. Termina con una línea: carril propuesto (verde, muestreo o lectura) y por qué.

No edites código ni publiques nada: solo informas.
