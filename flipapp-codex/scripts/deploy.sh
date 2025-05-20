#!/bin/bash
set -e
supabase db reset
supabase functions deploy enrich-logline
supabase functions deploy semantizar-logline
python3 backend/app.py &
cd frontend && npm install && npm run build && cd ..
