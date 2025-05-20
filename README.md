# FlipApp LogLine Blueprint

This repository contains the canonical blueprint for the FlipApp logging system. It includes:

- **logline.sql** – SQL schema for LogLine, people, triggers and functions.
- **supabase/schema.json** – JSON representation of the database schema.
- **src/semantizar.ts** – Edge function that enriches `logline` records with embeddings and semantic suggestions.

## Overview

LogLine is a structured record capturing any action or observation within the FlipApp ecosystem. It can originate from text, voice, images or any other input. The system normalises the content, extracts entities and stores everything in an auditable timeline. Incomplete entities become **ghost** records that can later be reconciled.

### Example LogLine

```json
{
  "who": "user:rafa",
  "did": "registrou",
  "this": {
    "raw": "peguei 2 tina da gaveta",
    "context": {
      "item": "tina",
      "quantidade": "2"
    }
  },
  "status": "raw",
  "tenant_id": "tenant_voulezvous"
}
```

### Lifecycle

| Status       | Transition condition                          | Next state   |
| ------------ | --------------------------------------------- | ------------ |
| `raw`        | after 7 days without enrichment               | `archived`   |
| `enriched`   | embedding and semantic fields completed       | `contextual` |
| `contextual` | after 180 days of inactivity                  | `archived`   |

## Pipeline from paper, voice or photo

1. **OCR/Transcription** – convert images or audio to text.
2. **LLM #1** – clean text, segment and detect entities.
3. **LLM #2** – transform into LogLine structure (`who`, `did`, `this`, `status`).
4. **LLM #3 (optional)** – semantic validator and reconstructor.
5. **Storage** – insert into Supabase with status `raw` or `enriched`.

## Deployment

Run the SQL script to set up the database structure. Deploy the edge function in Supabase to automatically semantise logs. Use the JSON schema for migrations or validation tools.

