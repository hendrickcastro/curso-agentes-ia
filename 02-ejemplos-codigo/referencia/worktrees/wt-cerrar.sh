#!/usr/bin/env sh
# Limpieza al cerrar la tarea: borra la copia. La rama se conserva (bórrala tú cuando esté fusionada).
# Uso: wt-cerrar.sh <nombre-de-tarea>
set -e
tarea="${1:?Uso: wt-cerrar.sh <nombre-de-tarea>}"
raiz=$(git rev-parse --show-toplevel)
destino="$(dirname "$raiz")/$(basename "$raiz")-$tarea"

# Aquí irían: parar el servidor de desarrollo y los contenedores de esta tarea.
git worktree remove "$destino"      # se niega si hay cambios sin confirmar: es lo que queremos
echo "Cerrado: $destino. La rama feature/$tarea sigue existiendo."
