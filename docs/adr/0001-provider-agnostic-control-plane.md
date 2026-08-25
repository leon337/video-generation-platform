# ADR-0001: Keep provider/model intelligence outside the product control plane

Status: Accepted

## Decision

Business workflows request abstract capabilities. Provider selection is performed by a governed routing layer. Provider/model SDKs are isolated behind adapters and cannot be imported by domain or routing-policy code.

## Consequences

- providers and models can be replaced independently;
- free/local/BYOK/paid routes can coexist;
- cost and eligibility policy remains centrally enforceable;
- provider-specific features must be normalized or explicitly exposed through capability metadata rather than leaking into the domain.
