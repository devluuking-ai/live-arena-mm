#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node မရှိသေးပါ။ Termux ဆိုရင်: pkg install nodejs"
  exit 1
fi

MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$MAJOR" -lt 22 ]; then
  echo "Node 22+ လိုပါတယ်။ အခု version: $(node -v)"
  echo "Termux ဆိုရင်: pkg upgrade nodejs"
  exit 1
fi

if [ ! -d node_modules/ttl-live ]; then
  npm install --no-audit --no-fund
fi

echo "Control: http://localhost:3000/control"
echo "Overlay: http://localhost:3000/overlay"
npm start
