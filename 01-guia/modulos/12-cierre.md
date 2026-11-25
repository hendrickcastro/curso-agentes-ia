# Cierre: la escala de uso {R}

> **En una frase.** En seis meses todos tendrán las mismas herramientas. El sistema, no: se construye ahora, mientras la mayoría improvisa. [D2:72] [D2:78]

## La escala de uso {R} [D2:73-76]

Cada escalón por lo que ganas, y en dos ejes: **qué haces tú y cuánto lees.**

| Escalón | Qué ganas | Tú | Lees |
|---|---|---|---|
| **Prompting** | Sale algo plausible, y rápido. | Pides sin especificar | Lo que sale, sin criterio para juzgarlo |
| **Sesiones y rules** | El agente tiene directrices y la sesión no se degrada. | Cuidas el contexto | Todo el código |
| **RPI** | Feedback temprano sobre el plan, y cada fase empieza con el contexto limpio. | Revisas el plan | Todo el código |
| **Garantías y guardarraíles** | El resultado se comprueba solo, y el criterio no depende de la especificación ni de las reglas. | Fijas el criterio | Todo el código, pero te fías más |
| **Workflow de implementación** | Lo lanzas en local y hace la implementación entera sin pararse. Pasas de estar dentro del bucle a estar encima. | Defines la tarea, lo lanzas y estás pendiente | El resultado y lo que la red señala |
| **El sistema** | Si la tarea está bien definida, el sistema la recoge solo y ejecuta el proceso entero, hasta la verificación. | Preparas la tarea y supervisas | Solo lo que merece tus ojos |

## Antes y después {C} [D2:77]

De «uso Claude Code» a «sé desarrollar software con agentes»; de «consigo que genere muchísimo código» a «sé qué delegar, cómo dirigirlo y cómo comprobar automáticamente que está bien»; de «voy probando cosas que veo por X» a «tengo un modelo mental y un método»; de «mi equipo experimenta con IA» a «tengo criterio para decidir, como equipo, cómo desarrollamos con IA».

## Por dónde empezar el lunes {R}

Un orden razonable, derivado de la escalera (cada paso habilita el siguiente):

1. **Mide tu contexto** una semana: `/context` al terminar cada sesión larga, y la regla del 60 %.
2. **Escribe un `AGENTS.md` corto**, por secciones, con el porqué de cada regla. Añade una regla cada vez que veas fallar al agente.
3. **Convierte en garantía lo que ya tienes instalado:** que el linter y la cobertura salgan con error en vez de avisar, y cuélgalos de `pre-commit` y `pre-push`.
4. **Pon un ratchet** sobre la deuda que ya existe para que lo nuevo no la aumente.
5. **Monta un hook** `PostToolUse` + `Stop` que ejecute esas mismas comprobaciones para el agente.
6. **Escribe criterios de aceptación comprobables** antes de lanzar una tarea, y parte por RPI las que no estén claras.
7. **Define tus tres carriles** con una sola regla verde, estrecha, y mide qué pasa.

## Recursos {C} [D2:79-80]

Dudas y comentarios del curso: `ai-training@540deg.com`. Recursos: `resources.540deg.com`. Newsletter: `newsletter.540deg.com`.

**De 540**

- [Recursos para desarrollo con IA](https://resources.540deg.com/ia-in-540/agentic-development-resources.html): lista curada con más de 80 recursos en siete categorías.
- [IA en 540, la newsletter](https://newsletter.540deg.com/) y el [índice de posts](https://resources.540deg.com/ia-in-540/posts.html).
- [540/agentic-toolbox](https://github.com/540/agentic-toolbox): plugins, skills y hooks; incluye [Gauntlet Audit](https://github.com/540/agentic-toolbox/tree/main/plugins/gauntlet-audit).
- Demos: [Value Stream Mapping](https://resources.540deg.com/ia-in-540/vsm/vsm-demo.html) y [panel de salud del código](https://resources.540deg.com/ia-in-540/code-health-dashboard.html).

**Gente a la que seguir · contexto, agentes y herramientas**

- Dex Horthy (HumanLayer): [hlyr.dev](https://www.hlyr.dev/) · [x.com/dexhorthy](https://x.com/dexhorthy). La fuente más citada del módulo de contexto.
- Matt Pocock: [aihero.dev](https://www.aihero.dev/) · [skills](https://github.com/mattpocock/skills). Guía de AGENTS.md y skills como `grill-me` y `grill-with-docs`.
- Boris Cherny, creador de Claude Code: [x.com/bcherny](https://x.com/bcherny). Thariq, del equipo de Claude Code: [x.com/trq212](https://x.com/trq212).
- Addy Osmani: [addyosmani.com](https://addyosmani.com/) · [Substack](https://addyo.substack.com/).
- Andrej Karpathy: [x.com/karpathy](https://x.com/karpathy). Acuñó «vibecoding».
- Anthropic: [blog de ingeniería](https://www.anthropic.com/engineering) · [claude.com/blog](https://claude.com/blog).

**Gente a la que seguir · craft, especificación y equipo**

- Kent Beck: [tidyfirst.substack.com](https://tidyfirst.substack.com/). XP, TDD y ahora agentes.
- Eduardo Ferro: [eferro.net](https://www.eferro.net/). Lean software delivery, pasos pequeños.
- Gojko Adzic: [gojko.net](https://gojko.net/). Specification by Example e Impact Mapping.
- Martin Fowler y Birgitta Böckeler: [Exploring Gen AI](https://martinfowler.com/articles/exploring-gen-ai/).
- Robert C. Martin: [x.com/unclebobmartin](https://x.com/unclebobmartin). Los frentes de verificación de los que sale la red.

**Lecturas por módulo**

- Contexto: [Context Rot](https://research.trychroma.com/context-rot) (Chroma, 2025) · [Lost in the Middle](https://arxiv.org/abs/2307.03172) (Liu et al., 2023) · [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) · [Claude Code: Best practices](https://code.claude.com/docs/en/best-practices) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices) · [Writing a Good CLAUDE.md](https://www.hlyr.dev/blog/writing-a-good-claude-md) · [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md)
- RPI, garantías y herramientas: [humanlayer/.claude](https://github.com/humanlayer/humanlayer/tree/main/.claude) · [skills.sh](https://skills.sh/) · [ImpossibleBench](https://arxiv.org/abs/2510.20270) · [estudio de METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) (los desarrolladores creían ir más rápido e iban más lento)
- Especificación: [grill-with-docs](https://github.com/mattpocock/skills/blob/main/docs/engineering/grill-with-docs.md) · [Understanding Spec-Driven-Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- Verificación: [How to Kill the Code Review](https://www.latent.space/p/reviews-dead) (el queso suizo de cinco capas) · [Risk-based code review](https://www.cortex.io/post/risk-based-code-review) · [Automating Low-Risk Code Review at Meta](https://arxiv.org/html/2605.30208v1)
- Equipo y adopción: [Fresh work: 80/15/5](https://tidyfirst.substack.com/p/fresh-work-80155) · [The Productivity J-Curve](https://www.aeaweb.org/articles?id=10.1257/mac.20180386)
- Otros: [Introducing System One models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
