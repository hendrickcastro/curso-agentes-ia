# RPI: Research, Plan, Implement {R}

> **En una frase.** El plan es lo único que puedes revisar antes de que exista el código: es el último momento en que decir que no sale barato. [D1:53]

## Por qué RPI, y por qué no {R} [D1:54-55]

Lo que el agente **ya hace solo**: lee el código antes de tocarlo (y cada versión lo hace mejor), planifica por dentro (no hace falta obligarlo a pensar antes) y se le ocurren los casos límite (y te avisa de lo que ya ha decidido).

**Si tu motivo para usar RPI es que el modelo piensa mejor así, la próxima versión te quitará la razón.**

El motivo que sí aguanta: **el plan es lo único que puedes revisar antes de que exista el código.** Revisar un plan cuesta minutos; revisar el diff que sale de él, una tarde.

## Tres fases, definidas por lo que tienen prohibido {R} [D1:56]

Lo que hacen es obvio. Lo que se saltan es lo que tienen prohibido.

| Fase | Prohibido | Deja |
|---|---|---|
| **Research** | No propone soluciones. No escribe código. | Un mapa de hechos con su fuente y preguntas abiertas (`research.md`) |
| **Plan** | No escribe código. No deja decisiones abiertas. | Ficheros, piezas, fases y verificación (`plan.md`) |
| **Implement** | No toma decisiones. Si se topa con una, para y pregunta. | El código, fase a fase, verificado |

Cada fase empieza en una **conversación nueva** con el fichero de la anterior como única entrada: así cada una arranca con el contexto limpio.

```text
# Sesión 1
/rpi-research Añade una tabla interactiva con las ventajas entre tipos
# Sesión 2 (nueva)
/rpi-plan @research.md
# Sesión 3 (nueva)
/rpi-implement @plan.md
```

Las tres skills reales están en la rama `rpi` del repositorio del curso (`.agents/skills/rpi-*`). Su esqueleto:

```markdown
---
name: rpi-research
description: Fase 1 de RPI. Investiga una petición en el código, los datos y
  el negocio, y la deja documentada en research.md.
disable-model-invocation: true
argument-hint: <petición>
---
Eres un cartógrafo: describes el terreno tal como está para que otra persona
decida el camino. Aquí solo lees, y el único fichero que escribes es research.md.

1. Desmonta la petición: subraya cada palabra que admite más de una lectura.
2. Recorre el código: cada afirmación cita fichero:línea.
3. Mira los datos reales: cada campo que menciones lo has visto en una respuesta real.
4. Reúne el contexto de negocio: cada regla o cifra, con su fuente y su fecha.
5. Lista las preguntas abiertas: opciones y qué cambia según la que se elija.
6. Entrega: resume y pregunta si lo guardas en research.md.
```

## El techo del research es el repositorio {R} [D1:57]

El agente puede investigar tu código perfectamente y seguir sin saber que una consulta se ejecuta en cada carga de la home, que hay clientes con diez mil pedidos, o que los datos de hace dos años están en otro sistema y cuestan dinero.

**Eso no está en ningún fichero. Está en la cabeza de alguien de tu empresa, y el único sitio por donde puede entrar es el plan.**

## El reparto de tiempo es contraintuitivo {R} [D1:58]

| Research | Plan | Implement |
|---|---|---|
| Aquí se va tu tiempo | Y aquí también | Poco tiempo tuyo: se delega entera |

**Si pasas la mayor parte del tiempo implementando, no has delegado. Has pedido.**

> **Analogía.** Un arquitecto pasa semanas con el plano y casi no pisa la obra. Si está cada día en la obra corrigiendo tabiques, el plano era malo, o no había plano.

## Práctica 3 · El mismo prompt por fases (10 min, individual) {M} [D1:59]

Mismo repositorio, rama `rpi`. Antes de empezar, **fijad el modelo y el nivel de esfuerzo, y apuntadlos.**

1. **Research (3 min).** Pedidle que investigue lo necesario para la tarea, sin proponer soluciones y sin escribir código.
2. **Plan (4 min).** Con lo investigado, que escriba el plan, todavía sin código. **Parad en el plan**, revisadlo y corregid lo que haga falta.
3. **Implement (3 min).** Que implemente el plan corregido. No hace falta que acabe.

Al terminar, pega en el chat el modelo, el nivel de esfuerzo y **una** corrección que hiciste al plan.

## Debate (10 min) {C} [D1:60]

- **¿Qué habéis corregido en el plan?** Lo que el agente decidió por su cuenta sin preguntaros.
- **¿En qué momento habríais podido decir que no?** Con un plan delante, antes de que existiera una línea de código. Sin él, leyendo el diff de la práctica de contexto.
- **¿Corrigieron menos en el plan quienes usaron el modelo más caro o el esfuerzo más alto?** Sale parecido. Más esfuerzo mejora el plan, pero no levanta el techo del research. Si pagas esfuerzo caro, gástalo en el plan, no en implementar.
- **¿Qué restricción de vuestro trabajo no está escrita en ningún sitio?** Casi siempre hay una, y suele ser la más cara.

## El límite de RPI {R} [D1:61]

El plan era bueno y el código parece correcto. **¿Cómo sé que lo está? Si lo leo entero, no he delegado nada.**
