# ADR-001: Monorepo

## Status
Accepted

## Context
Autopilot One has multiple applications and shared packages: web, API, business kernel, AI gateway and shared types.

## Decision
Use a pnpm workspace monorepo.

## Consequences
- Shared types remain consistent.
- Cross-package refactors are safer.
- CI can build and test all modules together.
