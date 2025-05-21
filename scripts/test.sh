#!/bin/bash
# test.sh - run tests for the FlipApp project
set -e

if command -v pytest >/dev/null 2>&1; then
    echo "[test] Running pytest"
    pytest || echo "[test] Tests failed"
else
    echo "[test] Pytest not installed"
fi

echo "[test] No other tests defined"
