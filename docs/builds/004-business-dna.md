# BUILD #004 — Business DNA

Status: implemented on branch `codex/build-004-business-dna`.

## Scope

BUILD #004 makes the company profile a structured source of truth for future AI Employees.

The company can describe:

- business summary
- products
- services
- operating rules
- communication tone
- FAQ
- objectives

## API endpoints

### Protected

- `GET /api/business-dna/:organizationId`
- `PUT /api/business-dna`

Access rules:

- `OWNER`, `ADMIN` and `MEMBER` can read Business DNA.
- `OWNER` and `ADMIN` can update Business DNA.

## Data contract

Business DNA is stored on `Organization.businessDna` as structured JSON.

```ts
interface BusinessDna {
  summary: string;
  products: Array<{ title: string; description: string }>;
  services: Array<{ title: string; description: string }>;
  rules: Array<{ title: string; description: string }>;
  tone: string;
  faq: Array<{ question: string; answer: string }>;
  objectives: Array<{ title: string; metric?: string; target?: string }>;
}
```

## UI

The onboarding page at `/onboarding` now provides a real Business DNA form connected to the API.

The dashboard sidebar links to Business DNA so the user can maintain company context after registration.

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #005 starts Knowledge Base:

- PDF upload
- DOCX upload
- TXT upload
- website source
- indexing
- semantic search
