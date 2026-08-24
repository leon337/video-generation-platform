import type { Capability } from '@vgp/contracts';

export interface RoutingPolicy {
  readonly policyVersion: string;
  readonly defaultAuthorizedCostUsd: number;
  readonly failClosed: true;
  readonly automaticPaidCalls: false;
  readonly preferredRouteClasses: readonly ('FREE' | 'LOCAL' | 'BYOK' | 'PAID')[];
  readonly capabilityOverrides?: Readonly<Partial<Record<Capability, number>>>;
}

export const zeroCostFirstPolicy: RoutingPolicy = {
  policyVersion: 'i0-foundation',
  defaultAuthorizedCostUsd: 0,
  failClosed: true,
  automaticPaidCalls: false,
  preferredRouteClasses: ['FREE', 'LOCAL', 'BYOK', 'PAID'],
};
