# Video Generation Platform

Foundation for a short-form video generation platform focused on 9:16 social video.

## Architectural invariants

- Product logic requests capabilities; it never selects a provider SDK directly.
- Provider/model implementations are replaceable execution engines behind `ProviderAdapter`.
- Paid execution is denied unless an explicit authorized-cost boundary allows it.
- Provider credentials never belong in domain objects, receipts or source control.
- Real provider integrations are intentionally excluded from I0.

## Workspace

- `apps/web` — Next.js web application
- `apps/api` — NestJS HTTP API
- `apps/worker` — BullMQ worker process
- `packages/domain` — provider-agnostic domain types
- `packages/contracts` — execution and provider contracts
- `packages/routing` — routing policy types (implementation arrives in I2)
- `packages/providers` — provider adapter boundary only in I0
- `packages/media` — media/render contracts
- `packages/testkit` — fake adapters and fixtures
- `db/migrations` — PostgreSQL migrations

## Local prerequisites

- Node.js >= 22.13
- pnpm 11
- PostgreSQL
- Redis

Copy `.env.example` to `.env`, start PostgreSQL/Redis, then install dependencies and run migrations.

```bash
pnpm install
pnpm db:migrate
pnpm verify
```

## I0 status

I0 establishes structure, contracts, migrations, queue foundations and CI. It does **not** connect to Z.ai, Alibaba, Kling, Seedance or any other real model provider.
