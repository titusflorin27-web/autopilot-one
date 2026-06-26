# ADR 0004 — Knowledge Base Chunk Index

## Status

Accepted for BUILD #005.

## Context

Autopilot One needs a Knowledge Base before Reception AI can answer from company-specific context.

The roadmap requires support for PDF, DOCX, TXT and Website sources, indexing and semantic search. The product is still pre-Reception-AI, so the priority is to establish a source/chunk data model and a deterministic retrieval contract before adding embedding providers or vector infrastructure.

## Decision

Create a PostgreSQL-backed Knowledge Base using two core models:

- `KnowledgeSource`
- `KnowledgeChunk`

Sources belong to an organization and represent a file, text paste or website URL. Chunks belong to both the source and the organization for efficient organization-scoped retrieval.

Initial search uses deterministic token scoring over chunks. The API shape is intentionally compatible with future vector search: it already returns result scores, source metadata and chunk content.

## Consequences

Positive:

- Keeps BUILD #005 dependency-light.
- Avoids introducing pgvector or external vector infrastructure before AI Gateway integration is ready.
- Gives Reception AI a stable retrieval interface in BUILD #006.
- Allows upload and indexing flows to be validated immediately.

Tradeoffs:

- Search is not true embedding-based semantic retrieval yet.
- PDF and DOCX extraction are MVP extractors and should be replaced with more robust parsers before production-scale document ingestion.
- Relevance quality will improve once embeddings are introduced.

## Follow-up

Future builds should evaluate:

- pgvector or managed vector storage.
- AI Gateway embedding provider abstraction.
- background indexing workers with Redis queues.
- source deletion and re-indexing.
- better document parsers for complex PDF/DOCX files.
