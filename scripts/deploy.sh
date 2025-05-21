#!/bin/bash
set -e

if [ -f logline.sql ]; then
    echo "[deploy] Applying schema"
    psql "$SUPABASE_DB" -f logline.sql
fi

supabase functions deploy semantizar

echo "[deploy] Done"
