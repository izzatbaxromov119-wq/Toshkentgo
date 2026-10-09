#!/usr/bin/env bash
# TashkentGo backend — macOS / Linux
cd "$(dirname "$0")" || exit 1

PYEXE=""
for CAND in python3.13 python3.12 python3.11 python3.10 python3 python; do
    if command -v "$CAND" >/dev/null 2>&1; then PYEXE="$CAND"; break; fi
done

if [ -z "$PYEXE" ]; then
    echo "[XATO] Python topilmadi. O'rnating: https://www.python.org/downloads/"
    read -p "Chiqish uchun Enter bosing..." _
    exit 1
fi

"$PYEXE" bootstrap.py
