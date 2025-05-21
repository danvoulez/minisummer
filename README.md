# FlipApp Deployment Skeleton

This repository contains the FlipApp blueprint with migrations, edge functions, and a basic backend/frontend.

The `flipapp-codex/` directory includes the main implementation. Additional helper scripts and configuration files live at the repository root.

## Scripts

- `scripts/install.sh` – install Python and Node dependencies
- `scripts/deploy.sh` – apply database migrations and deploy functions
- `scripts/test.sh` – run unit tests
- `scripts/nightly.sh` – tasks for nightly cronjobs
- `Makefile` – convenience wrapper for these scripts

## Configuration

A basic configuration is provided in `flip.config.json` which references the Mosaic theme and silent layout.

## LogLine

Run `docs/initial_logline.sql` after setup to seed an initial LogLine asserting that "este sistema existe".
