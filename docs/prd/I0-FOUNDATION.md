# I0 — Foundation

## Goal

Create a buildable monorepo foundation for the short-form video product without consuming external AI APIs.

## In scope

- web/api/worker process boundaries
- shared provider-agnostic contracts
- PostgreSQL migration runner
- BullMQ worker foundation
- object-storage contract
- provider adapter contract and fake provider testkit
- CI and architecture boundary checks

## Out of scope

- authentication/product-domain persistence
- real model/provider integrations
- scene generation
- FFmpeg rendering
- BYOK secrets
- production deployment

## Acceptance

See repository Issue #1.
