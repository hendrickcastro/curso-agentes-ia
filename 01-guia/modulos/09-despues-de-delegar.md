# Después de delegar {M}

> **En una frase.** Si no tienes que estar encima, puedes lanzar varios agentes; entonces el cuello de botella eres tú, y lo que te preocupa es el coste y que lo construido dure. [D2:38-39]

## Worktrees: un agente, una copia {M} [D2:40]

**Un worktree es otra copia de trabajo del mismo repositorio, en su propia rama.** Cada agente trabaja en su carpeta. Nadie pisa los ficheros ni el estado de git de otro. **Crear la copia es un comando. Lo difícil es que arranque.**

```bash
git worktree add ../miapp-tabla-tipos -b feature/tabla-tipos
git worktree list
git worktree remove ../miapp-tabla-tipos
```

## Qué necesita un worktree nuevo para arrancar {M} [D2:41]

Lo que no está en git no viene con la copia.

| Necesita | Por qué |
|---|---|
| **Configuración y secretos** | Los `.env` y las claves no están en git. Hay que copiarlos o generarlos. |
| **Dependencias** | Instalar los paquetes y compilar lo que haga falta. |
| **Servicios y puertos** | Base de datos, caché, colas. Dos copias no pueden escuchar en el mismo puerto. |
| **Datos** | Una base de datos con datos de prueba, propia o compartida. |
| **Limpieza** | Al cerrar la tarea, parar los servicios y borrar la copia. |

**Si cada worktree nuevo te pide diez minutos de ajustes a mano, no vas a tener cinco.** Por eso se convierte en un script (`02-ejemplos-codigo/referencia/worktrees/wt-nuevo.sh`, probado):

```sh
#!/usr/bin/env sh
# Uso: wt-nuevo.sh <nombre-de-tarea>
set -e
tarea="$1"
raiz=$(git rev-parse --show-toplevel)
destino="$(dirname "$raiz")/$(basename "$raiz")-$tarea"

git worktree add "$destino" -b "feature/$tarea"                       # la copia: un comando

[ -f "$raiz/.env" ] && cp "$raiz/.env" "$destino/.env"                # configuración y secretos
puerto=$((3000 + $(printf '%s' "$tarea" | cksum | cut -d' ' -f1) % 1000))
echo "PORT=$puerto" >> "$destino/.env"                                # un puerto estable por tarea

[ -f "$destino/package.json" ] && (cd "$destino" && pnpm install --frozen-lockfile)   # dependencias
echo "Listo: $destino (puerto $puerto)"
```

## Los contenedores: dos formas de montarlos {C} [D2:42]

| Opción | Qué es | Coste |
|---|---|---|
| **Todo por worktree** | Cada copia levanta su pila entera. | Aísla del todo, pero pesa y tarda. |
| **Infraestructura común** | Base de datos, caché y buscador en un solo sitio, y cada worktree levanta solo su aplicación. | Los datos se comparten, y dos tareas pueden chocar en ellos. |

En los dos casos, **una dirección por tarea**: un proxy da a cada tarea un nombre fijo en lugar de un puerto al azar. Traefik lo hace para los contenedores; Portless, para el servidor de desarrollo.

## Aislar la ejecución no evita el choque al integrar {M} [D2:43]

Dos tareas que tocan los mismos ficheros chocan igual, solo que más tarde. **Parte el trabajo por zonas que no se tocan. Si no se puede, hazlo en serie.**

## Con cinco agentes, el cuello de botella eres tú {M} [D2:44]

Cada agente que para a preguntar es un salto de contexto. Cinco agentes a la vez son cinco colas de revisión. Y tu ordenador, que también se satura y también tiene un límite.

## Lo que cuesta estar en este punto {M} [D2:45]

| Coste | En qué consiste |
|---|---|
| **Tokens y límites** | Más autonomía gasta más: cada fase delegada consume tokens. Y varios agentes a la vez llegan antes al límite del plan. |
| **Infraestructura** | Entornos en paralelo, contenedores y minutos de CI. |
| **Comprobaciones** | La red de verificación corre en cada cambio de cada agente. Algunas, como la mutación, son caras y lentas. |
| **Mantener el sistema** | Rules, skills y scripts son código que alguien mantiene. Si caducan, el agente sigue una rule que ya no es verdad. |

**La pregunta no es si cuesta. Es si cuesta menos que el tiempo que liberas.**

## Mantenibilidad a largo plazo {M} [D2:46]

Dentro de seis meses, otro agente tendrá que entender y cambiar lo que hoy escriben cinco agentes. Y tú, cuando te toque.

### Lo que el código no explica {M} [D2:47]

El código dice qué hace el sistema. No dice por qué.

- **Negocio y lenguaje ubicuo.** Un glosario vivo: qué significa cada término del dominio, para ti y para el agente. No es una especificación.
- **Decisiones técnicas.** Un ADR, **solo si** la decisión es difícil de revertir, sorprende sin contexto y es un *trade-off* real.

`grill-with-docs`: el interrogatorio de siempre, pero deja ficheros en el repositorio y no solo en tu cabeza.

```markdown
# ADR 007 · La mutación corre solo sobre dominio y servicios

**Estado:** aceptado · **Fecha:** 2026-04-12

## Contexto
Stryker sobre todo el repositorio tarda 40 minutos y bloquea la integración.

## Decisión
Se muta solo `src/core/**/domain` y `src/core/**/services`, con umbral del 100 %.

## Consecuencias
La interfaz queda protegida por cobertura (60 %) y por los tests de aceptación, no por mutación.
Si una regla de negocio acaba en un componente, nadie lo detecta: por eso la frontera
«las vistas no deciden» está en dependency-cruiser.
```

### Cada cambio pasa; el conjunto empeora {M} [D2:48]

La red comprueba que **cada cambio** es correcto, no que el código **siga siendo mantenible**. Con cinco agentes, la complejidad y la duplicación crecen más rápido de lo que nadie lo nota.

La respuesta es la de todo el curso: **métricas de calidad y garantías que te digan que el código sigue sano, hoy y dentro de seis meses.**

## El límite {M} [D2:49]

Mi máquina ya aguanta varios agentes y lo que monto dura. **Ahora lo tiene que usar todo el equipo.**
