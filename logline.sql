-- LogLine core schema for FlipApp

CREATE TABLE logline (
  id UUID PRIMARY KEY DEFAULT gen_ulid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  who TEXT NOT NULL CHECK (who ~ '^[a-z]+:[a-zA-Z0-9_-]+$'),
  did TEXT NOT NULL DEFAULT 'registrou' CHECK (did IN ('registrou', 'alertou', 'correlacionou', 'interpretou', 'delegou')),
  this JSONB NOT NULL,
  "when" TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_by TEXT,
  if_ok TEXT GENERATED ALWAYS AS (this->>'resolution') STORED,
  if_doubt TEXT GENERATED ALWAYS AS (this->>'fallback') STORED,
  if_not TEXT GENERATED ALWAYS AS (this->>'contingency') STORED,
  status TEXT NOT NULL GENERATED ALWAYS AS (
    CASE
      WHEN this ? 'embedding' THEN 'contextual'
      WHEN this ? 'tags' THEN 'enriched'
      ELSE 'raw'
    END
  ) STORED,
  valid BOOLEAN GENERATED ALWAYS AS (status IN ('enriched', 'contextual')) STORED,
  embedding REAL[],
  causality UUID[],
  severity SMALLINT DEFAULT 1,
  trace_id UUID DEFAULT gen_random_uuid(),
  span_id UUID DEFAULT gen_random_uuid()
) PARTITION BY LIST (status);

-- partitions
CREATE TABLE logline_raw PARTITION OF logline FOR VALUES IN ('raw');
CREATE TABLE logline_enriched PARTITION OF logline FOR VALUES IN ('enriched');
CREATE TABLE logline_contextual PARTITION OF logline FOR VALUES IN ('contextual');

-- enrichment trigger
CREATE OR REPLACE FUNCTION enriquecer_logline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'raw' THEN
    NEW.this := NEW.this || jsonb_build_object(
      'tags', ARRAY['auto', split_part(NEW.who, ':', 1)],
      'enriched_at', now()::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrich_raw_logline
BEFORE INSERT ON logline
FOR EACH ROW
WHEN (NEW.status = 'raw')
EXECUTE FUNCTION enriquecer_logline();

-- people table (ghost records)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_ulid(),
  tenant_id UUID NOT NULL,
  name TEXT,
  source TEXT,
  created_by TEXT,
  ghost_reason TEXT,
  valid BOOLEAN DEFAULT FALSE,
  identidade_ativa BOOLEAN DEFAULT FALSE
);

-- semantic search function
CREATE OR REPLACE FUNCTION buscar_logs(query TEXT)
RETURNS SETOF logline AS $$
DECLARE
  vetor REAL[];
BEGIN
  vetor := gerar_embedding(query);
  RETURN QUERY
    SELECT * FROM logline
    WHERE status = 'contextual'
    AND embedding <=> vetor < 0.25
    ORDER BY embedding <=> vetor;
END;
$$ LANGUAGE plpgsql;

-- tasks for logs needing manual or AI validation
CREATE TABLE ghost_logline_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logline_id UUID REFERENCES logline(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  assigned_to TEXT,
  notes TEXT
);

