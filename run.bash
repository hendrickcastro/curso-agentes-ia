#!/usr/bin/env bash
# Arranca el curso: comprueba el entorno, pregunta lo que falte y lanza el servidor.
#
#   bash run.bash              arranca y abre el navegador
#   bash run.bash --revisar    solo comprueba el entorno, sin arrancar
#   bash run.bash --olvidar    borra las rutas guardadas y vuelve a preguntar
#
# Funciona en macOS, Linux y Windows (Git Bash, el mismo que usa Claude Code).
# Las rutas que haya que preguntar se guardan en ~/.curso-agentes-ia para no repetirlas.

set -u

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AJUSTES="${HOME:-$AQUI}/.curso-agentes-ia"
PUERTO="${PUERTO:-5400}"
SOLO_REVISAR=0

case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*) SISTEMA=windows ;;
  Darwin) SISTEMA=mac ;;
  *) SISTEMA=linux ;;
esac

for opcion in "$@"; do
  case "$opcion" in
    --revisar) SOLO_REVISAR=1 ;;
    --olvidar) rm -f "$AJUSTES" && echo "Rutas guardadas borradas." ;;
    -h | --help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Opción desconocida: $opcion (usa --help)"; exit 2 ;;
  esac
done

bien() { printf '  \033[32m✔\033[0m %s\n' "$1"; }
mal() { printf '  \033[31m✘\033[0m %s\n' "$1"; }
aviso() { printf '  \033[33m!\033[0m %s\n' "$1"; }

# Acepta rutas de Windows (C:\curso), con comillas o con ~, y las deja al estilo de bash.
normalizar() {
  local ruta="$1"
  ruta="${ruta%\"}"; ruta="${ruta#\"}"; ruta="${ruta%\'}"; ruta="${ruta#\'}"
  ruta="${ruta/#\~/$HOME}"
  if [ "$SISTEMA" = windows ] && command -v cygpath >/dev/null 2>&1; then
    ruta="$(cygpath -u "$ruta" 2>/dev/null || printf '%s' "$ruta")"
  fi
  printf '%s' "${ruta%/}"
}

guardar() { # guardar CLAVE valor
  local resto=''
  [ -f "$AJUSTES" ] && resto="$(grep -v "^$1=" "$AJUSTES")"
  { [ -n "$resto" ] && printf '%s\n' "$resto"; printf '%s=%s\n' "$1" "$2"; } >"$AJUSTES"
}

leer() { [ -f "$AJUSTES" ] && sed -n "s/^$1=//p" "$AJUSTES" | tail -n 1; }

# Pregunta una ruta hasta que valga. Sin terminal no se puede preguntar: se explica cómo fijarla.
preguntar() { # preguntar "texto" funcion_que_valida VARIABLE_DE_ENTORNO
  local respuesta
  if [ ! -t 0 ]; then
    mal "No hay terminal para preguntar. Indícalo así:  $3=\"/ruta\" bash run.bash" >&2
    return 1
  fi
  while true; do
    printf '\n  %s\n  (Enter vacío para salir) > ' "$1" >&2
    IFS= read -r respuesta || return 1
    [ -z "$respuesta" ] && return 1
    respuesta="$(normalizar "$respuesta")"
    if "$2" "$respuesta"; then printf '%s' "$respuesta"; return 0; fi
    mal "Ahí no está: $respuesta" >&2
  done
}

es_curso() { [ -f "$1/servidor.mjs" ] && [ -d "$1/04-site" ] && [ -d "$1/06-en-vivo/pokedex" ]; }
es_claude() { [ -f "$1" ] || [ -f "$1/claude" ] || [ -f "$1/claude.exe" ] || [ -f "$1/claude.cmd" ]; }

echo
echo "  Curso «Desarrollo de software con IA» · comprobando el entorno ($SISTEMA)"
echo

# 1 · Los archivos del curso ---------------------------------------------------
CURSO=''
for candidato in "${CURSO_DIR:-}" "$AQUI" "$(pwd)" "$(leer CURSO_DIR)" \
  "$HOME/curso-agentes-ia" "$HOME/Documents/curso-agentes-ia" "$HOME/Desktop/curso-agentes-ia" \
  "$HOME/Downloads/curso-agentes-ia" "$HOME/source/repos/curso-agentes-ia" "/c/curso-agentes-ia"; do
  [ -z "$candidato" ] && continue
  candidato="$(normalizar "$candidato")"
  if es_curso "$candidato"; then CURSO="$candidato"; break; fi
done

