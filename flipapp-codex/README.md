# FlipApp Codex

This directory contains a full-stack blueprint for the Flip App. It includes
Supabase migrations, edge functions, a Flask backend, a React frontend and
deployment scripts.

## Structure

- `supabase/migrations/` – SQL migrations to set up the database
- `supabase/functions/` – edge functions for enrichment and webhooks
- `backend/` – Flask API and LLM helper service
- `frontend/` – React single page application
- `scripts/` – deploy and test helpers
- `.github/workflows/` – example CI pipeline
- `docs/` – additional documentation and examples

Run `scripts/deploy.sh` to bootstrap the stack. See `docs/ARCHITECTURE.md` for a
component overview.
