#!/usr/bin/env sh
# Un worktree que ARRANCA: la copia es un comando; lo difícil es lo que no está en git.
# Uso: wt-nuevo.sh <nombre-de-tarea>
set -e
tarea="${1:?Uso: wt-nuevo.sh <nombre-de-tarea>}"
raiz=$(git rev-parse --show-toplevel)
destino="$(dirname "$raiz")/$(basename "$raiz")-$tarea"

git worktree add "$destino" -b "feature/$tarea"                       # la copia: un comando

[ -f "$raiz/.env" ] && cp "$raiz/.env" "$destino/.env"                # configuración y secretos
puerto=$((3000 + $(printf '%s' "$tarea" | cksum | cut -d' ' -f1) % 1000))
echo "PORT=$puerto" >> "$destino/.env"                                # un puerto estable por tarea

if [ -f "$destino/package.json" ] && command -v pnpm >/dev/null 2>&1; then
  (cd "$destino" && pnpm install --frozen-lockfile)                   # dependencias
fi

echo "Listo: $destino (rama feature/$tarea, puerto $puerto)"
