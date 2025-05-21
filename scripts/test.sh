#!/bin/bash
set -e

if command -v pytest >/dev/null 2>&1; then
    pytest
else
    echo "pytest not installed"
fi
