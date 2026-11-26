# Taller

Formato de este fichero: cada `## ` es un ejercicio; la línea `@` lleva tiempo (min), qué hace falta, la herramienta del laboratorio, la sección de la guía y, con `agente=si`, que entra en la ruta «Agente». Las etiquetas {R} {M} {C} son las rutas. `node 04-site/build.mjs` lo convierte en la vista Taller del site.

## Prepara el terreno {R}
@ tiempo=5; necesita=Terminal, Node 20+, git; guia=m00

### Haz

1. Descomprime `demo.zip` (te lo ha pasado quien facilita) y entra en la carpeta.
2. Crea el punto de partida y comprueba que todo está en verde:

```bash
cd demo
git init -q -b main && git add -A && git commit -qm "punto de partida"
npm run check
```

### Deberías ver

```text
Ratchet: en verde. Deuda conocida: 2 violación(es); nuevas: 0.
# pass 15
# fail 0
```

### Al chat

Un ✅, o el error tal cual si no te sale.

### La idea

Para volver al punto de partida en cualquier momento: `git switch -f main && git checkout . && git clean -fd`. En Windows usa Git Bash o WSL.

## Pide sin red {R}
@ tiempo=10; necesita=Tu agente; lab=cuaderno; guia=m00

### Haz

1. Crea una rama **sin nada alrededor**: ni rules, ni contexto, ni hooks.

```bash
git switch -c sin-red
git rm -rq .claude AGENTS.md CLAUDE.md CONTEXT.md
git commit -qm "sin red"
```

2. Abre tu agente en la carpeta, lanza este prompt y **acepta todo lo que proponga**:

```text
Haz que el buscador muestre como máximo 3 resultados y avise de cuántos más hay.
```

3. Mira qué ha hecho:

```bash
git status --short
git diff --stat
npm run check
```

4. Apúntalo en el laboratorio (Cuaderno de prácticas) y guárdalo como «sin red».

### Deberías ver

Código que funciona, o lo parece. Fíjate en tres cosas: ¿ha tocado tests que ya existían?, ¿ha escrito el criterio nuevo en `specs/`?, ¿el texto del aviso lo ha decidido él?

### Al chat

Ficheros tocados y una decisión que tomó sin preguntarte.

### La idea

Para saber si está bien, lo tienes que leer entero. Has pedido, no has delegado.

## Lo que no está escrito no existe {R}
@ tiempo=8; necesita=Tu agente; lab=contexto; guia=m02; agente=si

### Haz

1. Sigue en la rama `sin-red`. En una **sesión nueva**, pregunta:

```text
Sin escribir código: ¿en qué orden deben salir los resultados del buscador y quién decide el mensaje de «sin resultados»? Dime de qué fichero lo sacas.
```

2. Cambia a `main` (`git switch -f main`), abre otra **sesión nueva** y haz la misma pregunta.
3. Si usas Claude Code, ejecuta `/context` y mira qué ocupa la ventana antes de que hayas pedido nada.

### Deberías ver

En `sin-red` lo deduce del código o lo inventa. En `main` lee `AGENTS.md`, salta a `CONTEXT.md` y contesta: orden de la Pokédex nacional, y el mensaje lo decide producto.

### Al chat

Qué contestó en cada rama, en una línea.

### La idea

El agente solo sabe lo que cabe en su ventana, y un `AGENTS.md` corto que apunta al sitio vale más que uno largo. **Sin agente:** en el laboratorio, Ventana de contexto, sube los MCP de 0 a 8 y busca en qué turno cruzas el 60 %.

## Para en el plan {R}
@ tiempo=12; necesita=Tu agente; lab=cuaderno; guia=m03; agente=si

### Haz

1. Rama nueva desde `main`:

```bash
git switch -f main && git switch -c rpi
```

2. **Research.** Sesión nueva:

```text
Investiga lo necesario para esta tarea: «mostrar como máximo 3 resultados y avisar de cuántos más hay». No propongas soluciones ni escribas código. Dime qué ficheros importan, qué reglas del proyecto aplican y qué no está decidido.
```

3. **Plan.**

```text
Con lo investigado, escribe el plan paso a paso: ficheros, criterios de aceptación y orden. Todavía sin código.
```

4. **Para.** Lee el plan y corrige al menos una cosa (el texto del aviso, si el límite es configurable, dónde va el criterio).
5. **Implement.**

```text
Implementa el plan corregido.
```

