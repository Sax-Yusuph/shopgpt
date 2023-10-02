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

create
or replace function match_products (
  embedding vector (384),
  match_threshold float,
  match_count int
) returns table (data jsonb, similarity float) language plpgsql as $$ # variable_conflict use_variable
BEGIN
  RETURN QUERY
    SELECT product.data, 1 - (embedding<=>product.embedding) as similarity
    FROM product
    where  1 - (embedding<=>product.embedding) > match_threshold
    ORDER BY similarity desc
    LIMIT match_count;
END;

$$