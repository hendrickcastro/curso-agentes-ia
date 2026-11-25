# Otros temas {C}

> **En una frase.** Cosas que tenéis que saber que existen. [D2:63-64]

## No hace falta que montes el flujo de cero {C} [D2:65]

Ya hay flujos escritos. Te dan ideas, y los puedes coger y adaptar a tu equipo. **Antes de adoptar uno, cuatro preguntas. Si no puedes responder a las cuatro, no lo adoptes.**

| Pregunta | Por qué importa |
|---|---|
| **Qué fases tiene** | Si no puedes nombrarlas, no sabes qué va a hacer. |
| **Dónde para** | Un flujo sin paradas para que revises decide por ti. |
| **Limpia el contexto** | Si arrastra el research a la implementación, se degrada. |
| **Qué artefactos deja** | Research, plan y decisiones en ficheros, no solo en la conversación. |

## IDE y ADE {C} [D2:66]

**El IDE está hecho para que tú edites. El ADE, para que tú supervises.** Un worktree, un terminal y un navegador por agente. Y una cola de cosas que revisar.

Pídele tres cosas: **que pare para que revises, que aísle cada agente y que te enseñe qué pasó.**

## Bucles que corren sin nadie delante {C} [D2:67]

| Bucle | Qué hace |
|---|---|
| **Mutación general** | Barre todo el código, encuentra los tests que no detectan nada y propone los que faltan. |
| **Triaje de errores de producción** | Agrupa, prioriza y abre la tarea con el contexto del fallo. |
| **Monitorización de la CI** | Detecta lo que se rompe o se vuelve inestable, y abre el arreglo. |
| **Reviews de usuarios** | Las recoge, las clasifica y las convierte en tareas. |
| **Releases a las stores** | Prepara la versión, las notas y la publicación. |

**No miran un cambio: miran el sistema entero. Si producen uno, entra por los mismos carriles que cualquier PR.**

## MCP solo cuando aporta algo que la CLI no da {C} [D2:68-69]

Autenticación o una función que la CLI no tiene. **Si es un envoltorio de la CLI, sobra.** Y una vez decidido, consistencia: siempre la misma vía para la misma herramienta.

El inventario de 540 (seis equipos, abril de 2026):

| Categoría | Herramienta | Vía |
|---|---|---|
| Gestión de proyecto y repositorio | GitHub | CLI |
| | Jira | CLI |
| | Azure DevOps | MCP |
| Diseño | Figma | MCP |
| Observabilidad | Sentry | MCP |
| CI/CD | Jenkins | MCP |
| | GitHub | CLI |
| | Azure DevOps | MCP |
| Base de datos | Tiger/Timescale | MCP |
| Automatización web y móvil | Chrome DevTools | MCP |
| | agent-device | CLI |

## Tres riesgos reales {C} [D2:70]

| Riesgo | En qué consiste |
|---|---|
| **Inyección** | Todo lo que el agente lee es entrada no confiable: una issue, una web, un fichero, la salida de una herramienta. |
| **Filtrado de datos** | Secretos y código que salen en prompts, hacia MCPs o hacia terceros. Una dependencia MCP tiene los permisos de tu agente. |
| **Permisos** | El agente tiene los permisos de tu usuario. Todo lo que puedes borrar, puede borrarlo. |

**Todo lo que lee es entrada no confiable. Y todo lo que tú puedes hacer, puede hacerlo él.**

Una defensa barata, tomada del repositorio del curso: permisos explícitos por comando.

```json
{ "permissions": {
    "allow": ["Bash(pnpm:*)", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git commit:*)", "Bash(gh pr:*)"],
    "deny":  ["Bash(git push --force:*)", "Bash(git commit --amend:*)", "Bash(git reset --hard:*)"] } }
```

## Lo que está por venir {C} [D2:71]

- **Observabilidad de lo que corre solo.** Si nadie mira, el registro es lo único que queda: qué hizo cada agente, cuánto tardó y por qué falló.
- **Evals.** Cambiar de modelo, de rule o de skill es un cambio. Un conjunto fijo de tareas, antes y después, y comparas.
- **Fuera de tu ordenador.** Cuanto más delegas, menos sentido tiene que corra en tu portátil. Nadie va a tener algo corriendo una hora en local.
- **Modelos de pesos abiertos.** Hoy dependes de dos proveedores. Los modelos abiertos se acercan y corren en tu infraestructura, con un arnés abierto.
- **Modelos especializados.** No todo es un LLM. Clasificadores que deciden rápido entre opciones, sin generar texto: un interruptor inteligente delante del agente.
