# Especificación {R}

> **En una frase.** El sistema ya construye casi cualquier cosa; la pregunta es qué le pides, y un sistema que trabaja sin ti necesita saber cuándo ha terminado. [D2:16]

## La condición de parada {R} [D2:17]

**Un sistema que trabaja sin ti necesita saber cuándo ha terminado. Y eso no lo decide él.**

Mientras el código era caro, la fricción de escribirlo sacaba a la luz los huecos uno a uno, y había alguien en medio decidiendo. Ahora nadie lo escribe a mano, y los huecos ya no afloran solos. El criterio de aceptación deja de ser una formalidad del ticket y pasa a ser **la condición de parada**: el «contrato antes» del día 1.

## Describir no es especificar {R} [D2:18]

**Si para saber si ha terminado tiene que mirarlo una persona, no has especificado. Has descrito.**

| Descrito | Especificado |
|---|---|
| Añade un buscador de Pokémon. | Busca por nombre sin distinguir mayúsculas. |
| | «PIKA» encuentra a Pikachu. |
| | «chu» también encuentra a Pikachu. |
| | Con menos de dos letras no busca. |
| | Sin resultados, dice «Ningún Pokémon se llama así». |

Cada línea de la segunda columna la puede comprobar alguien que no estuvo en la conversación. **Y por tanto, un agente.**

La misma especificación, en una forma que una máquina ejecuta (`02-ejemplos-codigo/demo/specs/buscador.criterios.json`):

```json
{ "id": "AC1", "texto": "Busca por nombre sin distinguir mayúsculas: «PIKA» encuentra a Pikachu.",
  "dado": { "consulta": "PIKA" }, "entonces": { "resultados": ["Pikachu"] } },
{ "id": "AC3", "texto": "Con menos de dos letras no busca.",
  "dado": { "consulta": "p" }, "entonces": { "haBuscado": false } }
```

```js
// test/aceptacion.test.mjs — los datos NO están en el test: se leen del criterio
for (const criterio of spec.criterios) {
  test(`${criterio.id} — ${criterio.texto}`, () => {
    const real = buscarPokemon(criterio.dado.consulta)
    for (const [clave, esperado] of Object.entries(criterio.entonces)) COMPROBACIONES[clave]?.(real, esperado)
  })
}
```

O en Gherkin, si el equipo usa Cucumber:

```gherkin
Escenario: La búsqueda no distingue mayúsculas
  Dado que existe el Pokémon "Pikachu"
  Cuando busco "PIKA"
  Entonces veo "Pikachu" en los resultados

Escenario: Con menos de dos letras no se busca
  Cuando busco "p"
  Entonces no se lanza ninguna búsqueda
```

## Las cuatro piezas de una definición que sirve {R} [D2:19]

| Pieza | Qué es |
|---|---|
| **El conocimiento de negocio** | El que no está en el repositorio. |
| **La intención** | Para qué se hace, qué problema resuelve. |
| **Las restricciones** | Lo que no se puede tocar ni romper. |
| **Los criterios de aceptación** | En una forma que alguien pueda comprobar sin opinar. |

**Spec-first, parte de la red de garantías, no es un ritual:** es que exista condición de parada antes de que exista código.

```markdown
# Tabla de ventajas entre tipos

## Conocimiento de negocio
- Manda la tabla de la generación VI en adelante (18 tipos, incluido Hada).
- «Ventaja» es el multiplicador de daño del tipo atacante sobre el defensor: ×2, ×1, ×½ o ×0.

## Intención
Que quien arma un equipo vea de un vistazo contra qué es fuerte y débil cada tipo.

## Restricciones
- Las vistas no llaman a la API: los datos llegan por `pokemonService`.
- No se toca la ficha de detalle.

## Criterios de aceptación
1. AC1 — La tabla tiene 18 filas (atacante) y 18 columnas (defensor).
2. AC2 — Agua contra Fuego muestra ×2; Fuego contra Agua, ×½.
3. AC3 — Normal contra Fantasma muestra ×0.
4. AC4 — Al pulsar una cabecera de fila se resaltan solo sus ×2.
```

