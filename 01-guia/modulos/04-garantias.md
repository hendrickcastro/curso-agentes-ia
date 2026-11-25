# Garantías {R}

> **En una frase.** Parecer correcto no basta, y leerlo entero no escala: hace falta una red de comprobaciones que detenga el trabajo, no que avise. [D1:62]

## La pregunta {R} [D1:63]

**¿Qué tendría que existir para que lo aceptaras sin leerlo, hoy y dentro de un año?** Si para aceptarlo tienes que leerlo entero, has cambiado el trabajo de escribir por el de leer.

## No es una herramienta: es una red {R} [D1:64]

**Once comprobaciones** que miran cosas distintas; ninguna sustituye a las demás. Van de la más asentada a la más abierta.

### Terreno firme: lo que ya no discute nadie {R} [D1:65]

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 1 | **Formateo** | Quita el ruido del diff para que se vea el cambio de verdad. La más barata de las once. | Prettier, Biome |
| 2 | **Linting** | Los criterios que se comprueban leyendo el código sin ejecutarlo. | ESLint, Oxlint |
| 3 | **Cobertura con umbral** | Mide qué código no ejercita ningún test; si baja del listón, el build falla. | `coverageThreshold` de Jest, `check-coverage` de c8 |
| 4 | **Duplicación estructural** | Lo mismo escrito en cuatro sitios se va a corregir en tres. | jscpd, SonarQube |
| 5 | **Arquitectura y dependencias** | Fronteras entre capas y ausencia de ciclos verificadas por una herramienta. | dependency-cruiser, `madge --circular` |
| 6 | **Mutation testing** | ¿Detectan mis tests un cambio en el código? La única de las once que dice si la suite protege algo. | StrykerJS, umbral en `thresholds.break` |

### Maduro, pero hay que elegir {M} [D1:66]

El concepto está claro; la herramienta la elige cada equipo.

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 7 | **Métricas de calidad del código** | Complejidad, tamaño, acoplamiento. La más rentable para empezar: el **riesgo CRAP**, que cruza complejidad con cobertura. Cada equipo elige dos o tres y las pone en un umbral. | `complexity` de ESLint, SonarQube |
| 8 | **Calidad del código de test** | El test también es código y también se pudre. Las herramientas escasean: casi todo recae en el acuerdo de equipo y en la revisión. | eslint-plugin-jest, eslint-plugin-vitest |

**El acuerdo que no está en ninguna herramienta es folklore.** Funcionaba mientras quien escribía el código se sentaba en la misma reunión en la que se acordó. El agente no estuvo en esa reunión.

La fórmula del CRAP, tal como la calcula el script del curso (`tools/crap/crap.ts`), con cobertura entre 0 y 1:

```ts
export function crapOf(complexity: number, coverage: number): number {
  return complexity ** 2 * (1 - coverage) ** 3 + complexity
}
// complejidad 10 sin tests  → 110   (muy por encima del umbral, 8)
// complejidad 10 al 100 %   → 10    (sigue por encima: hay que partirla)
// complejidad 5 al 100 %    → 5     (pasa)
```

### El frente abierto: la especificación {M} [D1:67-68]

Lo que se está inventando ahora mismo.

| # | Comprobación | Qué mira | Herramientas |
|---|---|---|---|
| 9 | **Comportamiento funcional** | El comportamiento especificado fuera del código y verificado contra la aplicación real. | Cucumber.js, Playwright |
| 10 | **Mutación de la especificación** | Si cambio un dato del criterio de aceptación, ¿falla algún test? Detecta criterios decorativos. | No hay herramienta estándar: script propio |
| 11 | **Proceso spec-first** | Comprueba si la especificación existió antes que el código o se escribió después para justificarlo. | Sin herramienta |

Cuando el código sale en minutos y lo escribe el agente, **lo que revisas deja de ser el código y pasa a ser lo que pediste.** La especificación asciende a artefacto principal, y llega sin nada del instrumental que el código sí tiene.

**De la prosa al invariante.** Una máquina puede verificar una precondición; un párrafo, no. Ahí se está trabajando ahora, y casi todo sigue en beta o en papers. Lo que se puede hacer hoy es más modesto: escribir el criterio antes que el código, y comprobar de vez en cuando que el test se cae si el criterio cambia.

Eso último es lo que hace `tools/mutacionSpec.mjs` en el proyecto de ejemplo:

