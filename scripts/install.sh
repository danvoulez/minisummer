#!/bin/bash
set -e

if [ -f requirements.txt ]; then
    echo "[install] Installing Python dependencies"
    pip install -r requirements.txt
fi

if [ -f package.json ]; then
    echo "[install] Installing Node packages"
    npm install
fi

echo "[install] Done"