6. Compara con el ejercicio anterior y guarda el intento como «rpi»:

```bash
git diff --stat main sin-red
git diff --stat main rpi
```

### Deberías ver

En el research aparecen cosas que en «sin red» decidió él solo. Y esta vez el criterio nuevo entra en `specs/` antes que el código, porque lo dice `AGENTS.md`.

### Al chat

Una cosa que corregiste en el plan.

### La idea

El plan es lo único que puedes revisar antes de que exista el código. Corregir una línea del plan cuesta un minuto; corregirla en el diff, la tarde.

## Una garantía que detiene {R}
@ tiempo=8; necesita=Terminal; lab=ratchet; guia=m04-el-ratchet

### Haz

1. Vuelve a `main` y rompe el acuerdo del equipo («las vistas no llaman a la API»):

```bash
git switch -f main
echo "fetch('x')" >> src/ui/buscadorView.mjs
npm run ratchet; echo "código: $?"
```

2. Deshazlo y mira el código viejo, que incumple lo mismo dos veces:

```bash
git checkout .
grep -n fetch src/ui/legacy/viejaVista.mjs
npm run ratchet; echo "código: $?"
```

3. Ahora **mejora** el código viejo: borra la función `cargarDetalle` de `src/ui/legacy/viejaVista.mjs` y ejecuta `npm run ratchet`.
4. Vuelve a ponerla (`git checkout src/ui/legacy/viejaVista.mjs`) y ejecuta `npm run ratchet` otra vez.
5. Restaura: `git checkout .`

### Deberías ver

```text
Paso 1   Ratchet: hay violaciones nuevas. Todo lo que salta es de hoy.   código: 1
Paso 2   Ratchet: en verde. Deuda conocida: 2 violación(es); nuevas: 0.  código: 0
Paso 3   Ratchet: la línea baja de 2 a 1.
Paso 4   src/ui/legacy/viejaVista.mjs: tenía 1, ahora 2                  código: 1
```

### Al chat

¿Qué comprobación de tu repositorio solo avisa? Una línea.

### La idea

Si avisa pero no detiene, es un informe. Y un repositorio viejo no tiene que cumplir: solo no empeorar. Lo viejo pasa, lo nuevo detiene, la línea solo baja.

## El hook para al agente {R}
@ tiempo=8; necesita=Terminal (mejor con Claude Code); lab=cuaderno; guia=m05-el-hook-de-punta-a-punta; agente=si

### Haz

1. Mira lo que el hook le dice al agente cuando rompe la frontera:

```bash
echo "fetch('x')" >> src/ui/buscadorView.mjs
echo '{"tool_input":{"file_path":"src/ui/buscadorView.mjs"}}' | node tools/guardarrailAgente.mjs edit; echo "código: $?"
git checkout .
```

2. Abre `.claude/settings.json`: ahí está cuándo se ejecuta (después de cada edición y al terminar).
3. **En vivo**, con tu agente en `main`:

```text
Haz que buscadorView cargue los tipos de cada Pokémon directamente desde PokéAPI.
```

### Deberías ver

```text
src/ui/buscadorView.mjs incumple los guardarraíles del proyecto. Corrígelo:
  src/ui/buscadorView.mjs:11  Las vistas no llaman a la API: pide el dato a pokemonService.
código: 2
```

En vivo con Claude Code: edita, el hook lo para, lee el motivo y lo corrige solo llevando la llamada al servicio. Con otra herramienta este hook no salta: lanza `npm run check` tú al terminar y mira si la regla de `AGENTS.md` bastó.

### Al chat

¿Cuántas veces lo paró el hook? Si usas otra herramienta: ¿respetó la regla sin hook?

### La idea

El código 2 y el motivo por stderr son lo que hace que el aviso lo lea el agente y no tú. Una regla escrita se cumple casi siempre; un hook, siempre.

## Una skill por dentro {R}
@ tiempo=6; necesita=Terminal; guia=m06-que-es-una-skill; agente=si

### Haz

1. Mira las tres piezas: instrucciones, script y referencia.

```bash
find .claude/skills/revisar-pr -type f
cat .claude/skills/revisar-pr/SKILL.md
```

2. Haz un cambio «sospechoso» en una rama y lanza el script que la skill ejecuta en su paso 2:

```bash
git switch -c toca-tests
echo "// ajuste" >> test/vista.test.mjs
git commit -qam "arreglo rápido"
sh .claude/skills/revisar-pr/scripts/riesgo.sh main
git switch -f main
```

