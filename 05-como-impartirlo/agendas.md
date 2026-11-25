# Agendas para impartirlo

Las tres se dan **en línea**, compartiendo pantalla con el site (`04-site/index.html`), eligiendo la ruta y pulsando **▶ Presentar** desde la vista **Taller**. Los tiempos son orientativos.

**Formato:** todo el grupo está conectado por videollamada y **no hay trabajo en parejas**. Cada práctica es individual, en el equipo de cada persona; lo que antes se comentaba con la pareja se escribe en el chat, y el cotejo se hace entre todos sobre la pantalla compartida. La mecánica completa está en el guion del facilitador, sección «Impartirlo en línea».

## La regla: primero se hace, después se explica

Cada bloque sigue el mismo orden, y la explicación va **al final y dura tres minutos como mucho**:

1. **Haz** (el ejercicio del Taller, cada persona en su equipo).
2. **Al chat** (el dato que pide el ejercicio).
3. **Qué ha pasado** (tres minutos: la frase de «La idea» y, si hace falta, una sección de la guía).

Se imparte desde la vista **Taller** del site con ▶ Presentar: un ejercicio por pantalla. La guía queda como material de consulta; no se recorre entera en directo.

## Ruta resumida · 100 minutos (82 de práctica)

| Min | Ejercicio | Explicación al terminar (máx. 3 min) |
|---|---|---|
| 0–5 | 0 · Prepara el terreno | Ninguna: solo comprobar que todo el mundo está en verde |
| 5–17 | 1 · Pide sin red | Pedir no es delegar: encuesta «¿escribes, pides o delegas?» |
| 17–27 | 2 · Lo que no está escrito no existe | El contexto es un presupuesto de atención; la regla del 60 % |
| 27–41 | 3 · Para en el plan | El plan es lo único revisable antes del código |
| 41–46 | Pausa | |
| 46–56 | 4 · Una garantía que detiene | «Si avisa pero no detiene, es un informe»; el ratchet |
| 56–66 | 5 · El hook para al agente | Prompt → rules → hook |
| 66–73 | 6 · Una skill por dentro | Divulgación progresiva |
| 73–84 | 7 · Caza el criterio decorativo | Describir no es especificar |
| 84–95 | 8 · ¿Qué PR no vas a leer? | Tres carriles; la red no se encoge |
| 95–100 | 9 · El primer paso del lunes | Cierre: se envían todas las frases a la vez |

Si vas justo de tiempo, quita el 6 antes que ningún otro. Quien no tenga agente hace el 0, 4, 5 (simulado), 6, 7 y 8 solo con la terminal, y sigue el 1, 2 y 3 en la pantalla de otra persona.

## Ruta media · media jornada (4 horas, unas 2 h 30 de práctica)

| Min | Ejercicio | Explicación al terminar |
|---|---|---|
| 0–100 | Los ejercicios 0 a 9 de la ruta resumida, en el mismo orden | Tres minutos por ejercicio |
| 100–115 | Descanso (cámaras apagadas, lejos de la pantalla) | |
| 115–165 | 10 · El mismo prompt, rama a rama (repositorio del curso) | Comparación de los cuadernos de todos en pantalla |
| 165–175 | 11 · Autodiagnóstico de tu red | Las once garantías y cuándo se ejecuta cada una |
| 175–185 | Pausa | |
| 185–195 | 12 · Dos agentes a la vez | Worktrees; con cinco agentes el cuello de botella eres tú |
| 195–205 | 13 · ¿Cuánto especificar? | La curva del coste de especificar |
| 205–240 | Repetir el ejercicio 4 o el 7 **sobre el repositorio real de cada persona** | Qué ha hecho falta para que detenga |

## Ruta completa · dos jornadas

**Día 1 (práctica):** los ejercicios 0 a 13 con pausa cada 60–75 minutos. Por la tarde, cada persona lleva a su propio repositorio dos cosas: una comprobación que pase de avisar a detener y un `AGENTS.md` corto.

**Día 2 (lo que no cabe en un ejercicio):** revisión de lo que cada persona montó el día 1 (15 min por persona, pantalla compartida) · el workflow de 8 fases y SDD desde la guía (45) · ejercicio 14, dónde está tu equipo (30) · después de delegar y llevarlo al equipo (45) · otros temas y riesgos (30) · cierre (15). Los debates del curso original están en la guía, ruta completa, y se hacen por el chat.

En línea la atención dura menos: no encadenes más de diez minutos de exposición sin un ejercicio.

## Preparación (para cualquier ruta)

- [ ] Abrir `04-site/index.html`, compartir esa ventana en la videollamada y probar ▶ Presentar con la ruta elegida. Comprobar con otra persona que la letra se lee.
- [ ] Hacer llegar el site a cada participante **antes** de la sesión: cada persona necesita su propio laboratorio. Basta con enviar dos ficheros: `04-site/index.html` (el site entero) y `02-ejemplos-codigo/demo.zip` (el proyecto de los ejercicios; solo necesita Node 20 y git).
- [ ] Pedir por adelantado que cada persona llegue con el **ejercicio 0 hecho** (`npm run check` en verde) y su agente funcionando; para la ruta media, además, el repositorio del curso clonado y con `pnpm install`. En línea no se puede ir mesa por mesa a arreglar instalaciones.
- [ ] Preparar las encuestas de la videollamada (¿escribes, pides o delegas?, y las de los debates).
- [ ] `cd 02-ejemplos-codigo/demo && npm run check` en verde.
- [ ] Solo para el ejercicio 10 (ruta media), el repositorio del curso: `git clone https://github.com/540/ai-development-training`, y en cada rama `pnpm install` antes de la sesión (tarda).
- [ ] Para la práctica 7: `npx skills@latest add mattpocock/skills --skill grill-me grilling`.
- [ ] Tener a mano la lista de participantes con la herramienta que usa cada persona, para dar la palabra a herramientas distintas en los cotejos.
- [ ] Si el grupo pasa de ocho personas, que una segunda persona atienda el chat e importe los JSON mientras tú presentas.
- [ ] Acordar el canal por el que se envían las exportaciones del laboratorio (JSON): el chat de la videollamada o un canal del equipo.
