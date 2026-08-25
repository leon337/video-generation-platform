# I0 Foundation Architecture

## Boundary

The product is a separate repository. The orchestration methodology/control plane remains outside provider implementations. This repository owns the video product, capability contracts, routing implementation, media pipeline and UI.

## Dependency direction

```text
apps -> packages/contracts/domain/routing/providers/media
routing -> contracts
providers -> contracts
media -> provider-agnostic media types

domain -X-> providers
routing -X-> provider SDKs
```

## Runtime processes

- `web`: interactive product UI
- `api`: authenticated HTTP boundary and application services
- `worker`: durable asynchronous work via BullMQ
- PostgreSQL: durable product/receipt/usage state
- Redis: queue coordination only; PostgreSQL remains the durable source of product truth

## I0 provider rule

No real provider adapter is enabled. `packages/providers` exposes the boundary, and `packages/testkit` supplies fakes for future routing tests.
