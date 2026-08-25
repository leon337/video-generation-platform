# ADR-0002: ZERO_COST_FIRST and fail-closed spending

Status: Accepted

## Decision

Default authorized provider cost is USD 0. Any future positive-cost route must be explicitly authorized before provider submission. Quota reservation and a separate cost firewall will be implemented before paid providers are enabled.

## I0 enforcement

Real provider implementations are disabled. The routing policy type records `automaticPaidCalls: false` and `failClosed: true`.
