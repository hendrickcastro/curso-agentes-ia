# Agendas para impartirlo

Las tres se dan **en línea**, compartiendo pantalla con el site (`04-site/index.html`), eligiendo la ruta. La resumida se da desde la pestaña **En vivo**; la media y la completa añaden el **Taller** (con ▶ Presentar, un ejercicio por pantalla). Los tiempos son orientativos.

**Formato:** todo el grupo está conectado por videollamada y **no hay trabajo en parejas**. Cada práctica es individual, en el equipo de cada persona; lo que antes se comentaba con la pareja se escribe en el chat, y el cotejo se hace entre todos sobre la pantalla compartida. La mecánica completa está en el guion del facilitador, sección «Impartirlo en línea».

## La regla: primero se hace, después se explica

Cada bloque sigue el mismo orden, y la explicación va **al final y dura tres minutos como mucho**:

1. **Haz** (el ejercicio del Taller, cada persona en su equipo).
2. **Al chat** (el dato que pide el ejercicio).
3. **Qué ha pasado** (tres minutos: la frase de «La idea» y, si hace falta, una sección de la guía).

Se imparte desde la vista **Taller** del site con ▶ Presentar: un ejercicio por pantalla. La guía queda como material de consulta; no se recorre entera en directo.

## Ruta resumida · unas 2 horas · solo lo que se hace en vivo

Se da desde la pestaña **En vivo** (hace falta `node servidor.mjs`). Los seis ejemplos usan el mismo encargo, la tabla de tipos de Pokémon. Cada bloque: lanzas las dos columnas a la vez, explicas la idea mientras corren (tardan entre 1 y 4 minutos) y después comparáis las dos webs y las comprobaciones.

| Min | Ejemplo | Mientras corre | Al terminar |
|---|---|---|---|
| 0–10 | Arranque | Enseña el proyecto de partida («Ver el proyecto de partida») y lee el encargo en voz alta | Encuesta: ¿escribes, pides o delegas? |
| 10–25 | 1 · Contexto | El contexto es un presupuesto de atención | El título, los 15 tipos y el «×½»: de dónde salió cada cosa |
| 25–40 | 2 · Reglas | Prompt → reglas → hook; las reglas son probabilísticas | `NOVEDADES.md`: el acuerdo que no se puede adivinar |
| 40–55 | 3 · Skills | Divulgación progresiva: solo entran dos líneas | Las dos tablas lado a lado: el patrón del equipo |
| 55–60 | Pausa | | |
| 60–75 | 4 · Hooks | «Si avisa pero no detiene, es un informe» | Abrid «Todo lo que hizo» y buscad las paradas en rojo |
| 75–90 | 5 · Workflow | El plan es lo único revisable antes del código | Leed el `plan.md`: las decisiones que tomó por su cuenta |
| 90–110 | 6 · Harness | Pedir frente a delegar: el techo lo pone el repositorio | El comparador del final: «Solo el modelo» frente a «Con el harness» |
| 110–120 | Cierre | | Cada persona escribe en el chat qué pieza montaría primero en su repositorio |

Cada persona puede lanzar los ejemplos en su equipo con su suscripción (cada ejecución cuesta entre 0,50 y 0,70 $ a precio de API), o seguir los tuyos por la pantalla compartida. Si quieres ahorrar tiempo, ejecútalos antes: las versiones quedan guardadas y se cargan al abrir la página.

Si sobra tiempo, la ruta resumida del **Taller** tiene seis ejercicios para hacer a mano lo mismo que se ha visto (contexto, RPI, hook y skill), sobre el proyecto `demo`.

## Ruta media · media jornada (4 horas)

| Min | Bloque | Cómo |
|---|---|---|
| 0–110 | La ruta resumida: los seis ejemplos en vivo | Como arriba |
| 110–125 | Descanso (cámaras apagadas, lejos de la pantalla) | |
| 125–185 | Taller, ejercicios 1 a 10: preparar el terreno, pedir sin red, contexto, RPI, garantía y ratchet, hook, skill, criterio decorativo, carriles y primer paso | Cada persona en su equipo, sobre `demo`; tres minutos de explicación al terminar cada uno |
| 185–195 | Pausa | |
| 195–230 | Ejercicios 11 a 14: el mismo prompt rama a rama, autodiagnóstico de la red, dos agentes a la vez y cuánto especificar | Los cuadernos del laboratorio de todos, comparados en pantalla |
| 230–240 | Cierre | El primer paso de cada persona, enviado a la vez en el chat |

## Ruta completa · dos jornadas

**Día 1 (práctica):** la ruta media entera, con pausa cada 60–75 minutos. Por la tarde, cada persona lleva a su propio repositorio dos cosas: una comprobación que pase de avisar a detener y un `AGENTS.md` corto.

**Día 2 (lo que no cabe en un ejercicio):** revisión de lo que cada persona montó el día 1 (15 min por persona, pantalla compartida) · el workflow de 8 fases y SDD desde la guía (45) · ejercicio 15, dónde está tu equipo (30) · después de delegar y llevarlo al equipo (45) · otros temas y riesgos (30) · cierre (15). Los debates del curso original están en la guía, ruta completa, y se hacen por el chat.

En línea la atención dura menos: no encadenes más de diez minutos de exposición sin un ejercicio o un ejemplo corriendo.

## Preparación (para cualquier ruta)

- [ ] Arrancar `node servidor.mjs`, abrir `http://localhost:5400`, compartir esa ventana en la videollamada y probar ▶ Presentar con la ruta elegida. Comprobar con otra persona que la letra se lee.
- [ ] Hacer llegar el site a cada participante **antes** de la sesión: cada persona necesita su propio laboratorio. Lo más sencillo es que clonen el repositorio y arranquen `node servidor.mjs` (necesitan Node 20, git y Claude Code con su sesión iniciada). Quien solo vaya a hacer el taller puede abrir `04-site/index.html` y descomprimir `02-ejemplos-codigo/demo.zip`.
- [ ] Pedir por adelantado que cada persona llegue con el servidor arrancado y, para el taller, con el **ejercicio 1 hecho** (`npm run check` en verde) y su agente funcionando; para la ruta media, además, el repositorio del curso clonado y con `pnpm install`. En línea no se puede ir mesa por mesa a arreglar instalaciones.
- [ ] Preparar las encuestas de la videollamada (¿escribes, pides o delegas?, y las de los debates).
- [ ] Comprobar que la pestaña En vivo dice «Listo» y lanzar un ejemplo de prueba. Para el taller: `cd 02-ejemplos-codigo/demo && npm run check` en verde.
- [ ] Solo para el ejercicio 11 (ruta media), el repositorio del curso: `git clone https://github.com/540/ai-development-training`, y en cada rama `pnpm install` antes de la sesión (tarda).
- [ ] Para la práctica 7: `npx skills@latest add mattpocock/skills --skill grill-me grilling`.
- [ ] Tener a mano la lista de participantes con la herramienta que usa cada persona, para dar la palabra a herramientas distintas en los cotejos.
- [ ] Si el grupo pasa de ocho personas, que una segunda persona atienda el chat e importe los JSON mientras tú presentas.
- [ ] Acordar el canal por el que se envían las exportaciones del laboratorio (JSON): el chat de la videollamada o un canal del equipo.
