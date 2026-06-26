# ADR-002: Event-driven Kernel

## Status
Accepted

## Context
The platform must support many AI employees and business workflows without tightly coupling modules.

## Decision
All business actions are represented as events.

## Consequences
- New agents can subscribe to events.
- Workflow execution can be audited.
- The platform becomes extensible without rewriting the kernel.