3. Con agente: en la rama `toca-tests`, pídele «revisa esta rama respecto a main» y mira si carga la skill sin que la nombres.

### Deberías ver

```text
== Tests que ya existían, modificados o borrados (la red se encoge) ==
M	test/vista.test.mjs
```

### Al chat

Una tarea que repites cada semana y que cabría en una skill.

### La idea

Al arrancar solo entran dos líneas (nombre y descripción); el resto se carga cuando hace falta. Y lo determinista va en un script, no en prosa.

## Caza el criterio decorativo {R}
@ tiempo=10; necesita=Terminal; lab=spec; guia=m07-describir-no-es-especificar

### Haz

1. Lee los cinco criterios y lanza la mutación de la especificación:

```bash
cat specs/buscador.criterios.json
npm run spec:mutacion
```

2. Arregla AC5. Dos caminos: quita el criterio, o haz que se compruebe. Con agente:

```text
AC5 es decorativo: ningún test lo comprueba. Haz que el runner de test/aceptacion.test.mjs mida el tiempo y lo verifique, sin tocar los demás criterios.
```

3. Vuelve a lanzar `npm run spec:mutacion` y `npm test`.
4. En el laboratorio, Descrito o especificado: escribe los criterios de **una tarea real tuya** y mira cuáles se pueden comprobar sin que nadie mire.

### Deberías ver

```text
Antes     DECORATIVO  AC5  (tiempoMaximoMs)  Responde en menos de 200 ms.
Después   Mutación de la spec: todos los criterios están protegidos por algún test.
```

### Al chat

Un criterio de tu tarea real que hoy solo puede comprobar una persona.

### La idea

Si para saber si ha terminado tiene que mirarlo alguien, no has especificado: has descrito.

## ¿Qué PR no vas a leer? {R}
@ tiempo=10; necesita=Terminal; lab=carriles; guia=m08-tres-carriles

### Haz

1. Pasa seis cambios de ejemplo por el embudo:

```bash
for f in cambios/*.json; do node tools/carril.mjs "$f"; done
```

2. En `carriles.config.json` baja `muestreoDesde` de 4 a 1 y repite: mira qué cambio sale del carril verde. Restaura con `git checkout .`
3. Describe **un cambio real tuyo** de esta semana y pásalo:

```bash
cp cambios/01-texto-de-pantalla.json cambios/mio.json
# edita cambios/mio.json con los datos de tu cambio
node tools/carril.mjs cambios/mio.json
```

### Deberías ver

De los seis, solo el primero sale en `CARRIL: VERDE`. El tercero (toca dos tests que ya existían) va a `LECTURA`, y el sexto (tests en rojo) queda `BLOQUEADO`.

### Al chat

El carril de tu cambio y la etapa que lo decidió. Después ataca la regla del mensaje anterior al tuyo: ¿qué cambio entraría por ella y no debería?

### La idea

Qué se lee lo decide un protocolo, no el cansancio. Las reglas pueden subir un cambio de carril, nunca bajarlo, y una zona cuya comprobación solo avisa no tiene carril verde.

## El primer paso del lunes {R}
@ tiempo=5; necesita=Nada; guia=m12

### Haz

1. Elige **una** cosa de las que has tocado hoy para tu repositorio: un `AGENTS.md` corto, una comprobación que pase de avisar a detener, un ratchet, un hook, una regla de carril verde.
2. Escríbela así: «El lunes hago ___ en ___, y sabré que funciona cuando ___».

### Deberías ver

Una frase que otra persona podría comprobar.

### Al chat

Tu frase. Escríbela sin enviar; a la señal, todo el mundo envía a la vez.

### La idea

El techo no lo pone el modelo: lo pone tu repositorio.

## El mismo prompt, rama a rama {M}
@ tiempo=45; necesita=Tu agente, pnpm; lab=cuaderno; guia=m01

### Haz

Es la serie de prácticas del curso original, sobre su repositorio. Clónalo e instala **antes** de la sesión.

```bash
git clone https://github.com/540/ai-development-training
cd ai-development-training && git switch base && pnpm install
```

1. Lanza en cada rama el prompt que trae su README, siempre el mismo, y guarda un intento por rama en el Cuaderno de prácticas.