```text
$ npm run spec:mutacion
protegido   AC1  (resultados)  «PIKA» encuentra a Pikachu.
protegido   AC2  (resultados)  «chu» también encuentra a Pikachu.
protegido   AC3  (haBuscado)   Con menos de dos letras no busca.
protegido   AC4  (mensaje)     Sin resultados, dice «Ningún Pokémon se llama así».
DECORATIVO  AC5  (tiempoMaximoMs)  Responde en menos de 200 ms.
```

## Cómo se ve la red en un repositorio real {M}

La red de la rama `harness` del repositorio del curso, con sus umbrales:

| Gate | Herramienta | Umbral |
|---|---|---|
| tipos | TypeScript | el proyecto compila |
| lint | ESLint | sin `any`, sin colores en crudo, las vistas no llaman a la API, tests sin enfocar, desactivar ni quedarse sin aserción |
| estilos | Stylelint | clases en camelCase y sin colores en crudo |
| idioma | cspell | el código, en inglés; los textos de pantalla, en castellano |
| arquitectura | dependency-cruiser | la dependencia apunta hacia dentro, sin ciclos ni huérfanos |
| duplicación | jscpd | cero duplicación por encima de 50 tokens |
| cobertura | Vitest e istanbul | 100 % en dominio y servicios; 90 % en infraestructura; 60 % en la interfaz |
| riesgo CRAP | script propio | ninguna función por encima de CRAP 8 |
| mutación | StrykerJS | 100 % de mutantes muertos en dominio y servicios |

Todo colgado de dos comandos, que es lo que hace que un agente pueda ejecutarla:

```json
{
  "scripts": {
    "check": "pnpm typecheck && pnpm lint && pnpm lint:css && pnpm spell && pnpm arch && pnpm test",
    "verify": "pnpm typecheck && pnpm lint && pnpm lint:css && pnpm spell && pnpm arch && pnpm duplication && pnpm coverage && pnpm crap"
  }
}
```

La frontera «las vistas no llaman a la API», convertida en dos garantías que detienen:

```js
// eslint.config.js — solo para src/ui
{
  files: ['src/ui/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-globals': ['error',
      { name: 'fetch', message: 'Views do not call the API: data comes from vehicleService.' }],
    'no-restricted-imports': ['error',
      { patterns: [{ group: ['**/infrastructure', '**/infrastructure/**'],
                     message: 'Views do not call the API: data comes from vehicleService.' }] }],
  },
}
```

```js
// .dependency-cruiser.cjs
{ name: 'ui-does-not-import-infrastructure', severity: 'error',
  from: { path: '^src/ui/' }, to: { path: '^src/core/[^/]+/infrastructure/' } },
{ name: 'no-cycles', severity: 'error', from: {}, to: { circular: true } },
```

```json
// stryker.config.json — el umbral que rompe el build
{ "mutate": ["src/core/**/domain/**/*.ts", "src/core/**/services/**/*.ts"],
  "thresholds": { "high": 100, "low": 100, "break": 100 } }
```

**Lo que la red no garantiza:** los gates verifican el código, no lo que el negocio pidió. Un agente puede dejarlos todos en verde implementando mal una regla. Si se inventa el precio de la gasolina, los tests que él mismo escribe lo darán por bueno. Eso lo cubre el módulo de especificación.

## Cuándo se ejecuta cada garantía {R} [D1:69]

El momento bueno no es el más temprano posible: es **el más temprano en el que la comprobación compensa lo que cuesta.**

| Momento | Qué cabe ahí | Por qué ahí |
|---|---|---|
| Antes de escribir el código | Que la especificación existe, con criterios de aceptación que se puedan comprobar | Es lo único que tiene sentido mirar cuando todavía no hay código |
| Al guardar un fichero | Formateo y linting | Milisegundos, y solo mira lo que acabas de tocar |
| Cuando el agente termina de escribir | Lo mismo, pero el aviso le llega a él | Es el único momento en que se corrige solo, sin gastar tu tiempo |
| Antes de confirmar el cambio | Tests del área tocada, umbrales sobre lo nuevo | Segundos, y todavía no lo ha visto nadie más |
| Antes de publicarlo | Suite rápida completa, fronteras y ciclos | Minutos, y es el último momento en que sigue siendo privado |
| En la integración | Cobertura, mutación, duplicación | Tarda, y aquí ya no hay nadie esperando delante |
| Al cerrar la sesión del agente | La red entera, como criterio de aceptación | Es donde decides si esto se acepta o se lee entero |