if [ -z "$CURSO" ]; then
  mal "No encuentro los archivos del curso (servidor.mjs, 04-site, 06-en-vivo)."
  echo "    Si aún no los tienes:  git clone https://github.com/hendrickcastro/curso-agentes-ia.git"
  CURSO="$(preguntar '¿En qué carpeta está el curso?' es_curso CURSO_DIR)" || exit 1
  echo
fi
[ "$CURSO" != "$AQUI" ] && guardar CURSO_DIR "$CURSO"
bien "Archivos del curso: $CURSO"

# 2 · Node ---------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  mal "Falta Node.js (versión 20 o superior). Instálalo desde https://nodejs.org y vuelve a lanzar esto."
  exit 1
fi
NODE_MAYOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAYOR" -lt 20 ]; then
  mal "Node $(node -v) es demasiado antiguo: hace falta la versión 20 o superior (https://nodejs.org)."
  exit 1
fi
bien "Node $(node -v)"

# 3 · Git (cada ejecución trabaja sobre una copia con su propio repositorio) -----
if command -v git >/dev/null 2>&1; then
  bien "$(git --version)"
else
  mal "Falta git. Instálalo desde https://git-scm.com y vuelve a lanzar esto."
  exit 1
fi

# 4 · Claude Code ---------------------------------------------------------------
# Si no está en el PATH se busca donde suele instalarse y, si tampoco, se pregunta.
# Se añade su carpeta al PATH en vez de pasar la ruta, para que no fallen los espacios.
usar_claude() {
  local ruta="$1"
  [ -f "$ruta" ] && ruta="$(dirname "$ruta")"
  PATH="$ruta:$PATH"
  export PATH
}

if ! command -v claude >/dev/null 2>&1; then
  for candidato in "${CLAUDE_DIR:-}" "$(leer CLAUDE_DIR)" "$HOME/.local/bin" "$HOME/.claude/local" \
    "$HOME/AppData/Roaming/npm" "$HOME/AppData/Local/Programs/claude" "$HOME/.npm-global/bin" \
    "/usr/local/bin" "/opt/homebrew/bin"; do
    [ -z "$candidato" ] && continue
    candidato="$(normalizar "$candidato")"
    if es_claude "$candidato"; then usar_claude "$candidato"; break; fi
  done
fi

if ! command -v claude >/dev/null 2>&1; then
  aviso "No encuentro Claude Code («claude»)."
  echo "    Si no está instalado: https://claude.com/claude-code"
  if respuesta="$(preguntar '¿En qué carpeta está el ejecutable de Claude Code?' es_claude CLAUDE_DIR)"; then
    usar_claude "$respuesta"
    [ -f "$respuesta" ] && respuesta="$(dirname "$respuesta")"
    guardar CLAUDE_DIR "$respuesta"
    echo
  fi
fi

if command -v claude >/dev/null 2>&1; then
  bien "Claude Code $(claude --version 2>/dev/null | head -n 1)"
  echo "    Si «En vivo» falla al ejecutar, inicia sesión una vez con:  claude"
else
  aviso "Sigo sin Claude Code: el site funcionará, pero «En vivo» no podrá ejecutar los ejemplos."
fi

# 5 · El site generado ----------------------------------------------------------
if [ ! -f "$CURSO/04-site/index.html" ]; then
  aviso "Falta el site generado: lo genero ahora."
  (cd "$CURSO" && node 04-site/build.mjs) || { mal "No se pudo generar el site."; exit 1; }
fi
bien "Site listo"

if [ "$SOLO_REVISAR" = 1 ]; then
  echo
  echo "  Entorno correcto. Arranca con:  bash run.bash"
  echo
  exit 0
fi

# 6 · Arrancar --------------------------------------------------------------------
URL="http://localhost:$PUERTO"

abrir() {
  case "$SISTEMA" in
    mac) open "$URL" ;;
    windows) cmd.exe //c start "" "$URL" ;;
    *) xdg-open "$URL" ;;
  esac >/dev/null 2>&1 || echo "  Abre $URL en el navegador."
}

responde() {
  node -e "fetch('$URL/api/estado').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))" 2>/dev/null
}

if responde; then
  bien "El servidor ya estaba en marcha en $URL"
  abrir
  exit 0
fi

# Abre el navegador cuando el servidor conteste (hasta 15 segundos).
(
  for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
    sleep 1
    if responde; then abrir; break; fi
  done
) &

cd "$CURSO" || exit 1
PUERTO="$PUERTO" exec node servidor.mjs
