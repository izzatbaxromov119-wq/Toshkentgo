#!/usr/bin/env bash
# TashkentGo frontend — macOS / Linux
set -e
cd "$(dirname "$0")"
echo "==================================================="
echo "  TashkentGo frontend"
echo "==================================================="

if ! command -v node >/dev/null 2>&1; then
    echo "[XATO] Node.js topilmadi. O'rnating (LTS versiya): https://nodejs.org/"
    exit 1
fi
echo "Node.js topildi: $(node --version)"

if [ ! -d "node_modules" ]; then
    echo "Paketlar o'rnatilmoqda (birinchi marta biroz vaqt oladi)..."
    npm install
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo "==================================================="
echo "  Sayt: http://localhost:5173"
echo "  To'xtatish uchun Ctrl+C bosing."
echo "  (Backend ham start.sh orqali ishga tushgan bo'lishi kerak)"
echo "==================================================="
npm run dev