## Dos reglas que separan una garantía de un adorno {R} [D1:70-71]

**Si avisa pero no detiene, no es una garantía. Es un informe.** Ejecutarla tolerando el fallo cuesta lo mismo y no protege igual. Lo único que compra es la tranquilidad de creerse cubierto.

**Una garantía que solo existe dentro de tu IDE no es una garantía.** Si no se puede invocar desde la línea de comandos, el agente no puede ejecutarla ni saber si la ha pasado. Y tú no puedes colgarla de ninguno de esos momentos, ni meterla en el sistema.

```bash
# Informe: el fallo se tolera
eslint . || true

# Garantía: sale con código distinto de cero y detiene el commit, el push o el build
eslint .
```

## Autodiagnóstico (8 min, individual) {M} [D1:72]

Cada persona sobre su propio repositorio, **de memoria y sin abrir nada**:

| Comprobación | ¿Existe? | ¿En qué momento se ejecuta? | ¿Detiene el trabajo o solo avisa? |
|---|---|---|---|
| Cobertura con umbral | | | |
| Arquitectura y dependencias | | | |
| Mutation testing | | | |
| Comportamiento funcional | | | |

Si tenéis que ir a mirarlo, ya tenéis la respuesta. Una comprobación que detiene el trabajo se nota, porque alguien se queja de ella. El laboratorio del site tiene la versión con las once comprobaciones, para guardarla y compararla entre repositorios: rellénala, expórtala y envíala por el chat; quien facilita importa las de todos y las compara con la pantalla compartida.

## El ratchet {R} [D1:73-74]

«Esto no va conmigo. Mi repositorio lleva ocho años y no cumple nada.» Justo para eso existe el ratchet: una carraca, que deja girar en un sentido y bloquea el otro.

1. **Mides hoy.** Tomas el número que salga como línea de partida y lo declaras aceptable. No es aprobar la deuda, es dejar de discutirla.
2. **Lo viejo pasa, lo nuevo detiene.** Las violaciones que ya estaban pasan; una nueva detiene el trabajo. Todo lo que salta es de hoy.
3. **La línea solo baja.** La reescribe la propia comprobación cuando alguien deja un fichero viejo mejor de lo que estaba. Un ratchet que lleva un año sin moverse es la misma deuda con un certificado.

**Para un agente, el ratchet es la frontera que le dice qué parte del repositorio puede tocar sin preguntar.** Con el listón completo sobre un proyecto viejo le estás pidiendo que reforme el proyecto entero, y lo va a intentar.

El núcleo de `02-ejemplos-codigo/demo/tools/ratchet.mjs`:

```js
const base = JSON.parse(readFileSync(RUTA_BASE, 'utf8'))   // { "src/ui/legacy/viejaVista.mjs": 2 }
const actual = contarPorFichero(buscarViolaciones())

// Lo nuevo detiene: cualquier fichero con MÁS violaciones de las que tenía.
const empeorados = Object.entries(actual).filter(([fichero, n]) => n > (base[fichero] ?? 0))
if (empeorados.length > 0) process.exit(1)

// La línea solo baja: se queda con el mínimo entre lo que había y lo que hay.
const nuevaBase = Object.fromEntries(
  Object.entries(base).map(([fichero, n]) => [fichero, Math.min(n, actual[fichero] ?? 0)])
                      .filter(([, n]) => n > 0))
if (total(nuevaBase) < total(base)) guardar(nuevaBase)
```

```text
$ npm run ratchet
Ratchet: en verde. Deuda conocida: 2 violación(es); nuevas: 0.

$ # alguien añade un fetch en una vista
Ratchet: hay violaciones nuevas. Todo lo que salta es de hoy.
src/ui/buscadorView.mjs: tenía 0, ahora 1
  src/ui/buscadorView.mjs:12  Las vistas no llaman a la API: pide el dato a pokemonService.
```

> **Analogía.** El ratchet es la báscula de una dieta que no te pide pesar 70 kilos mañana: solo te impide pesar más que ayer.

## El límite de las garantías {R} [D1:75]

Sé qué garantizar y cuándo. **Pero soy yo quien se acuerda de lanzarlas.** Son once comprobaciones, hay que aplicarlas en cada cambio, y eso a mano no se sostiene. El bloque siguiente automatiza una de ellas de punta a punta, el linting, para montar el mecanismo completo con las manos.