| Rama | Qué rodea al agente | En qué fijarte |
|---|---|---|
| `base` | Nada | Qué sale y cuánto hay que leer |
| `contexto` | `AGENTS.md` y `CONTEXT.md` | Qué ficheros lee antes de escribir |
| `rpi` | Research, plan, implement | Qué corriges en el plan |
| `guardarrailes` | Linters, tests y hooks | Cuándo lo para un hook y qué hace después |
| `harness` | El workflow completo | Cuánto código lees al final |

2. En cada cambio de rama: `git switch <rama> && pnpm install`.
3. Al terminar, marca todos tus intentos en el cuaderno y pulsa Comparar.

### Deberías ver

Las filas que cambian de una rama a otra: ficheros leídos antes de escribir, frontera respetada, paradas por hook y código que tuviste que leer.

### Al chat

Exporta el laboratorio y envía el JSON. La fila que más te cambió, en una línea.

### La idea

Lo que se aprende sale de comparar, no de cada intento.

## Autodiagnóstico de tu red {M}
@ tiempo=8; necesita=Tu repositorio, de memoria; lab=red; guia=m04-autodiagnostico-8-min-individual

### Haz

1. Abre el laboratorio, Autodiagnóstico de la red.
2. Rellena las once filas **de memoria, sin abrir el repositorio**: ¿existe?, ¿cuándo se ejecuta?, ¿detiene o solo avisa?
3. Guarda con el nombre de tu repositorio, exporta y envía el JSON.

### Deberías ver

Varias filas en «solo avisa» o «no lo sé». Si tienes que ir a mirarlo, ya tienes la respuesta.

### Al chat

El JSON, y la primera comprobación que pasarías de avisar a detener.

### La idea

Una comprobación que detiene se nota, porque alguien se queja de ella.

## Dos agentes a la vez {M}
@ tiempo=8; necesita=Terminal; guia=m09

### Haz

1. Desde la carpeta `demo`, crea dos copias de trabajo con git:

```bash
git switch -f main
git worktree add ../demo-tarea-a -b feature/tarea-a
git worktree add ../demo-tarea-b -b feature/tarea-b
git worktree list
```

2. Abre un agente en cada carpeta con una tarea distinta (por ejemplo, «búsqueda por prefijo con ^» y «ordenar por longitud del nombre») y déjalos trabajar a la vez.
3. Cuando acaben, pasa cada rama por `npm run check` y decide qué fusionas.
4. Limpia:

```bash
git worktree remove --force ../demo-tarea-a && git worktree remove --force ../demo-tarea-b
git branch -D feature/tarea-a feature/tarea-b
```

### Deberías ver

Dos ramas que no se pisan. Y que con dos agentes quien no da abasto eres tú.

### Al chat

¿Cuánto tardaste en revisar las dos frente a lo que tardaron en escribirlas?

### La idea

Crear la copia es un comando; lo difícil es lo que no está en git (dependencias, `.env`, puertos). Y con cinco agentes, el cuello de botella eres tú.

## ¿Cuánto especificar? {M}
@ tiempo=6; necesita=Nada; lab=coste; guia=m07-la-especificacion-minima-solo-parece-barata

### Haz

1. Abre el laboratorio, Coste de especificar.
2. Piensa en una tarea real tuya y mueve la completitud de la especificación hasta el mínimo de la curva. Guarda.
3. Sube los traspasos entre agentes a 3 y vuelve a buscar el mínimo. Guarda.
4. Cambia a «El agente redacta y tú revisas». Guarda y compara los tres.

### Deberías ver

Que el óptimo no está en cero ni en el máximo, y que se desplaza hacia más especificación cuantos más traspasos hay.

### Al chat

Una tarea que especificas de menos y otra que especificas de más.

### La idea

La especificación mínima solo parece barata; y a partir de un punto, preguntar más produce documento, no información. Las cifras del simulador son supuestos, no medidas.

## Dónde está tu equipo {C}
@ tiempo=10; necesita=Documento compartido; guia=m10

### Haz

1. En un documento compartido, cada persona añade los pasos reales de su equipo desde que llega una necesidad hasta producción.
2. Marca cada paso: **IA activa**, **IA posible** o **no aplica**.
3. Elige un solo paso «posible» para convertirlo en «activa».

### Deberías ver

Que lo «posible» se concentra en una o dos etapas, casi nunca en implementar.

### Al chat

El paso que has elegido.

### La idea

Lo posible es por donde avanzar; y al principio cuesta antes de compensar.
