#!/usr/bin/env sh
# Se ejecuta en el paso 2 de la skill. Determinista: no opina, lista.
# Uso: riesgo.sh [rama-base]   (por defecto, main)
base="${1:-main}"
cambiados=$(git diff --name-status "$(git merge-base "$base" HEAD)" HEAD)

echo "== Zonas vetadas (se leen siempre) =="
echo "$cambiados" | grep -E '(src/pagos/|migrations/|\.github/|\.claude/|ratchet\.base\.json|carriles\.config\.json)' || echo "ninguna"

echo "== Tests que ya existían, modificados o borrados (la red se encoge) =="
echo "$cambiados" | grep -E '^[MD].*\.test\.' || echo "ninguno"

echo "== Tests nuevos (la red crece) =="
echo "$cambiados" | grep -E '^A.*\.test\.' || echo "ninguno"
