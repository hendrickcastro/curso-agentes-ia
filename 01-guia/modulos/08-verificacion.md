# Verificación {R}

> **En una frase.** Quince PRs que no has visto escribir: la pregunta no es si vas a dejar de leer, sino si lo decides tú o te pasa. [D2:27]

## El cuello de botella se mueve otra vez {R} [D2:28-29]

Después de la IA, el segundo cuello de botella es la **verificación** (fase 05): más código del que nadie puede leer y una revisión humana que no escala.

**Quince PRs que no has visto escribir. ¿Cuáles no vas a leer?** No es si vas a dejar de leer. Es si lo decides tú o te pasa.

## Tres carriles {R} [D2:30]

| Carril | Quién lo mira |
|---|---|
| **Se lee entero** | Una persona lo revisa línea a línea. |
| **Por muestreo** | Un revisor automático hace la primera pasada y una persona mira lo que señala. |
| **Se fusiona solo** | Nadie lo lee. |

## El carril se decide en un embudo {R} [D2:31]

**Cada etapa solo puede mandar el cambio a un carril más lento.** Ninguna lo devuelve a uno más rápido.

| Etapa | Quién decide | Ejemplo |
|---|---|---|
| 01 **Zonas vetadas** | Una regla | Pagos, migraciones, la configuración de la propia red |
| 02 **Quién lo escribió** | Una regla | Un agente desatendido, alguien sin historial en esa zona |
| 03 **Señales del diff** | Una regla | Tamaño, tests existentes modificados, umbrales relajados |
| 04 **Nota de riesgo** | Un modelo: **cierra, nunca abre** | Una nota alta sube de carril; una baja no devuelve al verde |
| 05 **Red de garantías** | Las comprobaciones | Todo en verde y deteniendo, o no hay merge |

**Los umbrales los pone cada equipo: el apetito de riesgo es una decisión, no una constante.**

El embudo, ejecutable (`02-ejemplos-codigo/demo/tools/carril.mjs`):

```js
const ORDEN = ['verde', 'muestreo', 'lectura', 'bloqueado']
const masLento = (a, b) => (ORDEN.indexOf(b) > ORDEN.indexOf(a) ? b : a)

export function decidirCarril(cambio, config) {
  return ETAPAS.reduce((estado, etapa) => {
    const veredicto = etapa.decidir(cambio, config)
    // una etapa solo puede mandar el cambio a un carril MÁS LENTO
    const carril = veredicto ? masLento(estado.carril, veredicto.carril) : estado.carril
    return { carril, traza: [...estado.traza, { etapa: etapa.nombre, carril, motivo: veredicto?.motivo ?? 'pasa' }] }
  }, { carril: 'verde', traza: [] })
}
```

```text
$ node tools/carril.mjs cambios/03-toca-los-tests.json
Cambio: Arregla el buscador (y de paso 'ajusta' dos tests)
  01 Zonas vetadas (regla)                        → verde     pasa
  02 Quién lo escribió (regla)                    → muestreo  autor sin historial: agente-desatendido
  03 Señales del diff (regla)                     → lectura   encoge la red sin que haya cambiado la especificación
  04 Nota de riesgo (modelo: cierra, nunca abre)  → lectura   pasa
  05 Red de garantías (las comprobaciones)        → lectura   pasa
CARRIL: LECTURA
```

> **Analogía.** Es el triaje de urgencias: no se atiende a todo el mundo con el mismo detalle, pero quién espera y quién pasa lo decide un protocolo, no el cansancio del médico a las cuatro de la mañana. Y un triaje nunca baja la gravedad por una corazonada: solo la sube.

## Práctica 8 · Tres reglas (20 min, individual y por el chat) {M} [D2:32]

Sobre vuestro repositorio y el diagnóstico de ayer: **si la comprobación de una zona solo avisa, esa zona no tiene carril verde.**

**Tres reglas (10 min), cada persona por su cuenta:**

- Una ruta o tipo de cambio que siempre se lee.
- Una que no haría falta leer nunca.
- Qué tendría que estar en verde y deteniendo para que la segunda sea cierta hoy.

**Abogado del diablo (10 min):** pega tu segunda regla en el chat. Cada persona ataca la regla del mensaje anterior al suyo (la primera ataca la última): busca el cambio que entraría por ella y no debería, y respóndelo en el hilo.

## Debate (10 min) {C} [D2:33]

- **¿Qué regla verde has escrito? ¿Y quién no se atreve a escribir ninguna?**
- **¿Qué te falta de la red para poder escribirla?** Casi siempre, poco. Lo que falta es que algo pase de avisar a detener.
- **Lo que hoy entra sin que nadie lo lea, ¿en qué carril estaba?** Con una encuesta de la videollamada.

## Pedirle que no toque los tests no funciona {R} [D2:34]

Cuando la especificación y los tests chocan, los modelos **modifican los tests aunque la instrucción diga que no**, o programan casos especiales para pasar sin cumplir la especificación. Un modelo que vigila a otro caza entre el 42 y el 65 % de esas trampas en proyectos de varios ficheros. (Zhong, Raghunathan y Carlini, «ImpossibleBench», octubre de 2025.)

## La red puede crecer sola; no puede encogerse sin que nadie lo vea {R} [D2:35]

| Movimiento | Qué es | Qué pasa |
|---|---|---|
| **Ampliar** | Tests nuevos para el comportamiento nuevo. | Los escribe el agente, y la mutación dice si detectan algo. |
| **Encoger** | Modificar o borrar un test que ya existía, relajar un umbral, añadir una excepción. | **Sube de carril.** |

**¿Cuándo es legítimo tocar un test?** Cuando cambió la especificación. Si no cambió, es sospechoso.

En el embudo, es la etapa 03:

```js
const encoge = [
  cambio.testsModificadosOBorrados > 0 && 'modifica o borra tests que ya existían',
  cambio.relajaUmbrales && 'relaja un umbral',
  cambio.anadeExcepciones && 'añade una excepción (eslint-disable, skip, ignore…)',
].filter(Boolean)
if (encoge.length && !cambio.cambioLaEspecificacion) return { carril: 'lectura', motivo: '…' }
```

## El carril verde se abre con evidencia, no con fe {R} [D2:36]

Un caso publicado empezó dejando pasar el 25 % de cambios más seguros, y lo subió al 50 % cuando vio que las incidencias no crecían.

1. **Empieza estrecho.** Solo lo obvio.
2. **Mide.** Cuánto de lo que entró sin leer se revierte o acaba en un incidente, comparado con lo revisado.
3. **Ajusta.** Si aguanta, se ensancha. Si falla, se estrecha.

Es el ratchet del día 1, aplicado a los carriles.

## El límite de la verificación {R} [D2:37]

Sé qué no voy a leer, y cómo sé que sigue siendo verdad. **Ahora que corre solo, quiero lanzar varios.**
