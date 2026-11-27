---
name: implementar
description: Lleva una funcionalidad de principio a fin por fases: investigar, planificar, especificar, implementar y verificar. Úsala cuando pidan implementar una funcionalidad con /implementar.
---

# Implementar por fases

Cada fase tiene algo prohibido. No empieces una fase sin haber terminado la anterior.

1. **Investigar.** Prohibido proponer soluciones y escribir código. Lee `AGENTS.md`, `CONTEXT.md`, `specs/` y el código afectado. Crea `plan.md` con dos secciones: «Lo que he encontrado» (ficheros y reglas del proyecto que aplican) y «Lo que no está decidido».
2. **Planificar.** Prohibido escribir código. Añade a `plan.md` la sección «Plan» (pasos y ficheros, en orden) y la sección «Decisiones que he tomado por mi cuenta»: una línea por cada cosa no decidida, con la opción elegida y el porqué, para que una persona pueda corregirla antes de fusionar.
3. **Especificar.** Añade el criterio o los criterios nuevos a `specs/criterios.json` antes de tocar el código. Son la condición de parada.
4. **Implementar.** Solo lo que dice el plan. No modifiques ni borres tests que ya existían.
5. **Verificar.** Ejecuta `npm run check` hasta que pase.
6. **Informe.** Cinco líneas como mucho: qué cambió, qué criterios son nuevos, qué decisiones hay que revisar y el resultado de la verificación.
