#!/bin/bash
# Deploy script: apply migrations and deploy edge functions
set -e
psql "$SUPABASE_DB" < ../supabase/migrations/20240601000001_logline_canonico.sql
for fn in ../supabase/functions/*.ts; do
  echo "Deploying $fn"
  # placeholder for `supabase functions deploy`
  :
done
