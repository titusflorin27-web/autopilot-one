# BUILD #005 — Knowledge Base

Status: implemented on branch `codex/build-005-knowledge-base`.

## Scope

BUILD #005 introduces the first Knowledge Base layer for Autopilot One.

Implemented capabilities:

- TXT source ingestion
- PDF upload
- DOCX upload
- TXT upload
- Website ingestion
- Source registry
- Chunk indexing
- Search over indexed chunks
- Organization-scoped RBAC
- Connected Knowledge Base UI

## API endpoints

### Protected

- `GET /api/knowledge-base/organization/:organizationId/sources`
- `POST /api/knowledge-base/text`
- `POST /api/knowledge-base/website`
- `POST /api/knowledge-base/upload`
- `POST /api/knowledge-base/search`

Access rules:

- `OWNER`, `ADMIN` and `MEMBER` can list and search Knowledge Base.
- `OWNER` and `ADMIN` can ingest new sources.

## Data model

BUILD #005 adds:

- `KnowledgeSource`
- `KnowledgeChunk`
- `KnowledgeSourceType`
- `KnowledgeSourceStatus`

Source types:

- `TXT`
- `PDF`
- `DOCX`
- `WEBSITE`

Source statuses:

- `UPLOADED`
- `INDEXED`
- `FAILED`

## Indexing strategy

The initial MVP indexer extracts text, normalizes whitespace and splits content into fixed-size chunks. Chunks are stored in PostgreSQL and linked to both source and organization.

Search uses deterministic token scoring over indexed chunks. This keeps BUILD #005 dependency-light and prepares the system for vector embeddings in a later build without blocking the MVP flow.

## UI

The Knowledge Base UI lives at `/knowledge-base`.

It supports:

- adding pasted text
- uploading PDF, DOCX or TXT
- indexing a website URL
- listing indexed sources
- searching indexed chunks

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #006 starts Reception AI:

- first AI employee
- automatic answers
- lead qualification
- task creation
- exception escalation
