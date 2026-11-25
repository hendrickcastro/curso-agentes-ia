# Llevarlo al equipo {M}

> **En una frase.** El último problema no es técnico: nada de esto aguanta si es de una sola persona. Diagnosticar, compartir y mejorar. [D2:50-51]

## Diagnosticar · VSM: el mapa de cómo trabaja el equipo {M} [D2:52-53]

*Value Stream Mapping*: cada paso, desde la necesidad hasta producción. El VSM clásico, de lean, mide dónde espera el trabajo. Aquí, **cada paso lleva una marca: IA activa, IA posible o no aplica.**

El ejemplo del curso: un equipo con **31 pasos en 5 etapas** (definir → planificar → implementar → entregar → operar), con un 48 % de IA activa, un 32 % de IA posible y un 20 % que no aplica. **Lo posible es por donde avanzar.**

Para hacerlo con tu equipo:

1. Listad en una pizarra o documento compartido cada paso real desde que llega una necesidad hasta que está en producción.
2. Marcad cada uno: IA activa, IA posible o no aplica.
3. Elegid un solo paso «posible» y convertidlo en «activa» antes de la siguiente reunión de mejora.

## Diagnosticar · Gauntlet: ¿podrías dejar de leer el código? {M} [D2:54-55]

Un ejemplo de cómo medir tus garantías y guardarraíles. Nueve campos: **aceptación, mutation testing, mutación de la spec, CRAP, cobertura, DRY, arquitectura, calidad de tests y spec-first.** No es cerrado y es mejorable, pero te dice dónde mirar.

Cada campo se puntúa **de 0 a 4**, con una nota **sobre 36** y un roadmap. En el curso se compara la rama principal (antes de cualquier práctica, sin red) con la última rama del día 2 (con las comprobaciones de los módulos 4 a 6).

La skill se llama **Gauntlet Audit** y es solo diagnóstico: no instala ni modifica nada. Su criterio para ordenar el roadmap es el que conviene recordar:

1. **Convertir en gate lo ya instalado**: añadir un umbral que rompa el build a una herramienta que ya corre es casi gratis.
2. **Mutation testing**: el mayor salto de confianza en repositorios con una suite decente.
3. **Umbral de cobertura** si no existe: barato, y prerrequisito del CRAP.
4. **Gates de arquitectura**: ciclos y fronteras en CI.
5. **Mutación de la spec**, solo si ya existe capa de aceptación.

## Compartir · Qué es tuyo y qué es del equipo {M} [D2:56]

| | Capa de usuario | Repositorio |
|---|---|---|
| De quién | Tuyo | Del equipo |
| ¿Se versiona? | No | Sí |
| Dónde | `~/.claude/`, `~/.codex/` | `AGENTS.md`, `.claude/skills/` |

Las instrucciones y las skills ya tienen formato común. Los hooks, los subagentes y los permisos, no.

## Compartir · agentic-toolbox {C} [D2:57]

Así lo comparte 540: `github.com/540/agentic-toolbox`.

| Vía | Dónde | Qué lleva |
|---|---|---|
| **Plugin** | En Claude Code | Skills, hooks y agentes |
| **skills.sh** | En el resto de herramientas | Solo skills |

```bash
# Claude Code
/plugin marketplace add 540/agentic-toolbox
/plugin install gauntlet-audit@540

# Cualquier otro agente compatible con skills.sh
npx skills add 540/agentic-toolbox
```

## Mejorar · Probar cada uno, converger en común {M} [D2:58]

**Pruebas en tu capa → lo usa más gente → sube al repositorio.**

## Mejorar · La reunión de mejora continua {M} [D2:59]

Como la retrospectiva de siempre, sobre el flujo con IA:

1. ¿Qué está fallando?
2. ¿Cómo mejoramos el sistema y el flujo con IA?
3. ¿Qué podemos añadir?

## Si no leemos el código, ¿qué miramos? {M} [D2:60]

Había un tablero de mejoras técnicas y preocupaciones. Se llenaba leyendo código; al delegar, se queda vacío. **Un panel de métricas ocupa el sitio del tablero. Sigue decidiendo el equipo.** (Demo: panel de salud del código.)

## La curva J {M} [D2:61]

Cualquier mejora que adoptéis: **al principio cuesta** (el rendimiento baja por debajo del nivel de partida) **y después compensa.** Como el interés compuesto: cada mejora permite ir más rápido y seguir mejorando.

## Práctica 9 · Dónde estáis y qué atacaríais primero (7 min, todo el grupo) {C} [D2:62]

Con todo lo visto en los dos días.

**Dónde estáis:**

- ¿Compartís algo en el repositorio?
- ¿Hacéis alguna reunión de mejora continua?
- ¿Cuándo cambió vuestro equipo por última vez cómo trabaja con IA, y qué fue?

**Qué atacaríais primero:** piensa un momento qué es lo primero que atacarías en tu equipo. Escríbelo en el chat sin enviarlo; a la señal, todo el mundo envía a la vez, para que nadie copie la respuesta anterior. Después se comentan dos o tres.
