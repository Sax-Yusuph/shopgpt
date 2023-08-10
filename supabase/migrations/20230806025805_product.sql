-- Enable pgvector extension
CREATE extension IF NOT EXISTS vector;

CREATE TABLE product (
  id bigserial PRIMARY KEY,
  embedding vector(384),
  properties text,
  description text,
  brand text,
  name text
);

CREATE INDEX ON product USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE OR REPLACE FUNCTION match_products(
    embedding vector(384),
    match_threshold float,
    match_count int
  ) RETURNS TABLE (
    name text,
    brand text,
    description text,
    properties text,
    similarity float
  ) language plpgsql AS $$ # variable_conflict use_variable
  BEGIN RETURN query
SELECT product.name,
  product.brand,
  product.description,
  product.properties,
  (product.embedding <#>embedding) * -1 AS similarity
FROM product -- The dot product is negative because of a Postgres limitation, so we negate it
WHERE (product.embedding <#>embedding) * -1 > match_threshold -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
ORDER BY product.embedding <#>embedding
LIMIT match_count;

END;

$$