## De revisar el plan a definir la tarea {M} [D2:20]

**En RPI revisabas el plan. El sistema ya no espera a nadie.** La decisión no desaparece: lo que ayer entraba por el plan, hoy entra al definir la tarea. Una buena definición deja el plan acotado, y un plan acotado se puede automatizar sin que nadie lo revise antes.

## La especificación mínima solo parece barata {M} [D2:21]

Hasta que cuentas el retrabajo. El coste total es la suma de dos curvas: **especificar** (crece con la completitud) y **retrabajo** (cae con ella). El óptimo no está ni en «a pelo» ni en «exhaustiva».

- **Con varios agentes, el óptimo se va a la derecha:** cada uno reinterpreta lo que recibe y el error se acumula en cada traspaso.
- **Si el agente redacta y tú revisas, especificar cuesta menos**, y el óptimo también se desplaza a la derecha.

## Cuánto merece cada tipo de trabajo {M} [D2:22]

El conocimiento de negocio se escribe una vez por proyecto. El entendimiento común, por cambio. El diseño técnico, solo algunas cosas. Con varios agentes, todo por escrito: cada traspaso reinterpreta.

| Tipo de trabajo | Conocimiento de negocio | Entendimiento común | Diseño técnico |
|---|---|---|---|
| **Exploratorio** | El que ya exista | Una frase de intención y qué queda fuera. No va al sistema: lo trabajas tú delante | No: se descubre haciendo |
| **Tarea acotada** | El del proyecto, ya escrito | Criterios de aceptación comprobables | Solo si cruza una frontera |
| **Contrato entre servicios** | El del proyecto | Criterios de los dos lados | Sí: el contrato es el diseño |

## Práctica 7 · Especificar en vez de implementar (10 min, individual) {M} [D2:23]

Mismo repositorio, rama `especificacion`. El prompt de siempre, pero esta vez **no se implementa: se especifica.** Antes de empezar:

```bash
npx skills@latest add mattpocock/skills --skill grill-me grilling
```

1. **A pelo (3 min).** Pedidle los criterios de aceptación. Sin implementar.
2. **Interrogatorio (4 min).** Lo mismo, en sesión nueva y con `/grill-me`. Contesta tú como negocio.
3. **Cotejo (3 min).** ¿Qué salió solo en la segunda vuelta? ¿Estaba escrito en algún sitio? Pega en el chat la pregunta del interrogatorio que más cambió lo que se construiría.

## Debate (7 min) {C} [D2:24]

- **¿Qué dudas de negocio salieron?** Qué generación manda, qué tipos entran, si hay tipos dobles. Cosas que alguien estaba decidiendo sin saberlo.
- **¿Cuántas preguntas cambiaron lo que se construye y cuántas fueron relleno?** Con una encuesta de la videollamada.
- **¿En qué momento dejó de rendir el interrogatorio?** Llega un punto en que preguntar más produce documento, no información. Es la rama derecha de la curva.
- **¿Cuánto estaba en un sitio consultable?** Jira, Linear o Slack, vía MCP, levantan el techo del research a medias. Lo que nunca se escribió sigue sin estar.

## SDD: la especificación por delante {M} [D2:25]

*Spec-Driven Development.* Tres niveles, según cuánto vive la especificación (Birgitta Böckeler, «Understanding Spec-Driven-Development», octubre de 2025):

| Nivel | Qué es |
|---|---|
| **Spec-first** | Se escribe antes del código y sirve para esta tarea. Al terminarla, no se mantiene. |
| **Spec-anchored** | Se queda después de la tarea y se mantiene. Los cambios siguientes parten de ella. |
| **Spec-as-source** | Es el fichero principal. Solo se edita la especificación; el código no lo toca nadie. |

Lo del curso es **spec-first**, la comprobación de la red de garantías. Cuanto más a la derecha, menos probado está.

## El límite de la especificación {R} [D2:26]

Sé qué tengo que dejar dicho para que el sistema sepa cuándo ha terminado. **Y ahora tengo quince PRs encima que no he visto escribir.**
