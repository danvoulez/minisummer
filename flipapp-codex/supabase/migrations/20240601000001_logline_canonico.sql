-- Canonical LogLine schema with partitions and vector index
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

CREATE TABLE logline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  who TEXT NOT NULL CHECK (who ~ '^\w+:\S+$'),
  did TEXT NOT NULL DEFAULT 'registrou' CHECK (
    did IN ('registrou','alertou','correlacionou','interpretou')
  ),
  this JSONB NOT NULL,
  "when" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL GENERATED ALWAYS AS (
    CASE
      WHEN this ? 'embedding' THEN 'contextual'
      WHEN this ? 'tags' THEN 'enriched'
      ELSE 'raw'
    END
  ) STORED,
  embedding VECTOR(1536),
  severity SMALLINT DEFAULT 1
) PARTITION BY LIST (status);

CREATE TABLE logline_raw PARTITION OF logline FOR VALUES IN ('raw');
CREATE TABLE logline_enriched PARTITION OF logline FOR VALUES IN ('enriched');
CREATE TABLE logline_contextual PARTITION OF logline FOR VALUES IN ('contextual');

CREATE INDEX ON logline USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
